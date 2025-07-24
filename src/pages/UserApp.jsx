// src/pages/UserApp.jsx - DEBUGOVACÍ VERZE
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// ZÁKLADNÍ KOMPONENTY PRO TEST
const TestPage = ({ title, emoji }) => (
  <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
    <div className="text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">📱 Funguje na mobilu!</p>
      <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
        <p className="text-sm text-gray-500">
          ✅ React načten<br/>
          ✅ Routing funguje<br/>
          ✅ Tailwind načten
        </p>
      </div>
    </div>
  </div>
)

// MINIMÁLNÍ BOTTOM NAVIGATION
const SimpleBottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
    <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
      <button 
        onClick={() => window.location.hash = '/my-day'}
        className="flex flex-col items-center justify-center text-pink-600"
      >
        <div className="text-lg">🏠</div>
        <span className="text-xs">Můj den</span>
      </button>
      <button 
        onClick={() => window.location.hash = '/overview'}
        className="flex flex-col items-center justify-center text-gray-500"
      >
        <div className="text-lg">📊</div>
        <span className="text-xs">Přehled</span>
      </button>
      <button 
        onClick={() => window.location.hash = '/chat'}
        className="flex flex-col items-center justify-center text-gray-500"
      >
        <div className="text-lg">💬</div>
        <span className="text-xs">Chat</span>
      </button>
      <button 
        onClick={() => window.location.hash = '/profile'}
        className="flex flex-col items-center justify-center text-gray-500"
      >
        <div className="text-lg">👤</div>
        <span className="text-xs">Profil</span>
      </button>
    </div>
  </nav>
)

function UserApp() {
  // DEBUG INFO
  React.useEffect(() => {
    console.log('🔍 UserApp mounted!')
    console.log('🔍 Location:', window.location.href)
    console.log('🔍 User agent:', navigator.userAgent)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <main className="pb-20">
        <Routes>
          <Route path="/" element={<Navigate to="/my-day" replace />} />
          <Route 
            path="/my-day" 
            element={<TestPage title="Můj den" emoji="🌅" />} 
          />
          <Route 
            path="/overview" 
            element={<TestPage title="Přehled" emoji="📊" />} 
          />
          <Route 
            path="/chat" 
            element={<TestPage title="Chat" emoji="💬" />} 
          />
          <Route 
            path="/profile" 
            element={<TestPage title="Profil" emoji="👤" />} 
          />
          <Route path="*" element={<Navigate to="/my-day" replace />} />
        </Routes>
      </main>
      
      <SimpleBottomNav />
    </div>
  )
}

export default UserApp