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
    // 🔧 MOBILNÍ KOMPATIBILITA - starší browsery
    target: [
      'chrome85',    // Starší verze pro lepší support
      'firefox85',   
      'safari14',    
      'edge85'       
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
    // 🔧 KONZERVATIVNĚJŠÍ ES TARGET
    minify: 'esbuild',
    cssMinify: true,
    // 🔧 Větší compatibility
    polyfillModulePreload: true
  },
  // 🔧 STARŠÍ ES TARGET pro mobile
  esbuild: {
    target: 'es2020', // Místo es2022
    supported: {
      'top-level-await': false // Vypni top-level await
    }
  },
  // 🔧 LEGACY PLUGIN pro fallback
  legacy: {
    targets: ['defaults', 'not IE 11']
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