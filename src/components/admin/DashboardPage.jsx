import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  Eye,
  UserCheck,
  Activity,
  Package,
  AlertCircle,
  ChevronRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../lib/firebase'
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  getCountFromServer 
} from 'firebase/firestore'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalMessages: 0,
    unreadMessages: 0,
    completedDays: 0,
    averageProgress: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Načtení základních statistik
        const usersSnapshot = await getCountFromServer(collection(db, 'users'))
        const totalUsers = usersSnapshot.data().count

        // Aktivní uživatelé (přihlášení za posledních 7 dní)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        
        const activeUsersSnapshot = await getCountFromServer(
          query(collection(db, 'users'), where('lastLogin', '>=', weekAgo))
        )
        const activeUsers = activeUsersSnapshot.data().count

        // Celkové zprávy
        const messagesSnapshot = await getCountFromServer(collection(db, 'messages'))
        const totalMessages = messagesSnapshot.data().count

        // Nepřečtené zprávy
        const unreadMessagesSnapshot = await getCountFromServer(
          query(collection(db, 'messages'), where('isRead', '==', false))
        )
        const unreadMessages = unreadMessagesSnapshot.data().count

        // Dokončené dny
        const logsSnapshot = await getCountFromServer(collection(db, 'userLogs'))
        const completedDays = logsSnapshot.data().count

        // Nedávná aktivita
        const recentLogsQuery = query(
          collection(db, 'userLogs'),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        const recentLogsSnapshot = await getDocs(recentLogsQuery)
        const recentActivityData = []
        
        for (const doc of recentLogsSnapshot.docs) {
          const logData = doc.data()
          // Načtení jména uživatele
          const userDoc = await getDocs(
            query(collection(db, 'users'), where('__name__', '==', logData.userId))
          )
          const userName = userDoc.docs[0]?.data()?.name || 'Neznámý uživatel'
          
          recentActivityData.push({
            id: doc.id,
            userName,
            day: logData.day,
            mood: logData.mood,
            skinRating: logData.skinRating,
            createdAt: logData.createdAt
          })
        }
        setRecentActivity(recentActivityData)

        // Data pro graf (poslední 7 dní registrací)
        const chartDataArray = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dayStart = new Date(date.setHours(0, 0, 0, 0))
          const dayEnd = new Date(date.setHours(23, 59, 59, 999))

          const dayUsersSnapshot = await getCountFromServer(
            query(
              collection(db, 'users'),
              where('createdAt', '>=', dayStart),
              where('createdAt', '<=', dayEnd)
            )
          )
          
          chartDataArray.push({
            date: dayStart.toLocaleDateString('cs-CZ', { month: 'short', day: 'numeric' }),
            registrations: dayUsersSnapshot.data().count
          })
        }
        setChartData(chartDataArray)

        setStats({
          totalUsers,
          activeUsers,
          totalMessages,
          unreadMessages,
          completedDays,
          averageProgress: totalUsers > 0 ? Math.round((completedDays / totalUsers / 365) * 100) : 0
        })

      } catch (error) {
        console.error('Chyba při načítání dashboard dat:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Načítání dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (date) => {
    if (!date) return ''
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('cs-CZ', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Přehled aktivit a statistik</p>
        </div>
        <div className="text-sm text-gray-500">
          Aktualizováno: {new Date().toLocaleString('cs-CZ')}
        </div>
      </div>

      {/* Hlavní statistiky */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate('/admin/users')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Celkem uživatelů</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                <p className="text-sm text-green-600 mt-1">
                  {stats.activeUsers} aktivních týdně
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate('/admin/messages')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Zprávy</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMessages}</p>
                <p className="text-sm text-orange-600 mt-1">
                  {stats.unreadMessages} nepřečtených
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Splněné dny</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedDays}</p>
                <p className="text-sm text-green-600 mt-1">
                  Celkem všichni uživatelé
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Průměrný pokrok</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageProgress}%</p>
                <p className="text-sm text-purple-600 mt-1">
                  Z celoročního programu
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Grafy a analytika */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Registrace za poslední týden */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Nové registrace (7 dní)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="registrations" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-500">Načítání dat...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nedávná aktivita */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Nedávná aktivita</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.userName}
                        </p>
                        <p className="text-xs text-gray-600">
                          Dokončil den {activity.day} • Nálada: {activity.mood}/5
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(activity.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Zatím žádná aktivita</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Rychlé akce */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate('/admin/content')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Editor obsahu</p>
                  <p className="text-xs text-gray-600">Upravit denní úkoly</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate('/admin/users')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Správa uživatelů</p>
                  <p className="text-xs text-gray-600">Zobrazit profily</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate('/admin/products')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Produkty</p>
                  <p className="text-xs text-gray-600">Spravovat FaceDeluxe</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate('/admin/messages')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Zprávy</p>
                  <p className="text-xs text-gray-600">Odpovědět uživatelům</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Upozornění */}
      {stats.unreadMessages > 0 && (
        <Card className="border-0 shadow-lg border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">
                  Máte {stats.unreadMessages} nepřečtených zpráv
                </p>
                <p className="text-sm text-orange-700">
                  Uživatelé čekají na odpověď
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => navigate('/admin/messages')}
                className="bg-orange-600 hover:bg-orange-700 ml-auto"
              >
                Zobrazit zprávy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}

export default DashboardPage