# Smart Connect PWA v2

## General informations

Please note, that this app is constantly evolving. As of now, I plan to provide detailed documentation once I feel the app has enough features. I try to implement every feature stable, so Smart Connect should be usable perfectly fine (and stable) already.

If you stumbled on this repo already and want to use Smart Connect, but miss docs on certain parts, just open an issue and I will try my best to provide additional details.

### Ideas

If you have any ideas on new features or on any improvements (technical, UI, whatever), please feel free to just open an issue!

## Overview

Smart Connect is a PWA (=Progressive Web App) to control your devices in ioBroker.

## Features

### Offline-ready & installable

This app leverages almost all currently available web features for PWAs. This allows for a native-like experience with offline support, caching and many performance optimizations.

### Push notifications with actions

Via VAPID, you can send push notifications to this app from your javascript adapter in ioBroker. Just copy the keys and your set up, not third party provider or external server is required!

Smart Connect Push notifications have many icons already build in, if you require additional icons, feel free to open an issue!

#### Actions

Not only can you send notifications like warnings, infos or status reports to your mobile device, you can also engage on them directly from your phone via actions.

If you provide actions to a notification, users get buttons in the notification from which they can trigger state changes directly in ioBroker.

### History

Devices for which it makes sense render a history graph based on your ioBroker history source. As of now, only climate-sensor provides this.

### Security & home vitals overview

### Pin favorite room

### Filter devices

### Simple and detailed controls

## Supported Devices

## Setup

The setup process requires you to do just two things:

### Cloudflare Tunnel

In order for your ioBroker to be accessible over the internet, you need to expose your simple-api instance via a Cloudflare Tunnel.

### Set up all devices in the alias-folder

Smart Connect discovers devices automatically in your alias.0 folder. As device types may have different state representations from their adapter, it is necessary to get all devices in the format described under `Supported devices`.

## Details about the syncing process

As of now, this PWA sync states with ioBroker via regular HTTP requests to a simple-api instance. This works quite well, but a much better performance could be achieved with WebSockets. ioBroker supports communication via WebSockets and there is even a sophisticated TypeScript library to use this feature.

However, browsers don't allow to send custom headers in a WebSocket request, hence no WebSocket connection can pass through Cloudflare Access. Any ideas on how to solve this are highly welcome!

### Sync interval

By default, all states of visible devices will be synced at most every 3s. If ioBroker takes long to respond or you are using Smart Connect on a slow device, it might be more infrequent.

Hidden device's states will be synced every 10s, which means even if you hide e.g. window sensors, the security overview will still update every 10s.

If the details overview of a device is opened, its states will be synced with higher priority, at most every 0.5s. All other states won't be synced while details are opened.

The devices itself will be synced on load and afterwards every 30s.

If you change a device's state, its states will be synced 5x with a 0.5s delay to ensure quick responses in the UI.

### Initial load

If you open the app, all states need to be re-fetch initially. During this re-fetch, Smart Connect will show the values it got the last time you opened Smart Connect. As there might be hundreds of states to fetch, you may experience major latencies in the UI when changing device states for the first couple of seconds after the app started.

## Security concerns

It may feel unsafe to expose your ioBroker to the entire internet. However, Cloudflare Access, if configured correctly provides a solid protection layer for your smart home. Your credentials will only be saved locally on your device (in the IndexedDB, to be exact). Neither me, the developer of this app, nor any other third party will get to see your tokens.
