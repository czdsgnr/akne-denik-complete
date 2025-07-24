import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import BottomNavigation from '../components/ui/BottomNavigation'
import MyDayPage from '../components/user/MyDayPage'
import OverviewPage from '../components/user/OverviewPage'  
import ChatPage from '../components/user/ChatPage'
import PhotoGalleryPage from '../components/user/PhotoGalleryPage'
import ProfilePage from '../components/user/ProfilePage'
import DailyTaskPage from '../components/user/DailyTaskPage'

function UserApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hlavní obsah */}
      <main className="pb-20"> {/* Padding bottom pro bottom bar */}
        <Routes>
          <Route path="/" element={<Navigate to="/my-day" replace />} />
          <Route path="/my-day" element={<MyDayPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/day/:dayNumber" element={<DailyTaskPage />} />
          <Route path="*" element={<Navigate to="/my-day" replace />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

export default UserApp