import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // ✅ OPRAVENÉ TARGET ENVIRONMENTS - novější browsery
    target: [
      'chrome89',    // Místo chrome87
      'firefox89',   // Místo firefox78  
      'safari15',    // Místo safari14
      'edge89'       // Místo edge88
    ],
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'], 
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    },
    assetsDir: 'assets',
    sourcemap: false,
    // ✅ Modernější ES target
    minify: 'esbuild',
    cssMinify: true
  },
  // ✅ Aktualizované browserslist pro modernější support
  esbuild: {
    target: 'es2022', // Místo es2020
    supported: {
      'top-level-await': true
    }
  },
  server: {
    port: 5174,
    host: true,
    cors: true
  },
  preview: {
    port: 4173,
    host: true
  }
})