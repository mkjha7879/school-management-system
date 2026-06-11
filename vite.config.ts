import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages project sites the app is served from a sub-path.
// The deploy workflow sets DEPLOY_BASE=/school-management-system/.
const base = process.env.DEPLOY_BASE || '/'

export default defineConfig({
  base,
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
