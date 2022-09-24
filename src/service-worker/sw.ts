/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'

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

  const { tasks } = JSON.parse(action) as {
    tasks: {
      [stateId: string]: any
    }
  }

  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
      })
      .then(async (clientsArr) => {
        const client = await (clientsArr.length
          ? Promise.resolve(clientsArr[0])
          : self.clients.openWindow('/'))

        if (!client) {
          return
        }

        await client.focus()

        client.postMessage({
          type: 'setStates',
          tasks,
        })
      })
  )
})
