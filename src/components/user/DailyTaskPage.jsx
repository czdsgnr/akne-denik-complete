import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import BottomSheet from '../ui/BottomSheet'
import { 
  ArrowLeft,
  Camera,
  Heart,
  Star,
  Save,
  CheckCircle,
  Calendar,
  Target,
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../lib/firebase'
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs 
} from 'firebase/firestore'
import DailyLogForm from '../DailyLogForm'
import { uploadPhotoToStorage } from '../../lib/uploadPhotoToStorage'

function DailyTaskPage() {
  const { dayNumber } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [dayContent, setDayContent] = useState(null)
  const [userLog, setUserLog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showLogForm, setShowLogForm] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [debugInfo, setDebugInfo] = useState('')

  const day = parseInt(dayNumber)

  useEffect(() => {
    const loadDayData = async () => {
      if (!user || !day) return
      
      try {
        setDebugInfo('Načítání dat...')
        
        // 🔥 OPRAVA: Priorita DB obsahu před fallback
        console.log(`🔍 Načítání obsahu dne ${day} z databáze...`)
        const contentDoc = await getDoc(doc(db, 'dailyContent', `day-${day}`))
        
        if (contentDoc.exists()) {
          const contentData = contentDoc.data()
          console.log('✅ Obsah dne načten z DB:', contentData)
          setDayContent(contentData)
        } else {
          console.warn(`⚠️ Obsah pro den ${day} nebyl nalezen v DB - používám fallback`)
          // Fallback pouze pokud není v DB
          setDayContent({
            day: day,
            motivation: `Vítej v dni ${day}! Pokračuj ve své cestě za krásnou pletí! 💖`,
            task: `🎯 DEN ${day} - POKRAČUJ VE SVÉ CESTĚ!\n\n📌 VZPOMEŇ SI:\nJaký pokrok jsi už udělala?\n\n💪 ÚKOL:\nDnes se zaměř na pravidelnost své rutiny.\n⭐ Udělej si čas jen pro sebe!`,
            isPhotoDay: day % 7 === 1,
            isDualPhotoDay: day % 14 === 0
          })
        }

        // Načtení uživatelského logu pro tento den
        const logsQuery = query(
          collection(db, 'userLogs'),
          where('userId', '==', user.uid),
          where('day', '==', day)
        )
        const logsSnapshot = await getDocs(logsQuery)
        if (!logsSnapshot.empty) {
          setUserLog({ id: logsSnapshot.docs[0].id, ...logsSnapshot.docs[0].data() })
        }

        setDebugInfo('Data načtena úspěšně ✅')
      } catch (error) {
        console.error('Chyba při načítání dat dne:', error)
        setDebugInfo(`Chyba: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadDayData()
  }, [user, day])

  // 🔍 DEBUG UPLOAD FUNKCE
  const handleSaveLog = async (logData) => {
    setSaving(true)
    setUploadError('')
    setDebugInfo('Zahajuji ukládání...')
    
    try {
      console.log('🔍 DEBUG - Uživatel:', {
        uid: user.uid,
        email: user.email,
        isAuthenticated: !!user
      })
      
      console.log('💾 Ukládání logu pro den:', day)
      console.log('📝 Data logu:', logData)

      let finalLogData = { ...logData }

      // 🧪 TEST SINGLE PHOTO UPLOAD
      if (logData.photo && logData.photo instanceof File) {
        try {
          setDebugInfo('📸 Testování upload single fotky...')
          console.log('📸 Nahrávání single fotky - detaily:', {
            name: logData.photo.name,
            size: logData.photo.size,
            type: logData.photo.type
          })
          
          const photoUrl = await uploadPhotoToStorage(
            logData.photo, 
            user.uid, 
            day, 
            'single'
          )
          
          finalLogData.photos = [{ url: photoUrl, type: 'single' }]
          delete finalLogData.photo
          
          setDebugInfo('✅ Single fotka nahrána úspěšně!')
          console.log('✅ Single fotka nahrána:', photoUrl)
        } catch (photoError) {
          console.error('❌ Chyba při nahrávání single fotky:', photoError)
          setUploadError(`Upload single fotky selhal: ${photoError.message}`)
          setDebugInfo(`❌ Upload error: ${photoError.message}`)
          
          // 🚫 NEUKONČOVAT - pokračovat bez fotky
          console.log('⚠️ Pokračuji bez single fotky...')
          delete finalLogData.photo
        }
      }

      // 🧪 TEST DUAL PHOTOS UPLOAD
      if ((logData.photoFront && logData.photoFront instanceof File) || 
          (logData.photoSide && logData.photoSide instanceof File)) {
        try {
          setDebugInfo('📸 Testování upload dual fotek...')
          console.log('📸 Nahrávání dual fotek...')
          
          const photos = []
          
          if (logData.photoFront instanceof File) {
            console.log('📸 Upload front photo...')
            const frontUrl = await uploadPhotoToStorage(logData.photoFront, user.uid, day, 'front')
            photos.push({ url: frontUrl, type: 'front' })
          }
          
          if (logData.photoSide instanceof File) {
            console.log('📸 Upload side photo...')
            const sideUrl = await uploadPhotoToStorage(logData.photoSide, user.uid, day, 'side')
            photos.push({ url: sideUrl, type: 'side' })
          }
          
          finalLogData.photos = photos
          delete finalLogData.photoFront
          delete finalLogData.photoSide
          
          setDebugInfo('✅ Dual fotky nahrány úspěšně!')
          console.log('✅ Dual fotky nahrány:', photos)
          
        } catch (photoError) {
          console.error('❌ Chyba při nahrávání dual fotek:', photoError)
          setUploadError(`Upload dual fotek selhal: ${photoError.message}`)
          setDebugInfo(`❌ Dual photos error: ${photoError.message}`)
          
          // 🚫 POKRAČOVAT BEZ FOTEK
          delete finalLogData.photoFront
          delete finalLogData.photoSide
        }
      }

      setDebugInfo('💾 Ukládání do Firestore...')

      // ✅ ULOŽENÍ LOGU DO FIRESTORE
      if (userLog) {
        console.log('🔄 Aktualizuji existující log...')
        await updateDoc(doc(db, 'userLogs', userLog.id), {
          ...finalLogData,
          updatedAt: new Date()
        })
        setUserLog({ ...userLog, ...finalLogData })
      } else {
        console.log('➕ Vytvářím nový log...')
        const newLogRef = doc(collection(db, 'userLogs'))
        await setDoc(newLogRef, {
          userId: user.uid,
          day: day,
          ...finalLogData,
          createdAt: new Date()
        })
        setUserLog({ id: newLogRef.id, userId: user.uid, day, ...finalLogData })
      }

      // 🔥 OPRAVA: AKTUALIZACE POKROKU BEZ ZMĚNY currentDay
      const userDocRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)
      const userData = userDoc.data()
      
      const completedDays = userData.completedDays || []
      if (!completedDays.includes(day)) {
        completedDays.push(day)
        await updateDoc(userDocRef, {
          completedDays,
          lastActivity: new Date()
          // 🚫 currentDay: Math.max(userData.currentDay || 1, day + 1)  <- TOTO ODSTRANĚNO!
        })
      }

      setDebugInfo('✅ Vše uloženo úspěšně!')
      console.log('✅ Log úspěšně uložen!')
      setShowLogForm(false)
      
    } catch (error) {
      console.error('❌ Chyba při ukládání logu:', error)
      setUploadError(`Chyba při ukládání: ${error.message}`)
      setDebugInfo(`❌ Save error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Načítání dne {day}...</p>
          {debugInfo && <p className="text-sm text-gray-500 mt-2">{debugInfo}</p>}
        </div>
      </div>
    )
  }

  if (!dayContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Den {day} není dostupný</h2>
          <p className="text-gray-500 mb-6">Obsah pro tento den ještě není připraven</p>
          <Button onClick={() => navigate('/my-day')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zpět na můj den
          </Button>
        </div>
      </div>
    )
  }

  const isCompleted = !!userLog
  const isPhotoDay = dayContent.isPhotoDay || false
  const isDualPhotoDay = dayContent.isDualPhotoDay || false

  return (
    <div className="min-h-screen">
      {/* 🔥 ZMENŠENÝ Header - z h-16 na h-14 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/my-day')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Den {day}</h1>
                <p className="text-sm text-gray-600">
                  {isCompleted ? 'Dokončeno' : 'K dokončení'}
                </p>
              </div>
            </div>

            {isCompleted && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Splněno</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Debug info */}
        {debugInfo && (
          <div className="bg-gray-50 border rounded-lg p-3">
            <p className="text-sm text-gray-700">🔍 Debug: {debugInfo}</p>
          </div>
        )}

        {/* Error Alert */}
        {uploadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
              <p className="text-sm text-red-700 mt-1">{uploadError}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setUploadError('')}
              >
                Zavřít
              </Button>
            </div>
          </div>
        )}

        {/* 🔥 ZMENŠENÁ Denní motivace - z p-6 na p-4 */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-purple-50">
          <CardHeader className="flex flex-row items-center space-x-3 pb-3">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <CardTitle className="text-pink-900">Denní motivace</CardTitle>
              <p className="text-sm text-pink-700">Tvá dnešní inspirace</p>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <blockquote className="text-lg font-medium text-pink-800 italic">
              "{dayContent.motivation}"
            </blockquote>
          </CardContent>
        </Card>

        {/* 🔥 ZMENŠENÝ Denní úkol - z p-6 na p-4 */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-3 pb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Dnešní úkol</CardTitle>
              <p className="text-sm text-gray-600">Co tě dnes čeká</p>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="prose max-w-none">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                  {dayContent.task}
                </pre>
              </div>
            </div>

            {/* Foto instrukce */}
            {isPhotoDay && (
              <div className="mt-4 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Camera className="w-5 h-5 text-pink-600" />
                  <h3 className="font-semibold text-pink-900">
                    {isDualPhotoDay ? 'Pořiď 2 fotky (zepředu + z boku)' : 'Pořiď fotku pokroku'}
                  </h3>
                </div>
                <p className="text-sm text-pink-700">
                  {isDualPhotoDay 
                    ? 'Dnes je čas na podrobnou fotodokumentaci - udělej si fotky z předu i z boku pro lepší sledování pokroku.'
                    : 'Dnes je foto den! Poříď si selfie obličeje pro sledování pokroku tvé pleti.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 🔥 ZMENŠENÝ Denní formulář - z p-6 na p-4 */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-3 pb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Tvůj záznam</CardTitle>
              <p className="text-sm text-gray-600">
                {isCompleted ? 'Upravit záznam' : 'Zaznamenat pokrok'}
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isCompleted ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dokončeno</span>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < userLog.skinRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {userLog.photos && userLog.photos.length > 0 && (
                  <div className="text-sm text-gray-600">
                    📸 {userLog.photos.length} {userLog.photos.length === 1 ? 'fotka' : 'fotky'} nahrané
                  </div>
                )}

                <Button 
                  onClick={() => setShowLogForm(true)}
                  className="w-full"
                  disabled={saving}
                >
                  Upravit záznam
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowLogForm(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Ukládám... {debugInfo && `(${debugInfo})`}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Záznam + Foto
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Bottom Sheet s formulářem */}
      <BottomSheet
        isOpen={showLogForm}
        onClose={() => setShowLogForm(false)}
        title={`Den ${day} - Záznam pokroku`}
      >
        <DailyLogForm
          dayNumber={day}
          onSubmit={handleSaveLog}
          onCancel={() => setShowLogForm(false)}
          isPhotoDay={isPhotoDay}
          isDualPhotoDay={isDualPhotoDay}
          existingEntry={userLog}
        />
      </BottomSheet>
    </div>
  )
}

export default DailyTaskPage