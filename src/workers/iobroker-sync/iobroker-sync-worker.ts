/// <reference lib="webworker" />

import {
  DEVICES_REFETCH_INTERVAL,
  HIGH_PRIORITY_REFETCH_INTERVAL,
  LOW_PRIORITY_REFETCH_INTERVAL,
  MAX_BULK_GET_SIZE,
  STATE_REFETCH_INTERVAL,
} from '../../config/local-iobroker'
import { isSupportedDeviceType } from '../../constants/device-definitions'
import ioBrokerDb from '../../db/iobroker-db'
import nSizedChunks from '../../helpers/n-sized-chunks'
import Device from '../../types/device'
import syncDb from './sync-db'
import { expose } from 'comlink'
import setWaitingInterval from '../../helpers/waiting-interval'
import sleep from '../../helpers/sleep'

const data = {
  credentials: null,
  states: {
    background: [],
    lowPriority: [],
    normalPriority: [],
    highPriority: [],
  },
} as Parameters<typeof syncDb>['0']

const initialSync = syncDb(data)

const fetchStates = async (stateIds: string[]) => {
  const { credentials } = data

  if (!credentials) {
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
let clearSyncDevicesInterval: () => void

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
    () => fetchStates([...data.states.lowPriority, ...data.states.background]),
    LOW_PRIORITY_REFETCH_INTERVAL
  )
  clearSyncNormalPriorityInterval = setWaitingInterval(
    () => fetchStates(data.states.normalPriority),
    STATE_REFETCH_INTERVAL
  )
  clearSyncHighPriorityInterval = setWaitingInterval(
    () => fetchStates(data.states.highPriority),
    HIGH_PRIORITY_REFETCH_INTERVAL
  )

  await fetchDevices()
  await fetchStates(data.states.highPriority)
  await fetchStates(data.states.normalPriority)
  await fetchStates(data.states.lowPriority)
}

const stop = () => {
  active = false

  clearSyncLowPriorityInterval()
  clearSyncNormalPriorityInterval()
  clearSyncHighPriorityInterval()
  clearSyncDevicesInterval()
}

const refetchDevice = async (deviceId: string) => {
  const deviceStates = (
    await ioBrokerDb.states.where('id').startsWith(deviceId).toArray()
  ).map((state) => state.id)

  await fetchStates(deviceStates)
  await sleep(250)
  await fetchStates(deviceStates)
  await sleep(250)
  await fetchStates(deviceStates)
  await sleep(250)
  await fetchStates(deviceStates)
}

expose({
  start,
  stop,
  refetchDevice,
})
