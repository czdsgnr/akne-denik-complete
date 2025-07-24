import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // povolí top‑level await (moderní prohlížeče)
  esbuild: { target: 'esnext' },
  build:  { target: 'esnext' },
})
