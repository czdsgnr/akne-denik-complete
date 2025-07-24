// 📁 src/lib/pwaNotifications.js - Kompletní PWA notifikační systém - OPRAVENO

export class PWANotifications {
  constructor() {
    this.registration = null
    // 🔧 OPRAVA: Bezpečná kontrola pro mobil
    this.isSupported = typeof window !== 'undefined' && 
                       'serviceWorker' in navigator && 
                       'Notification' in window &&
                       typeof Notification !== 'undefined'
  }

  // Pomocná funkce pro bezpečnou kontrolu
  isNotificationAvailable() {
    return this.isSupported && typeof Notification !== 'undefined'
  }

  // Inicializace PWA
  async init() {
    if (!this.isSupported) {
      console.warn('PWA není podporována v tomto prohlížeči')
      return false
    }

    try {
      // Registrace Service Worker
      this.registration = await navigator.serviceWorker.register('/sw.js')
      console.log('✅ Service Worker zaregistrován:', this.registration)
      
      return true
    } catch (error) {
      console.error('❌ Chyba při registraci Service Worker:', error)
      return false
    }
  }

  // Požádání o povolení notifikací
  async requestPermission() {
    if (!this.isNotificationAvailable()) {
      console.warn('🔔 Notification API není dostupné')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        // 📳 Haptická odezva při povolení
        if (navigator.vibrate) {
          navigator.vibrate([300, 100, 300, 100, 300])
        }
        
        // Testovací notifikace
        this.showTestNotification()
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Chyba při povolování notifikací:', error)
      return false
    }
  }

  // Testovací notifikace
  showTestNotification() {
    if (!this.isNotificationAvailable()) {
      console.warn('🔔 Notification API není dostupné')
      return
    }

    if (Notification.permission !== 'granted') {
      console.warn('🔔 Notifikace nejsou povoleny')
      return
    }

    try {
      const notification = new Notification('Akné Deník', {
        body: 'Notifikace jsou nyní aktivní! 🎉',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification',
        requireInteraction: false,
        vibrate: [200, 100, 200] // 📳 HAPTIKA
      })

      // Auto close po 5 sekundách
      setTimeout(() => notification.close(), 5000)
    } catch (error) {
      console.error('❌ Chyba při zobrazení notifikace:', error)
    }
  }

  // Naplánování denního připomenutí
  async scheduleDailyReminder(hour = 9, minute = 0) {
    if (!this.isNotificationAvailable()) {
      console.warn('🔔 Notification API není dostupné')
      return false
    }

    if (Notification.permission !== 'granted') {
      console.warn('🔔 Notifikace nejsou povoleny')
      return false
    }

    const now = new Date()
    const reminderTime = new Date()
    reminderTime.setHours(hour, minute, 0, 0)

    // Pokud je čas už dnes minulý, nastav na zítra
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1)
    }

    const delay = reminderTime.getTime() - now.getTime()

    setTimeout(() => {
      this.showDailyReminder()
      // Rekurzivně naplánuj další den
      this.scheduleDailyReminder(hour, minute)
    }, delay)

    console.log(`⏰ Denní připomenutí naplánováno na ${reminderTime.toLocaleString('cs-CZ')}`)
    return true
  }

  // Denní připomenutí
  showDailyReminder() {
    if (!this.isNotificationAvailable()) {
      console.warn('🔔 Notification API není dostupné')
      return
    }

    if (Notification.permission !== 'granted') {
      console.warn('🔔 Notifikace nejsou povoleny')
      return
    }

    const messages = [
      'Čas na tvůj denní úkol! 💖',
      'Nezapomeň na péči o pleť! ✨', 
      'Tvoje pleť na tebe čeká! 🌟',
      'Čas pro tvůj Akné Deník! 📖',
      'Udělej si chvilku pro sebe! 💕'
    ]

    const randomMessage = messages[Math.floor(Math.random() * messages.length)]

    try {
      const notification = new Notification('Akné Deník', {
        body: randomMessage,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'daily-reminder',
        requireInteraction: true,
        vibrate: [400, 200, 400, 200, 400], // 📳 Silnější haptika pro připomenutí
        actions: [
          {
            action: 'open',
            title: 'Otevřít aplikaci'
          },
          {
            action: 'later',
            title: 'Připomenout za hodinu'
          }
        ]
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    } catch (error) {
      console.error('❌ Chyba při zobrazení denního připomenutí:', error)
    }
  }

  // Foto den připomenutí
  showPhotoReminder(day) {
    if (!this.isNotificationAvailable()) {
      console.warn('🔔 Notification API není dostupné')
      return
    }

    if (Notification.permission !== 'granted') {
      console.warn('🔔 Notifikace nejsou povoleny')
      return
    }

    try {
      const notification = new Notification('Akné Deník - Foto den! 📸', {
        body: `Dnes je den ${day} - čas na fotku pokroku! 📷✨`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'photo-reminder',
        requireInteraction: true,
        vibrate: [100, 50, 100, 50, 100, 50, 300], // 📳 Rytmická haptika pro foto
        actions: [
          {
            action: 'photo',
            title: 'Pořídit foto'
          },
          {
            action: 'later',
            title: 'Později'
          }
        ]
      })
    } catch (error) {
      console.error('❌ Chyba při zobrazení foto připomenutí:', error)
    }
  }

  // Progress update notifikace
  showProgressNotification(completedDays, totalDays) {
    if (!this.isNotificationAvailable()) {
      console.warn('🔔 Notification API není dostupné')
      return
    }

    if (Notification.permission !== 'granted') {
      console.warn('🔔 Notifikace nejsou povoleny')
      return
    }

    const percentage = Math.round((completedDays / totalDays) * 100)
    
    try {
      const notification = new Notification('Akné Deník - Pokrok! 🎉', {
        body: `Dokončil jsi už ${completedDays} dnů (${percentage}%)! Pokračuj dál! 💪`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'progress-update',
        vibrate: [200, 100, 200, 100, 400], // 📳 Slavnostní haptika
      })
    } catch (error) {
      console.error('❌ Chyba při zobrazení pokrok notifikace:', error)
    }
  }

  // Instalace PWA prompt - vylepšená verze
  async promptInstall() {
    // Už se to řeší v PWAInstallPrompt komponentě
    // Takže zde jen logujeme
    console.log('📱 PWA Install Prompt se řeší v PWAInstallPrompt komponentě')
  }

  // Test haptiky
  testHaptics() {
    if (!navigator.vibrate) {
      console.warn('Haptika není podporována')
      return false
    }

    // Různé vzory vibrací
    const patterns = [
      [100], // Krátký puls
      [200, 100, 200], // Dvojitý puls
      [100, 50, 100, 50, 100], // Rytmický
      [400, 200, 400], // Silný dvojitý
      [50, 50, 50, 50, 50, 50, 300] // Morse kód + dlouhý
    ]

    patterns.forEach((pattern, index) => {
      setTimeout(() => {
        console.log(`📳 Test haptiky ${index + 1}:`, pattern)
        navigator.vibrate(pattern)
      }, index * 2000)
    })

    return true
  }
}

// 🚀 SINGLETON INSTANCE - tady to je!
export const pwaNotifications = new PWANotifications()