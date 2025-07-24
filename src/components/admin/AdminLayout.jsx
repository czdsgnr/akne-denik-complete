import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { 
  BarChart3, 
  Users, 
  FileText, 
  Package, 
  MessageSquare, 
  Menu, 
  X, 
  LogOut,
  Heart,
  Home
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const navigationItems = [
  {
    id: 'dashboard',
    path: '/admin',
    icon: BarChart3,
    label: 'Dashboard',
    description: 'Přehledy a statistiky'
  },
  {
    id: 'users',
    path: '/admin/users',
    icon: Users,
    label: 'Uživatelé',
    description: 'Správa registrovaných uživatelů'
  },
  {
    id: 'content',
    path: '/admin/content',
    icon: FileText,
    label: 'Denní obsah',
    description: 'Editor motivací a úkolů'
  },
  {
    id: 'products',
    path: '/admin/products',
    icon: Package,
    label: 'Produkty',
    description: 'FaceDeluxe a další produkty'
  },
  {
    id: 'messages',
    path: '/admin/messages',
    icon: MessageSquare,
    label: 'Zprávy',
    description: 'Komunikace s uživateli'
  }
]

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Chyba při odhlašování:', error)
    }
  }

  const isActivePath = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-600">Akné Deník</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = isActivePath(item.path)
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path)
                  setSidebarOpen(false)
                }}
                className={`
                  w-full flex items-start space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700 border border-pink-200' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isActive ? 'text-pink-600' : 'text-gray-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isActive ? 'text-pink-900' : 'text-gray-900'}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-pink-600' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-pink-600 rounded-full mt-2" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-gray-600">Administrator</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="w-full justify-start"
            >
              <Home className="w-4 h-4 mr-2" />
              Hlavní stránka
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Odhlásit se
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header (Mobile) */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Admin Panel</span>
            </div>
            
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  )
}

export default AdminLayout