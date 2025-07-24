import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import DailyContentEditor from './DailyContentEditor'
import UserManagement from './UserManagement'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Package,
  Menu,
  X
} from 'lucide-react'

export default function DemoAdminPanel() {
  const [activeTab, setActiveTab] = useState('content')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', name: 'Uživatelé', icon: Users },
    { id: 'content', name: 'Denní obsah', icon: FileText },
    { id: 'products', name: 'Produkty', icon: Package },
    { id: 'messages', name: 'Zprávy', icon: MessageSquare },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'content':
        return <DailyContentEditor />
      case 'users':
        return <UserManagement />
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">1,234</div>
                  <p className="text-gray-600">Celkem uživatelů</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">892</div>
                  <p className="text-gray-600">Aktivní uživatelé</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">15</div>
                  <p className="text-gray-600">Produkty</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">23</div>
                  <p className="text-gray-600">Nové zprávy</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case 'products':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Správa produktů</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Zde bude správa produktů (FaceDeluxe, krémy, séra...)...</p>
              </CardContent>
            </Card>
          </div>
        )
      case 'messages':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Zprávy od uživatelů</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Zde budou zprávy a komunikace s uživateli...</p>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return <DailyContentEditor />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">Akné Deník</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {sidebarOpen && (
            <div className="text-center">
              <p className="text-sm text-gray-600">Demo Admin Panel</p>
              <p className="text-xs text-gray-500">Pro testování editoru</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

