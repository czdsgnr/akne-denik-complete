// src/hooks/useAuth.js - KOMPLETNÍ s getCurrentDay
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  updateDoc 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { calculateCurrentDay } from '../lib/utils';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    console.log('🔐 Setting up auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Auth state changed:', user?.email || 'No user');
      setLoading(true);
      
      if (user) {
        setUser(user);
        
        // Určení role podle emailu
        const isAdmin = user.email?.endsWith('@aknedenik.cz') || 
                       user.email?.endsWith('@akne-online.cz');
        setUserRole(isAdmin ? 'admin' : 'user');
        
        // Načtení uživatelského profilu z Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserProfile(userData);
            console.log('👤 User profile loaded:', userData.name || 'Unnamed user');
          } else {
            console.log('👤 User profile not found in Firestore');
            // Vytvoření základního profilu pokud neexistuje
            const basicProfile = {
              uid: user.uid,
              email: user.email,
              name: user.email.split('@')[0],
              createdAt: serverTimestamp(),
              registrationDate: new Date().toISOString(),
              currentDay: 1,
              completedDays: [],
              totalDays: 365,
              isAdmin: isAdmin,
              settings: {
                notifications: true,
                dailyReminders: true,
                weeklyReports: true,
                emailUpdates: false,
              }
            };
            
            await setDoc(doc(db, 'users', user.uid), basicProfile);
            setUserProfile(basicProfile);
          }
        } catch (error) {
          console.error('❌ Error loading user profile:', error);
          // Fallback profile pro offline režim
          setUserProfile({
            uid: user.uid,
            email: user.email,
            name: user.email.split('@')[0],
            registrationDate: new Date().toISOString(),
            currentDay: 1,
            completedDays: [],
          });
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔑 Attempting login for:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Aktualizace posledního přihlášení
      try {
        await updateDoc(doc(db, 'users', userCredential.user.uid), {
          lastLogin: serverTimestamp(),
        });
      } catch (updateError) {
        console.log('Note: Could not update lastLogin');
      }
      
      console.log('✅ Login successful');
      return { user: userCredential.user, error: null };
      
    } catch (error) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Chyba při přihlašování';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Uživatel s tímto emailem neexistuje';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Nesprávné heslo';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Neplatný email';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Příliš mnoho pokusů. Zkuste to později';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Nesprávné přihlašovací údaje';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Chyba sítě. Zkontrolujte internetové připojení';
          break;
        default:
          errorMessage = error.message || 'Neznámá chyba';
      }
      
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, profileData = {}) => {
    try {
      setLoading(true);
      console.log('📝 Attempting registration for:', email);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Vytvoření uživatelského profilu v Firestore
      const userProfileData = {
        uid: user.uid,
        email: user.email.toLowerCase(),
        name: profileData.name || user.email.split('@')[0],
        age: profileData.age || null,
        skinType: profileData.skinType || null,
        acneType: profileData.acneType || null,
        goals: profileData.goals || [],
        
        // Systémové údaje
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        registrationDate: new Date().toISOString(),
        isActive: true,
        
        // Program údaje
        currentDay: 1,
        completedDays: [],
        totalDays: 365,
        
        // Role
        isAdmin: user.email?.endsWith('@aknedenik.cz') || 
                user.email?.endsWith('@akne-online.cz'),
        
        // Statistiky
        totalPhotos: 0,
        totalLogs: 0,
        averageMood: 0,
        averageSkinRating: 0,
        
        // Nastavení
        settings: {
          notifications: true,
          dailyReminders: true,
          weeklyReports: true,
          emailUpdates: false,
        }
      };

      await setDoc(doc(db, 'users', user.uid), userProfileData);
      setUserProfile(userProfileData);

      console.log('✅ Registration successful');
      return { user, error: null };
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      let errorMessage = 'Chyba při registraci';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email je již používán jiným účtem';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Neplatný formát emailu';
          break;
        case 'auth/weak-password':
          errorMessage = 'Heslo je příliš slabé (minimálně 6 znaků)';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Chyba sítě. Zkontrolujte internetové připojení';
          break;
        default:
          errorMessage = error.message || 'Neznámá chyba';
      }
      
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log('🚪 Logging out user');
      
      await signOut(auth);
      
      console.log('✅ Logout successful');
      return { error: null };
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      setUserProfile(prev => ({ ...prev, ...updates }));
      return { error: null };
      
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      return { error: error.message };
    }
  };

  // Helper funkce pro získání aktuálního dne
  const getCurrentDay = () => {
    if (!userProfile?.registrationDate) return 1;
    
    try {
      return calculateCurrentDay(userProfile.registrationDate);
    } catch (error) {
      console.error('Error calculating current day:', error);
      return 1;
    }
  };

  const value = {
    // State
    user,
    userProfile,
    userRole,
    loading,
    
    // Actions
    login,
    register,
    logout,
    updateUserProfile,
    
    // Helpers
    getCurrentDay,
    isAdmin: userRole === 'admin',
    isUser: userRole === 'user',
    isLoggedIn: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;