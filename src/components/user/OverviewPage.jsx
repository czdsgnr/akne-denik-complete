import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Camera, 
  Target, 
  Award,
  Heart,
  Star,
  CheckCircle2,
  Sparkles,
  Flame,
  Eye,
  Grid3X3,
  Image,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../lib/firebase'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function OverviewPage() {
  const { user } = useAuth()
  const [userLogs, setUserLogs] = useState([])
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [stats, setStats] = useState({
    completedDays: 0,
    currentDay: 1,
    photosTaken: 0,
    averageMood: 0,
    averageSkinRating: 0,
    streak: 0
  })

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return
      
      try {
        console.log('🔍 Načítání dat pro uživatele:', user.uid)
        setLoading(true)
        setError(null)
        
        // Načtení uživatelských dat
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const userInfo = userDoc.data()
          setUserData(userInfo)
          console.log('👤 Uživatelská data:', userInfo)
        }

        // Zjednodušené načtení logů bez orderBy (aby se předešlo problémům s indexy)
        const logsQuery = query(
          collection(db, 'userLogs'),
          where('userId', '==', user.uid)
        )
        
        const logsSnapshot = await getDocs(logsQuery)
        const logs = []
        logsSnapshot.forEach((doc) => {
          const logData = { id: doc.id, ...doc.data() }
          logs.push(logData)
        })
        
        // Seřazení na klientu
        logs.sort((a, b) => a.day - b.day)
        
        console.log('📊 Načteno logů:', logs.length)  
        console.log('📷 Logy s fotkami:', logs.filter(log => log.photos && log.photos.length > 0).length)
        
        // Debug: výpis prvních několika logů s fotkami
        const logsWithPhotos = logs.filter(log => log.photos && log.photos.length > 0)
        if (logsWithPhotos.length > 0) {
          console.log('🖼️ Ukázka logů s fotkami:', logsWithPhotos.slice(0, 3).map(log => ({
            day: log.day,
            photosCount: log.photos.length,
            photoUrls: log.photos.map(p => p.url)
          })))
        }
        
        setUserLogs(logs)

        // ✅ VÝPOČET SKUTEČNÝCH STATISTIK
        if (logs.length > 0) {
          // Základní statistiky
          const completedDays = logs.length
          const photosTaken = logs.filter(log => log.photos && log.photos.length > 0).length
          const moodValues = logs.filter(log => log.mood > 0).map(log => log.mood)
          const skinValues = logs.filter(log => log.skinRating > 0).map(log => log.skinRating)
          
          const avgMood = moodValues.length > 0 ? moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length : 0
          const avgSkinRating = skinValues.length > 0 ? skinValues.reduce((sum, val) => sum + val, 0) / skinValues.length : 0
          
          // Výpočet streaku (postupné dny)
          let streak = 0
          if (logs.length > 0) {
            const sortedLogs = [...logs].sort((a, b) => b.day - a.day) // Seřadit sestupně
            streak = 1 // Minimálně 1 den
            
            for (let i = 1; i < sortedLogs.length; i++) {
              if (sortedLogs[i].day === sortedLogs[i-1].day - 1) {
                streak++
              } else {
                break
              }
            }
          }

          const realStats = {
            completedDays,
            currentDay: userDoc.exists() ? (userDoc.data()?.currentDay || completedDays + 1) : completedDays + 1,
            photosTaken,
            averageMood: Math.round(avgMood * 10) / 10,
            averageSkinRating: Math.round(avgSkinRating * 10) / 10,
            streak
          }

          console.log('📈 Vypočítané statistiky:', realStats)
          setStats(realStats)
        } else {
          // Uživatel nemá žádné logy - nastavit prázdné statistiky
          console.log('📭 Uživatel nemá žádné logy')
          setStats({
            completedDays: 0,
            currentDay: userDoc.exists() ? (userDoc.data()?.currentDay || 1) : 1,
            photosTaken: 0,
            averageMood: 0,
            averageSkinRating: 0,
            streak: 0
          })
        }

      } catch (error) {
        console.error('❌ Chyba při načítání dat:', error)
        setError('Chyba při načítání dat: ' + error.message)
        
        // V případě chyby nastavit prázdné statistiky
        setStats({
          completedDays: 0,
          currentDay: 1,
          photosTaken: 0,
          averageMood: 0,
          averageSkinRating: 0,
          streak: 0
        })
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Načítání tvých dat...</p>
        </div>
      </div>
    )
  }

  // Data pro graf pokroku (pouze posledních 7 dní)
  const chartData = userLogs.length > 0 ? userLogs.slice(-7).map(log => ({
    day: log.day,
    mood: log.mood || 0,
    skinRating: log.skinRating || 0,
    date: `Den ${log.day}`
  })) : []

  // Výpočet progress percentage
  const progressPercentage = Math.round((stats.completedDays / 365) * 100)

  // Achievements podle skutečných dat
  const achievements = [
    { 
      id: 1, 
      title: 'První týden', 
      description: '7 dní v řadě!', 
      icon: Award, 
      earned: stats.streak >= 7,
      progress: Math.min(stats.streak, 7),
      total: 7
    },
    { 
      id: 2, 
      title: 'Vytrvalost', 
      description: '30 dní dokončeno', 
      icon: Target, 
      earned: stats.completedDays >= 30,
      progress: Math.min(stats.completedDays, 30),
      total: 30
    },
    { 
      id: 3, 
      title: 'Fotograf', 
      description: '5 týdenních fotek', 
      icon: Camera, 
      earned: stats.photosTaken >= 5,
      progress: Math.min(stats.photosTaken, 5),
      total: 5
    },
    { 
      id: 4, 
      title: 'Optimista', 
      description: 'Průměrná nálada 4+', 
      icon: Heart, 
      earned: stats.averageMood >= 4,
      progress: Math.min(stats.averageMood, 4),
      total: 4
    }
  ]

  // Fotky pro galerii
  const photoLogs = userLogs.filter(log => log.photos && log.photos.length > 0)

  return (
    <div className="min-h-screen bg-white">
      {/* Čistý header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Přehled pokroku</h1>
                <p className="text-sm text-gray-500">
                  {stats.completedDays === 0 
                    ? 'Připrav se na svou cestu!' 
                    : `${stats.completedDays} dní dokončeno`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-red-900 mb-1">Chyba při načítání dat</h3>
                <p className="text-sm text-red-700">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="mt-3 text-red-600 border-red-300 hover:bg-red-50"
                >
                  Zkusit znovu
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hlavní statistiky */}
        <div className="grid grid-cols-2 gap-4">
          
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-pink-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.completedDays}</p>
            <p className="text-sm text-gray-600 mb-2">Splněných dnů</p>
            <div className="w-full bg-pink-100 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-pink-600 mt-1">{progressPercentage}% z cesty</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.streak}</p>
            <p className="text-sm text-gray-600 mb-2">Dní v řadě</p>
            {stats.streak >= 7 ? (
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                🔥 Super streak!
              </span>
            ) : stats.streak > 0 ? (
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                ⭐ Pokračuj tak!
              </span>
            ) : (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                💪 Začni dnes
              </span>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stats.averageMood > 0 ? stats.averageMood.toFixed(1) : '—'}
            </p>
            <p className="text-sm text-gray-600 mb-2">Průměrná nálada</p>
            {stats.averageMood >= 4 ? (
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                😊 Skvělé!
              </span>
            ) : stats.averageMood > 0 ? (
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                😌 Dobré
              </span>
            ) : (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                🎯 Začni hodnotit
              </span>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stats.averageSkinRating > 0 ? stats.averageSkinRating.toFixed(1) : '—'}
            </p>
            <p className="text-sm text-gray-600 mb-2">Hodnocení pleti</p>
            {stats.averageSkinRating >= 4 ? (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                ⭐ Skvělé
              </span>
            ) : stats.averageSkinRating > 0 ? (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                📈 Zlepšuje se
              </span>
            ) : (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                📊 Začni hodnotit
              </span>
            )}
          </div>

        </div>

        {/* Celkový pokrok */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Celkový pokrok</h3>
              <p className="text-sm text-gray-600">Tvoje cesta za krásnou pletí</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                {stats.completedDays} z 365 dní
              </span>
              <span className="text-lg font-bold text-blue-600">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 flex items-center justify-start pl-2"
                style={{ width: `${Math.max(progressPercentage, 2)}%` }}
              >
                {progressPercentage > 10 && (
                  <span className="text-xs text-white font-medium">
                    {progressPercentage}%
                  </span>
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {stats.completedDays === 0 
                  ? 'Připrav se na svou cestu za krásnou pletí! ✨'
                  : stats.completedDays < 7 
                  ? 'Skvělý začátek! Pokračuj každý den a uvidíš výsledky! 🌟'
                  : stats.completedDays < 30
                  ? 'Úžasný pokrok! Tvoje vytrvalost se vyplácí! 🎉'
                  : `Neuvěřitelných ${stats.completedDays} dní! Jsi inspirací! 🏆`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Fotky pokroku */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Fotky pokroku</h3>
                <p className="text-sm text-gray-600">{stats.photosTaken} fotek nahráno</p>
              </div>
            </div>
            {photoLogs.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPhotoGallery(!showPhotoGallery)}
                className="flex items-center space-x-2"
              >
                {showPhotoGallery ? (
                  <>
                    <Grid3X3 className="w-4 h-4" />
                    <span>Skrýt</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Zobrazit</span>
                  </>
                )}
              </Button>
            )}
          </div>

          {photoLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="mb-2 font-medium">Zatím nemáš žádné fotky pokroku</p>
              <p className="text-sm">Fotky se nahrávají během speciálních "foto dnů"</p>
            </div>
          ) : (
            <>
              {/* Rychlý přehled posledních fotek - SKUTEČNÉ FOTKY */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {photoLogs.slice(-3).map((log, index) => (
                  <div 
                    key={log.id} 
                    className="relative group cursor-pointer"
                    onClick={() => log.photos?.[0]?.url && setSelectedPhoto({...log.photos[0], day: log.day})}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {log.photos && log.photos[0]?.url ? (
                        <img 
                          src={log.photos[0].url} 
                          alt={`Den ${log.day} - pokrok`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            // Fallback když se obrázek nenačte
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center" style={{display: log.photos?.[0]?.url ? 'none' : 'flex'}}>
                        <div className="text-center">
                          <Camera className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                          <span className="text-xs text-purple-600 font-medium">Den {log.day}</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="text-white text-xs text-center">
                        <Eye className="w-4 h-4 mx-auto mb-1" />
                        <p className="font-semibold">Den {log.day}</p>
                        <p>{log.photos?.length || 0} {log.photos?.length === 1 ? 'fotka' : 'fotky'}</p>
                        {log.mood && (
                          <p className="mt-1">
                            {'⭐'.repeat(Math.min(log.mood, 5))}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rozšířená galerie - SKUTEČNÉ FOTKY */}
              {showPhotoGallery && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Image className="w-4 h-4 mr-2" />
                    Všechny fotky ({photoLogs.length} dnů)
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    {photoLogs.map((log) => (
                      <div 
                        key={log.id} 
                        className="relative group cursor-pointer"
                        onClick={() => log.photos?.[0]?.url && setSelectedPhoto({...log.photos[0], day: log.day})}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          {log.photos && log.photos[0]?.url ? (
                            <img 
                              src={log.photos[0].url} 
                              alt={`Den ${log.day} - pokrok`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                              onError={(e) => {
                                // Fallback když se obrázek nenačte
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center" style={{display: log.photos?.[0]?.url ? 'none' : 'flex'}}>
                            <div className="text-center">
                              <Camera className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                              <span className="text-xs text-blue-600 font-medium">D{log.day}</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="text-white text-xs text-center">
                            <Eye className="w-5 h-5 mx-auto mb-1 opacity-75" />
                            <p className="font-medium">Den {log.day}</p>
                            <p>{log.photos?.length || 0} fotky</p>
                            {log.mood && (
                              <p className="mt-1">
                                {'⭐'.repeat(Math.min(log.mood, 5))}
                              </p>
                            )}
                            {log.skinRating && (
                              <p className="text-xs text-green-300">
                                Pleť: {log.skinRating}/5
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Graf - pouze pokud má data */}
        {chartData.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pokrok za poslední dny</h3>
                <p className="text-sm text-gray-600">Sleduj, jak se zlepšuje tvoje nálada a pleť</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      value, 
                      name === 'mood' ? 'Nálada' : 'Hodnocení pleti'
                    ]}
                    labelFormatter={(label) => label}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mood" 
                    stackId="1"
                    stroke="#ec4899" 
                    fill="#ec4899" 
                    fillOpacity={0.4}
                    name="mood"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="skinRating" 
                    stackId="1"
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.4}
                    name="skinRating"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Úspěchy */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Úspěchy a ocenění</h3>
              <p className="text-sm text-gray-600">Tvoje dosažené milníky</p>
            </div>
          </div>

          <div className="space-y-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              const progressPercent = achievement.total > 0 ? Math.min((achievement.progress / achievement.total) * 100, 100) : 0
              
              return (
                <div
                  key={achievement.id}
                  className={`
                    p-4 rounded-lg border transition-all duration-200
                    ${achievement.earned
                      ? 'border-yellow-300 bg-yellow-50 shadow-sm'
                      : 'border-gray-200 bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${achievement.earned
                          ? 'bg-yellow-100'
                          : 'bg-gray-100'
                        }
                      `}>
                        <Icon className={`
                          w-5 h-5 
                          ${achievement.earned
                            ? 'text-yellow-600'
                            : 'text-gray-400'
                          }
                        `} />
                      </div>
                      <div>
                        <h3 className={`
                          font-semibold
                          ${achievement.earned
                            ? 'text-gray-900'
                            : 'text-gray-500'
                          }
                        `}>
                          {achievement.title}
                        </h3>
                        <p className={`
                          text-sm
                          ${achievement.earned
                            ? 'text-gray-700'
                            : 'text-gray-400'
                          }
                        `}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    {achievement.earned ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-sm text-gray-500">
                        {achievement.progress}/{achievement.total}
                      </span>
                    )}
                  </div>
                  
                  {/* Progress bar pro nedokončené úspěchy */}
                  {!achievement.earned && achievement.progress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Motivační zpráva */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-xl shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {stats.completedDays === 0 
              ? 'Začni svou cestu! ✨'
              : stats.completedDays < 7 
              ? 'Skvělý začátek! 🌟'
              : stats.completedDays < 30
              ? 'Úžasný pokrok! 🎉'
              : stats.completedDays < 100
              ? 'Jsi neuvěřitelná! 🏆'
              : 'Absolutní šampionka! 👑'
            }
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto">
            {stats.completedDays === 0 
              ? 'Tvoje cesta za krásnou pletí právě začíná. Každý den je novou příležitostí!'
              : stats.completedDays < 7 
              ? `Za ${stats.completedDays} dní jsi udělala skvělý začátek. Pokračuj dál - každý den se počítá!`
              : stats.completedDays < 30
              ? `${stats.completedDays} dní za sebou je úžasné! Tvoje vytrvalost se určitě vyplatí.`
              : stats.completedDays < 100
              ? `${stats.completedDays} dní je neuvěřitelný úspěch! Jsi inspirací pro všechny kolem sebe.`
              : `Neuvěřitelných ${stats.completedDays} dní! Jsi absolutní šampionka a vzor pro ostatní! 🌟`
            }
          </p>
        </div>

      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedPhoto.url} 
              alt={`Den ${selectedPhoto.day} - pokrok`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
              <p className="font-semibold">Den {selectedPhoto.day}</p>
              {selectedPhoto.type && (
                <p className="text-sm opacity-75">{selectedPhoto.type === 'front' ? 'Zepředu' : selectedPhoto.type === 'side' ? 'Z boku' : 'Pokrok'}</p>
              )}
            </div>
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OverviewPage