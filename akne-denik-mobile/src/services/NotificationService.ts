// services/NotificationService.ts - Push notifikace pro React Native
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Konfigurace notifikací
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  screen?: string;
  day?: number;
  type?: 'daily_reminder' | 'photo_reminder' | 'achievement' | 'custom';
  [key: string]: any;
}

export class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;
  private isInitialized = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // 🚀 Inicializace notifikačního systému
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      console.log('🔔 Inicializuji notifikační systém...');

      // Registrace push token
      const token = await this.registerForPushNotifications();
      if (token) {
        this.expoPushToken = token;
        console.log('✅ Push token získán:', token);
      }

      // Nastavení Android kanálů
      if (Platform.OS === 'android') {
        await this.setupAndroidChannels();
      }

      // Event listenery
      this.setupNotificationListeners();

      this.isInitialized = true;
      return true;

    } catch (error) {
      console.error('❌ Chyba při inicializaci notifikací:', error);
      return false;
    }
  }

  // 📱 Registrace pro push notifikace
  private async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn('🚫 Push notifikace fungují pouze na fyzických zařízeních');
      return null;
    }

    try {
      // Kontrola existujících oprávnění
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Požádání o oprávnění pokud není uděleno
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('🚫 Notifikace nebyly povoleny');
        return null;
      }

      // Získání Expo push token
      let token;
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        
        token = (await Notifications.getExpoPushTokenAsync({
          projectId,
        })).data;
      } catch (error) {
        console.error('Chyba při získávání push token:', error);
        // Fallback pro development
        token = `ExponentPushToken[DEVELOPMENT-${Date.now()}]`;
      }

      console.log('📱 Push token:', token);
      return token;

    } catch (error) {
      console.error('❌ Chyba při registraci push notifikací:', error);
      return null;
    }
  }

  // 🤖 Nastavení Android kanálů
  private async setupAndroidChannels(): Promise<void> {
    await Notifications.setNotificationChannelAsync('daily-reminders', {
      name: 'Denní připomenutí',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#ec4899',
      sound: 'default',
      description: 'Připomenutí denních úkolů a rutiny',
    });

    await Notifications.setNotificationChannelAsync('photo-reminders', {
      name: 'Fotografické dny',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#8b5cf6',
      sound: 'default',
      description: 'Připomenutí fotografických dnů',
    });

    await Notifications.setNotificationChannelAsync('achievements', {
      name: 'Úspěchy',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 200, 100, 200, 100, 200],
      lightColor: '#10b981',
      sound: 'default',
      description: 'Oznámení o dosažených úspěších',
    });
  }

  // 👂 Event listenery pro notifikace
  private setupNotificationListeners(): void {
    // Notifikace přijata když je app v popředí
    Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notifikace přijata:', notification);
    });

    // Notifikace kliknuta
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notifikace kliknuta:', response);
      this.handleNotificationPress(response.notification.request.content.data);
    });
  }

  // 🎯 Handling kliknutí na notifikaci
  private handleNotificationPress(data: NotificationData): void {
    console.log('🎯 Handling notification press:', data);
    
    // Zde můžeš implementovat navigaci na specifické obrazovky
    // Například pomocí React Navigation:
    /*
    if (data.screen === 'MyDay') {
      NavigationService.navigate('MyDay');
    } else if (data.screen === 'Photos' && data.day) {
      NavigationService.navigate('Photos', { day: data.day });
    }
    */
  }

  // 💾 Uložení push token do Firebase
  async savePushTokenToFirebase(userId: string): Promise<void> {
    if (!this.expoPushToken) return;

    try {
      await setDoc(doc(db, 'userTokens', userId), {
        pushToken: this.expoPushToken,
        platform: Platform.OS,
        deviceId: Constants.deviceId || 'unknown',
        appVersion: Constants.expoConfig?.version || '1.0.0',
        updatedAt: serverTimestamp(),
      }, { merge: true });

      console.log('✅ Push token uložen do Firebase');
    } catch (error) {
      console.error('❌ Chyba při ukládání push token:', error);
    }
  }

  // ⏰ Naplánování denního připomenutí
  async scheduleDailyReminder(hour: number = 9, minute: number = 0): Promise<void> {
    try {
      // Zruš všechna existující denní připomenutí
      await this.cancelScheduledNotification('daily-reminder');

      const trigger = {
        hour,
        minute,
        repeats: true,
      };

      await Notifications.scheduleNotificationAsync({
        identifier: 'daily-reminder',
        content: {
          title: 'Akné Deník 💖',
          body: 'Nezapomeň na dnešní úkol a záznam!',
          data: { 
            type: 'daily_reminder',
            screen: 'MyDay'
          },
          sound: 'default',
          categoryIdentifier: 'daily',
        },
        trigger,
      });

      // Uložení do AsyncStorage pro persistenci
      await AsyncStorage.setItem('@dailyReminderTime', JSON.stringify({ hour, minute }));
      
      console.log(`✅ Denní připomenutí nastaveno na ${hour}:${minute.toString().padStart(2, '0')}`);

    } catch (error) {
      console.error('❌ Chyba při plánování denního připomenutí:', error);
    }
  }

  // 📸 Naplánování připomenutí pro fotografický den
  async schedulePhotoReminder(day: number, date: Date): Promise<void> {
    try {
      const identifier = `photo-reminder-${day}`;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: 'Fotografický den! 📸',
          body: `Den ${day} - čas pořídit fotku pokroku!`,
          data: { 
            type: 'photo_reminder',
            screen: 'Photos',
            day 
          },
          sound: 'default',
          categoryIdentifier: 'photo',
        },
        trigger: {
          date,
        },
      });

      console.log(`✅ Foto připomenutí naplánováno pro den ${day}`);

    } catch (error) {
      console.error('❌ Chyba při plánování foto připomenutí:', error);
    }
  }

  // 🏆 Odeslání notifikace o úspěchu
  async sendAchievementNotification(title: string, body: string, data?: NotificationData): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🏆 ${title}`,
          body,
          data: { 
            type: 'achievement',
            ...data 
          },
          sound: 'default',
          categoryIdentifier: 'achievements',
        },
        trigger: null, // Okamžitě
      });

      console.log('✅ Achievement notifikace odeslána');

    } catch (error) {
      console.error('❌ Chyba při odesílání achievement notifikace:', error);
    }
  }

  // 📬 Okamžitá notifikace
  async sendInstantNotification(title: string, body: string, data?: NotificationData): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: 'default',
        },
        trigger: null,
      });

      console.log('✅ Okamžitá notifikace odeslána');

    } catch (error) {
      console.error('❌ Chyba při odesílání okamžité notifikace:', error);
    }
  }

  // ❌ Zrušení naplánované notifikace
  async cancelScheduledNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log(`✅ Notifikace ${identifier} zrušena`);
    } catch (error) {
      console.error(`❌ Chyba při rušení notifikace ${identifier}:`, error);
    }
  }

  // 🗑️ Zrušení všech notifikací
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ Všechny notifikace zrušeny');
    } catch (error) {
      console.error('❌ Chyba při rušení všech notifikací:', error);
    }
  }

  // 📋 Získání všech naplánovaných notifikací
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('❌ Chyba při získávání naplánovaných notifikací:', error);
      return [];
    }
  }

  // 🔧 Getter pro push token
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  // ✅ Kontrola stavu notifikací
  async getNotificationStatus(): Promise<{
    hasPermission: boolean;
    hasPushToken: boolean;
    isInitialized: boolean;
  }> {
    const { status } = await Notifications.getPermissionsAsync();
    
    return {
      hasPermission: status === 'granted',
      hasPushToken: !!this.expoPushToken,
      isInitialized: this.isInitialized,
    };
  }
}

// Singleton instance
export const notificationService = NotificationService.getInstance();

// Hook pro používání v komponentách
import { useEffect, useState } from 'react';

export function useNotifications() {
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState({
    hasPermission: false,
    hasPushToken: false,
    isInitialized: false,
  });

  useEffect(() => {
    const initializeNotifications = async () => {
      const success = await notificationService.initialize();
      if (success) {
        const currentStatus = await notificationService.getNotificationStatus();
        setStatus(currentStatus);
      }
      setIsReady(true);
    };

    initializeNotifications();
  }, []);

  const requestPermissions = async () => {
    const success = await notificationService.initialize();
    if (success) {
      const newStatus = await notificationService.getNotificationStatus();
      setStatus(newStatus);
    }
    return success;
  };

  const scheduleDaily = async (hour: number, minute: number) => {
    await notificationService.scheduleDailyReminder(hour, minute);
  };

  const sendAchievement = async (title: string, body: string, data?: NotificationData) => {
    await notificationService.sendAchievementNotification(title, body, data);
  };

  return {
    isReady,
    status,
    requestPermissions,
    scheduleDaily,
    sendAchievement,
    notificationService,
  };
}

// Utility funkce pro testování notifikací (pouze v development)
export const testNotifications = async () => {
  if (__DEV__) {
    console.log('🧪 Testování notifikací...');
    
    // Test okamžité notifikace
    await notificationService.sendInstantNotification(
      'Test notifikace',
      'Toto je testovací notifikace z Akné Deníku!'
    );

    // Test achievement notifikace za 5 sekund
    setTimeout(async () => {
      await notificationService.sendAchievementNotification(
        'Testovací úspěch',
        'Skvěle! Testování notifikací proběhlo úspěšně! 🎉'
      );
    }, 5000);
  }
};