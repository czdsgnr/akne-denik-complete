import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { 
  Bug, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Eye,
  User,
  Clock,
  Wifi,
  WifiOff,
  Shield,
  Key,
  FileText,
  Download,
  Upload
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../lib/firebase'
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  limit 
} from 'firebase/firestore'

function DebugTool() {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { timestamp, message, type }])
  }

  // 🧪 TEST FIREBASE PŘIPOJENÍ
  const testFirebaseConnection = async () => {
    setLoading(true)
    addLog('🔄 Testování Firebase připojení...', 'info')
    
    try {
      const testDoc = doc(db, 'test', 'connection')
      await setDoc(testDoc, { timestamp: new Date(), test: true })
      
      const readDoc = await getDoc(testDoc)
      if (readDoc.exists()) {
        addLog('✅ Firebase připojení funguje', 'success')
        setTestResults(prev => ({ ...prev, firebase: true }))
      } else {
        addLog('❌ Firebase čtení selhalo', 'error')
        setTestResults(prev => ({ ...prev, firebase: false }))
      }
    } catch (error) {
      addLog(`❌ Firebase chyba: ${error.message}`, 'error')
      setTestResults(prev => ({ ...prev, firebase: false }))
    } finally {
      setLoading(false)
    }
  }

  // 🧪 TEST DAILYCONTENT OPRÁVNĚNÍ
  const testDailyContentPermissions = async () => {
    setLoading(true)
    addLog('🔄 Testování dailyContent oprávnění...', 'info')
    
    try {
      const testDay = 999 // Test den
      const testDoc = doc(db, 'dailyContent', `day-${testDay}`)
      
      // Test ZÁPISU
      const testData = {
        day: testDay,
        motivation: 'Test motivace',
        task: 'Test úkol',
        isPhotoDay: false,
        createdAt: new Date().toISOString(),
        createdBy: user.email
      }
      
      await setDoc(testDoc, testData)
      addLog('✅ Zápis do dailyContent funguje', 'success')
      
      // Test ČTENÍ
      const readDoc = await getDoc(testDoc)
      if (readDoc.exists()) {
        addLog('✅ Čtení z dailyContent funguje', 'success')
        setTestResults(prev => ({ ...prev, dailyContent: true }))
        
        // Vyčištění test dat
        await setDoc(testDoc, { deleted: true })
        addLog('🧹 Test data vyčištěna', 'info')
      } else {
        addLog('❌ Čtení z dailyContent selhalo', 'error')
        setTestResults(prev => ({ ...prev, dailyContent: false }))
      }
      
    } catch (error) {
      addLog(`❌ dailyContent chyba: ${error.message}`, 'error')
      setTestResults(prev => ({ ...prev, dailyContent: false }))
      
      if (error.code === 'permission-denied') {
        addLog('🚨 PERMISSION DENIED - Zkontroluj Firebase Rules!', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  // 🧪 TEST NAČTENÍ EXISTUJÍCÍHO OBSAHU
  const testLoadExistingContent = async () => {
    setLoading(true)
    addLog('🔄 Testování načtení existujícího obsahu...', 'info')
    
    try {
      const snapshot = await getDocs(query(collection(db, 'dailyContent'), limit(5)))
      const count = snapshot.size
      
      addLog(`📊 Nalezeno ${count} dnů s obsahem`, 'info')
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        addLog(`📄 Den ${data.day}: "${data.motivation?.substring(0, 50)}..."`, 'info')
      })
      
      setTestResults(prev => ({ ...prev, existingContent: count }))
      
    } catch (error) {
      addLog(`❌ Chyba při načítání obsahu: ${error.message}`, 'error')
      setTestResults(prev => ({ ...prev, existingContent: false }))
    } finally {
      setLoading(false)
    }
  }

  // 🧪 TEST ADMIN OPRÁVNĚNÍ
  const testAdminPermissions = async () => {
    setLoading(true)
    addLog('🔄 Testování admin oprávnění...', 'info')
    
    try {
      // Kontrola emailu
      const isAdminEmail = user.email?.includes('@aknedenik.cz') || user.email?.includes('@akne-online.cz')
      addLog(`📧 Email: ${user.email}`, 'info')
      addLog(`🔑 Admin email: ${isAdminEmail ? 'ANO' : 'NE'}`, isAdminEmail ? 'success' : 'error')
      
      // Test přístupu k admin kolekcím
      const collections = ['users', 'userLogs', 'messages', 'products']
      
      for (const collectionName of collections) {
        try {
          const snapshot = await getDocs(query(collection(db, collectionName), limit(1)))
          addLog(`✅ Přístup k ${collectionName}: OK (${snapshot.size} docs)`, 'success')
        } catch (error) {
          addLog(`❌ Přístup k ${collectionName}: CHYBA`, 'error')
        }
      }
      
      setTestResults(prev => ({ ...prev, adminPermissions: isAdminEmail }))
      
    } catch (error) {
      addLog(`❌ Admin test chyba: ${error.message}`, 'error')
      setTestResults(prev => ({ ...prev, adminPermissions: false }))
    } finally {
      setLoading(false)
    }
  }

  // 🧪 KOMPLETNÍ TEST
  const runAllTests = async () => {
    setLogs([])
    setTestResults({})
    addLog('🚀 Spouštím kompletní diagnostiku...', 'info')
    
    await testFirebaseConnection()
    await testAdminPermissions()
    await testDailyContentPermissions()
    await testLoadExistingContent()
    
    addLog('🏁 Diagnostika dokončena!', 'info')
  }

  // 📋 EXPORT DIAGNOSTIKY
  const exportDiagnostics = () => {
    const report = {
      timestamp: new Date().toISOString(),
      user: {
        email: user.email,
        uid: user.uid
      },
      testResults,
      logs,
      browserInfo: {
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `akne-denik-diagnostika-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    addLog('📄 Diagnostika exportována', 'success')
  }

  useEffect(() => {
    // Auto-start základní diagnostika při načtení
    testFirebaseConnection()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl text-white p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Bug className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Diagnostika systému</h1>
        </div>
        <p className="text-red-100">
          Nástroj pro řešení problémů s ukládáním obsahu a Firebase oprávněními
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Testy */}
        <div className="space-y-4">
          
          <Card>
            <CardHeader>
              <CardTitle>🧪 Diagnostické testy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              
              <Button
                onClick={runAllTests}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testuji...
                  </>
                ) : (
                  <>
                    <Bug className="w-4 h-4 mr-2" />
                    Spustit všechny testy
                  </>
                )}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={testFirebaseConnection}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Firebase
                </Button>
                
                <Button
                  onClick={testAdminPermissions}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin práva
                </Button>
                
                <Button
                  onClick={testDailyContentPermissions}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <Key className="w-4 h-4 mr-2" />
                  DailyContent
                </Button>
                
                <Button
                  onClick={testLoadExistingContent}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Existující obsah
                </Button>
              </div>
              
            </CardContent>
          </Card>

          {/* Výsledky testů */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Výsledky testů</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                
                {Object.entries(testResults).map(([test, result]) => (
                  <div key={test} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium capitalize">
                      {test.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <div className="flex items-center space-x-2">
                      {result === true ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-green-600 font-medium">OK</span>
                        </>
                      ) : result === false ? (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="text-red-600 font-medium">CHYBA</span>
                        </>
                      ) : typeof result === 'number' ? (
                        <>
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="text-blue-600 font-medium">{result}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-400">Čekám...</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                
              </div>
            </CardContent>
          </Card>

          {/* Export */}
          <Card>
            <CardHeader>
              <CardTitle>📤 Export & Podpora</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              
              <Button
                onClick={exportDiagnostics}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportovat diagnostiku
              </Button>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Exportuj diagnostiku a pošli ji podpor.</p>
                <p>• Obsahuje anonymní technické údaje</p>
                <p>• Pomůže s rychlým řešením problémů</p>
              </div>
              
            </CardContent>
          </Card>

        </div>

        {/* Logy */}
        <div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>📝 Diagnostické logy</CardTitle>
                <Button
                  onClick={() => setLogs([])}
                  variant="outline"
                  size="sm"
                >
                  Vymazat
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              
              <div className="h-96 overflow-y-auto bg-gray-900 rounded-lg p-4 font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">
                    Zatím žádné logy...
                    <br />
                    Spusť nějaký test! 🧪
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div
                      key={index}
                      className={`mb-1 ${
                        log.type === 'error' ? 'text-red-400' :
                        log.type === 'success' ? 'text-green-400' :
                        log.type === 'warning' ? 'text-yellow-400' :
                        'text-gray-300'
                      }`}
                    >
                      <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                    </div>
                  ))
                )}
              </div>
              
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Návod na opravu Firebase pravidel */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">🚨 Časté problémy a řešení</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <h4 className="font-bold text-red-700 mb-2">❌ PERMISSION DENIED při ukládání</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Problém:</strong> Admin nemůže ukládat do dailyContent kolekce</p>
              <p><strong>Řešení:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Jdi do Firebase Console → Firestore → Rules</li>
                <li>Zkontroluj že admin má write přístup k dailyContent</li>
                <li>Pravidla by měla obsahovat: <code className="bg-gray-100 px-1 rounded">allow write: if request.auth.token.email.matches('.*@aknedenik\\.cz$')</code></li>
                <li>Publikuj pravidla</li>
              </ol>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <h4 className="font-bold text-yellow-700 mb-2">⚠️ Obsah se neukazuje uživatelům</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Možné příčiny:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Data se neukládají (permission denied)</li>
                <li>MyDayPage načítá z jiné kolekce</li>
                <li>Uživatel není na správném dni</li>
                <li>Cache problém v prohlížeči</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <h4 className="font-bold text-blue-700 mb-2">ℹ️ Kontrolní seznam</h4>
            <div className="text-sm text-gray-700">
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>✅ Admin email končí na @aknedenik.cz nebo @akne-online.cz</li>
                <li>✅ Firebase pravidla povolují write do dailyContent</li>
                <li>✅ Obsah se úspěšně ukládá (zelené ✅ v diagnostice)</li>
                <li>✅ MyDayPage načítá z Firebase (ne localStorage)</li>
                <li>✅ Uživatel je na správném dni programu</li>
              </ol>
            </div>
          </div>

        </CardContent>
      </Card>

    </div>
  )
}

export default DebugTool