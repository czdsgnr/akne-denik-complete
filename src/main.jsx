// 🔧 GLOBÁLNÍ POLYFILL PRO NOTIFICATION API (iOS FIX) - OPRAVENÝ!
if (typeof window !== 'undefined' && !('Notification' in window)) {
  console.warn('🔔 Notification API není podporováno - používám polyfill')
  
  // Vytvoř fake Notification class
  class FakeNotification {
    constructor(title, options = {}) {
      console.log(`🔔 Fake notification: ${title}`, options)
      this.title = title
      this.options = options
      this.onclick = null
      this.onshow = null
      this.onclose = null
      this.onerror = null
    }
    
    close() {
      console.log('🔔 Fake notification closed')
    }
    
    static async requestPermission() {
      console.log('🔔 Fake notification permission request')
      return 'denied'
    }
  }
  
  // 🔧 OPRAVA: Definuj permission jako configurable property
  Object.defineProperty(FakeNotification, 'permission', {
    value: 'denied',
    writable: true,
    enumerable: true,
    configurable: true
  })
  
  // Přiřaď do window
  window.Notification = FakeNotification
}

// 🔧 BEZPEČNÁ KONTROLA SERVICE WORKER
if (typeof window !== 'undefined' && !('serviceWorker' in navigator)) {
  console.warn('🔧 Service Worker není podporován - používám polyfill')
  
  // Fake service worker pro fallback
  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      register: () => Promise.reject(new Error('Service Worker not supported')),
      getRegistration: () => Promise.resolve(null)
    },
    writable: true,
    enumerable: true,
    configurable: true
  })
}

// 🔧 BEZPEČNÁ KONTROLA VIBRATE API
if (typeof window !== 'undefined' && !('vibrate' in navigator)) {
  console.warn('📳 Vibrate API není podporováno - používám polyfill')
  
  Object.defineProperty(navigator, 'vibrate', {
    value: () => false,
    writable: true,
    enumerable: true,
    configurable: true
  })
}

// 📱 MOBILE DEBUG INFO
console.log('🚀 Akné Deník - Mobile polyfills loaded')
console.log('📱 User Agent:', navigator.userAgent)
console.log('🔔 Notification support:', 'Notification' in window)
console.log('🔧 Service Worker support:', 'serviceWorker' in navigator)
console.log('📳 Vibrate support:', 'vibrate' in navigator)

// PŮVODNÍ MAIN.JSX KÓD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)