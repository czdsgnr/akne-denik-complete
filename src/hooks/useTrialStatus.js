import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './useAuth'

export function useTrialStatus() {
  const { user, userRole } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trialStatus, setTrialStatus] = useState({
    isTrialActive: true,
    isTrialExpired: false,
    remainingDays: 3,
    totalDays: 3,
    hasExtended: false,
    canExtend: false,
    isBlocked: false
  })

  // 🔄 NAČÍTÁNÍ DAT UŽIVATELE
  const loadUserData = async () => {
    if (!user || userRole === 'admin') {
      setLoading(false)
      return null
    }
    
    try {
      console.log('🔍 Načítám user data pro:', user.uid)
      
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        console.log('📊 User data načtena:', {
          createdAt: data.createdAt?.toDate?.()?.toISOString(),
          trialExtendedDays: data.trialExtendedDays,
          trialExtendedAt: data.trialExtendedAt?.toDate?.()?.toISOString()
        })
        
        setUserData(data)
        
        // Výpočet trial statusu
        const status = calculateTrialStatus(data)
        setTrialStatus(status)
        
        return data
      } else {
        console.warn('⚠️ User document neexistuje pro:', user.uid)
        return null
      }
    } catch (error) {
      console.error('❌ Chyba při načítání trial statusu:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // 🧮 VÝPOČET TRIAL STATUSU
  const calculateTrialStatus = (userData) => {
    if (!userData?.createdAt) {
      console.log('⚠️ Chybí createdAt, defaultní trial status')
      return {
        isTrialActive: true,
        isTrialExpired: false,
        remainingDays: 3,
        totalDays: 3,
        hasExtended: false,
        canExtend: false,
        isBlocked: false
      }
    }

    // Datum registrace
    const registrationDate = userData.createdAt.toDate ? 
      userData.createdAt.toDate() : 
      new Date(userData.createdAt)
    
    // Aktuální datum
    const today = new Date()
    
    // Dny od registrace
    const msPerDay = 24 * 60 * 60 * 1000
    const daysSinceRegistration = Math.floor(
      (today.getTime() - registrationDate.getTime()) / msPerDay
    )
    
    // 🔧 OPRAVENÁ LOGIKA PRO EXTENDED DAYS
    const extendedDays = userData.trialExtendedDays || 0
    const hasExtended = extendedDays > 0  // 🔧 Jednoduchá kontrola
    
    // Celková délka trialu (3 dny + prodloužené dny)
    const totalTrialDays = 3 + extendedDays
    
    // Zbývající dny
    const remainingDays = Math.max(0, totalTrialDays - daysSinceRegistration)
    
    // 🔧 OPRAVENÁ STATUS LOGIKA
    const isTrialActive = remainingDays > 0
    const isTrialExpired = remainingDays <= 0  // 🔧 <= místo === (HLAVNÍ FIX!)
    const canExtend = !hasExtended && isTrialExpired
    const isBlocked = isTrialExpired && !canExtend
    
    console.log('🔍 Trial Status Calculation:', {
      registrationDate: registrationDate.toISOString(),
      today: today.toISOString(),
      daysSinceRegistration,
      extendedDays,
      totalTrialDays,
      remainingDays,
      isTrialActive,
      isTrialExpired,
      hasExtended,
      canExtend,
      isBlocked,
      // 🆕 Extra debug info
      userData_trialExtendedDays: userData.trialExtendedDays,
      userData_trialExtendedAt: userData.trialExtendedAt?.toDate?.()?.toISOString(),
      // 🆕 Math debug
      timeDifferenceMs: today.getTime() - registrationDate.getTime(),
      msPerDay,
      rawDaysDifference: (today.getTime() - registrationDate.getTime()) / msPerDay
    })

    return {
      isTrialActive,
      isTrialExpired,
      remainingDays,
      totalDays: totalTrialDays,
      hasExtended,
      canExtend,
      isBlocked,
      daysSinceRegistration
    }
  }

  // 🚀 INITIAL LOAD
  useEffect(() => {
    loadUserData()
  }, [user, userRole])

  // 🔄 FUNKCE PRO REFRESH STATUSU (po prodloužení)
  const refreshTrialStatus = async () => {
    if (!user || userRole === 'admin') {
      console.log('⏭️ Skipping refresh - admin nebo žádný user')
      return
    }
    
    try {
      console.log('🔄 Refreshing trial status...')
      setLoading(true)
      
      // Znovu načíst data z Firebase
      const freshUserData = await loadUserData()
      
      if (freshUserData) {
        console.log('✅ Trial status refreshed successfully')
      }
      
    } catch (error) {
      console.error('❌ Chyba při refresh trial statusu:', error)
    }
  }

  // 🚫 FUNKCE PRO KONTROLU ZOBRAZENÍ MODALU
  const shouldShowTrialModal = () => {
    // Admin nikdy neblokovat
    if (userRole === 'admin') {
      console.log('⏭️ Admin - skipping modal')
      return false
    }
    
    // 🔧 OPRAVENÁ LOGIKA: Zobrazit modal pokud je trial expired
    // (nezáleží na tom jestli může nebo nemůže prodloužit)
    const shouldShow = trialStatus.isTrialExpired
    console.log('🤔 Should show modal?', {
      isTrialExpired: trialStatus.isTrialExpired,
      canExtend: trialStatus.canExtend,
      hasExtended: trialStatus.hasExtended,
      shouldShow
    })
    
    return shouldShow
  }

  // ✅ FUNKCE PRO KONTROLU DOSTUPNOSTI FUNKCÍ
  const isFeatureAvailable = (feature = 'basic') => {
    // Admin má vždy vše dostupné
    if (userRole === 'admin') return true
    
    // Během trialu jsou všechny funkce dostupné
    if (trialStatus.isTrialActive) return true
    
    // Po skončení trialu nejsou funkce dostupné
    return false
  }

  return {
    userData,
    trialStatus,
    loading,
    shouldShowTrialModal,
    isFeatureAvailable,
    refreshTrialStatus,
    // 🆕 Pro debugging
    loadUserData
  }
}