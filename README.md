# 🌟 Akné Deník - Kompletní systém

Kompletní propojený systém pro péči o pleť s celoročním programem, správou produktů a administrací.

## 🚀 Kompletní flow

### 1. **Landing Page** (`/`)
- Moderní design s animacemi
- Přehled funkcí a výhod
- Testimonials od uživatelek
- CTA tlačítka pro registraci

### 2. **Registrace** (`/register`)
- Detailní formulář s profilem
- Typ pleti, věk, cíle
- Automatické vytvoření účtu ve Firebase
- Přesměrování do hlavní aplikace

### 3. **Přihlášení** (`/login`)
- Bezpečná autentifikace
- Rozpoznání admin vs uživatel
- Automatické přesměrování podle role

### 4. **Hlavní aplikace** (pro uživatele)
- **Celoroční program** - 365 dnů obsahu
- **Denní motivace** a úkoly
- **Sledování pokroku** s vizualizací
- **Personalizovaný obsah** podle profilu

### 5. **Admin panel** (`/admin/*`)
- **Dashboard** s reálnými statistikami
- **Správa uživatelů** - všichni registrovaní
- **Denní obsah** - editace pro celý rok
- **Produkty** - FaceDeluxe a další
- **Zprávy** - komunikace s uživateli

## 📅 Celoroční systém (365 dnů)

### **Místo 21denní výzvy:**
- ✅ **365 dnů** strukturovaného obsahu
- ✅ **Denní motivace** pro každý den v roce
- ✅ **Postupné zlepšování** návyků
- ✅ **Sezónní přizpůsobení** obsahu

### **Automatické generování:**
```javascript
// Výpočet dne v roce
const today = new Date()
const dayOfYear = Math.floor((today - startOfYear(today)) / (1000 * 60 * 60 * 24)) + 1

// Načtení obsahu pro konkrétní den
const contentDoc = await getDocs(
  query(collection(db, 'dailyContent'), where('day', '==', dayOfYear))
)
```

## 🛍️ Správa produktů

### **Admin funkce:**
- ✅ **Přidávání produktů** (FaceDeluxe, krémy, séra)
- ✅ **Editace popisu** a cen
- ✅ **Správa kategorií** produktů
- ✅ **Sledování objednávek**

### **Struktura produktu:**
```javascript
{
  id: "facedeluxe-001",
  name: "FaceDeluxe Premium Krém",
  description: "Luxusní krém pro péči o problematickou pleť",
  price: 1299,
  category: "krémy",
  inStock: true,
  images: ["url1", "url2"],
  createdAt: timestamp
}
```

## 🔧 Technické detaily

### **Firebase kolekce:**
```
📁 users/                    # Registrovaní uživatelé
  ├── email, name, age, skinType
  ├── currentDay (1-365)
  ├── completedDays []
  └── profile data

📁 dailyContent/             # Obsah pro každý den
  ├── day (1-365)
  ├── motivation
  ├── task
  └── tips []

📁 products/                 # Produkty (FaceDeluxe atd.)
  ├── name, description
  ├── price, category
  ├── images, inStock
  └── metadata

📁 messages/                 # Zprávy od uživatelů
📁 orders/                   # Objednávky produktů
📁 activity/                 # Aktivita uživatelů
```

### **Autentifikace a role:**
```javascript
// Automatické rozpoznání role
const isAdminEmail = (email) => {
  const adminEmails = [
    'admin@aknedenik.cz',
    'support@aknedenik.cz', 
    'info@aknedenik.cz'
  ]
  return adminEmails.includes(email)
}

// Přesměrování podle role
if (userRole === 'admin') {
  // → Admin panel (/admin/*)
} else {
  // → Hlavní aplikace
}
```

## 🚀 Rychlé spuštění

### 1. **Instalace**
```bash
cd akne-denik-complete
pnpm install
```

### 2. **Firebase setup**
- Vytvořte admin účty v Firebase Auth
- Nastavte Firestore pravidla
- Zkontrolujte konfigurace v `src/lib/firebase.js`

### 3. **Spuštění**
```bash
pnpm run dev
```

### 4. **Testování flow**
1. Otevřete http://localhost:5174
2. Projděte landing page
3. Zaregistrujte se jako uživatel
4. Otestujte hlavní aplikaci
5. Přihlaste se jako admin (admin@aknedenik.cz)
6. Otestujte admin panel

## 📊 Funkce podle role

### **Uživatel:**
- ✅ **Registrace** s detailním profilem
- ✅ **Denní obsah** - motivace, úkoly, tipy
- ✅ **Sledování pokroku** - dokončené dny
- ✅ **Celoroční program** - 365 dnů
- ✅ **Personalizace** podle typu pleti

### **Admin:**
- ✅ **Dashboard** s reálnými statistikami
- ✅ **Správa uživatelů** - profily, pokrok
- ✅ **Editor obsahu** - denní motivace pro celý rok
- ✅ **Správa produktů** - FaceDeluxe, krémy, séra
- ✅ **Komunikace** - zprávy od uživatelů
- ✅ **Analýzy** - aktivita, trendy

## 🎨 Design systém

### **Barevná paleta:**
```css
/* Primární gradienty */
Pink to Purple: from-pink-600 to-purple-600
Blue to Purple: from-blue-600 to-purple-600

/* Pozadí */
Landing: from-pink-50 via-purple-50 to-indigo-50
App: from-pink-50 to-purple-50
Admin: bg-gray-50
```

### **Komponenty:**
- ✅ **Shadcn/UI** - moderní komponenty
- ✅ **Framer Motion** - animace
- ✅ **Lucide Icons** - ikony
- ✅ **Tailwind CSS** - styling

## 🌐 Nasazení

### **Produkční build:**
```bash
pnpm run build
```

### **Vercel (doporučeno):**
```bash
vercel --prod
```

### **Vlastní server:**
```bash
# Zkopírujte dist/ na server
# Nastavte Firebase domény
```

## 📱 Responzivní design

- ✅ **Desktop** - plná funkcionalita
- ✅ **Tablet** - přizpůsobený layout
- ✅ **Mobil** - touch-friendly ovládání

## 🔒 Bezpečnost

### **Firebase Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin přístup
    match /{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.email.matches('.*@aknedenik\\.cz$');
    }
    
    // Uživatelský přístup
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

## 📞 Podpora

### **Řešení problémů:**
1. Zkontrolujte Firebase konfigurace
2. Ověřte admin emaily
3. Zkontrolujte Firestore pravidla
4. Zkontrolujte konzoli prohlížeče

### **Kontakt:**
- Email: support@aknedenik.cz
- Admin panel: /admin

---

## 🎯 Výsledek

**Kompletní propojený systém:**
- ✅ **Landing page** → **Registrace** → **Aplikace** → **Admin**
- ✅ **365 dnů** obsahu místo 21
- ✅ **Správa produktů** FaceDeluxe z administrace
- ✅ **Real-time synchronizace** všech dat
- ✅ **Profesionální design** s animacemi
- ✅ **Připraveno pro produkci**

**Systém je připraven k okamžitému nasazení! 🚀**

