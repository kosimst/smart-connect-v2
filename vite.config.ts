import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import dynamicImport from 'vite-plugin-dynamic-import'

import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src/service-worker',
      filename: 'sw.ts',
      devOptions: {
        enabled: true,
      },
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      manifest: {
        name: 'Smart Connect',
        short_name: 'Smart Connect',
        display: 'standalone',
        orientation: 'portrait-primary',
        description: 'Smart Connect',
        start_url: '/',
        lang: 'en',
        categories: ['connectivity', 'utilities'],
        prefer_related_applications: true,
        related_applications: [],
        icons: [
          {
            src: '/icons/maskable.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/smart-connect-v2-icon_180px.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/smart-connect-v2-icon_192px.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/smart-connect-v2-icon_512px.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
        // @ts-ignore
        share_target: {
          action: '/_share-target',
          method: 'GET',
          params: {
            title: 'title',
            text: 'text',
            url: 'url',
          },
        },
        display_override: ['window-controls-overlay'],
      },
      includeAssets: 'public',
    }),
    react(),
    dynamicImport(),
  ],
})
