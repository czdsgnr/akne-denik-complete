// 📁 src/components/PWATestPage.jsx - Testovací stránka pro PWA funkce
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  Bell,
  Smartphone,
  Download,
  CheckCircle2,
  AlertCircle,
  Camera,
  Heart,
  Settings,
  Zap,
  Volume2
} from 'lucide-react'
import { pwaNotifications } from '../../lib/pwaNotifications'

function PWATestPage() {
  const [pwaStatus, setPwaStatus] = useState({
    serviceWorker: false,
    notifications: 'default',
    standalone: false,
    vibration: false
  })
  const [testResults, setTestResults] = useState([])

  useEffect(() => {
    checkPWASupport()
  }, [])

  const checkPWASupport = () => {
    const status = {
      serviceWorker: 'serviceWorker' in navigator,
      notifications: Notification.permission,
      standalone: window.matchMedia('(display-mode: standalone)').matches,
      vibration: 'vibrate' in navigator
    }
    
    setPwaStatus(status)
    
    // Inicializace PWA pokud ještě není
    if (status.serviceWorker) {
      pwaNotifications.init()
    }
  }

  const addTestResult = (test, success, message) => {
    const result = {
      id: Date.now(),
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString('cs-CZ')
    }
    setTestResults(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 results
  }

  const handleRequestNotifications = async () => {
    try {
      const granted = await pwaNotifications.requestPermission()
      if (granted) {
        addTestResult('Notifikace', true, 'Povolení uděleno úspěšně!')
        setPwaStatus(prev => ({ ...prev, notifications: 'granted' }))
      } else {
        addTestResult('Notifikace', false, 'Povolení zamítnuto')
      }
    } catch (error) {
      addTestResult('Notifikace', false, `Chyba: ${error.message}`)
    }
  }

  const handleTestNotification = () => {
    try {
      pwaNotifications.showTestNotification()
      addTestResult('Test notifikace', true, 'Testovací notifikace odeslána')
    } catch (error) {
      addTestResult('Test notifikace', false, `Chyba: ${error.message}`)
    }
  }

  const handleTestDailyReminder = () => {
    try {
      pwaNotifications.showDailyReminder()
      addTestResult('Denní připomenutí', true, 'Denní připomenutí zobrazeno')
    } catch (error) {
      addTestResult('Denní připomenutí', false, `Chyba: ${error.message}`)
    }
  }

  const handleTestPhotoReminder = () => {
    try {
      pwaNotifications.showPhotoReminder(7)
      addTestResult('Foto připomenutí', true, 'Foto připomenutí zobrazeno')
    } catch (error) {
      addTestResult('Foto připomenutí', false, `Chyba: ${error.message}`)
    }
  }

  const handleTestProgress = () => {
    try {
      pwaNotifications.showProgressNotification(45, 365)
      addTestResult('Progress notifikace', true, 'Progress notifikace zobrazena')
    } catch (error) {
      addTestResult('Progress notifikace', false, `Chyba: ${error.message}`)
    }
  }

  const handleTestHaptics = () => {
    try {
      const success = pwaNotifications.testHaptics()
      if (success) {
        addTestResult('Haptika', true, 'Test haptiky spuštěn (5 různých vzorů)')
      } else {
        addTestResult('Haptika', false, 'Haptika není podporována')
      }
    } catch (error) {
      addTestResult('Haptika', false, `Chyba: ${error.message}`)
    }
  }

  const handleScheduleDaily = async () => {
    try {
      const success = await pwaNotifications.scheduleDailyReminder(9, 0)
      if (success) {
        addTestResult('Plánování', true, 'Denní připomenutí naplánováno na 9:00')
      } else {
        addTestResult('Plánování', false, 'Chyba při plánování')
      }
    } catch (error) {
      addTestResult('Plánování', false, `Chyba: ${error.message}`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case true:
      case 'granted':
        return 'bg-green-100 text-green-800 border-green-200'
      case false:
      case 'denied':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'default':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (supported) => {
    return supported ? (
      <CheckCircle2 className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-600" />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PWA Test Center</h1>
          <p className="text-gray-600">Test všech PWA funkcí Akné Deníku</p>
        </div>

        {/* PWA Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>PWA Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Service Worker */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(pwaStatus.serviceWorker)}
                  <span className="text-sm font-medium">Service Worker</span>
                </div>
                <Badge className={getStatusColor(pwaStatus.serviceWorker)}>
                  {pwaStatus.serviceWorker ? 'Aktivní' : 'Nepodporováno'}
                </Badge>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-medium">Notifikace</span>
                </div>
                <Badge className={getStatusColor(pwaStatus.notifications)}>
                  {pwaStatus.notifications === 'granted' ? 'Povoleno' : 
                   pwaStatus.notifications === 'denied' ? 'Zamítnuto' : 'Čeká'}
                </Badge>
              </div>

              {/* Standalone */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm font-medium">Standalone</span>
                </div>
                <Badge className={getStatusColor(pwaStatus.standalone)}>
                  {pwaStatus.standalone ? 'Instalováno' : 'Prohlížeč'}
                </Badge>
              </div>

              {/* Vibration */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Haptika</span>
                </div>
                <Badge className={getStatusColor(pwaStatus.vibration)}>
                  {pwaStatus.vibration ? 'Podporováno' : 'Nepodporováno'}
                </Badge>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Notification Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifikace testy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              
              <Button
                onClick={handleRequestNotifications}
                disabled={pwaStatus.notifications === 'granted'}
                className="w-full"
                variant={pwaStatus.notifications === 'granted' ? 'outline' : 'default'}
              >
                {pwaStatus.notifications === 'granted' ? '✅ Povoleno' : '🔔 Povolit notifikace'}
              </Button>

              <Button
                onClick={handleTestNotification}
                disabled={pwaStatus.notifications !== 'granted'}
                variant="outline"
                className="w-full"
              >
                <Bell className="w-4 h-4 mr-2" />
                Test notifikace
              </Button>

              <Button
                onClick={handleTestDailyReminder}
                disabled={pwaStatus.notifications !== 'granted'}
                variant="outline"
                className="w-full"
              >
                <Heart className="w-4 h-4 mr-2" />
                Denní připomenutí
              </Button>

              <Button
                onClick={handleTestPhotoReminder}
                disabled={pwaStatus.notifications !== 'granted'}
                variant="outline"
                className="w-full"
              >
                <Camera className="w-4 h-4 mr-2" />
                Foto připomenutí
              </Button>

              <Button
                onClick={handleTestProgress}
                disabled={pwaStatus.notifications !== 'granted'}
                variant="outline"
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Progress notifikace
              </Button>

              <Button
                onClick={handleScheduleDaily}
                disabled={pwaStatus.notifications !== 'granted'}
                variant="outline"
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Naplánovat denní (9:00)
              </Button>

            </CardContent>
          </Card>

          {/* Haptic Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Haptika testy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              
              <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
                📳 Haptika funguje nejlépe na mobilních zařízeních. 
                Na desktopu se může neprojevit.
              </div>

              <Button
                onClick={handleTestHaptics}
                disabled={!pwaStatus.vibration}
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-2" />
                Test haptiky (5 vzorů)
              </Button>

              <Button
                onClick={() => navigator.vibrate && navigator.vibrate([100])}
                disabled={!pwaStatus.vibration}
                variant="outline"
                className="w-full"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Krátký puls
              </Button>

              <Button
                onClick={() => navigator.vibrate && navigator.vibrate([200, 100, 200])}
                disabled={!pwaStatus.vibration}
                variant="outline"
                className="w-full"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Dvojitý puls
              </Button>

              <Button
                onClick={() => navigator.vibrate && navigator.vibrate([100, 50, 100, 50, 100])}
                disabled={!pwaStatus.vibration}
                variant="outline"
                className="w-full"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Rytmický vzor
              </Button>

              <Button
                onClick={() => navigator.vibrate && navigator.vibrate([400, 200, 400])}
                disabled={!pwaStatus.vibration}
                variant="outline"
                className="w-full"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Silný dvojitý
              </Button>

            </CardContent>
          </Card>

        </div>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Výsledky testů</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTestResults([])}
              >
                Vymazat
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Zatím žádné testy. Spusť nějaký test výše! 👆
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {testResults.map((result) => (
                  <div
                    key={result.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      result.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {result.success ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{result.test}</p>
                        <p className="text-xs text-gray-600">{result.message}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Install PWA */}
        <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Instalovat jako PWA aplikaci
                </h3>
                <p className="text-sm text-gray-600">
                  Pro nejlepší zážitek si přidej Akné Deník na domovskou obrazovku
                </p>
              </div>
              <Button 
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                onClick={() => {
                  // Browser install prompt se aktivuje automaticky
                  alert('Použij "Přidat na domovskou obrazovku" v menu prohlížeče 📱')
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Instalovat
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default PWATestPage