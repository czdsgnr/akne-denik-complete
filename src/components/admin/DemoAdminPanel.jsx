import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import DailyContentEditor from '../DailyContentEditor'
import UserManagement from '../UserManagement'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Package,
  Menu,
  X,
  ArrowLeft,
  Heart
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
            <h2 className="text-2xl font-bold text-gray-900">Demo Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">1,234</div>
                  <p className="text-gray-600">Celkem uživatelů</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">892</div>
                  <p className="text-gray-600">Aktivní uživatelé</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">15</div>
                  <p className="text-gray-600">Produkty</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">23</div>
                  <p className="text-gray-600">Nové zprávy</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Demo režim</h3>
                  <p className="text-sm text-blue-700">
                    Toto je demo verze admin panelu pro testování funkcí. 
                    Data se neukládají trvale a slouží pouze pro prezentaci možností systému.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      case 'products':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Demo - Správa produktů</h2>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Správa produktů</h3>
                  <p className="text-gray-500 mb-4">
                    Zde bude správa produktů jako FaceDeluxe, krémy, séra a další produkty pro péči o pleť.
                  </p>
                  <div className="text-sm text-blue-600">
                    💡 V plné verzi: Přidávání produktů, editace cen, správa skladových zásob
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'messages':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Demo - Zprávy od uživatelů</h2>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Komunikace s uživateli</h3>
                  <p className="text-gray-500 mb-4">
                    Zde budou zprávy od uživatelů a možnost odpovědět na jejich dotazy ohledně péče o pleť.
                  </p>
                  <div className="text-sm text-blue-600">
                    💡 V plné verzi: Real-time chat, automatické odpovědi, kategorizace dotazů
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return <DailyContentEditor />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header s návratem */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Zpět na hlavní stránku</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Demo Admin Panel</h1>
                  <p className="text-xs text-gray-600">Akné Deník - Testovací prostředí</p>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Demo režim - data se neukládají
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col min-h-screen`}>
          
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Navigace</h2>
                  <p className="text-xs text-gray-600">Vyberte sekci</p>
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
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${!sidebarOpen ? 'mx-auto' : 'mr-3'}`} />
                    {sidebarOpen && (
                      <span className="font-medium">{item.name}</span>
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
    </div>
  )
}