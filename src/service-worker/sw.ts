/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { liveQuery } from 'dexie'
import ioBrokerDb from '../db/iobroker-db'
import nSizedChunks from '../helpers/n-sized-chunks'

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
  if (data.type !== 'fetch-states') {
    return
  }
  if (!credentials) {
    return
  }

  const { url, cfClientId, cfClientSecret } = credentials

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
})
