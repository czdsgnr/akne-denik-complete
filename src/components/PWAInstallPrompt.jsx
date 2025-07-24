// 📁 src/components/PWAInstallPrompt.jsx - Bottom Sheet pro PWA instalaci
import React, { useState, useEffect } from 'react'
import { X, Download, Smartphone, Share, Plus, Home, Chrome } from 'lucide-react'

function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isStandalone: false,
    browser: 'unknown'
  })

  useEffect(() => {
    detectDevice()
    setupInstallPrompt()
    
    // Zobrazit prompt po 10 sekundách, pokud není instalováno
    const timer = setTimeout(() => {
      if (!deviceInfo.isStandalone && !localStorage.getItem('pwa-install-dismissed')) {
        setShowPrompt(true)
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const detectDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.navigator.standalone ||
                        document.referrer.includes('android-app://')

    const info = {
      isIOS: /iphone|ipad|ipod/.test(userAgent),
      isAndroid: /android/.test(userAgent),
      isMobile: /mobile|android|iphone|ipad|ipod/.test(userAgent),
      isStandalone,
      browser: getBrowserName(userAgent)
    }

    setDeviceInfo(info)
  }

  const getBrowserName = (userAgent) => {
    if (userAgent.includes('chrome')) return 'chrome'
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari'
    if (userAgent.includes('firefox')) return 'firefox'
    if (userAgent.includes('edge')) return 'edge'
    return 'unknown'
  }

  const setupInstallPrompt = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Zobrazit prompt automaticky, pokud není dismissed
      if (!localStorage.getItem('pwa-install-dismissed')) {
        setShowPrompt(true)
      }
    })

    window.addEventListener('appinstalled', () => {
      console.log('🎉 PWA byla nainstalována!')
      setShowPrompt(false)
      setDeferredPrompt(null)
      
      // Haptická odezva
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 400])
      }
    })
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Android Chrome - použij native prompt
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('✅ Uživatel přijal instalaci')
      } else {
        console.log('❌ Uživatel odmítl instalaci')
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    } else {
      // iOS nebo jiný - ukazuj instrukce
      // Prompt zůstane zobrazený s instrukcemi
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    
    // Znovu zobrazit za 3 dny
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed')
    }, 3 * 24 * 60 * 60 * 1000)
  }

  const handleLater = () => {
    setShowPrompt(false)
    // Znovu zobrazit za 1 hodinu
    setTimeout(() => {
      setShowPrompt(true)
    }, 60 * 60 * 1000)
  }

  if (!showPrompt || deviceInfo.isStandalone) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-300"
        onClick={handleDismiss}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 max-w-md mx-auto">
          
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Instalovat Akné Deník</h3>
                  <p className="text-sm text-gray-600">Získej rychlý přístup</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Rychlý přístup z domovské obrazovky</p>
                  <p className="text-xs text-gray-600">Spouštěj jako normální aplikaci</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Home className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Funguje i bez internetu</p>
                  <p className="text-xs text-gray-600">Použij kdekoliv, kdykoliv</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Download className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Žádné stahování z obchodu</p>
                  <p className="text-xs text-gray-600">Instalace přímo z prohlížeče</p>
                </div>
              </div>
            </div>

            {/* Install Instructions */}
            {deviceInfo.isIOS ? (
              // iOS Instructions
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Share className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-2">Jak nainstalovat na iOS:</p>
                    <ol className="text-blue-700 space-y-1 text-xs list-decimal list-inside">
                      <li>Klepni na tlačítko <strong>Sdílet</strong> 📤 (dole uprostřed)</li>
                      <li>Roluj dolů a vyber <strong>"Přidat na plochu"</strong> 📱</li>
                      <li>Klepni na <strong>"Přidat"</strong> pro potvrzení</li>
                    </ol>
                  </div>
                </div>
              </div>
            ) : deviceInfo.isAndroid && deviceInfo.browser === 'chrome' ? (
              // Android Chrome - má native prompt
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Chrome className="w-5 h-5 text-green-600" />
                  <div className="text-sm">
                    <p className="font-medium text-green-900">Klepni na "Instalovat" pro přidání na plochu! 📱</p>
                  </div>
                </div>
              </div>
            ) : (
              // Other browsers
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <Plus className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-2">Jak nainstalovat:</p>
                    <ol className="text-gray-700 space-y-1 text-xs list-decimal list-inside">
                      <li>Otevři menu prohlížeče (⋮)</li>
                      <li>Vyber "Přidat na domovskou obrazovku"</li>
                      <li>Potvrď přidání aplikace</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {deferredPrompt && (
                <button
                  onClick={handleInstall}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" />
                  <span>Instalovat aplikaci</span>
                </button>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={handleLater}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
                >
                  Připomenout později
                </button>
                <button
                  onClick={handleDismiss}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
                >
                  Ne, děkuji
                </button>
              </div>
            </div>

            {/* Small print */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Můžeš odinstalovat kdykoliv z nastavení telefonu
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default PWAInstallPrompt