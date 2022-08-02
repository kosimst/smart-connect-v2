import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
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
    }),
    react(),
  ],
})
