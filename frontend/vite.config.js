import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        timeout: 30000,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/templates': {
        target: 'http://localhost:3004',
        changeOrigin: true
      }
    }
  }
})
