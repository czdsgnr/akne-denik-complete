import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserApp from './pages/UserApp'
import AdminLayout from './components/admin/AdminLayout'
import AdminRoutes from './components/admin/AdminRoutes'
import DemoAdminPanel from './components/admin/DemoAdminPanel'

// 🆕 PWA IMPORTS
import { pwaNotifications } from './lib/pwaNotifications'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import PWAStatusBadge from './components/PWAStatusBadge'

// 🆕 OPTIONAL: PWA Test Page (pro testování)
// import PWATestPage from './components/PWATestPage'

function AppContent() {
  const { user, userRole, loading } = useAuth()

  // 🚀 PWA INICIALIZACE
  useEffect(() => {
    const initPWA = async () => {
      try {
        console.log('🔄 Inicializace PWA...')
        
        // 🔧 BEZPEČNÁ KONTROLA NOTIFICATION API
        const hasNotificationSupport = typeof window !== 'undefined' && 
                                      'Notification' in window && 
                                      typeof Notification !== 'undefined'
        
        console.log('🔔 Notification API support:', hasNotificationSupport)
        
        // Inicializace PWA systému
        const success = await pwaNotifications.init()
        
        if (success) {
          console.log('✅ PWA úspěšně inicializována!')
          
          // Zobrazit install prompt pokud je dostupný
          pwaNotifications.promptInstall()
          
          // 🔧 BEZPEČNÁ KONTROLA PŘED POUŽITÍM NOTIFICATION
          if (hasNotificationSupport && Notification.permission === 'granted') {
            console.log('🔔 Nastavuji denní připomenutí...')
            try {
              await pwaNotifications.scheduleDailyReminder(9, 0) // 9:00 ráno
            } catch (error) {
              console.error('❌ Chyba při nastavení připomenutí:', error)
            }
          } else {
            console.log('🔔 Notification API není dostupné nebo není povolené')
          }
          
        } else {
          console.warn('⚠️ PWA inicializace se nezdařila')
        }
        
      } catch (error) {
        console.error('❌ Chyba při inicializaci PWA:', error)
      }
    }

    // Spustit inicializaci po načtení
    initPWA()

    // 🎯 Event listenery pro PWA
    const handleInstall = (e) => {
      console.log('📱 PWA byla nainstalována!')
      
      // Haptická odezva při instalaci
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200])
      }
    }

    const handleOnline = () => {
      console.log('🌐 Aplikace je online')
    }

    const handleOffline = () => {
      console.log('📱 Aplikace je offline (PWA režim)')
    }

    // Přidat event listenery
    window.addEventListener('appinstalled', handleInstall)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('appinstalled', handleInstall)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, []) // Spustit jednou při načtení

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Načítání...</p>
        </div>
      </div>
    )
  }

  // Pokud není přihlášen, zobraz landing page, login nebo register
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/demo-admin" element={<DemoAdminPanel />} />
        
        {/* 🆕 OPTIONAL: PWA Test Route (pro development) */}
        {/* <Route path="/pwa-test" element={<PWATestPage />} /> */}
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // Pokud je admin, zobraz admin panel
  if (userRole === 'admin') {
    return (
      <AdminLayout>
        <AdminRoutes />
      </AdminLayout>
    )
  }

  // Pokud je běžný uživatel, zobraz hlavní aplikaci
  return <UserApp />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        
        {/* 🚀 PWA komponenty - pouze pokud jsou dostupné */}
        <PWAInstallPrompt />
        <PWAStatusBadge />
      </Router>
    </AuthProvider>
  )
}

export default App