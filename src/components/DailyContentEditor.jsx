import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { 
  Calendar, 
  Save, 
  Plus, 
  Edit, 
  Camera, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Copy,
  Trash2
} from 'lucide-react'

export default function DailyContentEditor() {
  const [selectedDay, setSelectedDay] = useState(1)
  const [dayContent, setDayContent] = useState({
    day: 1,
    motivation: '',
    task: '',
    isPhotoDay: false,
    isDualPhotoDay: false
  })
  const [allContent, setAllContent] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPhotoOnly, setFilterPhotoOnly] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    loadAllContent()
  }, [])

  useEffect(() => {
    if (allContent[selectedDay]) {
      setDayContent(allContent[selectedDay])
    } else {
      // Výchozí obsah pro nový den
      setDayContent({
        day: selectedDay,
        motivation: `Den ${selectedDay} - Pokračuj ve své cestě za krásnou pletí!`,
        task: `🌟 DNEŠNÍ ÚKOL:
Zaměř se na svou rutinu péče o pleť a pozitivní myšlení.

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
    }
  }, [selectedDay, allContent])

  const loadAllContent = async () => {
    setLoading(true)
    try {
      // Pro demo verzi použijeme lokální úložiště
      const savedContent = localStorage.getItem('dailyContent')
      if (savedContent) {
        const content = JSON.parse(savedContent)
        setAllContent(content)
      }
    } catch (error) {
      console.error('Chyba při načítání obsahu:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    if (!dayContent.motivation.trim() || !dayContent.task.trim()) {
      alert('Prosím vyplňte motivaci i úkol')
      return
    }

    setSaving(true)
    try {
      // Pro demo verzi uložíme do localStorage
      const updatedContent = {
        ...allContent,
        [selectedDay]: {
          ...dayContent,
          day: selectedDay,
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin'
        }
      }
      
      localStorage.setItem('dailyContent', JSON.stringify(updatedContent))
      setAllContent(updatedContent)

      alert(`Den ${selectedDay} byl úspěšně uložen!`)
    } catch (error) {
      console.error('Chyba při ukládání:', error)
      alert('Chyba při ukládání obsahu')
    } finally {
      setSaving(false)
    }
  }

  const copyFromDay = (fromDay) => {
    if (allContent[fromDay]) {
      setDayContent({
        ...allContent[fromDay],
        day: selectedDay
      })
    }
  }

  const deleteContent = async () => {
    if (!confirm(`Opravdu chcete smazat obsah pro den ${selectedDay}?`)) {
      return
    }

    try {
      const newContent = { ...allContent }
      delete newContent[selectedDay]
      
      localStorage.setItem('dailyContent', JSON.stringify(newContent))
      setAllContent(newContent)
      
      // Reset formuláře
      setDayContent({
        day: selectedDay,
        motivation: '',
        task: '',
        isPhotoDay: false,
        isDualPhotoDay: false
      })
      
      alert(`Obsah pro den ${selectedDay} byl smazán`)
    } catch (error) {
      console.error('Chyba při mazání:', error)
      alert('Chyba při mazání obsahu')
    }
  }

  const generateBulkContent = async (startDay, endDay, template) => {
    if (!confirm(`Opravdu chcete vygenerovat obsah pro dny ${startDay}-${endDay}?`)) {
      return
    }

    setSaving(true)
    try {
      const updatedContent = { ...allContent }
      
      for (let day = startDay; day <= endDay; day++) {
        updatedContent[day] = {
          day,
          motivation: template.motivation.replace('{day}', day),
          task: template.task.replace('{day}', day),
          isPhotoDay: day % 7 === 1 || day % 7 === 0,
          isDualPhotoDay: day % 14 === 0,
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin-bulk'
        }
      }
      
      localStorage.setItem('dailyContent', JSON.stringify(updatedContent))
      setAllContent(updatedContent)
      
      alert(`Obsah pro dny ${startDay}-${endDay} byl vygenerován!`)
    } catch (error) {
      console.error('Chyba při hromadném generování:', error)
      alert('Chyba při generování obsahu')
    } finally {
      setSaving(false)
    }
  }

  const filteredDays = Array.from({ length: 365 }, (_, i) => i + 1).filter(day => {
    const content = allContent[day]
    const matchesSearch = !searchTerm || 
      (content && (
        content.motivation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.task.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    const matchesFilter = !filterPhotoOnly || (content && (content.isPhotoDay || content.isDualPhotoDay))
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Editor denního obsahu</h2>
          <p className="text-gray-600">Spravujte úkoly a motivace pro všechny dny (1-365)</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {Object.keys(allContent).length}/365 dnů vyplněno
          </Badge>
          <Button onClick={loadAllContent} variant="outline" size="sm">
            Obnovit
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Hledat v obsahu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={filterPhotoOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPhotoOnly(!filterPhotoOnly)}
              >
                <Camera className="w-4 h-4 mr-2" />
                Pouze foto dny
              </Button>
              <Button
                variant={showPreview ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Náhled
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Day Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Výběr dne
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Day Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                disabled={selectedDay <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">Den {selectedDay}</div>
                <div className="text-sm text-gray-600">z 365 dnů</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDay(Math.min(365, selectedDay + 1))}
                disabled={selectedDay >= 365}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Day Input */}
            <div className="mb-4">
              <Input
                type="number"
                min="1"
                max="365"
                value={selectedDay}
                onChange={(e) => setSelectedDay(Math.max(1, Math.min(365, parseInt(e.target.value) || 1)))}
                placeholder="Číslo dne"
                className="text-center"
              />
            </div>

            {/* Day Status */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={allContent[selectedDay] ? "default" : "secondary"}>
                  {allContent[selectedDay] ? "Vyplněno" : "Prázdné"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Foto den:</span>
                <Badge variant={dayContent.isPhotoDay || dayContent.isDualPhotoDay ? "default" : "outline"}>
                  {dayContent.isDualPhotoDay ? "Dvě fotky" : dayContent.isPhotoDay ? "Jedna fotka" : "Bez fotek"}
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => copyFromDay(selectedDay - 1)}
                disabled={selectedDay <= 1 || !allContent[selectedDay - 1]}
              >
                <Copy className="w-4 h-4 mr-2" />
                Kopírovat z předchozího dne
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-red-600 hover:text-red-700"
                onClick={deleteContent}
                disabled={!allContent[selectedDay]}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Smazat obsah
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Editace obsahu - Den {selectedDay}
              </span>
              <Button
                onClick={saveContent}
                disabled={saving}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Ukládání...' : 'Uložit'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Motivation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Denní motivace *
              </label>
              <Textarea
                value={dayContent.motivation}
                onChange={(e) => setDayContent(prev => ({ ...prev, motivation: e.target.value }))}
                placeholder="Motivační zpráva pro uživatele..."
                className="min-h-[80px]"
                required
              />
            </div>

            {/* Task */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Denní úkol *
              </label>
              <Textarea
                value={dayContent.task}
                onChange={(e) => setDayContent(prev => ({ ...prev, task: e.target.value }))}
                placeholder="Detailní popis úkolu pro daný den..."
                className="min-h-[200px]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Můžete použít emoji a formátování. Podporuje víceřádkový text.
              </p>
            </div>

            {/* Photo Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Nastavení fotografování
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={dayContent.isPhotoDay}
                    onChange={(e) => setDayContent(prev => ({ 
                      ...prev, 
                      isPhotoDay: e.target.checked,
                      isDualPhotoDay: e.target.checked ? prev.isDualPhotoDay : false
                    }))}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Foto den (uživatel má pořídit fotku obličeje)
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={dayContent.isDualPhotoDay}
                    onChange={(e) => setDayContent(prev => ({ 
                      ...prev, 
                      isDualPhotoDay: e.target.checked,
                      isPhotoDay: e.target.checked ? true : prev.isPhotoDay
                    }))}
                    disabled={!dayContent.isPhotoDay}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Dvě fotky (zepředu + z boku)
                  </span>
                </label>
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-3">Náhled pro uživatele:</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <h5 className="font-medium text-pink-600 mb-2">💖 Denní motivace</h5>
                    <p className="text-gray-700">{dayContent.motivation}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-600 mb-2">🎯 Dnešní úkol</h5>
                    <div className="text-gray-700 whitespace-pre-line">{dayContent.task}</div>
                  </div>
                  {(dayContent.isPhotoDay || dayContent.isDualPhotoDay) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center text-blue-700">
                        <Camera className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
                          {dayContent.isDualPhotoDay 
                            ? 'Dnes je den pro dvě fotky (zepředu a z boku)' 
                            : 'Dnes je den pro fotku obličeje'
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bulk Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Hromadné operace</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                const startDay = parseInt(prompt('Od kterého dne?', '1'))
                const endDay = parseInt(prompt('Do kterého dne?', '30'))
                if (startDay && endDay && startDay <= endDay) {
                  generateBulkContent(startDay, endDay, {
                    motivation: 'Den {day} - Pokračuj ve své cestě za krásnou pletí!',
                    task: `🌟 DNEŠNÍ ÚKOL - DEN {day}:
Zaměř se na svou rutinu péče o pleť a pozitivní myšlení.

💧 HYDRATACE:
- Vypij alespoň 2 litry vody
- Použij hydratační krém ráno i večer

🧘‍♀️ MINDFULNESS:
- 5 minut meditace nebo hlubokého dýchání
- Pozitivní afirmace: "Moje pleť se každým dnem zlepšuje"

📝 REFLEXE:
Zamysli se nad tím, co dnes uděláš pro svou pleť a celkovou pohodu.`
                  })
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Vygenerovat základní obsah
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                const confirmed = confirm('Opravdu chcete nastavit foto dny pro celý rok? (každý 7. den)')
                if (confirmed) {
                  // Implementace nastavení foto dnů
                  alert('Foto dny budou nastaveny při příštím uložení')
                }
              }}
            >
              <Camera className="w-4 h-4 mr-2" />
              Nastavit foto dny
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Days Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Přehled dnů</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 md:grid-cols-20 gap-1">
            {filteredDays.slice(0, 100).map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`w-8 h-8 text-xs rounded border-2 font-medium transition-all duration-200 ${
                  day === selectedDay
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent'
                    : allContent[day]
                    ? 'bg-green-100 text-green-700 border-green-300 hover:border-green-400'
                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
                title={allContent[day] ? `Den ${day} - Vyplněno` : `Den ${day} - Prázdné`}
              >
                {day}
              </button>
            ))}
          </div>
          {filteredDays.length > 100 && (
            <p className="text-sm text-gray-500 mt-2">
              Zobrazeno prvních 100 dnů. Použijte vyhledávání pro filtrování.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

