import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { doc, setDoc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { 
  Save, 
  Calendar, 
  Users, 
  MessageSquare, 
  Package,
  Sparkles,
  Target,
  Camera,
  ChevronLeft,
  ChevronRight,
  Bug,
  AlertTriangle,
  CheckCircle,
  Eye,
  Trash2
} from 'lucide-react'

// 🔥 KOMPLETNÍ ADMIN PANEL - POUZE FIREBASE
function ContentPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('content')
  const [debugLog, setDebugLog] = useState([])
  const [stats, setStats] = useState({})
  
  // Content Editor State
  const [selectedDay, setSelectedDay] = useState(1)
  const [dayContent, setDayContent] = useState({
    day: 1,
    motivation: '',
    task: '',
    isPhotoDay: false,
    isDualPhotoDay: false
  })
  const [saving, setSaving] = useState(false)
  const [allContent, setAllContent] = useState({})
  const [lastSaveStatus, setLastSaveStatus] = useState('')

  const addDebug = (message) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `${timestamp}: ${message}`
    console.log('🔍 ADMIN DEBUG:', logMessage)
    setDebugLog(prev => [...prev.slice(-15), logMessage])
  }

  useEffect(() => {
    addDebug('🚀 Kompletní Admin Panel inicializován')
    
    // Check user permissions
    if (!user) {
      addDebug('❌ Uživatel není přihlášen!')
      return
    }
    
    const isAdmin = user.email?.endsWith('@aknedenik.cz') || user.email?.endsWith('@akne-online.cz')
    addDebug(`👤 Uživatel: ${user.email}`)
    addDebug(`🔐 Je Admin: ${isAdmin ? 'ANO' : 'NE'}`)
    
    if (!isAdmin) {
      addDebug('⚠️ VAROVÁNÍ: Uživatel nemá admin oprávnění!')
    }

    // Check localStorage pollution
    const localData = localStorage.getItem('dailyContent')
    if (localData) {
      addDebug('🚨 PROBLÉM: localStorage obsahuje dailyContent!')
      addDebug('🔧 Doporučuji vyčistit localStorage')
    } else {
      addDebug('✅ localStorage je čistý')
    }

    loadDashboardStats()
    loadAllContent()
  }, [user])

  useEffect(() => {
    if (activeTab === 'content') {
      loadDayContent(selectedDay)
    }
  }, [selectedDay, activeTab])

  const loadDashboardStats = async () => {
    try {
      addDebug('📊 Načítání dashboard statistik...')
      
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const messagesSnapshot = await getDocs(collection(db, 'messages'))
      const logsSnapshot = await getDocs(collection(db, 'userLogs'))
      
      const stats = {
        totalUsers: usersSnapshot.size,
        totalMessages: messagesSnapshot.size,
        totalLogs: logsSnapshot.size,
        loadedAt: new Date().toLocaleTimeString()
      }
      
      setStats(stats)
      addDebug(`✅ Statistiky načteny: ${stats.totalUsers} uživatelů, ${stats.totalMessages} zpráv`)
    } catch (error) {
      addDebug(`❌ Chyba při načítání statistik: ${error.message}`)
    }
  }

  const loadAllContent = async () => {
    try {
      addDebug('🔄 Načítání obsahu z Firebase...')
      const content = {}
      
      // Load first 10 days for performance
      for (let day = 1; day <= 10; day++) {
        const docRef = doc(db, 'dailyContent', `day-${day}`)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          content[day] = docSnap.data()
        }
      }
      
      setAllContent(content)
      addDebug(`✅ Načten obsah pro ${Object.keys(content).length} dnů z Firebase`)
    } catch (error) {
      addDebug(`❌ Chyba při načítání obsahu: ${error.message}`)
    }
  }

  const loadDayContent = async (dayNumber) => {
    try {
      addDebug(`📖 Načítání dne ${dayNumber}...`)
      const docRef = doc(db, 'dailyContent', `day-${dayNumber}`)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setDayContent(data)
        addDebug(`✅ Den ${dayNumber} načten z Firebase`)
      } else {
        addDebug(`📝 Den ${dayNumber} neexistuje - prázdný template`)
        setDayContent({
          day: dayNumber,
          motivation: `Den ${dayNumber} - Pokračuj ve své cestě za krásnou pletí! 💖`,
          task: `🎯 DEN ${dayNumber} - ZAMĚŘ SE NA SVOU RUTINU!

📌 VZPOMEŇ SI:
Co jsi dnes udělala pro svou pleť?

💪 ÚKOL:
Dnes se zaměř na:
- Jemné čištění pleti ráno i večer
- Hydrataci (alespoň 2 litry vody)
- Pozitivní afirmace před zrcadlem

💧 HYDRATACE:
- Vypij alespoň 2 litry vody
- Použij hydratační krém ráno i večer

🧘‍♀️ MINDFULNESS:
- 5 minut meditace nebo hlubokého dýchání
- Pozitivní afirmace: "Moje pleť se každým dnem zlepšuje"

📝 REFLEXE:
Zamysli se nad tím, co dnes uděláš pro svou pleť a celkovou pohodu.`,
          isPhotoDay: dayNumber % 7 === 1,
          isDualPhotoDay: dayNumber % 14 === 0
        })
      }
    } catch (error) {
      addDebug(`❌ Chyba při načítání dne ${dayNumber}: ${error.message}`)
    }
  }

  const saveContent = async () => {
    if (!dayContent.motivation.trim() || !dayContent.task.trim()) {
      alert('Prosím vyplňte motivaci i úkol')
      return
    }

    setSaving(true)
    setLastSaveStatus('')
    
    addDebug('🚨 ZAHÁJENÍ UKLÁDÁNÍ:')
    addDebug(`- Den: ${selectedDay}`)
    addDebug(`- Motivace: "${dayContent.motivation.substring(0, 50)}..."`)
    addDebug(`- Uživatel: ${user?.email}`)
    
    try {
      const docRef = doc(db, 'dailyContent', `day-${selectedDay}`)
      const contentToSave = {
        ...dayContent,
        day: selectedDay,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || 'admin'
      }
      
      addDebug(`🔥 Ukládání do Firebase: dailyContent/day-${selectedDay}`)
      await setDoc(docRef, contentToSave)
      
      // Update local cache
      setAllContent(prev => ({
        ...prev,
        [selectedDay]: contentToSave
      }))

      const successTime = new Date().toLocaleTimeString()
      addDebug(`✅ Den ${selectedDay} úspěšně uložen v ${successTime}!`)
      setLastSaveStatus(`✅ Uloženo v ${successTime}`)
      
      alert(`✅ Den ${selectedDay} byl úspěšně uložen do Firebase! 🔥\n\nČas: ${successTime}\nJdi zkontrolovat Firebase Console.`)
      
      // Reload content to verify
      setTimeout(() => {
        loadAllContent()
      }, 1000)
      
    } catch (error) {
      addDebug(`❌ Chyba při ukládání: ${error.message}`)
      addDebug(`❌ Error code: ${error.code}`)
      setLastSaveStatus(`❌ Chyba: ${error.message}`)
      alert('❌ Chyba při ukládání: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('dailyContent')
    localStorage.clear()
    addDebug('🗑️ localStorage vyčištěn!')
    alert('🗑️ localStorage vyčištěn! Refresh stránku.')
    window.location.reload()
  }

  const quickSaveDay1 = async () => {
    setSaving(true)
    addDebug('🚀 RYCHLÉ ULOŽENÍ DEN 1...')
    
    try {
      const day1Data = {
        day: 1,
        motivation: `NOVÝ OBSAH ${new Date().toLocaleString()} - Den 1 - Pokračuj ve své cestě za krásnou pletí! 💖`,
        task: `🎯 DNEŠNÍ ÚKOL - DEN 1 (${new Date().toLocaleString()}):

❄️ ZIMNÍ PÉČE:
Zaměř se na intenzivní hydrataci a ochranu před chladem.

💧 HYDRATACE:
- Vypij alespoň 2 litry vody
- Použij hydratační krém ráno i večer

🧘‍♀️ MINDFULNESS:
- 5 minut meditace nebo hlubokého dýchání
- Pozitivní afirmace: "Moje pleť se každým dnem zlepšuje"

📝 REFLEXE:
Zamysli se nad tím, co dnes uděláš pro svou pleť a celkovou pohodu.`,
        isPhotoDay: true,
        isDualPhotoDay: false,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || 'admin-quick'
      }
      
      const docRef = doc(db, 'dailyContent', 'day-1')
      await setDoc(docRef, day1Data)
      
      addDebug('✅ Den 1 rychle uložen!')
      alert('✅ Den 1 rychle uložen! Zkontroluj Firebase Console.')
      
      loadAllContent()
    } catch (error) {
      addDebug(`❌ Rychlé uložení selhalo: ${error.message}`)
      alert('❌ Rychlé uložení selhalo: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nejste přihlášeni</h1>
          <p className="text-gray-600">Pro přístup k admin panelu se musíte přihlásit.</p>
        </div>
      </div>
    )
  }

  const isAdmin = user.email?.endsWith('@aknedenik.cz') || user.email?.endsWith('@akne-online.cz')
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Přístup odepřen</h1>
          <p className="text-gray-600">Váš email ({user.email}) nemá admin oprávnění.</p>
          <p className="text-sm text-gray-500 mt-2">Potřebujete email @aknedenik.cz nebo @akne-online.cz</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🔥 Admin Panel (Firebase ONLY)</h1>
              <p className="text-sm text-gray-600">Admin: {user.email} • {lastSaveStatus}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {localStorage.getItem('dailyContent') && (
                <button
                  onClick={clearLocalStorage}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  🗑️ Vyčistit localStorage
                </button>
              )}
              
              <div className="text-sm">
                <span className={`px-2 py-1 rounded ${localStorage.getItem('dailyContent') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  localStorage: {localStorage.getItem('dailyContent') ? '❌ ŠPINAVÝ' : '✅ ČISTÝ'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'content', name: 'Editor obsahu', icon: Sparkles },
              { id: 'dashboard', name: 'Dashboard', icon: Users },
              { id: 'debug', name: 'Debug Log', icon: Bug }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Content Editor Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">🚀 Rychlé akce</h2>
              <div className="flex space-x-3">
                <button
                  onClick={quickSaveDay1}
                  disabled={saving}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? '🔄 Ukládám...' : '⚡ Rychle ulož den 1'}
                </button>
                
                <button
                  onClick={() => {
                    setSelectedDay(1)
                    loadDayContent(1)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  📖 Načti den 1
                </button>
                
                <button
                  onClick={loadAllContent}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  🔄 Refresh obsah
                </button>
              </div>
            </div>

            {/* Day Editor */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Day Selector */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">📅 Výběr dne</h3>
                
                <div className="flex items-center space-x-2 mb-4">
                  <button
                    onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                    disabled={selectedDay <= 1}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(parseInt(e.target.value) || 1)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  />
                  
                  <button
                    onClick={() => setSelectedDay(Math.min(365, selectedDay + 1))}
                    disabled={selectedDay >= 365}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedDay(1)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded hover:bg-gray-100"
                  >
                    První den
                  </button>
                  <button
                    onClick={() => setSelectedDay(7)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded hover:bg-gray-100"
                  >
                    Den 7 (foto den)
                  </button>
                </div>

                {/* Content Status */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Status obsahu:</h4>
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-center space-x-2 ${allContent[selectedDay] ? 'text-green-600' : 'text-gray-500'}`}>
                      {allContent[selectedDay] ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 border border-gray-300 rounded-full" />}
                      <span>Den {selectedDay} v Firebase</span>
                    </div>
                    <div className="text-gray-600">
                      Načteno: {Object.keys(allContent).length} dnů
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Form */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">✏️ Den {selectedDay}</h3>
                  <div className="flex items-center space-x-2">
                    {dayContent.isPhotoDay && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                        📸 Foto den
                      </span>
                    )}
                    {allContent[selectedDay] && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                        ✅ V Firebase
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Motivation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Denní motivace *
                    </label>
                    <textarea
                      value={dayContent.motivation}
                      onChange={(e) => setDayContent(prev => ({ ...prev, motivation: e.target.value }))}
                      placeholder="Krátká motivační zpráva..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>

                  {/* Task */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Denní úkol *
                    </label>
                    <textarea
                      value={dayContent.task}
                      onChange={(e) => setDayContent(prev => ({ ...prev, task: e.target.value }))}
                      placeholder="Detailní úkol pro daný den..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={12}
                    />
                  </div>

                  {/* Photo Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={dayContent.isPhotoDay}
                        onChange={(e) => setDayContent(prev => ({ ...prev, isPhotoDay: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Foto den</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={dayContent.isDualPhotoDay}
                        onChange={(e) => setDayContent(prev => ({ ...prev, isDualPhotoDay: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Dual fotky</span>
                    </label>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={saveContent}
                    disabled={saving || !dayContent.motivation.trim() || !dayContent.task.trim()}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {saving ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Ukládám do Firebase...</span>
                      </div>
                    ) : (
                      <>🔥 Uložit den {selectedDay} do Firebase</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">📊 Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalUsers || 0}</p>
                    <p className="text-sm text-blue-600">Celkem uživatelů</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{stats.totalMessages || 0}</p>
                    <p className="text-sm text-green-600">Celkem zpráv</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{stats.totalLogs || 0}</p>
                    <p className="text-sm text-purple-600">Splněné dny</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              Poslední aktualizace: {stats.loadedAt || 'Načítání...'}
            </div>
          </div>
        )}

        {/* Debug Tab */}
        {activeTab === 'debug' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">🐛 Debug Log</h2>
            
            <div className="bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="space-y-1">
                {debugLog.map((log, index) => (
                  <div key={index} className="text-sm font-mono text-gray-700 py-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => setDebugLog([])}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                🗑️ Vyčistit log
              </button>
              
              <button
                onClick={() => addDebug('🧪 Test zpráva z debug panelu')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                🧪 Test zpráva
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ContentPage