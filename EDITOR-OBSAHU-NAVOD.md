# 📝 Editor denního obsahu - Kompletní návod

## 🎯 Co je to Editor denního obsahu?

Editor denního obsahu je pokročilý nástroj v admin panelu, který vám umožňuje spravovat úkoly, motivace a obsah pro všech 365 dnů v roce. Každý den může mít svůj unikátní obsah, který uvidí všichni uživatelé aplikace.

## 🚀 Jak se k editoru dostat?

### Metoda 1: Přes admin přihlášení
1. Přihlaste se jako admin s emailem `@aknedenik.cz` nebo `@akne-online.cz`
2. V admin panelu klikněte na "Denní obsah"

### Metoda 2: Demo verze (pro testování)
1. Jděte na URL: `http://localhost:5173/demo-admin`
2. Klikněte na "Denní obsah" v levém menu

## 📋 Funkce editoru

### 🎯 Základní editace
- **Výběr dne**: Můžete editovat jakýkoliv den od 1 do 365
- **Denní motivace**: Krátká motivační zpráva pro uživatele
- **Denní úkol**: Detailní popis toho, co má uživatel daný den dělat
- **Foto dny**: Nastavení kdy mají uživatelé fotit (den 1, 7, 14, 21...)

### 🔍 Pokročilé funkce
- **Vyhledávání**: Hledání v obsahu všech dnů
- **Filtrování**: Zobrazení pouze foto dnů
- **Náhled**: Ukázka jak bude obsah vypadat uživatelům
- **Kopírování**: Zkopírování obsahu z jiného dne
- **Hromadné operace**: Generování obsahu pro více dnů najednou

## 📝 Jak editovat konkrétní den

### Krok 1: Výběr dne
- Použijte šipky ← → pro navigaci
- Nebo zadejte číslo dne (1-365) do pole
- Nebo klikněte na den v přehledu dnů

### Krok 2: Vyplnění obsahu
```
Denní motivace *
Krátká motivační zpráva, např.:
"Vítej v Akné Deníku! Dnes začíná tvoje cesta za krásnou pletí! 💖"

Denní úkol *
Detailní popis úkolu, např.:
🎯 PRVNÍ DEN - ZAČNI SVOU CESTU!

📌 VZPOMEŇ SI:
Vzpomeň si na moment, kdy se ti začaly tvořit pupínky?

💪 ÚKOL:
Běž k zrcadlu a řekni nahlas:
„MILUJI SAMA SEBE TAKOVOU JAKÁ JSEM"
```

### Krok 3: Nastavení fotek
- ☑️ **Foto den**: Uživatel má pořídit jednu fotku obličeje
- ☑️ **Dvě fotky**: Uživatel má pořídit dvě fotky (zepředu + z boku)

### Krok 4: Uložení
- Klikněte na tlačítko **"Uložit"**
- Obsah se uloží do Firebase a bude okamžitě dostupný všem uživatelům

## 🎨 Formátování obsahu

### Emoji a symboly
```
🎯 Cíl
💪 Úkol  
📌 Důležité
💭 Zamyšlení
📸 Fotka
⭐ Hvězdička
💖 Srdce
🌟 Hvězda
```

### Struktura úkolu
```
🎯 NÁZEV DNU - HLAVNÍ TÉMA

📌 SEKCE 1:
- Bod 1
- Bod 2

💪 ÚKOL:
Konkrétní instrukce co má uživatel udělat

📸 FOTKA:
Pokud je foto den, připomenutí o focení
```

## 📅 Foto dny - doporučené nastavení

### Základní foto dny (každý týden)
- **Den 1**: První fotka (začátek cesty)
- **Den 7**: Týdenní kontrola
- **Den 14**: Dvoutýdenní pokrok (2 fotky)
- **Den 21**: Tříneděl pokrok
- **Den 28**: Měsíční pokrok (2 fotky)

### Pokračování
- Každý 7. den: Jedna fotka
- Každý 14. den: Dvě fotky (zepředu + z boku)

## 🔄 Hromadné operace

### Generování základního obsahu
1. Klikněte na "Vygenerovat základní obsah"
2. Zadejte rozsah dnů (např. 1-30)
3. Systém vytvoří základní šablonu pro všechny dny

### Nastavení foto dnů
1. Klikněte na "Nastavit foto dny"
2. Systém automaticky nastaví foto dny podle doporučeného schématu

## 📊 Přehled dnů

### Barevné označení
- **Šedé**: Den není vyplněný
- **Zelené**: Den je kompletně vyplněný
- **Růžové**: Aktuálně editovaný den

### Statistiky
- **0/365 dnů vyplněno**: Ukazuje kolik dnů už máte připraveno
- **Filtrování**: Můžete zobrazit pouze foto dny nebo hledat v obsahu

## 🔧 Technické detaily

### Ukládání dat
- Všechna data se ukládají do Firebase Firestore
- Kolekce: `dailyContent`
- Dokument: `day-{číslo_dne}`
- Real-time synchronizace s uživatelskou aplikací

### Struktura dat
```javascript
{
  day: 1,
  motivation: "Denní motivace...",
  task: "Detailní úkol...",
  isPhotoDay: true,
  isDualPhotoDay: false,
  updatedAt: "2024-01-01T10:00:00Z",
  updatedBy: "admin"
}
```

## 🎯 Tipy pro vytváření kvalitního obsahu

### Motivace
- Buďte pozitivní a povzbuzující
- Použijte emoji pro lepší vizuální dojem
- Držte se 1-2 vět

### Úkoly
- Buďte konkrétní a jasní
- Rozdělte úkol do sekcí
- Použijte akční slovesa
- Přidejte reflexní otázky

### Foto dny
- Připomeňte důležitost dokumentace pokroku
- Vysvětlete jak fotit (světlo, úhel, výraz)
- Motivujte k pravidelnosti

## 🚨 Časté problémy a řešení

### Obsah se neuloží
- Zkontrolujte že máte vyplněnou motivaci i úkol
- Ověřte připojení k internetu
- Zkuste obnovit stránku

### Nefunguje Firebase
- Pro testování použijte demo verzi na `/demo-admin`
- Zkontrolujte Firebase konfiguraci
- Ověřte admin oprávnění

### Obsah se nezobrazuje uživatelům
- Zkontrolujte že je obsah uložený (zelené označení dne)
- Ověřte že uživatelská aplikace načítá z Firebase
- Zkuste vymazat cache prohlížeče

## 📱 Responzivní design

Editor funguje na:
- **Desktop**: Plná funkcionalita
- **Tablet**: Přizpůsobený layout
- **Mobil**: Touch-friendly ovládání

## 🎉 Výsledek

Po správném nastavení budou uživatelé vidět:
1. **Denní motivaci** na hlavní stránce
2. **Detailní úkol** po kliknutí na den
3. **Připomenutí focení** v foto dny
4. **Postupné odemykání** dnů podle registrace

---

**Editor denního obsahu je mocný nástroj pro vytvoření personalizovaného celoročního programu péče o pleť! 🌟**

