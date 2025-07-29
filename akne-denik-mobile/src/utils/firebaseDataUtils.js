// src/utils/firebaseDataUtils.js
import { doc, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Sample denní obsah pro prvních 30 dnů
export const sampleDailyContent = {
  1: {
    day: 1,
    motivation: "Vítej v Akné Deníku! Dnes začíná tvoje cesta za krásnou pletí! 💖",
    task: `🎯 PRVNÍ DEN - ZAČNI SVOU CESTU!

📌 VZPOMEŇ SI:
Vzpomeň si na moment, kdy se ti začaly tvořit pupínky?

💪 ÚKOL:
Běž k zrcadlu a řekni nahlas:
„MILUJI SAMA SEBE TAKOVOU JAKÁ JSEM"
⭐ Vyslov nahlas 3x tuhle větu.

📸 Dnes si také poříď první fotku svého obličeje!`,
    isPhotoDay: true,
    category: "start"
  },

  2: {
    day: 2,
    motivation: "Druhý den za námi! Každý krok je důležitý na cestě ke zdravé pleti. 🌟",
    task: `🎯 RUTINA A NÁVYKY

📌 ÚKOL:
Vytvoř si ranní rutinu péče o pleť:
1. Jemné umytí obličeje vlažnou vodou
2. Aplikace FaceDeluxe krému
3. Pozitivní afirmace před zrcadlem

💡 TIP:
Rutina trvá jen 5 minut, ale její účinek je obrovský!`,
    isPhotoDay: false,
    category: "routine"
  },

  3: {
    day: 3,
    motivation: "Třetí den! Tvé tělo si již začíná zvykat na novou rutinu. Pokračuj! 💪",
    task: `🎯 HYDRATACE JE ZÁKLAD

📌 ÚKOL:
Dnes se zaměř na hydrataci:
- Vypij alespoň 8 sklenic vody
- Pozoruj, jak se tvá pleť chová
- Zapíš si své pozorování

💧 VĚDĚL/A JSI:
70% naší pleti tvoří voda. Správná hydratace je základem zdravé pleti!`,
    isPhotoDay: false,
    category: "hydration"
  },

  4: {
    day: 4,
    motivation: "Čtvrtý den! Malé kroky vedou k velkým změnám. Jsi na dobré cestě! 🌱",
    task: `🎯 VÝŽIVA PRO PLEŤ

📌 ÚKOL:
Zaměř se na stravu bohatou na vitaminy:
- Zelenina (mrkev, špenát, brokolice)
- Ovoce (citrusy, jahody)
- Ořechy a semínka

🥗 DNES ZKUS:
Připrav si salát s ingrediencemi, které tvá pleť miluje!`,
    isPhotoDay: false,
    category: "nutrition"
  },

  5: {
    day: 5,
    motivation: "Pátý den! Tvoje odhodlání je obdivuhodné. Pokračuj v dobré práci! ⭐",
    task: `🎯 SPÁNEK A REGENERACE

📌 ÚKOL:
Věnuj pozornost kvalitě spánku:
- Jdi spát před 23:00
- Před spaním si očisti obličej
- Aplikuj FaceDeluxe krém
- Větrání místnosti

😴 PAMATUJ:
Během spánku se tvá pleť regeneruje nejvíce!`,
    isPhotoDay: false,
    category: "sleep"
  },

  6: {
    day: 6,
    motivation: "Šestý den! Jsi už skoro na konci prvního týdne. To je úžasné! 🎉",
    task: `🎯 STRES A RELAXACE

📌 ÚKOL:
Najdi si čas na relaxaci:
- 10 minut meditace nebo hlubokého dýchání
- Poslechni si oblíbenou hudbu
- Udělej si něco, co tě baví

🧘‍♀️ VĚDĚL/A JSI:
Stres může zhoršovat akné. Relaxace pomáhá!`,
    isPhotoDay: false,
    category: "stress"
  },

  7: {
    day: 7,
    motivation: "Týden za námi! Gratulujeme k dokončení prvního týdne! 🏆",
    task: `🎯 TÝDENNÍ REFLEXE

📊 ZHODNOŤ:
- Jak se ti dařilo dodržovat rutinu?
- Co ti dělalo největší problém?
- V čem vidíš zlepšení?
- Co chceš změnit příští týden?

📸 Čas na týdenní fotku pokroku!

🎊 GRATULUJEME:
Dokončil/a jsi první týden! To je skvělý začátek!`,
    isPhotoDay: true,
    category: "reflection"
  },

  8: {
    day: 8,
    motivation: "Druhý týden začíná! Jsi zkušenější a silnější než před týdnem! 💫",
    task: `🎯 NOVÝ TÝDEN, NOVÉ CÍLE

📌 ÚKOL:
Stanovte si cíle pro tento týden:
- Co chceš zlepšit?
- Jak budeš pokračovat v rutině?
- Jaké nové návyky chceš přidat?

✨ MOTIVACE:
Jeden týden je za tebou, zbývá jich už jen 51!`,
    isPhotoDay: false,
    category: "goals"
  },

  9: {
    day: 9,
    motivation: "Devátý den! Návyky se pomalu vytvářejí. Buď trpělivý/á! 🌿",
    task: `🎯 ČIŠTĚNÍ PLETI

📌 ÚKOL:
Zkontroluj svou techniku čištění:
- Používáš vlažnou vodu?
- Masíruješ jemně krouživými pohyby?
- Nesušíš pleť hrubým ručníkem?

🧼 TIP:
Přílišné čištění může pleť dráždit. Jemnost je klíčová!`,
    isPhotoDay: false,
    category: "cleansing"
  },

  10: {
    day: 10,
    motivation: "Desátý den! Už máš za sebou více než týden. Jsi úžasný/á! 🌟",
    task: `🎯 MOTIVACE A POZITIVITA

📌 ÚKOL:
Vytvoř si seznam pozitivních afirmací:
- "Moje pleť se každým dnem zlepšuje"
- "Jsem krásný/á takový/á, jaký/á jsem"
- "Péče o sebe je projev lásky"

💖 PAMATUJ:
Pozitivní myšlení ovlivňuje i zdraví tvé pleti!`,
    isPhotoDay: false,
    category: "motivation"
  },

  14: {
    day: 14,
    motivation: "Dva týdny! To je úžasný milník. Tvoje pleť si už zvykla na péči! 🎊",
    task: `🎯 DVOUTÝDENNÍ HODNOCENÍ

📊 ANALÝZA:
- Porovnej fotky z dne 1 a 7
- Jak se změnila tvá pleť?
- Máš méně pupínků?
- Je pleť měkčí?

📸 Další důležitá dokumentační fotka!

🏅 ACHIEVEMENT UNLOCKED:
Dva týdny vytrvalosti!`,
    isPhotoDay: true,
    category: "milestone"
  },

  21: {
    day: 21,
    motivation: "Tři týdny! Gratulujeme! Návyky se stávají součástí tvého života! 🌈",
    task: `🎯 TŘI TÝDNY ÚSPĚCHU

🎉 OSLAVA:
- Tři týdny pravidelné péče!
- Třetí fotografická dokumentace
- Návyky jsou téměř zautomatizované

📸 Třítýdenní progress foto!

💪 POKRAČUJ:
Jsi už na čtvrtině cesty k trvalým návykům!`,
    isPhotoDay: true,
    category: "celebration"
  },

  30: {
    day: 30,
    motivation: "MĚSÍC! Úžasný milník! Gratulujeme k dokončení prvního měsíce! 🎆",
    task: `🎯 MĚSÍČNÍ VYHODNOCENÍ

🏆 MILNÍK:
Dokončil/a jsi celý měsíc péče o pleť!

📊 VYHODNOCENÍ:
- Porovnej všechny svoje fotky
- Jaký je rozdíl mezi dnem 1 a 30?
- Co se ti nejvíce osvědčilo?
- Na co se chceš zaměřit další měsíc?

📸 Slavnostní měsíční fotka!

🎊 GRATULUJI:
Jsi na skvělé cestě za krásnou pletí!`,
    isPhotoDay: true,
    category: "monthly_milestone"
  }
};

// Funkce pro generování obsahu pro zbývající dny
export const generateDailyContentForYear = () => {
  const content = { ...sampleDailyContent };
  
  // Generuj obsah pro dny 31-365
  for (let day = 31; day <= 365; day++) {
    const weekNumber = Math.ceil(day / 7);
    const monthNumber = Math.ceil(day / 30);
    const isPhotoDay = day % 7 === 0; // Foto každý týden
    const isMilestone = day % 30 === 0; // Milník každý měsíc
    
    let category = "routine";
    let motivation = `Den ${day} - Pokračuj ve své cestě! Každý den tě přibližuje k cíli. 🌟`;
    let task = `🎯 DEN ${day}

💪 DENNÍ RUTINA:
1. Ranní očištění pleti
2. Aplikace FaceDeluxe krému  
3. Dostatečná hydratace
4. Večerní péče

📝 Nezapomeň si zapsat svoje pocity do deníku!`;

    // Speciální obsah pro milníky
    if (isMilestone) {
      category = "monthly_milestone";
      motivation = `${monthNumber}. měsíc dokončen! Gratulujeme k této neuvěřitelné vytrvalosti! 🎉`;
      task = `🎯 MĚSÍČNÍ MILNÍK - DEN ${day}

🏆 GRATULUJEME:
Dokončil/a jsi ${monthNumber}. měsíc programu!

📊 VYHODNOCENÍ:
- Jak se změnila tvá pleť za poslední měsíc?
- Co se ti osvědčilo nejvíce?
- Máš nové cíle na další měsíc?

📸 Důležitá dokumentační fotka!`;
    }
    // Speciální obsah pro 100. den
    else if (day === 100) {
      category = "major_milestone";
      motivation = "100 DNŮ! Neuvěřitelný milník! Jsi absolutní inspirace! 👑";
      task = `🎯 100 DNŮ ÚSPĚCHU!

🎉 OSLAVA:
Sto dní nepřetržité péče o pleť!

🏆 ACHIEVEMENT:
- 100 dní vytrvalosti
- 14+ týdnů péče
- 3+ měsíce nových návyků

📸 Slavnostní stovková fotka!

👑 JSI LEGENDA!`;
    }
    // Speciální obsah pro 200. den
    else if (day === 200) {
      category = "major_milestone";
      motivation = "200 DNŮ! Jsi už expert na péči o pleť! Neuvěřitelné! 🌟";
      task = `🎯 200 DNŮ MAJESTRÁTU!

🎊 OSLAVA:
Dvěstě dní dokonalé péče!

📈 POKROK:
- Pleť je určitě v lepším stavu
- Návyky jsou zautomatizované
- Jsi inspirací pro ostatní

📸 Dvouset denní progress foto!`;
    }
    // Týdenní foto dny
    else if (isPhotoDay) {
      motivation = `Týden ${weekNumber} dokončen! Čas na dokumentaci pokroku! 📸`;
      task = `🎯 TÝDENNÍ FOTO DEN ${day}

📸 DOKUMENTACE:
Čas na týdenní fotku pokroku!

📊 REFLEXE:
- Jak se ti dařilo tento týden?
- Vidíš nějaké změny?
- Co chceš příští týden zlepšit?

💪 POKRAČUJ:
Jsi na skvělé cestě!`;
    }
    
    content[day] = {
      day,
      motivation,
      task,
      isPhotoDay,
      category
    };
  }
  
  return content;
};

// Funkce pro nahrání obsahu do Firebase
export const uploadDailyContentToFirebase = async () => {
  try {
    console.log('📤 Začínám nahrávání denního obsahu do Firebase...');
    
    const allContent = generateDailyContentForYear();
    const batch = writeBatch(db);
    
    // Nahraj obsah po částech (Firestore má limit 500 operací per batch)
    const contentArray = Object.values(allContent);
    const batchSize = 400; // Ponechej si rezervu
    
    for (let i = 0; i < contentArray.length; i += batchSize) {
      const batchItems = contentArray.slice(i, i + batchSize);
      const currentBatch = writeBatch(db);
      
      batchItems.forEach(content => {
        const docRef = doc(db, 'dailyContent', content.day.toString());
        currentBatch.set(docRef, {
          ...content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
      
      await currentBatch.commit();
      console.log(`✅ Nahráno ${Math.min(i + batchSize, contentArray.length)}/${contentArray.length} dní`);
    }
    
    console.log('🎉 Denní obsah byl úspěšně nahrán do Firebase!');
    return { success: true, count: contentArray.length };
    
  } catch (error) {
    console.error('❌ Chyba při nahrávání obsahu:', error);
    return { success: false, error: error.message };
  }
};

// Funkce pro kontrolu existence obsahu
export const checkDailyContentExists = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'dailyContent'));
    const existingDays = [];
    
    snapshot.forEach(doc => {
      existingDays.push(parseInt(doc.id));
    });
    
    return {
      exists: existingDays.length > 0,
      count: existingDays.length,
      days: existingDays.sort((a, b) => a - b)
    };
  } catch (error) {
    console.error('Chyba při kontrole obsahu:', error);
    return { exists: false, count: 0, days: [] };
  }
};

// Funkce pro nahrání pouze ukázkového obsahu (prvních 30 dnů)
export const uploadSampleContent = async () => {
  try {
    console.log('📤 Nahrávám ukázkový obsah (30 dnů)...');
    
    const batch = writeBatch(db);
    
    Object.values(sampleDailyContent).forEach(content => {
      const docRef = doc(db, 'dailyContent', content.day.toString());
      batch.set(docRef, {
        ...content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    
    await batch.commit();
    console.log('✅ Ukázkový obsah byl nahrán!');
    
    return { success: true, count: Object.keys(sampleDailyContent).length };
  } catch (error) {
    console.error('❌ Chyba při nahrávání ukázkového obsahu:', error);
    return { success: false, error: error.message };
  }
};

// Funkce pro smazání všeho obsahu (pro testing)
export const deleteAllDailyContent = async () => {
  try {
    console.log('🗑️ Mažu všechen denní obsah...');
    
    const snapshot = await getDocs(collection(db, 'dailyContent'));
    const batch = writeBatch(db);
    
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('✅ Všechen obsah byl smazán!');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Chyba při mazání obsahu:', error);
    return { success: false, error: error.message };
  }
};