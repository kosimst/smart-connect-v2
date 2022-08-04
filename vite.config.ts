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
        background_color: '#fff',
        start_url: '/',
        theme_color: '#fff',
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
            src: '/icons/favicon.svg',
            sizes:
              '16x16 32x32 48x48 64x64 96x96 128x128 192x192 256x256 512x512 1024x1024',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      includeAssets: 'public',
    }),
    react(),
    dynamicImport(),
  ],
})
