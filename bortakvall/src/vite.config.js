import { resolve } from 'path'
import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        kassa: resolve(__dirname, 'kassa.html'),
      },
    },
  },
})