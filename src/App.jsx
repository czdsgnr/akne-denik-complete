import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserApp from './pages/UserApp'
import AdminLayout from './components/admin/AdminLayout'
import AdminRoutes from './components/admin/AdminRoutes'
import DemoAdminPanel from './components/admin/DemoAdminPanel'

// 🗑️ PWA IMPORTS ODSTRANĚNY
// import { pwaNotifications } from './lib/pwaNotifications'
// import PWAInstallPrompt from './components/PWAInstallPrompt'
// import PWAStatusBadge from './components/PWAStatusBadge'

function AppContent() {
  const { user, userRole, loading } = useAuth()

  // 🗑️ PWA INICIALIZACE ODSTRANĚNA
  // useEffect(() => { ... }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Načítání...</p>
        </div>
      </div>
    )
  }

  // Pokud není přihlášen, zobraz landing page, login nebo register
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/demo-admin" element={<DemoAdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // Pokud je admin, zobraz admin panel
  if (userRole === 'admin') {
    return (
      <AdminLayout>
        <AdminRoutes />
      </AdminLayout>
    )
  }

  // Pokud je běžný uživatel, zobraz hlavní aplikaci
  return <UserApp />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        
        {/* 🗑️ PWA komponenty odstraněny */}
        {/* <PWAInstallPrompt /> */}
        {/* <PWAStatusBadge /> */}
      </Router>
    </AuthProvider>
  )
}

export default App