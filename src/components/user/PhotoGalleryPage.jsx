import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  ChevronRight,
  X,
  Share2,
  Clock,
  Target,
  Zap,
  Smile
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../lib/firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'

function PhotoGalleryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [photoLogs, setPhotoLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'timeline'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [showComparison, setShowComparison] = useState(false)
  const [filterType, setFilterType] = useState('all') // 'all' | 'photo_days' | 'progress'

  // 🚀 Scroll to top při načtení
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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
        console.error('Chyba při načítání foto logů:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPhotoLogs()
  }, [user])

  // Filtrování a vyhledávání
  useEffect(() => {
    let filtered = [...photoLogs]

    // Filtr podle typu
    if (filterType === 'photo_days') {
      filtered = filtered.filter(log => log.day % 7 === 1 || log.day === 1) // Foto dny
    } else if (filterType === 'progress') {
      filtered = filtered.filter(log => log.skinRating >= 4) // Pouze pozitivní pokrok
    }

    // Vyhledávání v poznámkách
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `den ${log.day}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLogs(filtered)
  }, [photoLogs, searchTerm, filterType])

  const getProgressMessage = (log) => {
    if (log.skinRating >= 4 && log.mood >= 4) {
      return { text: "Skvělý pokrok! 🎉", color: "text-green-600" }
    } else if (log.skinRating >= 3) {
      return { text: "Dobře se daří 👍", color: "text-blue-600" }
    } else {
      return { text: "Pokračuj dál 💪", color: "text-orange-600" }
    }
  }

  const getComparisonPhotos = () => {
    if (photoLogs.length < 2) return null
    
    // První a poslední foto pro porovnání
    const firstLog = photoLogs[0]
    const lastLog = photoLogs[photoLogs.length - 1]
    
    return {
      before: firstLog,
      after: lastLog,
      daysDifference: lastLog.day - firstLog.day
    }
  }

  const handlePhotoClick = (photo, log) => {
    setSelectedPhoto({ photo, log })
  }

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredLogs.map((log) => (
        <Card key={log.id} className="border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-0">
            {/* Foto */}
            <div className="relative aspect-square">
              {log.photos && log.photos.length > 0 ? (
                <img
                  src={log.photos[0].url}
                  alt={`Den ${log.day}`}
                  className="w-full h-full object-cover rounded-t-lg cursor-pointer"
                  onClick={() => handlePhotoClick(log.photos[0], log)}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-t-lg flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              {/* Den badge */}
              <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Den {log.day}
              </div>
              
              {/* Počet fotek */}
              {log.photos && log.photos.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  +{log.photos.length - 1}
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-gray-600">{log.mood}/5</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-gray-600">{log.skinRating}/5</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
                {log.note || 'Bez poznámky'}
              </p>
              
              <div className="mt-2">
                {(() => {
                  const progress = getProgressMessage(log)
                  return (
                    <p className={`text-xs font-medium ${progress.color}`}>
                      {progress.text}
                    </p>
                  )
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderTimelineView = () => (
    <div className="space-y-6">
      {filteredLogs.map((log, index) => (
        <Card key={log.id} className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:space-x-6">
              
              {/* Fotka */}
              <div className="flex-shrink-0 mb-4 lg:mb-0">
                <div className="relative">
                  {log.photos && log.photos.length > 0 ? (
                    <img
                      src={log.photos[0].url}
                      alt={`Den ${log.day}`}
                      className="w-full lg:w-48 h-48 object-cover rounded-xl cursor-pointer shadow-md"
                      onClick={() => handlePhotoClick(log.photos[0], log)}
                    />
                  ) : (
                    <div className="w-full lg:w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Badge */}
                  <div className="absolute -top-2 -left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                    Den {log.day}
                  </div>
                </div>
              </div>
              
              {/* Obsah */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Den {log.day} - {new Date(log.createdAt?.toDate?.() || log.createdAt).toLocaleDateString('cs-CZ')}
                  </h3>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-700">{log.mood}/5</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">{log.skinRating}/5</span>
                    </div>
                  </div>
                </div>
                
                {/* Poznámka */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {log.note || 'Bez poznámky k tomuto dni'}
                  </p>
                </div>
                
                {/* Progress message */}
                <div className="flex items-center justify-between">
                  {(() => {
                    const progress = getProgressMessage(log)
                    return (
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className={`font-medium ${progress.color}`}>
                          {progress.text}
                        </span>
                      </div>
                    )
                  })()}
                  
                  {log.photos && log.photos.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePhotoClick(log.photos[0], log)}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Zobrazit všechny ({log.photos.length})
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Načítání tvých fotek...</p>
          <p className="text-sm text-gray-500 mt-1">Připravujeme galerii tvého pokroku</p>
        </div>
      </div>
    )
  }

  const comparisonPhotos = getComparisonPhotos()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                
                <div>
                  <h1 className="text-xl font-bold">Fotodokumentace pokroku</h1>
                  <p className="text-purple-100 text-sm">
                    {filteredLogs.length} fotek ze tvé cesty
                  </p>
                </div>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center space-x-2">
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
                    <TrendingUp className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Comparison Section */}
        {showComparison && comparisonPhotos && (
          <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span>Tvůj pokrok za {comparisonPhotos.daysDifference} dnů!</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Před */}
                <div className="text-center">
                  <div className="relative">
                    <img
                      src={comparisonPhotos.before.photos[0].url}
                      alt="Před"
                      className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
                    />
                    <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full">
                      Den {comparisonPhotos.before.day}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-4">Začátek cesty</h3>
                  <p className="text-sm text-gray-600">
                    Nálada: {comparisonPhotos.before.mood}/5 • Pleť: {comparisonPhotos.before.skinRating}/5
                  </p>
                </div>
                
                {/* Po */}
                <div className="text-center">
                  <div className="relative">
                    <img
                      src={comparisonPhotos.after.photos[0].url}
                      alt="Po"
                      className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
                    />
                    <div className="absolute top-4 left-4 bg-green-500 text-white font-bold px-3 py-1 rounded-full">
                      Den {comparisonPhotos.after.day}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-4">Aktuálně</h3>
                  <p className="text-sm text-gray-600">
                    Nálada: {comparisonPhotos.after.mood}/5 • Pleť: {comparisonPhotos.after.skinRating}/5
                  </p>
                </div>
                
              </div>
              
              {/* Progress stats */}
              <div className="mt-6 p-4 bg-white rounded-xl border">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      +{comparisonPhotos.after.mood - comparisonPhotos.before.mood}
                    </p>
                    <p className="text-sm text-gray-600">Zlepšení nálady</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      +{comparisonPhotos.after.skinRating - comparisonPhotos.before.skinRating}
                    </p>
                    <p className="text-sm text-gray-600">Zlepšení pleti</p>
                  </div>
                </div>
              </div>
              
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Hledat v poznámkách nebo dnech..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-white shadow-md"
            />
          </div>
          
          {/* Filters */}
          <div className="flex space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg shadow-md bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">Všechny fotky</option>
              <option value="photo_days">Pouze foto dny</option>
              <option value="progress">Pozitivní pokrok</option>
            </select>
          </div>
          
        </div>

        {/* Stats Bar */}
        {filteredLogs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <p className="text-2xl font-bold text-pink-600">{filteredLogs.length}</p>
              <p className="text-sm text-gray-600">Celkem fotek</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(filteredLogs.reduce((sum, log) => sum + log.mood, 0) / filteredLogs.length * 10) / 10}
              </p>
              <p className="text-sm text-gray-600">Průměrná nálada</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(filteredLogs.reduce((sum, log) => sum + log.skinRating, 0) / filteredLogs.length * 10) / 10}
              </p>
              <p className="text-sm text-gray-600">Průměrné hodnocení</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <p className="text-2xl font-bold text-green-600">
                {filteredLogs.length > 0 ? filteredLogs[filteredLogs.length - 1].day - filteredLogs[0].day + 1 : 0}
              </p>
              <p className="text-sm text-gray-600">Dnů pokroku</p>
            </div>
          </div>
        )}

        {/* Content */}
        {filteredLogs.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-12">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {photoLogs.length === 0 ? 'Zatím žádné fotky' : 'Žádné výsledky'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {photoLogs.length === 0 
                    ? 'Až pořídíš první foto v denních záznamech, objeví se zde' 
                    : 'Zkus změnit filtry nebo vyhledávací term'}
                </p>
                <Button
                  onClick={() => navigate('/my-day')}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Jít na denní úkoly
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {viewMode === 'grid' ? renderGridView() : renderTimelineView()}
          </div>
        )}

      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                Den {selectedPhoto.log.day} - {new Date(selectedPhoto.log.createdAt?.toDate?.() || selectedPhoto.log.createdAt).toLocaleDateString('cs-CZ')}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* Photo */}
              <div className="text-center">
                <img
                  src={selectedPhoto.photo.url}
                  alt={`Den ${selectedPhoto.log.day}`}
                  className="max-w-full max-h-96 mx-auto rounded-xl shadow-lg"
                />
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{selectedPhoto.log.mood}/5</p>
                  <p className="text-sm text-gray-600">Nálada</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{selectedPhoto.log.skinRating}/5</p>
                  <p className="text-sm text-gray-600">Hodnocení pleti</p>
                </div>
              </div>
              
              {/* Note */}
              {selectedPhoto.log.note && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Poznámka k dni:</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedPhoto.log.note}</p>
                </div>
              )}
              
              {/* Progress */}
              <div className="text-center">
                {(() => {
                  const progress = getProgressMessage(selectedPhoto.log)
                  return (
                    <p className={`text-lg font-semibold ${progress.color}`}>
                      {progress.text}
                    </p>
                  )
                })()}
              </div>
              
            </div>
            
          </div>
        </div>
      )}

    </div>
  )
}

export default PhotoGalleryPage