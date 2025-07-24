import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  MoreHorizontal,
  UserCheck,
  UserX,
  Calendar,
  Target,
  Camera
} from 'lucide-react'
import { db } from '../../lib/firebase'
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where,
  doc,
  getDoc
} from 'firebase/firestore'

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersQuery = query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc')
        )
        const usersSnapshot = await getDocs(usersQuery)
        const usersData = []
        
        for (const userDoc of usersSnapshot.docs) {
          const userData = { id: userDoc.id, ...userDoc.data() }
          
          // Načtení počtu splněných dnů
          const logsQuery = query(
            collection(db, 'userLogs'),
            where('userId', '==', userDoc.id)
          )
          const logsSnapshot = await getDocs(logsQuery)
          userData.completedDaysCount = logsSnapshot.size
          
          usersData.push(userData)
        }
        
        setUsers(usersData)
      } catch (error) {
        console.error('Chyba při načítání uživatelů:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('cs-CZ')
  }

  const getProgressPercentage = (completedDays) => {
    return Math.round((completedDays / 365) * 100)
  }

  const getStatusColor = (lastLogin) => {
    if (!lastLogin) return 'bg-gray-100 text-gray-800'
    
    const daysSinceLogin = Math.floor((new Date() - lastLogin.toDate()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLogin <= 1) return 'bg-green-100 text-green-800'
    if (daysSinceLogin <= 7) return 'bg-blue-100 text-blue-800'
    if (daysSinceLogin <= 30) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getStatusText = (lastLogin) => {
    if (!lastLogin) return 'Nikdy'
    
    const daysSinceLogin = Math.floor((new Date() - lastLogin.toDate()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLogin === 0) return 'Dnes'
    if (daysSinceLogin === 1) return 'Včera'
    if (daysSinceLogin <= 7) return `Před ${daysSinceLogin} dny`
    if (daysSinceLogin <= 30) return `Před ${daysSinceLogin} dny`
    return 'Neaktivní'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Načítání uživatelů...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Správa uživatelů</h1>
          <p className="text-gray-600 mt-1">Přehled všech registrovaných uživatelů ({users.length})</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtrovat</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Hledat podle jména nebo emailu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Aktivní</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.lastLogin && (new Date() - u.lastLogin.toDate()) < 7 * 24 * 60 * 60 * 1000).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Avg. pokrok</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {users.length > 0 ? Math.round(users.reduce((sum, u) => sum + (u.completedDaysCount || 0), 0) / users.length / 365 * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uživatel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registrace
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pokrok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poslední aktivita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typ pleti
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {searchTerm ? 'Žádní uživatelé nevyhovují hledání' : 'Zatím žádní uživatelé'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      
                      {/* User Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-pink-600">
                              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'Bez jména'}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-pink-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(getProgressPercentage(user.completedDaysCount || 0), 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">{user.completedDaysCount || 0}</span>/365
                            <div className="text-gray-500">
                              {getProgressPercentage(user.completedDaysCount || 0)}%
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Last Activity */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.lastLogin)}`}>
                          {getStatusText(user.lastLogin)}
                        </span>
                      </td>

                      {/* Skin Type */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {user.skinType || 'Neuvedeno'}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detail uživatele</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Základní informace</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Jméno:</span>
                    <p className="font-medium">{selectedUser.name || 'Neuvedeno'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Věk:</span>
                    <p className="font-medium">{selectedUser.age || 'Neuvedeno'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Typ pleti:</span>
                    <p className="font-medium capitalize">{selectedUser.skinType || 'Neuvedeno'}</p>
                  </div>
                </div>
              </div>

              {/* Progress Stats */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Statistiky pokroku</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{selectedUser.completedDaysCount || 0}</div>
                    <div className="text-sm text-gray-600">Splněných dnů</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{selectedUser.currentDay || 1}</div>
                    <div className="text-sm text-gray-600">Aktuální den</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {getProgressPercentage(selectedUser.completedDaysCount || 0)}%
                    </div>
                    <div className="text-sm text-gray-600">Dokončeno</div>
                  </div>
                </div>
              </div>

              {/* Goals */}
              {selectedUser.goals && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Cíle</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedUser.goals}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default UsersPage