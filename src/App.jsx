// src/App.jsx
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

function AppContent() {
  const { user, userRole } = useAuth()

  // Veřejné (nepřihlášené) routy
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

  // Admin panel
  if (userRole === 'admin') {
    return (
      <AdminLayout>
        <AdminRoutes />
      </AdminLayout>
    )
  }

  // Aplikace pro běžného uživatele
  return <UserApp />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App