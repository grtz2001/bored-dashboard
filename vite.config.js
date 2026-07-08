import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The Bored API doesn't send CORS headers, so the browser blocks direct
    // fetches. Proxy them through the dev server (server-to-server, no CORS):
    // the app calls /bored/... and Vite forwards it to the real API.
    proxy: {
      '/bored': {
        target: 'https://bored-api.appbrewery.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bored/, ''),
      },
    },
  },
})
