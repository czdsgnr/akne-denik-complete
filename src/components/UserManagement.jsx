import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  Calendar,
  Camera,
  Star,
  TrendingUp,
  MessageSquare,
  Download,
  RefreshCw,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Activity
} from 'lucide-react'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showUserDetail, setShowUserDetail] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      // Pro demo verzi vytvoříme ukázková data
      const demoUsers = [
        {
          id: '1',
          email: 'anna.novakova@email.cz',
          name: 'Anna Nováková',
          age: 23,
          skinType: 'Smíšená',
          goals: 'Zbavit se akné a zlepšit texturu pleti',
          registrationDate: '2024-01-15',
          currentDay: 45,
          completedDays: 42,
          totalPhotos: 12,
          averageRating: 4.2,
          lastActivity: '2024-03-01',
          status: 'active',
          profile: {
            phone: '+420 123 456 789',
            city: 'Praha',
            skinConcerns: ['Akné', 'Rozšířené póry', 'Mastná T-zóna'],
            currentProducts: ['Čisticí gel', 'Hydratační krém', 'Sérum s niacinem']
          },
          progress: {
            mood: [4, 3, 5, 4, 4, 3, 5, 4, 4, 5],
            skinRating: [2, 2, 3, 3, 3, 4, 4, 4, 5, 5],
            photos: [
              { day: 1, url: '/demo-photos/anna-day1.jpg', type: 'single' },
              { day: 7, url: '/demo-photos/anna-day7.jpg', type: 'single' },
              { day: 14, url: '/demo-photos/anna-day14-front.jpg', type: 'front' },
              { day: 14, url: '/demo-photos/anna-day14-side.jpg', type: 'side' },
              { day: 21, url: '/demo-photos/anna-day21.jpg', type: 'single' },
              { day: 28, url: '/demo-photos/anna-day28-front.jpg', type: 'front' },
              { day: 28, url: '/demo-photos/anna-day28-side.jpg', type: 'side' },
              { day: 35, url: '/demo-photos/anna-day35.jpg', type: 'single' },
              { day: 42, url: '/demo-photos/anna-day42.jpg', type: 'single' }
            ],
            logs: [
              { day: 45, mood: 5, skinRating: 5, note: 'Pleť vypadá skvěle! Cítím se sebevědomě.', date: '2024-03-01' },
              { day: 44, mood: 4, skinRating: 4, note: 'Dobrý den, rutina funguje.', date: '2024-02-29' },
              { day: 43, mood: 4, skinRating: 4, note: 'Pokračujem v péči, vidím zlepšení.', date: '2024-02-28' }
            ]
          }
        },
        {
          id: '2',
          email: 'tereza.svobodova@email.cz',
          name: 'Tereza Svobodová',
          age: 19,
          skinType: 'Mastná',
          goals: 'Kontrola akné a prevence jizev',
          registrationDate: '2024-02-01',
          currentDay: 28,
          completedDays: 25,
          totalPhotos: 8,
          averageRating: 3.8,
          lastActivity: '2024-02-28',
          status: 'active',
          profile: {
            phone: '+420 987 654 321',
            city: 'Brno',
            skinConcerns: ['Těžké akné', 'Zánět', 'Jizvy'],
            currentProducts: ['Salicylová kyselina', 'Benzoyl peroxid', 'Hydratační krém']
          },
          progress: {
            mood: [2, 3, 3, 4, 3, 4, 4, 5],
            skinRating: [2, 2, 3, 3, 4, 4, 4, 4],
            photos: [
              { day: 1, url: '/demo-photos/tereza-day1.jpg', type: 'single' },
              { day: 7, url: '/demo-photos/tereza-day7.jpg', type: 'single' },
              { day: 14, url: '/demo-photos/tereza-day14-front.jpg', type: 'front' },
              { day: 14, url: '/demo-photos/tereza-day14-side.jpg', type: 'side' },
              { day: 21, url: '/demo-photos/tereza-day21.jpg', type: 'single' },
              { day: 28, url: '/demo-photos/tereza-day28.jpg', type: 'single' }
            ],
            logs: [
              { day: 28, mood: 5, skinRating: 4, note: 'Velké zlepšení! Akné se zmenšuje.', date: '2024-02-28' },
              { day: 27, mood: 4, skinRating: 4, note: 'Rutina pomáhá, pokračujem.', date: '2024-02-27' },
              { day: 26, mood: 4, skinRating: 3, note: 'Stále pracujem na zlepšení.', date: '2024-02-26' }
            ]
          }
        },
        {
          id: '3',
          email: 'klara.novotna@email.cz',
          name: 'Klára Novotná',
          age: 25,
          skinType: 'Suchá',
          goals: 'Hydratace a prevence stárnutí',
          registrationDate: '2024-01-01',
          currentDay: 60,
          completedDays: 58,
          totalPhotos: 16,
          averageRating: 4.7,
          lastActivity: '2024-03-01',
          status: 'active',
          profile: {
            phone: '+420 555 123 456',
            city: 'Ostrava',
            skinConcerns: ['Suchá pleť', 'Jemné linky', 'Ztráta elasticity'],
            currentProducts: ['Hydratační sérum', 'Krém s kyselinou hyaluronovou', 'SPF krém']
          },
          progress: {
            mood: [4, 4, 5, 5, 4, 5, 5, 4, 5, 5, 4, 5],
            skinRating: [3, 3, 4, 4, 4, 5, 5, 5, 5, 4, 5, 5],
            photos: [
              { day: 1, url: '/demo-photos/klara-day1.jpg', type: 'single' },
              { day: 7, url: '/demo-photos/klara-day7.jpg', type: 'single' },
              { day: 14, url: '/demo-photos/klara-day14-front.jpg', type: 'front' },
              { day: 14, url: '/demo-photos/klara-day14-side.jpg', type: 'side' },
              { day: 21, url: '/demo-photos/klara-day21.jpg', type: 'single' },
              { day: 28, url: '/demo-photos/klara-day28-front.jpg', type: 'front' },
              { day: 28, url: '/demo-photos/klara-day28-side.jpg', type: 'side' },
              { day: 35, url: '/demo-photos/klara-day35.jpg', type: 'single' },
              { day: 42, url: '/demo-photos/klara-day42-front.jpg', type: 'front' },
              { day: 42, url: '/demo-photos/klara-day42-side.jpg', type: 'side' },
              { day: 49, url: '/demo-photos/klara-day49.jpg', type: 'single' },
              { day: 56, url: '/demo-photos/klara-day56-front.jpg', type: 'front' },
              { day: 56, url: '/demo-photos/klara-day56-side.jpg', type: 'side' }
            ],
            logs: [
              { day: 60, mood: 5, skinRating: 5, note: 'Pleť je hydratovaná a zářivá!', date: '2024-03-01' },
              { day: 59, mood: 5, skinRating: 5, note: 'Skvělé výsledky, pokračujem.', date: '2024-02-29' },
              { day: 58, mood: 4, skinRating: 5, note: 'Rutina je součástí mého života.', date: '2024-02-28' }
            ]
          }
        },
        {
          id: '4',
          email: 'marie.kratka@email.cz',
          name: 'Marie Krátká',
          age: 21,
          skinType: 'Citlivá',
          goals: 'Zklidnění pleti a redukce zarudnutí',
          registrationDate: '2024-02-15',
          currentDay: 15,
          completedDays: 12,
          totalPhotos: 4,
          averageRating: 3.5,
          lastActivity: '2024-02-28',
          status: 'new',
          profile: {
            phone: '+420 777 888 999',
            city: 'České Budějovice',
            skinConcerns: ['Citlivá pleť', 'Zarudnutí', 'Reakce na produkty'],
            currentProducts: ['Jemný čisticí krém', 'Zklidňující sérum', 'Minerální SPF']
          },
          progress: {
            mood: [3, 3, 4, 3],
            skinRating: [2, 3, 3, 4],
            photos: [
              { day: 1, url: '/demo-photos/marie-day1.jpg', type: 'single' },
              { day: 7, url: '/demo-photos/marie-day7.jpg', type: 'single' },
              { day: 14, url: '/demo-photos/marie-day14-front.jpg', type: 'front' },
              { day: 14, url: '/demo-photos/marie-day14-side.jpg', type: 'side' }
            ],
            logs: [
              { day: 15, mood: 4, skinRating: 4, note: 'Pleť se zklidňuje, méně zarudnutí.', date: '2024-02-28' },
              { day: 14, mood: 3, skinRating: 3, note: 'Postupné zlepšení, budu pokračovat.', date: '2024-02-27' },
              { day: 13, mood: 3, skinRating: 3, note: 'Stále hledám správnou rutinu.', date: '2024-02-26' }
            ]
          }
        }
      ]
      
      setUsers(demoUsers)
    } catch (error) {
      console.error('Chyba při načítání uživatelů:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktivní</Badge>
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">Nový</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Neaktivní</Badge>
      default:
        return <Badge variant="outline">Neznámý</Badge>
    }
  }

  const getProgressPercentage = (completedDays, currentDay) => {
    return Math.round((completedDays / currentDay) * 100)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('cs-CZ')
  }

  const getMoodEmoji = (mood) => {
    const emojis = ['😞', '😕', '😐', '😊', '😄']
    return emojis[mood - 1] || '😐'
  }

  const getStarRating = (rating) => {
    return '⭐'.repeat(Math.round(rating))
  }

  const showUserDetails = (user) => {
    setSelectedUser(user)
    setShowUserDetail(true)
  }

  if (showUserDetail && selectedUser) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowUserDetail(false)}
            >
              ← Zpět na seznam
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
              <p className="text-gray-600">{selectedUser.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(selectedUser.status)}
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Napsat zprávu
            </Button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{selectedUser.currentDay}</div>
              <p className="text-gray-600">Aktuální den</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{selectedUser.completedDays}</div>
              <p className="text-gray-600">Dokončené dny</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{selectedUser.totalPhotos}</div>
              <p className="text-gray-600">Fotky pokroku</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{selectedUser.averageRating}</div>
              <p className="text-gray-600">Průměrné hodnocení</p>
            </CardContent>
          </Card>
        </div>

        {/* User Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profil uživatele
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Věk</label>
                  <p className="text-gray-900">{selectedUser.age} let</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Typ pleti</label>
                  <p className="text-gray-900">{selectedUser.skinType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Město</label>
                  <p className="text-gray-900">{selectedUser.profile.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Registrace</label>
                  <p className="text-gray-900">{formatDate(selectedUser.registrationDate)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Cíle</label>
                <p className="text-gray-900">{selectedUser.goals}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Problémy s pletí</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedUser.profile.skinConcerns.map((concern, index) => (
                    <Badge key={index} variant="outline">{concern}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Používané produkty</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedUser.profile.currentProducts.map((product, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">{product}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Poslední aktivita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedUser.progress.logs.slice(0, 5).map((log, index) => (
                  <div key={index} className="border-l-4 border-pink-500 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Den {log.day}</span>
                      <span className="text-sm text-gray-500">{formatDate(log.date)}</span>
                    </div>
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-sm">
                        Nálada: {getMoodEmoji(log.mood)}
                      </span>
                      <span className="text-sm">
                        Pleť: {getStarRating(log.skinRating)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{log.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Photo Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Fotodokumentace pokroku ({selectedUser.totalPhotos} fotek)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {selectedUser.progress.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <p className="text-sm font-medium">Den {photo.day}</p>
                      <p className="text-xs">{photo.type === 'single' ? 'Jedna fotka' : photo.type === 'front' ? 'Zepředu' : 'Z boku'}</p>
                    </div>
                  </div>
                  <Badge className="absolute top-2 left-2 text-xs">
                    Den {photo.day}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Správa uživatelů</h2>
          <p className="text-gray-600">Přehled všech registrovaných uživatelů a jejich pokroku</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {filteredUsers.length} uživatelů
          </Badge>
          <Button onClick={loadUsers} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Obnovit
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Hledat uživatele..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={filterStatus === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                Všichni
              </Button>
              <Button
                variant={filterStatus === 'active' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus('active')}
              >
                Aktivní
              </Button>
              <Button
                variant={filterStatus === 'new' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus('new')}
              >
                Noví
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Načítání uživatelů...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Žádní uživatelé</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Žádní uživatelé nevyhovují vašemu vyhledávání.' : 'Zatím se neregistroval žádný uživatel.'}
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  {getStatusBadge(user.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Aktuální den:</span>
                    <span className="font-medium">Den {user.currentDay}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Dokončeno:</span>
                    <span className="font-medium">{user.completedDays}/{user.currentDay} dnů</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(user.completedDays, user.currentDay)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fotky:</span>
                    <span className="font-medium">{user.totalPhotos} fotek</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Průměrné hodnocení:</span>
                    <span className="font-medium">{getStarRating(user.averageRating)} ({user.averageRating})</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Poslední aktivita:</span>
                    <span className="font-medium">{formatDate(user.lastActivity)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{user.skinType}</span> pleť
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => showUserDetails(user)}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Detail
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

