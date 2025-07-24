// 📁 src/components/SimplePWATest.jsx - rychlý test PWA
import React, { useState, useEffect } from 'react'
import { pwaNotifications } from '../lib/pwaNotifications'

function SimplePWATest() {
  const [status, setStatus] = useState('Čekám...')
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission)

  useEffect(() => {
    checkPWAStatus()
  }, [])

  const checkPWAStatus = () => {
    const hasServiceWorker = 'serviceWorker' in navigator
    const hasNotifications = 'Notification' in window
    const hasVibration = 'vibrate' in navigator
    
    setStatus(`
      🔧 Service Worker: ${hasServiceWorker ? '✅' : '❌'}
      🔔 Notifikace: ${hasNotifications ? '✅' : '❌'}
      📳 Haptika: ${hasVibration ? '✅' : '❌'}
      🚀 PWA Support: ${hasServiceWorker && hasNotifications ? '✅' : '❌'}
    `)
  }

  const handleTestAll = async () => {
    console.log('🧪 Spouštím kompletní test...')
    
    try {
      // 1. Inicializace
      const initSuccess = await pwaNotifications.init()
      console.log('✅ PWA init:', initSuccess)
      
      // 2. Požádat o notifikace
      if (Notification.permission !== 'granted') {
        const permissionGranted = await pwaNotifications.requestPermission()
        setNotificationPermission(Notification.permission)
        console.log('🔔 Notifikace povoleny:', permissionGranted)
      }
      
      // 3. Test haptiky
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
        console.log('📳 Haptika test')
      }
      
      // 4. Test notifikace
      setTimeout(() => {
        pwaNotifications.showTestNotification()
        console.log('🔔 Test notifikace odeslána')
      }, 1000)
      
      setStatus('✅ Všechny testy dokončeny!')
      
    } catch (error) {
      console.error('❌ Chyba při testování:', error)
      setStatus('❌ Chyba při testování: ' + error.message)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #ec4899',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      maxWidth: '300px',
      fontSize: '14px'
    }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#ec4899' }}>🧪 PWA Test</h3>
      
      <pre style={{ 
        fontSize: '12px', 
        background: '#f5f5f5', 
        padding: '8px', 
        borderRadius: '6px',
        whiteSpace: 'pre-line'
      }}>
        {status}
      </pre>
      
      <div style={{ marginTop: '12px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px' }}>
          Notifikace: <strong>{notificationPermission}</strong>
        </p>
        
        <button
          onClick={handleTestAll}
          style={{
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          🚀 Test všechno
        </button>
        
        <button
          onClick={() => pwaNotifications.testHaptics()}
          style={{
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '11px',
            marginLeft: '8px'
          }}
        >
          📳 Test haptiky
        </button>
      </div>
    </div>
  )
}

export default SimplePWATest