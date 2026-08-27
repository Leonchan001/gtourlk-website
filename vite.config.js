import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    port: parseInt(process.env.PORT) || 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        en: resolve(process.cwd(), 'en/index.html'),
      },
    },
  }
})
