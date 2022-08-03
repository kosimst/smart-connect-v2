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
        display: 'standalone',
        orientation: 'portrait-primary',
      },
    }),
    react(),
    dynamicImport(),
  ],
})
