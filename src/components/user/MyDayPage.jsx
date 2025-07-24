import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { 
  Heart, 
  Calendar, 
  Target, 
  Camera, 
  Sparkles,
  CheckCircle2,
  Star,
  Clock,
  Gift,
  Upload,
  X
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../lib/firebase'
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  updateDoc 
} from 'firebase/firestore'
import { uploadPhotoToStorage, validatePhotoFile } from '../../lib/uploadPhotoToStorage'

// Countdown komponenta
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const diff = tomorrow - now
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      } else {
        setTimeLeft('00:00:00')
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center">
      <div className="text-3xl font-mono font-bold text-gray-900 mb-2">
        {timeLeft}
      </div>
      <p className="text-sm text-gray-600">do dalšího dne</p>
    </div>
  )
}

function MyDayPage() {
  const { user } = useAuth()
  const [currentDay, setCurrentDay] = useState(1)
  const [currentDayContent, setCurrentDayContent] = useState(null)
  const [userLogs, setUserLogs] = useState({})
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [todayCompleted, setTodayCompleted] = useState(false)
  const [dailyLog, setDailyLog] = useState({
    mood: 0,
    skinRating: 0,
    note: '',
    completed: false,
    photos: []
  })
  
  // Photo upload states
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const photoInputRef = useRef(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // Vždy scroll na začátek při načtení stránky
    window.scrollTo(0, 0)
    
    const loadTodaysData = async () => {
      if (!user) return
      
      try {
        console.log('🔄 Loading user data...')
        
        // Načtení aktuálního dne uživatele
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (!userDoc.exists()) {
          console.error('❌ User document not found!')
          return
        }
        
        const userInfo = userDoc.data()
        const day = userInfo?.currentDay || 1
        
        console.log('✅ User data loaded:', { day, userInfo })
        
        setCurrentDay(day)
        setUserData(userInfo)

        // Načtení denního obsahu
        console.log(`🔄 Loading daily content for day ${day}...`)
        const contentDoc = await getDoc(doc(db, 'dailyContent', `day-${day}`))
        
        if (contentDoc.exists()) {
          const contentData = contentDoc.data()
          console.log('✅ Daily content loaded:', contentData)
          setCurrentDayContent(contentData)
        } else {
          console.warn(`⚠️ No content found for day-${day}`)
          // Fallback obsah
          setCurrentDayContent({
            motivation: `Vítej v dni ${day}! Dnes budeš pokračovat ve své cestě za krásnou pletí! 💖`,
            task: `🎯 DEN ${day} - POKRAČUJ VE SVÉ CESTĚ!\n\n📌 VZPOMEŇ SI:\nJaký pokrok jsi už udělala?\n\n💪 ÚKOL:\nDnes se zaměř na pravidelnost své rutiny.\n⭐ Udělej si čas jen pro sebe!`,
            isPhotoDay: day % 7 === 1 // Každý týden foto den
          })
        }

        // Načtení uživatelských logů
        console.log('🔄 Loading user logs...')
        const logsQuery = query(
          collection(db, 'userLogs'),
          where('userId', '==', user.uid)
        )
        const logsSnapshot = await getDocs(logsQuery)
        const logs = {}
        logsSnapshot.forEach((doc) => {
          const data = doc.data()
          logs[data.day] = data
        })
        console.log('✅ User logs loaded:', logs)
        setUserLogs(logs)

        // Kontrola jestli už dnes vyplnil záznam (podle dnešního data)
        const today = new Date()
        const todayString = today.toDateString()
        
        let todayLogExists = false
        logsSnapshot.forEach((doc) => {
          const logData = doc.data()
          const logDate = logData.createdAt?.toDate?.() || new Date(logData.createdAt)
          if (logDate.toDateString() === todayString) {
            todayLogExists = true
            setDailyLog({
              mood: logData.mood || 0,
              skinRating: logData.skinRating || 0,
              note: logData.note || '',
              completed: true,
              photos: logData.photos || []
            })
          }
        })
        
        console.log('✅ Today completed check:', todayLogExists)
        setTodayCompleted(todayLogExists)

      } catch (error) {
        console.error('❌ Error loading data:', error)
        setErrorMessage('Chyba při načítání dat. Zkus obnovit stránku. 🔄')
      } finally {
        setLoading(false)
      }
    }

    loadTodaysData()
  }, [user])

  const handleMoodSelect = (mood) => {
    setDailyLog(prev => ({ ...prev, mood }))
    setErrorMessage('') // Vymaž error při výběru
  }

  const handleSkinRating = (rating) => {
    setDailyLog(prev => ({ ...prev, skinRating: rating }))
    setErrorMessage('') // Vymaž error při výběru
  }

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setErrorMessage('') // Vymaž předchozí chyby

    try {
      validatePhotoFile(file)
      
      setPhotoFile(file)
      
      // Preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setErrorMessage(error.message + ' Zkus prosím vybrat jinou fotografii. 📸')
    }
  }

  const handlePhotoUpload = async () => {
    if (!photoFile) {
      setErrorMessage('Nejdřív vyber fotografii pomocí tlačítka "Vybrat foto" 📸')
      return
    }

    setUploadingPhoto(true)
    setErrorMessage('') // Vymaž předchozí chyby
    
    try {
      const photoUrl = await uploadPhotoToStorage(
        photoFile, 
        user.uid, 
        currentDay, 
        'progress'
      )
      
      // Aktualizace denního logu s fotkou
      setDailyLog(prev => ({ 
        ...prev, 
        photos: [{ url: photoUrl, type: 'progress' }] 
      }))
      
      // Úspěšná zpráva se zobrazí jen krátce
      setErrorMessage('')
      
    } catch (error) {
      console.error('Chyba při nahrávání fotky:', error)
      setErrorMessage('Chyba při nahrávání fotky: ' + error.message + ' Zkus to prosím znovu. 🔄')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleCompleteDay = async () => {
    // Vymaž předchozí chyby
    setErrorMessage('')
    
    // Validace
    if (!dailyLog.mood || !dailyLog.skinRating) {
      setErrorMessage('Prosím, vyplň náladu a hodnocení pleti před dokončením dne. Děláš to přece pro sebe! 💖')
      return
    }

    // Kontrola povinné fotky na foto dnech
    if (isPhotoDay && (!dailyLog.photos || dailyLog.photos.length === 0)) {
      setErrorMessage('Dnes je foto den! Nahraj prosím fotografii svého obličeje - chceš přece vidět svůj pokrok! 📸')
      return
    }

    try {
      // Uložení denního logu
      await addDoc(collection(db, 'userLogs'), {
        userId: user.uid,
        day: currentDay,
        mood: dailyLog.mood,
        skinRating: dailyLog.skinRating,
        note: dailyLog.note,
        createdAt: new Date(),
        photos: dailyLog.photos || [] // Včetně nahraných fotek
      })

      // Aktualizace uživatele - posun na další den
      await updateDoc(doc(db, 'users', user.uid), {
        currentDay: currentDay + 1,
        completedDays: [...(userData?.completedDays || []), currentDay],
        updatedAt: new Date()
      })

      // Označit dnešní den jako dokončený
      setTodayCompleted(true)
      
      // Scroll na začátek pro zobrazení countdown sekce
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)

    } catch (error) {
      console.error('Chyba při ukládání:', error)
      setErrorMessage('Ups! Něco se nepovedlo. Zkus to prosím znovu. 🔄')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Načítání tvého dne...</p>
        </div>
      </div>
    )
  }

  const isPhotoDay = currentDayContent?.isPhotoDay || false
  const completedDaysCount = Object.keys(userLogs).length
  const progressPercentage = Math.round((completedDaysCount / 365) * 100)
  const streak = calculateStreak(userLogs, currentDay)

  // Validace formuláře
  const isFormValid = dailyLog.mood > 0 && 
                     dailyLog.skinRating > 0 && 
                     (!isPhotoDay || (dailyLog.photos && dailyLog.photos.length > 0))

  const moods = [
    { value: 1, emoji: '😞', label: 'Špatná' },
    { value: 2, emoji: '😕', label: 'Horší' },
    { value: 3, emoji: '😐', label: 'Neutrální' },
    { value: 4, emoji: '😊', label: 'Dobrá' },
    { value: 5, emoji: '😄', label: 'Výborná' }
  ]

  // Motivační zprávy pro zítřek
  const tomorrowMotivations = [
    "Zítra tě čeká nový den plný možností! 🌟",
    "Odpočiň si a připrav se na další krok k dokonalé pleti! ✨",
    "Tvoje pleť se bude zítra těšit na další péči! 💖",
    "Každý nový den je šancí být ještě krásnější! 🌸",
    "Zítřejší den přinese nové tipy pro tvou pleť! 🎯"
  ]
  
  const randomMotivation = tomorrowMotivations[Math.floor(Math.random() * tomorrowMotivations.length)]

  return (
    <div className="min-h-screen bg-white">
      {/* Minimalistický Header */}
      <header className="bg-gradient-to-r from-pink-500 to-rose-500 text-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">
                    Ahoj, {userData?.name || 'Tereza'}! 👋
                  </h1>
                  <div className="flex items-center space-x-3 text-sm text-pink-100">
                    <span>Den {currentDay}</span>
                    <span>•</span>
                    <span>{streak} dní v řadě 🔥</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{currentDay}</div>
                <div className="text-xs text-pink-200">z 365</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Po dokončení dne - Countdown sekce */}
        {todayCompleted && (
          <Card className="border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Skvělá práce! Den {currentDay} dokončen! 🎉
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Už jsi dnes vyplnila svůj denní záznam. Počkej si na další den!
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Další den za:</span>
                    </div>
                    <CountdownTimer />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Gift className="w-5 h-5 text-pink-500" />
                    <span className="font-medium text-gray-800">Na co se můžeš těšit</span>
                  </div>
                  <p className="text-sm text-gray-700 text-center">
                    {randomMotivation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats - menší výška */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">{completedDaysCount}</p>
              <p className="text-xs text-gray-600">Splněno</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Target className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">{streak}</p>
              <p className="text-xs text-gray-600">V řadě</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">{365 - currentDay}</p>
              <p className="text-xs text-gray-600">Zbývá</p>
            </CardContent>
          </Card>
        </div>

        {/* Denní motivace */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Denní motivace</h2>
                <p className="text-gray-700 leading-relaxed">
                  {currentDayContent?.motivation || 
                   `Už ${currentDay} dní děláš skvělou práci! Tvoje pleť se postupně zlepšuje a ty si to zasloužíš! 💖`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dnešní úkol */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Dnešní úkol</h2>
                {isPhotoDay && (
                  <p className="text-sm text-orange-600 flex items-center space-x-1">
                    <Camera className="w-4 h-4" />
                    <span>Foto den - týden {Math.ceil(currentDay / 7)}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">
                {currentDayContent?.task || 
                 `🎯 DEN ${currentDay} - DŮVĚŘUJ PROCESU!\n\n📌 VZPOMEŇ SI:\nKdy jsi naposledy dostala kompliment na svou pleť?\n\n💪 ÚKOL:\nDnes se podívej do zrcadla a najdi 3 věci, které se ti na své pleti líbí.\n⭐ Napiš si je do poznámky a usmej se na sebe!`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Denní záznam - pouze pokud není den dokončen */}
        {!todayCompleted && (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Jak se dnes cítíš?</span>
              </h2>
              
              {/* Celková nálada - RESPONSIVE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Celková nálada
                </label>
                <div className="grid grid-cols-5 gap-1 sm:gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood.value)}
                      className={`
                        p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 text-center
                        ${dailyLog.mood === mood.value
                          ? 'border-pink-500 bg-pink-50 shadow-md transform scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="text-lg sm:text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs text-gray-600 leading-tight">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hodnocení pleti */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hodnocení pleti (1-5 hvězdiček)
                </label>
                <div className="flex space-x-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleSkinRating(star)}
                      className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= dailyLog.skinRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Poznámka */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poznámka (volitelné)
                </label>
                <textarea
                  value={dailyLog.note}
                  onChange={(e) => setDailyLog(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Jak se dnes cítíš? Nějaké změny na pleti?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Foto sekce - pouze na foto dnech */}
              {isPhotoDay && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Povinná fotodokumentace - Den {currentDay}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          Dnes je čas na týdenní fotografii pokroku! Pořiď si selfie svého obličeje, 
                          abychom ti mohli ukázat, jak se tvá pleť zlepšuje. 📸
                        </p>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>💡 <strong>Tip:</strong> Foť se vždy za stejného světla a ze stejného úhlu</p>
                          <p>🔒 <strong>Soukromí:</strong> Tvoje fotky jsou pouze tvoje - nikdo jiný je neuvidí</p>
                          <p>🛡️ <strong>Bezpečnost:</strong> Fotky jsou šifrovaně uložené a není možné je zveřejnit</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Photo Preview */}
                    {photoPreview && (
                      <div className="mb-4">
                        <div className="relative inline-block">
                          <img 
                            src={photoPreview} 
                            alt="Preview pokroku" 
                            className="max-w-full max-h-48 rounded-lg shadow-md border-2 border-white"
                          />
                          <button
                            onClick={() => {
                              setPhotoFile(null)
                              setPhotoPreview(null)
                              setDailyLog(prev => ({ ...prev, photos: [] }))
                              setErrorMessage('') // Vymaž i error zprávy
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            ✓ Připraveno k uložení
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => photoInputRef.current?.click()}
                        variant="outline"
                        className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {photoPreview ? 'Změnit foto' : 'Vybrat foto'}
                      </Button>
                      
                      {photoFile && !uploadingPhoto && (
                        <Button 
                          onClick={handlePhotoUpload}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Nahrát foto
                        </Button>
                      )}
                      
                      {uploadingPhoto && (
                        <Button 
                          disabled
                          className="flex-1 bg-gray-400 text-white cursor-not-allowed"
                        >
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Nahrávám...
                        </Button>
                      )}
                    </div>
                    
                    {/* Hidden file input */}
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Error zpráva */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm">!</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-red-800 font-medium text-sm">
                        {errorMessage}
                      </p>
                    </div>
                    <button
                      onClick={() => setErrorMessage('')}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Dokončit den - SMART VALIDACE */}
              <Button
                onClick={handleCompleteDay}
                disabled={!isFormValid}
                className={`
                  w-full py-3 text-lg font-semibold rounded-lg transition-all duration-200
                  ${isFormValid 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <span className="flex items-center justify-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>
                    {isPhotoDay ? 'Dokončit den + foto' : 'Dokončit den'}
                  </span>
                  {!isFormValid && <span className="text-xs">(vyplň všechno)</span>}
                </span>
              </Button>
              
              {/* Info o povinnosti fotky */}
              {isPhotoDay && (
                <div className="text-center">
                  <p className="text-sm text-orange-600 flex items-center justify-center space-x-1">
                    <Camera className="w-4 h-4" />
                    <span>Foto je dnes povinné pro dokončení dne</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Helper funkce pro výpočet streaku
function calculateStreak(userLogs, currentDay) {
  const logDays = Object.keys(userLogs).map(Number).sort((a, b) => b - a)
  
  if (logDays.length === 0) return 0
  
  let streak = 0
  let expectedDay = currentDay - 1 // Počítáme od včerejška
  
  for (const day of logDays) {
    if (day === expectedDay) {
      streak++
      expectedDay--
    } else {
      break
    }
  }
  
  return streak
}

export default MyDayPage