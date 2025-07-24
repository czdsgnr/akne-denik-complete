import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        // Rozpoznání role podle emailu
        const isAdmin = user.email?.endsWith('@aknedenik.cz') || user.email?.endsWith('@akne-online.cz')
        setUserRole(isAdmin ? 'admin' : 'user')
      } else {
        setUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      throw new Error('Chyba při přihlašování: ' + error.message)
    }
  }

  const register = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Uložení dodatečných dat uživatele
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        ...userData,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        currentDay: 1,
        completedDays: [],
        totalDays: 365
      })
      
      return userCredential.user
    } catch (error) {
      throw new Error('Chyba při registraci: ' + error.message)
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}