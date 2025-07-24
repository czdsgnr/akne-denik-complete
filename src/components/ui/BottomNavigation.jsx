import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  CalendarDays, 
  BarChart3, 
  MessageSquare, 
  User,
  Heart
} from 'lucide-react'

const navigationItems = [
  {
    id: 'my-day',
    path: '/my-day',
    icon: CalendarDays,
    label: 'Můj den',
    activeColor: 'text-pink-600'
  },
  {
    id: 'overview',
    path: '/overview',
    icon: BarChart3,
    label: 'Přehled',
    activeColor: 'text-purple-600'
  },
  {
    id: 'chat',
    path: '/chat',
    icon: MessageSquare,
    label: 'Chat',
    activeColor: 'text-blue-600'
  },
  {
    id: 'profile',
    path: '/profile',
    icon: User,
    label: 'Profil',
    activeColor: 'text-green-600'
  }
]

function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex justify-around items-center h-16">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className={`flex flex-col items-center justify-center space-y-1 px-2 py-1 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                  isActive 
                    ? `${item.activeColor} bg-gray-50 scale-105` 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className={`w-1 h-1 rounded-full bg-current animate-pulse`} />
                )}
              </button>
            )
          })}
        </nav>
      </div>
      
      {/* Gradient overlay pro lepší vizuál */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
    </div>
  )
}

export default BottomNavigation