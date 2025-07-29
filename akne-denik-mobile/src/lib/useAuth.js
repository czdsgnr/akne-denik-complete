// ================================================================
// src/hooks/useAuth.js
// 🔐 AKTUALIZOVANÝ AUTH HOOK pro onboarding data
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { signUpWithEmail, signInWithEmail, signOutUser } from '../lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          await loadUserProfile(firebaseUser.uid);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  // Načtení profilu uživatele
  const loadUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    } catch (error) {
      console.error('Load user profile error:', error);
    }
  };

  // Registrace s onboarding daty
  const registerWithOnboarding = async (email, password, onboardingData) => {
    try {
      setLoading(true);
      
      // Vytvoření Firebase uživatele
      const firebaseUser = await signUpWithEmail(email, password);
      
      // Uložení onboarding dat do Firestore
      const userProfileData = {
        email: email.toLowerCase(),
        
        // Onboarding data
        gender: onboardingData.gender,
        age: onboardingData.age,
        skinType: onboardingData.skinType,
        skinSensitivity: onboardingData.skinSensitivity,
        concerns: onboardingData.concerns || [],
        skinPhototype: onboardingData.skinPhototype,
        experience: onboardingData.experience,
        goals: onboardingData.goals || [],
        
        // Systémové údaje
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        onboardingCompleted: true,
        
        // Program údaje
        currentDay: 1,
        registrationDate: new Date(),
        completedDays: [],
        totalDays: 365,
        
        // Statistiky
        totalPhotos: 0,
        totalLogs: 0,
        averageMood: 0,
        averageSkinRating: 0,
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userProfileData);
      
      return firebaseUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Standardní přihlášení
  const login = async (email, password) => {
    try {
      setLoading(true);
      const firebaseUser = await signInWithEmail(email, password);
      
      // Update last login
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        lastLogin: new Date(),
      });
      
      return firebaseUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Odhlášení
  const logout = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Aktualizace profilu
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: new Date(),
      });
      
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // Výpočet aktuálního dne
  const getCurrentDay = () => {
    if (!userProfile?.registrationDate) return 1;
    
    const registrationDate = userProfile.registrationDate.toDate();
    const today = new Date();
    const diffTime = Math.abs(today - registrationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.min(diffDays, 365);
  };

  const value = {
    // State
    user,
    userProfile,
    loading,
    initializing,
    
    // Actions
    login,
    registerWithOnboarding,
    logout,
    updateProfile,
    
    // Helpers
    getCurrentDay,
    isLoggedIn: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};