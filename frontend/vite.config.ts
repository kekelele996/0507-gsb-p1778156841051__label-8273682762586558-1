import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const version = readFileSync(resolve(__dirname, '../VERSION'), 'utf-8').trim()

  return {
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
        '/sanctum': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  }
})
