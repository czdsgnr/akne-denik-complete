import React, { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Eye, 
  Calendar,
  Camera,
  Sparkles,
  Target,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Copy,
  Trash2,
  Bug
} from 'lucide-react'
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

// UI Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-4 py-3 border-b border-gray-100 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`px-4 py-3 ${className}`}>
    {children}
  </div>
)

const Button = ({ children, onClick, disabled = false, variant = "default", size = "default", className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  }
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

export default function DailyContentEditor() {
  const [selectedDay, setSelectedDay] = useState(1)
  const [dayContent, setDayContent] = useState({
    day: 1,
    motivation: '',
    task: '',
    isPhotoDay: false,
    isDualPhotoDay: false
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [allContent, setAllContent] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [filterPhotoOnly, setFilterPhotoOnly] = useState(false)
  const [debugLog, setDebugLog] = useState([])
  const [lastSaveStatus, setLastSaveStatus] = useState('')

  const addDebug = (message) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `${timestamp}: ${message}`
    console.log('🔍 DEBUG:', logMessage)
    setDebugLog(prev => [...prev.slice(-10), logMessage]) // Keep last 10 messages
  }

  useEffect(() => {
    addDebug('🚀 DailyContentEditor inicializován')
    loadAllContent()
  }, [])

  useEffect(() => {
    loadDayContent(selectedDay)
  }, [selectedDay])

  useEffect(() => {
    // Auto-generování základního obsahu pokud je den prázdný
    if (!dayContent.motivation && !dayContent.task) {
      setDayContent({
        day: selectedDay,
        motivation: `Den ${selectedDay} - Pokračuj ve své cestě za krásnou pletí! 💖`,
        task: `🎯 DEN ${selectedDay} - ZAMĚŘ SE NA SVOU RUTINU!

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
        isPhotoDay: selectedDay % 7 === 1 || selectedDay % 7 === 0,
        isDualPhotoDay: selectedDay % 14 === 0
      })
      addDebug(`📝 Auto-vygenerován template pro den ${selectedDay}`)
    }
  }, [selectedDay, allContent])

  // 🔥 POUZE FIREBASE - žádný localStorage!
  const loadAllContent = async () => {
    setLoading(true)
    addDebug('🔄 Načítání obsahu z Firebase...')
    
    try {
      const content = {}
      
      // Načteme obsah pro prvních 20 dnů jako sample (pro performance)
      for (let day = 1; day <= 20; day++) {
        try {
          const docRef = doc(db, 'dailyContent', `day-${day}`)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            content[day] = docSnap.data()
          }
        } catch (error) {
          // Ignorovat chyby při načítání jednotlivých dnů
          console.warn(`⚠️ Chyba při načítání dne ${day}:`, error)
        }
      }
      
      addDebug(`✅ Načten obsah pro ${Object.keys(content).length} dnů z Firebase`)
      setAllContent(content)
    } catch (error) {
      addDebug(`❌ Chyba při načítání obsahu: ${error.message}`)
      console.error('❌ Chyba při načítání obsahu:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDayContent = async (dayNumber) => {
    try {
      addDebug(`🔄 Načítání obsahu pro den ${dayNumber}...`)
      const docRef = doc(db, 'dailyContent', `day-${dayNumber}`)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        addDebug(`✅ Obsah dne ${dayNumber} načten z Firebase`)
        setDayContent(data)
      } else {
        addDebug(`📝 Den ${dayNumber} neexistuje - prázdný template`)
        // Prázdný den - vygenerovat základní template
        setDayContent({
          day: dayNumber,
          motivation: '',
          task: '',
          isPhotoDay: false,
          isDualPhotoDay: false
        })
      }
    } catch (error) {
      addDebug(`❌ Chyba při načítání dne ${dayNumber}: ${error.message}`)
      console.error('❌ Chyba při načítání obsahu dne:', error)
    }
  }

  // 🔥 POUZE FIREBASE - žádný localStorage!
  const saveContent = async () => {
    if (!dayContent.motivation.trim() || !dayContent.task.trim()) {
      alert('Prosím vyplňte motivaci i úkol')
      return
    }

    setSaving(true)
    setLastSaveStatus('')
    addDebug(`💾 Zahajuji ukládání dne ${selectedDay} do Firebase...`)
    
    try {
      const docRef = doc(db, 'dailyContent', `day-${selectedDay}`)
      const contentToSave = {
        ...dayContent,
        day: selectedDay,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin'
      }
      
      addDebug(`🔥 Ukládání do Firebase: dailyContent/day-${selectedDay}`)
      addDebug(`📋 Data: ${JSON.stringify(contentToSave, null, 2).substring(0, 200)}...`)
      
      await setDoc(docRef, contentToSave)
      
      // Aktualizovat lokální cache
      setAllContent(prev => ({
        ...prev,
        [selectedDay]: contentToSave
      }))

      addDebug(`✅ Den ${selectedDay} úspěšně uložen do Firebase!`)
      setLastSaveStatus(`✅ Uloženo v ${new Date().toLocaleTimeString()}`)
      alert(`✅ Den ${selectedDay} byl úspěšně uložen do Firebase! 🔥`)
    } catch (error) {
      addDebug(`❌ Chyba při ukládání: ${error.message}`)
      setLastSaveStatus(`❌ Chyba: ${error.message}`)
      console.error('❌ Chyba při ukládání:', error)
      alert('❌ Chyba při ukládání obsahu: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  // 🔥 POUZE FIREBASE - žádný localStorage!
  const deleteContent = async () => {
    if (!confirm(`Opravdu chcete smazat obsah pro den ${selectedDay}?`)) {
      return
    }

    try {
      addDebug(`🗑️ Mazání dne ${selectedDay} z Firebase...`)
      const docRef = doc(db, 'dailyContent', `day-${selectedDay}`)
      await deleteDoc(docRef)
      
      // Aktualizovat lokální cache
      const newContent = { ...allContent }
      delete newContent[selectedDay]
      setAllContent(newContent)
      
      // Reset formuláře
      setDayContent({
        day: selectedDay,
        motivation: '',
        task: '',
        isPhotoDay: false,
        isDualPhotoDay: false
      })
      
      addDebug(`✅ Den ${selectedDay} úspěšně smazán z Firebase!`)
      alert(`✅ Obsah pro den ${selectedDay} byl smazán z Firebase!`)
    } catch (error) {
      addDebug(`❌ Chyba při mazání: ${error.message}`)
      console.error('❌ Chyba při mazání:', error)
      alert('❌ Chyba při mazání obsahu: ' + error.message)
    }
  }

  const copyFromDay = (fromDay) => {
    if (allContent[fromDay]) {
      setDayContent({
        ...allContent[fromDay],
        day: selectedDay
      })
      addDebug(`📋 Zkopírováno z dne ${fromDay}`)
    }
  }

  const filteredDays = Array.from({ length: 365 }, (_, i) => i + 1).filter(day => {
    if (filterPhotoOnly && !(day % 7 === 1 || day % 7 === 0)) return false
    if (searchTerm) {
      const content = allContent[day]
      if (!content) return false
      return content.motivation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             content.task?.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
  })

  const getCompletedDaysCount = () => {
    return Object.keys(allContent).length
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      
      {/* Header s debug info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            🔥 Editor denního obsahu (Firebase ONLY)
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Firebase: {getCompletedDaysCount()}/365 dnů • {lastSaveStatus}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Skrýt' : 'Náhled'}
          </Button>
          
          <Button
            onClick={saveContent}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Ukládám...</span>
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Uložit do Firebase 🔥
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Debug Log */}
      <Card className="border border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Bug className="w-4 h-4" />
            <span>🔍 Debug Log</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {debugLog.map((log, index) => (
              <div key={index} className="text-xs font-mono text-blue-700 bg-blue-100 p-1 rounded">
                {log}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        
        {/* Day Navigator */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <Calendar className="w-4 h-4" />
                <span>Navigace dnů</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              
              {/* Day selector */}
              <div className="flex items-center space-x-2 mb-3">
                <Button
                  onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                  disabled={selectedDay <= 1}
                  size="sm"
                  variant="outline"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(parseInt(e.target.value) || 1)}
                  className="flex-1 px-2 py-1 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                
                <Button
                  onClick={() => setSelectedDay(Math.min(365, selectedDay + 1))}
                  disabled={selectedDay >= 365}
                  size="sm"
                  variant="outline"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>

              {/* Quick actions */}
              <div className="space-y-1 mb-3">
                <Button
                  onClick={() => setSelectedDay(1)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  První den
                </Button>
                <Button
                  onClick={() => setSelectedDay(Math.floor(Math.random() * 365) + 1)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  Náhodný den
                </Button>
              </div>

              {/* Days overview */}
              <div className="mt-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                <div className="grid grid-cols-7 gap-1">
                  {filteredDays.slice(0, 35).map(day => {
                    const hasContent = allContent[day]
                    const isSelected = day === selectedDay
                    const isPhotoDay = day % 7 === 1 || day % 7 === 0
                    
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`
                          w-6 h-6 text-xs rounded flex items-center justify-center transition-colors
                          ${isSelected 
                            ? 'bg-blue-600 text-white' 
                            : hasContent 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                          ${isPhotoDay ? 'ring-1 ring-orange-300' : ''}
                        `}
                        title={`Den ${day}${isPhotoDay ? ' (foto)' : ''}${hasContent ? ' - vyplněno' : ' - prázdný'}`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Target className="w-4 h-4" />
                  <span>Den {selectedDay}</span>
                  {dayContent.isPhotoDay && (
                    <div className="flex items-center space-x-1 text-orange-600 text-sm">
                      <Camera className="w-3 h-3" />
                      <span>Foto</span>
                    </div>
                  )}
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  {allContent[selectedDay] && (
                    <div className="flex items-center space-x-1 text-green-600 text-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Firebase ✅</span>
                    </div>
                  )}
                  
                  <Button
                    onClick={deleteContent}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Motivation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Denní motivace *
                </label>
                <div className="relative">
                  <Sparkles className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                  <textarea
                    value={dayContent.motivation}
                    onChange={(e) => setDayContent(prev => ({ ...prev, motivation: e.target.value }))}
                    placeholder="Krátká motivační zpráva pro uživatele..."
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    rows={2}
                  />
                </div>
              </div>

              {/* Task */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Denní úkol *
                </label>
                <textarea
                  value={dayContent.task}
                  onChange={(e) => setDayContent(prev => ({ ...prev, task: e.target.value }))}
                  placeholder="Detailní popis úkolu pro daný den..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={10}
                />
              </div>

              {/* Photo settings */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={dayContent.isPhotoDay}
                    onChange={(e) => setDayContent(prev => ({ ...prev, isPhotoDay: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Foto den</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={dayContent.isDualPhotoDay}
                    onChange={(e) => setDayContent(prev => ({ ...prev, isDualPhotoDay: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Dual fotky</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
                <Button
                  onClick={saveContent}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? 'Ukládám do Firebase...' : 'Uložit do Firebase 🔥'}
                </Button>
                
                <Button
                  onClick={() => copyFromDay(selectedDay - 1)}
                  variant="outline"
                  size="sm"
                  disabled={selectedDay <= 1 || !allContent[selectedDay - 1]}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Kopírovat
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>

      {/* Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Náhled pro uživatele</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Denní motivace</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {dayContent.motivation || 'Žádná motivace není vyplněna'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Dnešní úkol</h3>
                  {dayContent.isPhotoDay && (
                    <p className="text-sm text-orange-600 flex items-center space-x-1">
                      <Camera className="w-3 h-3" />
                      <span>Foto den</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">
                  {dayContent.task || 'Žádný úkol není vyplněn'}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}