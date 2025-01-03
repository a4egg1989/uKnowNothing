import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
const config = {
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {}
  }
}

if (process.env.NODE_ENV === 'development') {
  config.server.proxy = {
    '/api': 'http://127.0.0.1:5000',
    '/dictFrame': 'https://stroke-order.learningweb.moe.edu.tw/dictFrame',
    // '/rwd': 'https://wwwc.twse.com.tw/',
    // '/account': 'http://localhost:3002',
    // '/api': 'http://localhost:3000'
  }
}

export default defineConfig(config)

