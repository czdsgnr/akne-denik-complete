// 📁 src/components/PWAInstallPrompt.jsx - Bezpečná verze pro mobil
import React, { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

function PWAInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // 🔧 BEZPEČNÁ KONTROLA PWA SUPPORT
    const checkPWASupport = () => {
      // Kontrola jestli už není nainstalována
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone ||
                          document.referrer.includes('android-app://')

      if (isStandalone) {
        setIsInstalled(true)
        return false
      }

      // Kontrola Service Worker support
      if (!('serviceWorker' in navigator)) {
        console.warn('🔧 Service Worker není podporován')
        return false
      }

      return true
    }

    if (!checkPWASupport()) {
      return
    }

    // Event listener pro beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('📱 PWA install prompt available')
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Zobraz prompt po 5 sekundách (aby nebyl rušivý)
      setTimeout(() => {
        setIsVisible(true)
      }, 5000)
    }

    // Event listener pro instalaci
    const handleAppInstalled = () => {
      console.log('📱 PWA byla nainstalována')
      setIsVisible(false)
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    // Přidat event listenery
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.warn('📱 Install prompt není dostupný')
      return
    }

    try {
      // Zobraz systémový install prompt
      deferredPrompt.prompt()
      
      // Počkej na odpověď
      const { outcome } = await deferredPrompt.userChoice
      
      console.log(`📱 User choice: ${outcome}`)
      
      if (outcome === 'accepted') {
        console.log('✅ Uživatel přijal instalaci')
        
        // Haptická odezva
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200])
        }
      } else {
        console.log('❌ Uživatel odmítl instalaci')
      }
      
      // Skryj prompt
      setIsVisible(false)
      setDeferredPrompt(null)
      
    } catch (error) {
      console.error('❌ Chyba při instalaci PWA:', error)
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    
    // Znovu zobraz za 24 hodin
    localStorage.setItem('pwa-dismiss-time', Date.now().toString())
  }

  // Už je nainstalována nebo není support
  if (isInstalled || !isVisible || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              Instalovat Akné Deník
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Rychlý přístup z domovské obrazovky, funguje i bez internetu
            </p>
            
            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:from-pink-600 hover:to-purple-700 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Instalovat</span>
              </button>
              
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt