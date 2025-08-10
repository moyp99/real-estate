import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Estate Navigator',
        short_name: 'Estate Navigator',
        description: 'Find your perfect home',
        theme_color: '#1E40AF',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/real-estate/',
        start_url: '/real-estate/',
        icons: [
          {
            src: '/real-estate/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/real-estate/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: process.env.NODE_ENV === 'production' ? '/real-estate/' : '/',
  }
})