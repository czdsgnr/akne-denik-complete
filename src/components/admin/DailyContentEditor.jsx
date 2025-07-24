import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
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
  Copy,
  Trash2,
  Zap,
  RefreshCw,
  Database,
  Bug,
  Download,
  Upload,
  Plus
} from 'lucide-react'
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'

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
  const [showPreview, setShowPreview] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')
  const [lastSaved, setLastSaved] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // 🔄 NAČTENÍ VŠECH DAT PŘI STARTU
  useEffect(() => {
    loadAllContentOverview()
  }, [])

  // 🔄 NAČTENÍ KONKRÉTNÍHO DNE
  useEffect(() => {
    loadDayContent(selectedDay)
  }, [selectedDay])

  // 🎯 SLEDOVÁNÍ ZMĚN PRO UNSAVED INDICATOR
  useEffect(() => {
    const originalContent = allContent[selectedDay]
    const currentContent = dayContent
    
    if (originalContent) {
      const hasChanges = 
        originalContent.motivation !== currentContent.motivation ||
        originalContent.task !== currentContent.task ||
        originalContent.isPhotoDay !== currentContent.isPhotoDay ||
        originalContent.isDualPhotoDay !== currentContent.isDualPhotoDay
      
      setHasUnsavedChanges(hasChanges)
    } else {
      setHasUnsavedChanges(currentContent.motivation.trim() !== '' || currentContent.task.trim() !== '')
    }
  }, [dayContent, allContent, selectedDay])

  // 📊 NAČTENÍ PŘEHLEDU VŠECH DNÍ
  const loadAllContentOverview = async () => {
    setLoading(true)
    setDebugInfo('🔄 Načítání přehledu všech dnů...')
    
    try {
      const snapshot = await getDocs(collection(db, 'dailyContent'))
      const content = {}
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        content[data.day] = data
      })
      
      setAllContent(content)
      setDebugInfo(`✅ Načteno ${Object.keys(content).length}/365 dnů`)
      
    } catch (error) {
      console.error('Chyba při načítání přehledu:', error)
      setDebugInfo(`❌ Chyba: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // 📅 NAČTENÍ KONKRÉTNÍHO DNE
  const loadDayContent = async (dayNumber) => {
    setDebugInfo(`🔄 Načítání dne ${dayNumber}...`)
    
    try {
      const docRef = doc(db, 'dailyContent', `day-${dayNumber}`)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setDayContent(data)
        setDebugInfo(`✅ Den ${dayNumber} načten úspěšně`)
        setLastSaved(data.updatedAt ? new Date(data.updatedAt) : null)
      } else {
        // Prázdný den - základní template
        const template = generateDayTemplate(dayNumber)
        setDayContent(template)
        setDebugInfo(`📝 Den ${dayNumber} je prázdný - vytvořen template`)
        setLastSaved(null)
      }
    } catch (error) {
      console.error('Chyba při načítání dne:', error)
      setDebugInfo(`❌ Chyba při načítání dne ${dayNumber}: ${error.message}`)
    }
  }

  // 🏗️ GENEROVÁNÍ ZÁKLADNÍHO TEMPLATU
  const generateDayTemplate = (dayNumber) => {
    const weekNumber = Math.ceil(dayNumber / 7)
    const isPhotoDay = dayNumber % 7 === 1 || dayNumber === 1 || dayNumber % 14 === 0
    
    const motivations = [
      `Den ${dayNumber} - Každý den je nová příležitost! 💖`,
      `Ahoj! Vítej v dni ${dayNumber} tvé cesty za krásnou pletí! ✨`,
      `Den ${dayNumber} - Tvá pleť se každým dnem zlepšuje! 🌟`,
      `Skvělá práce! Už jsi v dni ${dayNumber}! Pokračuj! 💪`,
      `Den ${dayNumber} - Ty to zvládáš úžasně! 🎉`
    ]
    
    const taskTemplate = `🎯 DEN ${dayNumber} - ${isPhotoDay ? 'FOTO DEN' : 'POKRAČUJ V PÉČI'}!

📌 VZPOMEŇ SI:
${isPhotoDay ? 
  'Dnes je čas na dokumentaci pokroku! Pořiď si fotku a porovnej s předchozími.' :
  'Jak se dnes cítíš? Všimla sis nějaké změny na své pleti?'
}

💪 ÚKOL:
${isPhotoDay ? `
📸 FOTO DEN ${weekNumber}. týden:
- Pořiď si selfie za dobrého světla
- Zachovej stejný úhel jako minule
- Porovnej s předchozími fotkami

💧 DENNÍ PÉČE:
- Jemně si vyčisti pleť ráno i večer
- Aplikuj hydratační krém
- Nezapomeň na SPF během dne
` : `
🧴 DENNÍ PÉČE:
- Ranní čištění + hydratace + SPF
- Večerní čištění + sérum + krém
- Pij dostatek vody (min. 2L)

🧘‍♀️ MINDFULNESS:
- 5 minut pro sebe
- Pozitivní afirmace před zrcadlem
- "Moje pleť se každým dnem zlepšuje"
`}

📝 REFLEXE:
Co jsi dnes udělala pro svou pleť? Jak se cítíš?

⭐ Pamatuj: Každý malý krok je pokrok!`

    return {
      day: dayNumber,
      motivation: motivations[Math.floor(Math.random() * motivations.length)],
      task: taskTemplate,
      isPhotoDay,
      isDualPhotoDay: dayNumber % 28 === 0 // Každé 4 týdny
    }
  }

  // 💾 ULOŽENÍ OBSAHU
  const saveContent = async () => {
    if (!dayContent.motivation.trim() || !dayContent.task.trim()) {
      setDebugInfo('❌ Vyplň prosím motivaci i úkol!')
      return
    }

    setSaving(true)
    setDebugInfo(`🔄 Ukládání dne ${selectedDay}...`)
    
    try {
      const docRef = doc(db, 'dailyContent', `day-${selectedDay}`)
      const contentToSave = {
        ...dayContent,
        day: selectedDay,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin'
      }
      
      await setDoc(docRef, contentToSave)
      
      // Aktualizace lokálního cache
      setAllContent(prev => ({
        ...prev,
        [selectedDay]: contentToSave
      }))

      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      setDebugInfo(`✅ Den ${selectedDay} uložen úspěšně! ${new Date().toLocaleTimeString()}`)
      
    } catch (error) {
      console.error('Chyba při ukládání:', error)
      setDebugInfo(`❌ CHYBA při ukládání: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  // 🗑️ SMAZÁNÍ OBSAHU
  const deleteContent = async () => {
    if (!confirm(`Opravdu smazat obsah pro den ${selectedDay}?`)) return

    try {
      setDebugInfo(`🔄 Mazání dne ${selectedDay}...`)
      
      await deleteDoc(doc(db, 'dailyContent', `day-${selectedDay}`))
      
      const newContent = { ...allContent }
      delete newContent[selectedDay]
      setAllContent(newContent)
      
      setDayContent(generateDayTemplate(selectedDay))
      setLastSaved(null)
      setHasUnsavedChanges(false)
      setDebugInfo(`✅ Den ${selectedDay} smazán`)
      
    } catch (error) {
      console.error('Chyba při mazání:', error)
      setDebugInfo(`❌ Chyba při mazání: ${error.message}`)
    }
  }

  // 📋 KOPÍROVÁNÍ Z JINÉHO DNE
  const copyFromDay = (fromDay) => {
    if (allContent[fromDay]) {
      setDayContent({
        ...allContent[fromDay],
        day: selectedDay
      })
      setDebugInfo(`📋 Zkopírováno z dne ${fromDay}`)
    }
  }

  // ⚡ BULK GENEROVÁNÍ
  const generateBulkContent = async (startDay, endDay) => {
    if (!confirm(`Vygenerovat obsah pro dny ${startDay}-${endDay}? (${endDay - startDay + 1} dnů)`)) return

    setSaving(true)
    setDebugInfo(`🔄 Generování dnů ${startDay}-${endDay}...`)
    
    try {
      const updatedContent = { ...allContent }
      
      for (let day = startDay; day <= endDay; day++) {
        const template = generateDayTemplate(day)
        const contentToSave = {
          ...template,
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin-bulk'
        }
        
        await setDoc(doc(db, 'dailyContent', `day-${day}`), contentToSave)
        updatedContent[day] = contentToSave
        
        setDebugInfo(`🔄 Generování ${day}/${endDay}...`)
      }
      
      setAllContent(updatedContent)
      setDebugInfo(`✅ Vygenerováno ${endDay - startDay + 1} dnů!`)
      
    } catch (error) {
      console.error('Chyba při bulk generování:', error)
      setDebugInfo(`❌ Chyba při generování: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  // 📊 STATISTIKY
  const getStats = () => {
    const total = 365
    const completed = Object.keys(allContent).length
    const photoDays = Object.values(allContent).filter(day => day.isPhotoDay).length
    const percentage = Math.round((completed / total) * 100)
    
    return { total, completed, photoDays, percentage }
  }

  const stats = getStats()

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      
      {/* 🎯 HLAVNÍ HEADER S STATISTIKAMI */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Editor denního obsahu</h1>
            <p className="text-blue-100">Spravuj motivace a úkoly pro celý rok</p>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold">{stats.completed}</div>
            <div className="text-sm text-blue-200">z {stats.total} dnů</div>
            <div className="text-xs text-blue-300">{stats.percentage}% hotovo</div>
          </div>
        </div>
        
        {/* Rychlé statistiky */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="font-bold text-xl">{stats.completed}</div>
            <div className="text-xs">Vyplněno</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="font-bold text-xl">{365 - stats.completed}</div>
            <div className="text-xs">Zbývá</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="font-bold text-xl">{stats.photoDays}</div>
            <div className="text-xs">Foto dnů</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="font-bold text-xl">{stats.percentage}%</div>
            <div className="text-xs">Pokrok</div>
          </div>
        </div>
      </div>

      {/* 🐛 DEBUG PANEL */}
      {debugInfo && (
        <div className={`p-4 rounded-lg border-l-4 ${
          debugInfo.includes('❌') ? 'bg-red-50 border-red-500 text-red-700' :
          debugInfo.includes('✅') ? 'bg-green-50 border-green-500 text-green-700' :
          'bg-blue-50 border-blue-500 text-blue-700'
        }`}>
          <div className="flex items-center space-x-2">
            <Bug className="w-4 h-4" />
            <span className="font-mono text-sm">{debugInfo}</span>
            {lastSaved && (
              <span className="text-xs">
                • Naposledy uloženo: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* 📅 LEVÝ PANEL - NAVIGACE */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Den selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Den {selectedDay}</span>
                {hasUnsavedChanges && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" title="Neuložené změny" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Navigace dnů */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                  disabled={selectedDay <= 1}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Input
                  type="number"
                  min="1"
                  max="365"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Math.min(365, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="flex-2 text-center font-bold text-lg"
                />
                
                <Button
                  onClick={() => setSelectedDay(Math.min(365, selectedDay + 1))}
                  disabled={selectedDay >= 365}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Rychlé skoky */}
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => setSelectedDay(1)} variant="outline" size="sm">
                  První
                </Button>
                <Button onClick={() => setSelectedDay(365)} variant="outline" size="sm">
                  Poslední
                </Button>
                <Button 
                  onClick={() => setSelectedDay(Math.floor(Math.random() * 365) + 1)} 
                  variant="outline" size="sm"
                >
                  Náhodný
                </Button>
                <Button 
                  onClick={() => setSelectedDay(Math.min(365, selectedDay + 7))} 
                  variant="outline" size="sm"
                >
                  +7 dnů
                </Button>
              </div>

              {/* Stav dne */}
              <div className="text-center space-y-2">
                {allContent[selectedDay] ? (
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Vyplněno</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-gray-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Prázdný den</span>
                  </div>
                )}
                
                {dayContent.isPhotoDay && (
                  <div className="flex items-center justify-center space-x-2 text-orange-600">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm font-medium">Foto den</span>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Bulk akce */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Rychlé akce</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              
              <Button
                onClick={() => generateBulkContent(1, 30)}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={saving}
              >
                <Plus className="w-4 h-4 mr-2" />
                Vygenerovat 1-30
              </Button>
              
              <Button
                onClick={() => generateBulkContent(31, 90)}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={saving}
              >
                <Plus className="w-4 h-4 mr-2" />
                Vygenerovat 31-90
              </Button>
              
              <Button
                onClick={() => generateBulkContent(selectedDay, Math.min(365, selectedDay + 6))}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={saving}
              >
                <Plus className="w-4 h-4 mr-2" />
                Týden od dne {selectedDay}
              </Button>

              <Button
                onClick={loadAllContentOverview}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Obnovit přehled
              </Button>

            </CardContent>
          </Card>

          {/* Přehled dnů */}
          <Card>
            <CardHeader>
              <CardTitle>Přehled (první 42 dnů)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 42 }, (_, i) => i + 1).map(day => {
                  const hasContent = allContent[day]
                  const isSelected = day === selectedDay
                  const isPhotoDay = day % 7 === 1 || day === 1 || day % 14 === 0
                  
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`
                        w-8 h-8 text-xs rounded flex items-center justify-center transition-all
                        ${isSelected 
                          ? 'bg-blue-600 text-white scale-110 shadow-lg' 
                          : hasContent 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                        ${isPhotoDay ? 'ring-2 ring-orange-300' : ''}
                      `}
                      title={`Den ${day}${isPhotoDay ? ' (foto)' : ''}${hasContent ? ' ✓' : ' ○'}`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                📸 = foto den | ✓ = vyplněno | ○ = prázdný
              </p>
            </CardContent>
          </Card>

        </div>

        {/* 📝 STŘEDNÍ PANEL - EDITOR */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Editace dne {selectedDay}</span>
                </CardTitle>
                
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
                    disabled={saving || (!dayContent.motivation.trim() || !dayContent.task.trim())}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Ukládám...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Uložit
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Motivace */}
              <div>
                <Label className="text-base font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Denní motivace *</span>
                </Label>
                <Textarea
                  value={dayContent.motivation}
                  onChange={(e) => setDayContent(prev => ({ ...prev, motivation: e.target.value }))}
                  placeholder="Krátká motivační zpráva pro uživatele... (např. 'Den 1 - Vítej na cestě za krásnou pletí! 💖')"
                  className="min-h-[80px] text-base leading-relaxed resize-none"
                  rows={3}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {dayContent.motivation.length}/200 znaků
                </div>
              </div>

              {/* Úkol */}
              <div>
                <Label className="text-base font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Denní úkol *</span>
                </Label>
                <Textarea
                  value={dayContent.task}
                  onChange={(e) => setDayContent(prev => ({ ...prev, task: e.target.value }))}
                  placeholder="Detailní popis úkolu pro daný den..."
                  className="min-h-[400px] text-sm font-mono leading-relaxed resize-none"
                  rows={20}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {dayContent.task.length} znaků
                </div>
              </div>

              {/* Nastavení fotky */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dayContent.isPhotoDay}
                    onChange={(e) => setDayContent(prev => ({ ...prev, isPhotoDay: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">📸 Foto den</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dayContent.isDualPhotoDay}
                    onChange={(e) => setDayContent(prev => ({ ...prev, isDualPhotoDay: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">📸📸 Dvě fotky</span>
                </label>
              </div>

              {/* Akce */}
              <div className="flex items-center space-x-3 pt-4 border-t">
                <Button
                  onClick={saveContent}
                  disabled={saving || !dayContent.motivation.trim() || !dayContent.task.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Ukládám den {selectedDay}...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Uložit den {selectedDay}
                      {hasUnsavedChanges && " (neuložené změny)"}
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => copyFromDay(selectedDay - 1)}
                  variant="outline"
                  disabled={selectedDay <= 1 || !allContent[selectedDay - 1]}
                  title="Kopírovat obsah z předchozího dne"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={deleteContent}
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                  disabled={!allContent[selectedDay]}
                  title="Smazat obsah tohoto dne"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* 👁️ PRAVÝ PANEL - NÁHLED */}
        <div className="lg:col-span-1">
          {showPreview && (
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Náhled pro uživatele</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Motivace preview */}
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">Denní motivace</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {dayContent.motivation || 'Žádná motivace není vyplněna...'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Úkol preview */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Dnešní úkol</h4>
                      {dayContent.isPhotoDay && (
                        <p className="text-xs text-orange-600 flex items-center space-x-1">
                          <Camera className="w-3 h-3" />
                          <span>Foto den</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 text-xs leading-relaxed">
                      {dayContent.task || 'Žádný úkol není vyplněn...'}
                    </pre>
                  </div>
                </div>

              </CardContent>
            </Card>
          )}
        </div>

      </div>

    </div>
  )
}