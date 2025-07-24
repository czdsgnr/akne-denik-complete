import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './DashboardPage'
import UsersPage from './UserPage'  // ← opravený název souboru
import ContentPage from './ContentPage'
import ProductsPage from './ProductPage'  // ← opravený název souboru
import MessagesPage from './MessagePage'  // ← opravený název souboru

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<DashboardPage />} />
      <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="/admin/users" element={<UsersPage />} />
      <Route path="/admin/content" element={<ContentPage />} />
      <Route path="/admin/products" element={<ProductsPage />} />
      <Route path="/admin/messages" element={<MessagesPage />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export default AdminRoutes