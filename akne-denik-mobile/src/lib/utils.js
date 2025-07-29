// ===============================================
// src/lib/utils.js - Utility funkce
// ===============================================

// Výpočet aktuálního dne od registrace
export const calculateCurrentDay = (registrationDate) => {
  if (!registrationDate) return 1;
  
  try {
    const today = new Date();
    const regDate = new Date(registrationDate);
    const diffTime = today.getTime() - regDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Den 1 = registrační den, maximum 365
    return Math.min(Math.max(1, diffDays + 1), 365);
  } catch (error) {
    console.error('Error calculating current day:', error);
    return 1;
  }
};

// Format date pro zobrazení
export const formatDate = (date) => {
  if (!date) return '';
  
  try {
    return new Date(date).toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    return '';
  }
};

// Format času
export const formatTime = (date) => {
  if (!date) return '';
  
  try {
    return new Date(date).toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return '';
  }
};

// Validace emailu
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generování ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// ===============================================
// src/utils/firebaseDataUtils.js - Firebase utility
// ===============================================

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Načtení denního obsahu
export const getDailyContent = async (day) => {
  try {
    // Pokus o načtení z Firebase
    const contentDoc = await getDoc(doc(db, 'dailyContent', `day-${day}`));
    
    if (contentDoc.exists()) {
      return contentDoc.data();
    } else {
      // Fallback - výchozí obsah
      return generateDefaultContent(day);
    }
  } catch (error) {
    console.log('Firebase not available, using default content');
    return generateDefaultContent(day);
  }
};

// Generování výchozího obsahu pokud Firebase není dostupný
const generateDefaultContent = (day) => {
  const motivations = [
    "Každý den je nová příležitost! 💖",
    "Jsi úžasná a tvoje pleť to ví! ✨",
    "Malé kroky vedou k velkým změnám! 🌟",
    "Dnes je tvůj den pro krásnou pleť! 💕",
    "Pokračuj dál, jsi na správné cestě! 🎯",
  ];
  
  const tasks = [
    "Vyčisti si pleť jemným čisticím přípravkem",
    "Nezapomeň na hydrataci - jak pleť, tak celé tělo",
    "Věnuj si pár minut relaxace a hlubokého dýchání",
    "Zkontroluj, zda používáš správné produkty pro svůj typ pleti",
    "Dnes se zaměř na zdravou stravu a dostatek vody",
  ];
  
  const motivationIndex = (day - 1) % motivations.length;
  const taskIndex = (day - 1) % tasks.length;
  
  return {
    day,
    motivation: `Den ${day} - ${motivations[motivationIndex]}`,
    task: `🎯 DEN ${day}\n\n📌 DNEŠNÍ ÚKOL:\n${tasks[taskIndex]}`,
    isPhotoDay: day === 1 || day % 7 === 1, // První den a každý týden
    isDualPhotoDay: false,
  };
};

// Uložení denního záznamu
export const saveDailyLog = async (userId, dayData) => {
  try {
    // Tady by byla logika pro uložení do Firebase
    console.log('Saving daily log:', { userId, dayData });
    return { success: true };
  } catch (error) {
    console.error('Error saving daily log:', error);
    return { success: false, error: error.message };
  }
};

// Načtení statistik uživatele
export const getUserStats = async (userId) => {
  try {
    // Tady by byla logika pro načtení statistik z Firebase
    return {
      totalLogs: 0,
      averageMood: 0,
      averageSkinRating: 0,
      totalPhotos: 0,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
};