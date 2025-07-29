import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import BottomNavigation from '../components/ui/BottomNavigation'
import MyDayPage from '../components/user/MyDayPage'
import OverviewPage from '../components/user/OverviewPage'  
import ChatPage from '../components/user/ChatPage'
import PhotoGalleryPage from '../components/user/PhotoGalleryPage'
import ProfilePage from '../components/user/ProfilePage'
import DailyTaskPage from '../components/user/DailyTaskPage'
import SubscriptionPage from '../components/user/SubscriptionPage'
import TrialExpiredBottomSheet from '../components/ui/TrialExpiredBottomSheet'
import { useTrialStatus } from '../hooks/useTrialStatus'
import { Loader2, Lock } from 'lucide-react'

function UserApp() {
  const location = useLocation()
  const navigate = useNavigate()
  const { 
    userData, 
    trialStatus, 
    loading: trialLoading, 
    shouldShowTrialModal,
    isFeatureAvailable,
    refreshTrialStatus 
  } = useTrialStatus()
  
  const [showTrialModal, setShowTrialModal] = useState(false)
  const [hasShownModal, setHasShownModal] = useState(false)

  // 🚨 KRITICKÁ LOGIKA: Zobrazení modalu při načtení
  useEffect(() => {
    if (trialLoading) return
    
    console.log('🔍 Checking modal display:', {
      shouldShow: shouldShowTrialModal(),
      hasShownModal,
      trialStatus,
      // 🆕 Force debug
      remainingDays: trialStatus.remainingDays,
      isTrialExpired: trialStatus.isTrialExpired
    })
    
    // 🔧 DOČASNÝ FIX: Zobrazit modal pokud remainingDays <= 0
    const forceShowModal = trialStatus.remainingDays <= 0 && !hasShownModal
    
    if ((shouldShowTrialModal() || forceShowModal) && !hasShownModal) {
      // Malé zpoždění aby se stránka stihla načíst
      const timer = setTimeout(() => {
        console.log('📱 Showing trial modal (force:', forceShowModal, ')')
        setShowTrialModal(true)
        setHasShownModal(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [trialLoading, shouldShowTrialModal, hasShownModal, trialStatus])

  // 🔄 Reset hasShownModal při změně trial statusu
  useEffect(() => {
    if (trialStatus.isTrialActive) {
      console.log('✅ Trial is active - resetting modal state')
      setHasShownModal(false)
      setShowTrialModal(false)
    }
  }, [trialStatus.isTrialActive])

  // 🚫 BLOKOVÁNÍ STRÁNEK po skončení trialu
  const BlockedContent = ({ children }) => {
    const currentPath = location.pathname
    
    console.log('🔒 Checking content blocking:', {
      path: currentPath,
      isFeatureAvailable: isFeatureAvailable(),
      showTrialModal,
      trialStatus
    })
    
    // 🆕 POVOLIT NAVIGACI pokud je modal otevřený (uživatel může přejít na subscription/profil)
    if (showTrialModal) {
      return children
    }
    
    // Vždy povolit subscription stránku
    if (currentPath === '/subscription') {
      return children
    }
    
    // Vždy povolit profil
    if (currentPath === '/profile') {
      return children
    }
    
    // Pokud je funkce dostupná, zobraz normální obsah
    if (isFeatureAvailable()) {
      return children
    }
    
    // Jinak zobraz blocked stránku s tlačítkem pro modal
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Trial skončil
          </h2>
          
          <p className="text-gray-600 mb-6">
            Tvůj trial vypršel. Pro pokračování si vyber předplatné{trialStatus.canExtend ? ' nebo si trial prodluž o 1 den' : ''}.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowTrialModal(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
            >
              Zobrazit možnosti
            </button>
            
            <button
              onClick={() => navigate('/subscription')}
              className="w-full border-2 border-orange-300 text-orange-700 hover:bg-orange-50 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
            >
              Přejít na předplatné
            </button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            Nebo přejdi na <button onClick={() => navigate('/profile')} className="underline">profil</button> pro více informací
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (trialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Kontrolujem trial status...</p>
        </div>
      </div>
    )
  }

  // 🔄 FUNKCE PRO ZAVŘENÍ MODALU
  const handleModalClose = () => {
    console.log('❌ Closing trial modal')
    setShowTrialModal(false)
    // Modal se již automaticky nezobrazuje po čase - lepší UX
    // Uživatel si může otevřít modal z blocked page nebo profilu
  }

  // 🔄 FUNKCE PRO REFRESH PO PRODLOUŽENÍ
  const handleTrialExtended = async () => {
    console.log('🔄 Trial was extended, refreshing status...')
    await refreshTrialStatus()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hlavní obsah */}
      <main className="pb-20"> {/* Padding bottom pro bottom bar */}
        <BlockedContent>
          <Routes>
            <Route path="/" element={<Navigate to="/my-day" replace />} />
            <Route path="/my-day" element={<MyDayPage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/photos" element={<PhotoGalleryPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/day/:dayNumber" element={<DailyTaskPage />} />
            <Route path="*" element={<Navigate to="/my-day" replace />} />
          </Routes>
        </BlockedContent>
      </main>

      {/* Bottom Navigation - skrytá na subscription stránce a při blocked content */}
      <Routes>
        <Route path="/subscription" element={null} />
        <Route path="*" element={
          isFeatureAvailable() ? <BottomNavigation /> : null
        } />
      </Routes>
      
      {/* 🚨 TRIAL EXPIRED MODAL */}
      <TrialExpiredBottomSheet
        isOpen={showTrialModal}
        onClose={handleModalClose}
        userData={userData}
        onTrialExtended={handleTrialExtended}
      />
      
      {/* 🎯 DEBUG INFO - pouze v development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 right-0 bg-black/80 text-white p-2 text-xs z-50 max-w-xs">
          <div className="space-y-1">
            <div>Trial: {trialStatus.isTrialActive ? '✅' : '❌'}</div>
            <div>Expired: {trialStatus.isTrialExpired ? '🚫' : '✅'}</div>
            <div>Remaining: {trialStatus.remainingDays}d</div>
            <div>Extended: {trialStatus.hasExtended ? '✅' : '❌'}</div>
            <div>Can Extend: {trialStatus.canExtend ? '✅' : '❌'}</div>
            <div>Show Modal: {shouldShowTrialModal() ? '🚫' : '✅'}</div>
            <div>Modal Open: {showTrialModal ? '📱' : '❌'}</div>
            <div>extendedDays: {userData?.trialExtendedDays || 0}</div>
            {/* 🆕 Emergency button */}
            <button 
              onClick={() => setShowTrialModal(true)}
              className="w-full bg-red-600 text-white px-2 py-1 rounded text-xs mt-2"
            >
              🚨 Force Modal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserApp