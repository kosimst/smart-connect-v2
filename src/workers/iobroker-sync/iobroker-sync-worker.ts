/// <reference lib="webworker" />

import {
  BACKGROUND_PRIORITY_REFETCH_INTERVAL,
  DEVICES_REFETCH_INTERVAL,
  DEVICE_STATE_REFETCH_COUNT,
  DEVICE_STATE_REFETCH_DELAY,
  HIGH_PRIORITY_REFETCH_INTERVAL,
  LOW_PRIORITY_REFETCH_INTERVAL,
  MAX_BULK_GET_SIZE,
  STATE_REFETCH_INTERVAL,
  SUBSCRIPTION_FETCH_DEBOUNCE_INTERVAL,
} from '../../config/local-iobroker'
import { isSupportedDeviceType } from '../../constants/device-definitions'
import ioBrokerDb from '../../db/iobroker-db'
import nSizedChunks from '../../helpers/n-sized-chunks'
import Device from '../../types/device'
import syncDb from './sync-db'
import { expose } from 'comlink'
import setWaitingInterval from '../../helpers/waiting-interval'
import sleep from '../../helpers/sleep'
import { SubscriptionPriority } from '.'
import randomUUID from '../../helpers/randomUUID'

const subscriptions = new Map<
  string,
  {
    [key in SubscriptionPriority]?: Set<string>
  }
>()

const getStatesWithPriority = (priority: SubscriptionPriority) => {
  const priorityOrder = [
    'high',
    'medium',
    'low',
    'background',
  ] as SubscriptionPriority[]

  const states = new Set<string>()

  for (const [state, priorities] of subscriptions) {
    for (const priorityEntry of priorityOrder) {
      if (priorityEntry !== priority) {
        continue
      }

      const higherPriorities = priorityOrder.slice(
        0,
        priorityOrder.indexOf(priorityEntry)
      )
      const hasHigherPriority = higherPriorities.some(
        (higherPriority) => !!priorities[higherPriority]?.size
      )

      if (hasHigherPriority) {
        break
      }

      if (priorityEntry === priority && priorities[priorityEntry]?.size) {
        states.add(state)
        break
      }
    }
  }

  return states
}

const data = {
  credentials: null,
  states: Array<string>(),
} as Parameters<typeof syncDb>['0']

const initialSync = syncDb(data)

const fetchStates = async (stateIds: string[]) => {
  const { credentials } = data

  if (!credentials || !stateIds.length) {
    return
  }

  const { url, cfClientId, cfClientSecret } = credentials

  const chunks = nSizedChunks(stateIds, MAX_BULK_GET_SIZE)

  for (const chunk of chunks) {
    const path = '/getBulk/' + chunk.join(',')

    try {
      const response = await fetch(`https://${url}${path}`, {
        headers: {
          'CF-Access-Client-Id': cfClientId,
          'CF-Access-Client-Secret': cfClientSecret,
        },
      })

      if (response.status !== 200) {
        return
      }

      const json = await response.json()
      const newStates = json
        .filter(({ id }: any) => !!id)
        .map(({ id, val: value }: any) => ({
          id,
          value,
          ts: new Date(),
          role: id.split('.').at(-1),
        })) as {
        id: string
        value: any
        ts: Date
        role: string
      }[]

      await ioBrokerDb.states.bulkPut(newStates)
    } catch (error) {
      console.error(error)
    }
  }
}

const fetchDevices = async () => {
  const { credentials } = data

  if (!credentials) {
    return
  }

  const { url, cfClientId, cfClientSecret } = credentials

  const res = await fetch(
    `https://${url}/objects?pattern=alias.0.*&type=channel`,
    {
      headers: {
        'CF-Access-Client-Id': cfClientId,
        'CF-Access-Client-Secret': cfClientSecret,
      },
    }
  )

  if (!res.ok) {
    console.warn(`Failed to fetch devices: ${res.status} (${res.statusText})`)
    return
  }

  const json = await res.json()

  const newDevices = Array<Device>()

  for (const {
    common: { name, role },
    _id: id,
    enums,
  } of Object.values<any>(json)) {
    if (!isSupportedDeviceType(role)) {
      continue
    }

    const roomName = Object.entries(enums).find(
      ([k, v]) => k.startsWith('enum.rooms.') && v
    )?.[1] as string | undefined

    newDevices.push({
      id,
      name,
      type: role,
      roomName,
    })
  }

  await ioBrokerDb.devices.bulkPut(newDevices)

  const devices = await ioBrokerDb.devices.toArray()
  const devicesToRemove = devices
    .filter(
      (device) => !newDevices.some((newDevice) => newDevice.id == device.id)
    )
    .map((device) => device.id)

  if (devicesToRemove.length) {
    await ioBrokerDb.devices.bulkDelete(devicesToRemove)
  }
}

let active = false

let clearSyncLowPriorityInterval: () => void
let clearSyncNormalPriorityInterval: () => void
let clearSyncHighPriorityInterval: () => void
let clearSyncBackgroundPriorityInterval: () => void
let clearSyncDevicesInterval: () => void

const fetchStatesWithPriority =
  (priority: SubscriptionPriority) => async () => {
    const states = getStatesWithPriority(priority)

    if (states.size)
      console.log(`Fetching ${states.size} states with priority ${priority}`)

    await fetchStates(Array.from(states))
  }

const start = async () => {
  if (active) {
    return
  }

  active = true

  await initialSync

  clearSyncDevicesInterval = setWaitingInterval(
    fetchDevices,
    DEVICES_REFETCH_INTERVAL
  )
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
    const backgroundStates = getStatesWithPriority('background')
    const unsubscribedStates = data.states.filter((state) => {
      if (!subscriptions.has(state)) {
        return true
      }

      const priorities = subscriptions.get(state)!
      const hasSubscriptions = Object.values(priorities).some(
        (priority) => !!priority?.size
      )

      return !hasSubscriptions
    })

    console.log(
      `Fetching ${backgroundStates.size} background states and unsubscribed states (${unsubscribedStates.length})`
    )

    await fetchStates([...backgroundStates, ...unsubscribedStates])
  }, BACKGROUND_PRIORITY_REFETCH_INTERVAL)
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
  const deviceStates = (
    await ioBrokerDb.states.where('id').startsWith(deviceId).toArray()
  ).map((state) => state.id)

  for (let i = 0; i < DEVICE_STATE_REFETCH_COUNT; i++) {
    await sleep(DEVICE_STATE_REFETCH_DELAY)
    await fetchStates(deviceStates)
  }
}

const recentlyAdded = new Set<string>()
let fetchRecentlyAddedTimeout: ReturnType<typeof setTimeout>
const subscribeState = async (id: string, priority: SubscriptionPriority) => {
  const subscriptionId = randomUUID()

  if (!recentlyAdded.has(id)) {
    clearTimeout(fetchRecentlyAddedTimeout)

    recentlyAdded.add(id)

    fetchRecentlyAddedTimeout = setTimeout(() => {
      fetchStates(Array.from(recentlyAdded))
      recentlyAdded.clear()
    }, SUBSCRIPTION_FETCH_DEBOUNCE_INTERVAL)
  }

  const oldSubscriptions = subscriptions.get(id) || {}
  const oldSet = oldSubscriptions[priority] || new Set<string>()

  oldSet.add(subscriptionId)

  subscriptions.set(id, {
    ...oldSubscriptions,
    [priority]: oldSet,
  })

  return subscriptionId
}

const unsubscribeState = async (subscriptionId: string) => {
  for (const priorities of subscriptions.values()) {
    for (const ids of Object.values(priorities)) {
      ids.delete(subscriptionId)
    }
  }
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
