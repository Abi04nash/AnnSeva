import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Yeh zaroori hai v4 ke liye
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src', 
    },
  },
  plugins: [
    react(),
    tailwindcss(), // <-- Tailwind ka build yahan se hota hai
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AnnSeva', 
        short_name: 'AnnSeva', 
        description: 'A surplus food redistribution platform connecting donors with NGOs',
        theme_color: '#FFA500', 
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})