// 📁 src/components/PWAStatusBadge.jsx - PWA status indikátor
import React, { useState, useEffect } from 'react'
import { Smartphone, Wifi, WifiOff, Bell, BellOff } from 'lucide-react'

function PWAStatusBadge() {
  const [status, setStatus] = useState({
    isStandalone: false,
    isOnline: navigator.onLine,
    hasNotifications: Notification.permission === 'granted',
    hasServiceWorker: false
  })

  useEffect(() => {
    // Detekce PWA režimu
    const checkStandalone = () => {
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone ||
        document.referrer.includes('android-app://')
      
      setStatus(prev => ({ ...prev, isStandalone }))
    }

    // Detekce Service Worker
    const checkServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration()
          setStatus(prev => ({ ...prev, hasServiceWorker: !!registration }))
        } catch (error) {
          console.log('SW check error:', error)
        }
      }
    }

    // Online/Offline listenery
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }))

    // Notifikace změny
    const handleNotificationChange = () => {
      setStatus(prev => ({ ...prev, hasNotifications: Notification.permission === 'granted' }))
    }

    // Inicializace
    checkStandalone()
    checkServiceWorker()

    // Event listenery
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Periodické kontroly
    const interval = setInterval(() => {
      checkStandalone()
      handleNotificationChange()
    }, 5000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  // Zobrazit jen v development nebo standalone módu
  const shouldShow = process.env.NODE_ENV === 'development' || status.isStandalone

  if (!shouldShow) return null

  return (
    <div className="fixed top-4 left-4 z-40 flex items-center space-x-2">
      
      {/* PWA Status */}
      {status.isStandalone && (
        <div className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-xs font-medium shadow-lg">
          <Smartphone className="w-3 h-3" />
          <span>PWA</span>
        </div>
      )}

      {/* Service Worker Status */}
      {status.hasServiceWorker && (
        <div className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-xs font-medium shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span>SW</span>
        </div>
      )}

      {/* Online/Offline Status */}
      <div className={`px-3 py-1 rounded-full flex items-center space-x-1 text-xs font-medium shadow-lg ${
        status.isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        {status.isOnline ? (
          <Wifi className="w-3 h-3" />
        ) : (
          <WifiOff className="w-3 h-3" />
        )}
        <span>{status.isOnline ? 'Online' : 'Offline'}</span>
      </div>

      {/* Notifications Status */}
      <div className={`px-3 py-1 rounded-full flex items-center space-x-1 text-xs font-medium shadow-lg ${
        status.hasNotifications 
          ? 'bg-purple-500 text-white' 
          : 'bg-gray-500 text-white'
      }`}>
        {status.hasNotifications ? (
          <Bell className="w-3 h-3" />
        ) : (
          <BellOff className="w-3 h-3" />
        )}
        <span>{status.hasNotifications ? 'Bell' : 'No Bell'}</span>
      </div>

    </div>
  )
}

export default PWAStatusBadge