/// <reference lib="webworker" />

import { expose } from 'comlink'
import { signal, computed, effect } from '@preact/signals-core'

import { SubscriptionPriority } from '.'
import {
  BACKGROUND_PRIORITY_REFETCH_INTERVAL,
  DEVICES_REFETCH_INTERVAL,
  DEVICE_STATE_REFETCH_COUNT,
  DEVICE_STATE_REFETCH_DELAY,
  HIGH_PRIORITY_REFETCH_INTERVAL,
  LOW_PRIORITY_REFETCH_INTERVAL,
  STATE_REFETCH_INTERVAL,
  SUBSCRIPTION_FETCH_DEBOUNCE_INTERVAL,
} from '../../config/local-iobroker'
import { isSupportedDeviceType } from '../../constants/device-definitions'
import ioBrokerDb from '../../db/iobroker-db'
import randomUUID from '../../helpers/randomUUID'
import sleep from '../../helpers/sleep'
import setWaitingInterval from '../../helpers/waiting-interval'
import Device from '../../types/device'
import fetchStates from './fetchers/fetch-states'
import getStatesWithPriority from './get-states-with-priority'
import syncDb from './sync-db'
import Credentials from '../../types/credentials'
import fetchDevices from './fetchers/fetch-devices'

const subscriptions = signal(
  new Map<
    string,
    {
      [key in SubscriptionPriority]?: Set<string>
    }
  >()
)

const highCount = computed(
  () => getStatesWithPriority(subscriptions.value, 'high').size
)
const highPriorityMode = computed(() => highCount.value > 0)

const pausedSet = signal(new Set<string>())

const pause = () => {
  const id = randomUUID()
  pausedSet.value = new Set([...pausedSet.value, id])

  return () => {
    const prev = pausedSet.value
    const newSet = new Set(prev)
    newSet.delete(id)
    pausedSet.value = newSet
  }
}

const isPaused = computed(() => pausedSet.value.size > 0)

const credentials = signal(null as Credentials | null)
const states = signal(new Set<string>())

const initialSync = syncDb(credentials, states)

let active = false

let clearSyncLowPriorityInterval: () => void
let clearSyncNormalPriorityInterval: () => void
let clearSyncHighPriorityInterval: () => void
let clearSyncBackgroundPriorityInterval: () => void
let clearSyncDevicesInterval: () => void

const fetchStatesWithPriority =
  (priority: SubscriptionPriority) => async () => {
    if (isPaused.value || (priority !== 'high' && highPriorityMode.value)) {
      return
    }

    const states = getStatesWithPriority(subscriptions.value, priority)

    if (credentials.value) {
      await fetchStates(Array.from(states), credentials.value)
    }
  }

const start = async () => {
  if (active) {
    return
  }

  active = true

  await initialSync

  clearSyncDevicesInterval = setWaitingInterval(async () => {
    if (!credentials.value) {
      return
    }

    await fetchDevices(credentials.value)
  }, DEVICES_REFETCH_INTERVAL)
  clearSyncLowPriorityInterval = setWaitingInterval(
    fetchStatesWithPriority('low'),
    LOW_PRIORITY_REFETCH_INTERVAL
  )
  clearSyncNormalPriorityInterval = setWaitingInterval(
    fetchStatesWithPriority('medium'),
    STATE_REFETCH_INTERVAL
  )
  clearSyncHighPriorityInterval = setWaitingInterval(
    fetchStatesWithPriority('high'),
    HIGH_PRIORITY_REFETCH_INTERVAL
  )
  clearSyncBackgroundPriorityInterval = setWaitingInterval(async () => {
    if (isPaused.value || highPriorityMode.value) {
      return
    }

    const backgroundStates = getStatesWithPriority(
      subscriptions.value,
      'background'
    )
    const unsubscribedStates = [...states.value].filter((state) => {
      if (!subscriptions.value.has(state)) {
        return true
      }

      const priorities = subscriptions.value.get(state)!
      const hasSubscriptions = Object.values(priorities).some(
        (priority) => !!priority?.size
      )

      return !hasSubscriptions
    })

    if (credentials.value) {
      await fetchStates(
        [...backgroundStates, ...unsubscribedStates],
        credentials.value
      )
    }
  }, BACKGROUND_PRIORITY_REFETCH_INTERVAL)

  setTimeout(() => credentials.value && fetchDevices(credentials.value), 2000)
}

const stop = () => {
  active = false

  clearSyncLowPriorityInterval()
  clearSyncNormalPriorityInterval()
  clearSyncHighPriorityInterval()
  clearSyncBackgroundPriorityInterval()
  clearSyncDevicesInterval()
}

const refetchDevice = async (deviceId: string) => {
  const resume = pause()

  const deviceStates = (
    await ioBrokerDb.states.where('id').startsWith(deviceId).toArray()
  ).map((state) => state.id)

  for (let i = 0; i < DEVICE_STATE_REFETCH_COUNT; i++) {
    await sleep(DEVICE_STATE_REFETCH_DELAY)
    if (credentials.value) {
      await fetchStates(deviceStates, credentials.value)
    }
  }

  resume()
}

const recentlyAdded = new Set<string>()
let fetchRecentlyAddedTimeout: ReturnType<typeof setTimeout>
const subscribeState = async (id: string, priority: SubscriptionPriority) => {
  const subscriptionId = randomUUID()

  if (!recentlyAdded.has(id)) {
    clearTimeout(fetchRecentlyAddedTimeout)

    recentlyAdded.add(id)

    fetchRecentlyAddedTimeout = setTimeout(() => {
      if (credentials.value) {
        fetchStates(Array.from(recentlyAdded), credentials.value)
      }
      recentlyAdded.clear()
    }, SUBSCRIPTION_FETCH_DEBOUNCE_INTERVAL)
  }

  const oldSubscriptions = subscriptions.value.get(id) || {}
  const oldSet = oldSubscriptions[priority] || new Set<string>()

  oldSet.add(subscriptionId)

  subscriptions.value = new Map(subscriptions.value).set(id, {
    ...oldSubscriptions,
    [priority]: oldSet,
  })

  return subscriptionId
}

const unsubscribeState = async (subscriptionId: string) => {
  for (const priorities of subscriptions.value.values()) {
    for (const ids of Object.values(priorities)) {
      ids.delete(subscriptionId)
    }
  }

  subscriptions.value = new Map(subscriptions.value)
}

const workerMethods = {
  start,
  stop,
  refetchDevice,
  subscribeState,
  unsubscribeState,
} as const

export type WorkerMethods = typeof workerMethods

expose(workerMethods)
