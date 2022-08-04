/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import { liveQuery } from 'dexie'
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { isSupportedDeviceType } from '../constants/device-definitions'
import ioBrokerDb from '../db/iobroker-db'
import nSizedChunks from '../helpers/n-sized-chunks'
import Device from '../types/device'

self.skipWaiting()
clientsClaim()

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

const credentialsObservable = liveQuery(() =>
  ioBrokerDb.credentials.limit(1).toArray()
)
const subscribedStatesObservable = liveQuery(() =>
  ioBrokerDb.subscribedStates.toArray()
)

let credentials: {
  url: string
  cfClientId: string
  cfClientSecret: string
} | null = null
credentialsObservable.subscribe((newCredentials) => {
  credentials = newCredentials[0] || null
})
let subscribedStates: string[] = []
subscribedStatesObservable.subscribe((newSubscribedStates) => {
  subscribedStates = [...new Set(newSubscribedStates.map((state) => state.id))]
})

self.addEventListener('message', async ({ data }) => {
  if (!credentials) {
    return
  }

  const { url, cfClientId, cfClientSecret } = credentials

  if (data.type == 'fetch-states') {
    const chunks = nSizedChunks(subscribedStates, 10)

    for (const chunk of chunks) {
      const path = '/getBulk/' + chunk.join(',')

      try {
        const res = await fetch(`https://${url}${path}`, {
          headers: {
            'CF-Access-Client-Id': cfClientId,
            'CF-Access-Client-Secret': cfClientSecret,
          },
        })

        if (!res.ok) {
          console.warn(
            `Failed to fetch ${path}: ${res.status} (${res.statusText})`
          )
          continue
        }

        const json = await res.json()
        const states = json
          .filter(({ id }: any) => !!id)
          .map(({ id, val: value }: any) => ({
            id,
            value,
          })) as {
          id: string
          value: any
        }[]

        await ioBrokerDb.states.bulkPut(states)
      } catch (e) {
        console.warn('Failed to fetch states', e)
      }
    }
  } else if (data.type == 'fetch-devices') {
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
  }
})

// push listener
self.addEventListener('push', (event) => {
  let msg = event.data?.text()

  if (!msg) {
    return
  }

  try {
    msg = JSON.parse(msg)
  } catch {
    return
  }

  const { title, options } = msg as any as {
    title: string
    options: NotificationOptions
  }

  self.registration.showNotification(title, options)
})

// on action click
self.addEventListener('notificationclick', (event) => {
  console.log(event)
  event.notification.close()
})
