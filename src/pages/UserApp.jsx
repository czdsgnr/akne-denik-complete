import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// 🛡️ BEZPEČNÉ IMPORTY S ERROR HANDLING
let BottomNavigation = null
let MyDayPage = null
let OverviewPage = null
let ChatPage = null
let ProfilePage = null
let DailyTaskPage = null

// Zkus importovat komponenty a zachyť chyby
try {
  const BottomNavigationModule = await import('../components/ui/BottomNavigation')
  BottomNavigation = BottomNavigationModule.default
} catch (error) {
  console.error('❌ Chyba při importu BottomNavigation:', error)
}

try {
  const MyDayPageModule = await import('../components/user/MyDayPage')
  MyDayPage = MyDayPageModule.default
} catch (error) {
  console.error('❌ Chyba při importu MyDayPage:', error)
}

try {
  const OverviewPageModule = await import('../components/user/OverviewPage')
  OverviewPage = OverviewPageModule.default
} catch (error) {
  console.error('❌ Chyba při importu OverviewPage:', error)
}

try {
  const ChatPageModule = await import('../components/user/ChatPage')
  ChatPage = ChatPageModule.default
} catch (error) {
  console.error('❌ Chyba při importu ChatPage:', error)
}

try {
  const ProfilePageModule = await import('../components/user/ProfilePage')
  ProfilePage = ProfilePageModule.default
} catch (error) {
  console.error('❌ Chyba při importu ProfilePage:', error)
}

try {
  const DailyTaskPageModule = await import('../components/user/DailyTaskPage')
  DailyTaskPage = DailyTaskPageModule.default
} catch (error) {
  console.error('❌ Chyba při importu DailyTaskPage:', error)
}

// 🔥 FALLBACK KOMPONENTY PRO CHYBĚJÍCÍ SOUBORY
const FallbackComponent = ({ componentName, error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Komponenta {componentName} není dostupná
      </h2>
      <p className="text-gray-600 mb-4">
        Soubor pravděpodobně neexistuje nebo obsahuje chybu.
      </p>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-700 font-mono">
            {error.toString()}
          </p>
        </div>
      )}
      <button 
        onClick={() => window.location.reload()}
        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium"
      >
        Zkusit znovu
      </button>
    </div>
  </div>
)

const LoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Načítání aplikace...</p>
    </div>
  </div>
)

// 🔧 ERROR BOUNDARY KOMPONENTA
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ React Error Boundary zachytila chybu:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-4">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💥</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Aplikace narazila na chybu
              </h2>
              <p className="text-gray-600">
                Něco se pokazilo při vykreslování komponenty.
              </p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-red-900 mb-2">Chyba:</h3>
              <pre className="text-sm text-red-700 whitespace-pre-wrap">
                {this.state.error && this.state.error.toString()}
              </pre>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">Stack trace:</h3>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Znovu načíst stránku
              </button>
              <button 
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null })
                }}
                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-medium"
              >
                Zkusit znovu
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function UserApp() {
  const [componentsLoaded, setComponentsLoaded] = useState(false)
  const [loadingError, setLoadingError] = useState(null)

  useEffect(() => {
    // Kontrola, že všechny komponenty jsou načtené
    const checkComponents = () => {
      const missingComponents = []
      
      if (!BottomNavigation) missingComponents.push('BottomNavigation')
      if (!MyDayPage) missingComponents.push('MyDayPage')
      if (!OverviewPage) missingComponents.push('OverviewPage')
      if (!ChatPage) missingComponents.push('ChatPage')
      if (!ProfilePage) missingComponents.push('ProfilePage')
      if (!DailyTaskPage) missingComponents.push('DailyTaskPage')

      if (missingComponents.length > 0) {
        setLoadingError(`Chybějící komponenty: ${missingComponents.join(', ')}`)
        console.error('❌ Chybějící komponenty:', missingComponents)
      } else {
        setComponentsLoaded(true)
      }
    }

    // Dej komponentám čas na načtení
    setTimeout(checkComponents, 1000)
  }, [])

  // Loading state
  if (!componentsLoaded && !loadingError) {
    return <LoadingComponent />
  }

  // Error state
  if (loadingError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Chyba při načítání komponent
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700">
              {loadingError}
            </p>
          </div>
          <p className="text-gray-600 mb-4">
            Zkontroluj, že všechny soubory komponent existují v správných složkách.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            Znovu načíst
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        {/* Hlavní obsah */}
        <main className="pb-20"> {/* Padding bottom pro bottom bar */}
          <Routes>
            <Route path="/" element={<Navigate to="/my-day" replace />} />
            <Route 
              path="/my-day" 
              element={
                MyDayPage ? 
                  <MyDayPage /> : 
                  <FallbackComponent componentName="MyDayPage" />
              } 
            />
            <Route 
              path="/overview" 
              element={
                OverviewPage ? 
                  <OverviewPage /> : 
                  <FallbackComponent componentName="OverviewPage" />
              } 
            />
            <Route 
              path="/chat" 
              element={
                ChatPage ? 
                  <ChatPage /> : 
                  <FallbackComponent componentName="ChatPage" />
              } 
            />
            <Route 
              path="/profile" 
              element={
                ProfilePage ? 
                  <ProfilePage /> : 
                  <FallbackComponent componentName="ProfilePage" />
              } 
            />
            <Route 
              path="/day/:dayNumber" 
              element={
                DailyTaskPage ? 
                  <DailyTaskPage /> : 
                  <FallbackComponent componentName="DailyTaskPage" />
              } 
            />
            <Route path="*" element={<Navigate to="/my-day" replace />} />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        {BottomNavigation ? (
          <BottomNavigation />
        ) : (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 text-center">
            <p className="text-red-600 font-medium">BottomNavigation komponenta není dostupná</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default UserApp