import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  User, 
  Camera 
} from 'lucide-react'

const navigationItems = [
  {
    id: 'my-day',
    path: '/my-day',
    icon: Calendar,
    label: 'Můj den',
    color: 'text-pink-600'
  },
  {
    id: 'overview',
    path: '/overview', 
    icon: BarChart3,
    label: 'Přehled',
    color: 'text-purple-600'
  },
  {
    id: 'chat',
    path: '/chat',
    icon: MessageSquare,
    label: 'Chat',
    color: 'text-blue-600'
  },
  {
    id: 'photos',
    path: '/photos',
    icon: Camera,
    label: 'Fotky',
    color: 'text-green-600'
  },
  {
    id: 'profile',
    path: '/profile',
    icon: User,
    label: 'Profil',
    color: 'text-indigo-600'
  }
]

function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/my-day') {
      return location.pathname === '/' || location.pathname === '/my-day'
    }
    return location.pathname === path
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center space-y-1 py-2 px-1 transition-all duration-200
                ${active 
                  ? 'text-pink-600 bg-pink-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-pink-600' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${active ? 'text-pink-600' : 'text-gray-500'}`}>
                {item.label}
              </span>
              {active && (
                <div className="w-1 h-1 bg-pink-600 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
      
      {/* Bezpečnostní spodní padding pro iOS */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  )
}

export default BottomNavigation