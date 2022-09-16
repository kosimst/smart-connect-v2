/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import { liveQuery } from 'dexie'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import ioBrokerDb from '../db/iobroker-db'

self.skipWaiting()
clientsClaim()

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
)

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

  const {
    title,
    options: {
      badge = 'https://us-central1-smart-connect-pwa.cloudfunctions.net/notifyIcon?icon=home_iot_device&badge=true?size=96',
      icon = 'https://us-central1-smart-connect-pwa.cloudfunctions.net/notifyIcon?icon=home_iot_device?size=196',
      body,
      silent,
      tag,
      actions,
    } = {},
  } = msg as any as {
    title: string
    options?: {
      icon?: string
      badge?: string
      body?: string
      silent?: boolean
      tag?: string
      actions?: {
        title: string
        tasks: {
          [stateId: string]: any
        }
      }[]
    }
  }

  self.registration.showNotification(title, {
    icon,
    badge,
    body,
    silent,
    tag,
    ...(actions
      ? {
          actions: actions.map((action) => ({
            action: JSON.stringify({
              tasks: action.tasks,
            }),
            title: action.title,
          })),
        }
      : {}),
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const action = event.action

  if (!action) {
    return
  }

  const { tasks } = JSON.parse(action)

  if (!credentials) return

  const { url, cfClientId, cfClientSecret } = credentials

  for (const [stateId, value] of Object.entries(tasks)) {
    fetch(`https://${url}/set/${stateId}?value=${value}`, {
      headers: {
        'CF-Access-Client-Id': cfClientId,
        'CF-Access-Client-Secret': cfClientSecret,
      },
    }).catch((e) => {
      self.registration.showNotification('Failed execute action', {
        body: e.message,
        icon: '/notify/icons/alert.png',
        badge: '/notify/badges/default.png',
      })
    })
  }
})
