import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { 
  Camera, 
  ArrowLeft, 
  Calendar, 
  Search,
  Filter,
  Download,
  Eye,
  Grid3X3,
  List,
  Image,
  Star,
  Heart,
  Sparkles,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
// import { useAuth } from '../../hooks/useAuth' - Mock for artifacts
const useAuth = () => ({
  user: { uid: 'demo-user-123' } // Mock user for demo
})
// import { db } from '../../lib/firebase' - Mock for artifacts
// import { collection, query, where, getDocs, orderBy } from 'firebase/firestore' - Mock for artifacts

// Mock Firebase functions for demo
const db = {}
const collection = () => ({})
const query = () => ({})
const where = () => ({})
const getDocs = async () => ({
  forEach: (callback) => {
    // Demo data - ukázka 3 foto logů
    const demoLogs = [
      {
        id: 'log1',
        day: 1,
        mood: 3,
        skinRating: 2,
        note: 'První den mé cesty! Jsem nervózní ale nadšená.',
        photos: [{ url: 'demo1.jpg', type: 'single' }],
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'log2', 
        day: 7,
        mood: 4,
        skinRating: 3,
        note: 'První týden za mnou! Cítím se lépe.',
        photos: [{ url: 'demo2.jpg', type: 'single' }],
        createdAt: new Date('2024-01-07')
      },
      {
        id: 'log3',
        day: 14, 
        mood: 4,
        skinRating: 4,
        note: 'Dva týdny! Vidím první změny na své pleti.',
        photos: [
          { url: 'demo3a.jpg', type: 'front' },
          { url: 'demo3b.jpg', type: 'side' }
        ],
        createdAt: new Date('2024-01-14')
      }
    ]
    
    demoLogs.forEach(log => {
      callback({ id: log.id, data: () => log })
    })
  }
})
const orderBy = () => ({})
// import { useNavigate } from 'react-router-dom' - Not supported in artifacts

function PhotoGalleryPage() {
  const { user } = useAuth()
  // const navigate = useNavigate() - Not supported in artifacts
  const [photoLogs, setPhotoLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'timeline'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    const loadPhotoLogs = async () => {
      if (!user) return
      
      try {
        console.log('📸 Načítání foto logů pro uživatele:', user.uid)
        
        // Načtení všech logů s fotkami
        const logsQuery = query(
          collection(db, 'userLogs'),
          where('userId', '==', user.uid),
          orderBy('day', 'asc')
        )
        
        const logsSnapshot = await getDocs(logsQuery)
        const logs = []
        
        logsSnapshot.forEach((doc) => {
          const logData = { id: doc.id, ...doc.data() }
          // Pouze logy s fotkami
          if (logData.photos && logData.photos.length > 0) {
            logs.push(logData)
          }
        })
        
        console.log('📷 Načteno foto logů:', logs.length)
        setPhotoLogs(logs)
        setFilteredLogs(logs)
        
      } catch (error) {
        console.error('❌ Chyba při načítání foto logů:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPhotoLogs()
  }, [user])

  // Filtrování podle vyhledávání
  useEffect(() => {
    if (searchTerm) {
      const filtered = photoLogs.filter(log =>
        log.day.toString().includes(searchTerm) ||
        log.note?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredLogs(filtered)
    } else {
      setFilteredLogs(photoLogs)
    }
  }, [searchTerm, photoLogs])

  // Funkce pro porovnání před/po
  const getComparisonPhotos = () => {
    if (filteredLogs.length < 2) return null
    
    const firstLog = filteredLogs[0]
    const lastLog = filteredLogs[filteredLogs.length - 1]
    
    return {
      before: { ...firstLog, label: `Den ${firstLog.day} (začátek)` },
      after: { ...lastLog, label: `Den ${lastLog.day} (aktuálně)` }
    }
  }

  // Formátování data
  const formatDate = (day) => {
    const startDate = new Date(2024, 0, 1) // 1. ledna 2024
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + day - 1)
    return currentDate.toLocaleDateString('cs-CZ', { 
      day: 'numeric', 
      month: 'long' 
    })
  }

  // Získání emoji pro náladu
  const getMoodEmoji = (mood) => {
    const moods = ['😞', '😕', '😐', '😊', '😄']
    return moods[mood - 1] || '😐'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Načítání tvých fotek...</p>
        </div>
      </div>
    )
  }

  const comparisonPhotos = getComparisonPhotos()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // navigate(-1) - Not supported in artifacts
                    console.log('Navigate back')
                    alert('V reálné aplikaci: zpět na předchozí stránku')
                  }}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Fotodokumentace pokroku</h1>
                  <p className="text-purple-100 mt-1">
                    {filteredLogs.length} fotek ze tvé cesty
                  </p>
                </div>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'timeline' : 'grid')}
                  className="text-white hover:bg-white/20"
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                </Button>
                
                {comparisonPhotos && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComparison(!showComparison)}
                    className="text-white hover:bg-white/20"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Před/Po
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Search & Filter */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Hledat podle dne nebo poznámky..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {filteredLogs.length} z {photoLogs.length} fotek
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Porovnání před/po */}
        {showComparison && comparisonPhotos && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Tvůj pokrok: Před vs. Po
              </CardTitle>
              <p className="text-sm text-green-700">
                Srovnání první a poslední fotky - podívej se, jak daleko jsi se dostala! 
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Před */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {comparisonPhotos.before.label}
                  </h3>
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Fotka ze začátku</p>
                      <p className="text-xs text-gray-400">{formatDate(comparisonPhotos.before.day)}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Nálada: {getMoodEmoji(comparisonPhotos.before.mood)}</p>
                    <p className="text-sm text-gray-600">
                      Pleť: {'⭐'.repeat(comparisonPhotos.before.skinRating || 0)}
                    </p>
                  </div>
                </div>

                {/* Po */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-green-600" />
                    {comparisonPhotos.after.label}
                  </h3>
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-green-600">Aktuální fotka</p>
                      <p className="text-xs text-green-500">{formatDate(comparisonPhotos.after.day)}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Nálada: {getMoodEmoji(comparisonPhotos.after.mood)}</p>
                    <p className="text-sm text-gray-600">
                      Pleť: {'⭐'.repeat(comparisonPhotos.after.skinRating || 0)}
                    </p>
                  </div>
                </div>

              </div>
              
              {/* Pokrok statistiky */}
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <h4 className="font-medium mb-3 text-center">Tvůj pokrok v číslech:</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {comparisonPhotos.after.day - comparisonPhotos.before.day + 1}
                    </p>
                    <p className="text-xs text-gray-600">Dní cesty</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {((comparisonPhotos.after.mood - comparisonPhotos.before.mood) > 0 ? '+' : '')}
                      {(comparisonPhotos.after.mood - comparisonPhotos.before.mood).toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-600">Změna nálady</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {((comparisonPhotos.after.skinRating - comparisonPhotos.before.skinRating) > 0 ? '+' : '')}
                      {(comparisonPhotos.after.skinRating - comparisonPhotos.before.skinRating).toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-600">Zlepšení pleti</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Galerie fotek */}
        {filteredLogs.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-12 text-center">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm ? 'Nenalezeny žádné fotky' : 'Zatím nemáš žádné fotky'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? 'Zkus změnit vyhledávací dotaz'
                  : 'Fotky se nahrávají během speciálních "foto dnů"'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => {
                    // navigate('/my-day') - Not supported in artifacts
                    console.log('Navigate to my-day')
                    alert('V reálné aplikaci: přechod na Můj den')
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  Jít na Můj den
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>
                {viewMode === 'grid' ? 'Mřížkové zobrazení' : 'Časová osa'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              
              {viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedPhoto(log)}
                    >
                      <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center hover:shadow-lg transition-all duration-200">
                        <div className="text-center">
                          <Camera className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                          <span className="text-sm font-medium text-purple-700">Den {log.day}</span>
                          <div className="flex justify-center mt-1">
                            {'⭐'.repeat(log.skinRating || 0)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <Eye className="w-6 h-6 mx-auto mb-2" />
                          <p className="text-sm font-medium">Zobrazit detail</p>
                          <p className="text-xs">{formatDate(log.day)}</p>
                        </div>
                      </div>
                      
                      {/* Badge s počtem fotek */}
                      <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {log.photos?.length || 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Timeline View */
                <div className="space-y-6">
                  {filteredLogs.map((log, index) => (
                    <div key={log.id} className="relative">
                      {/* Timeline line */}
                      {index !== filteredLogs.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-16 bg-gradient-to-b from-purple-300 to-transparent" />
                      )}
                      
                      <div className="flex items-start space-x-4">
                        {/* Timeline dot */}
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">{log.day}</span>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 bg-white rounded-lg p-4 shadow-sm border">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">Den {log.day}</h3>
                            <span className="text-sm text-gray-500">{formatDate(log.day)}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Photo placeholder */}
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                <span className="text-xs text-gray-500">
                                  {log.photos?.length || 1} {log.photos?.length === 1 ? 'fotka' : 'fotky'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Details */}
                            <div className="md:col-span-2 space-y-3">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Heart className="w-4 h-4 text-red-500" />
                                  <span className="text-sm">Nálada: {getMoodEmoji(log.mood)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm">Pleť: {'⭐'.repeat(log.skinRating || 0)}</span>
                                </div>
                              </div>
                              
                              {log.note && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-700 italic">"{log.note}"</p>
                                </div>
                              )}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPhoto(log)}
                                className="w-full"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Zobrazit detail
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
            </CardContent>
          </Card>
        )}

      </div>

      {/* Modal pro detail fotky */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Den {selectedPhoto.day}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2"
                >
                  ✕
                </Button>
              </div>
              
              {/* Photo detail content */}
              <div className="space-y-4">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-purple-700">Den {selectedPhoto.day}</p>
                    <p className="text-sm text-purple-600">{formatDate(selectedPhoto.day)}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {selectedPhoto.photos?.length || 1} {selectedPhoto.photos?.length === 1 ? 'fotka' : 'fotky'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Nálada</p>
                    <p className="text-lg">{getMoodEmoji(selectedPhoto.mood)}</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Hodnocení pleti</p>
                    <p className="text-lg">{'⭐'.repeat(selectedPhoto.skinRating || 0)}</p>
                  </div>
                </div>
                
                {selectedPhoto.note && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Tvoje poznámka:</h4>
                    <p className="text-gray-700 italic">"{selectedPhoto.note}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default PhotoGalleryPage