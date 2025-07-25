import React, { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../hooks/useAuth'

// 🚀 JEDNODUCHÉ RYCHLÉ ULOŽENÍ DO FIREBASE
export default function SimpleContentSaver() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState('')
  
  const [content, setContent] = useState({
    day: 1,
    motivation: 'JINÝ PRVNÍ DEN Den 1 - Pokračuj ve své cestě za krásnou pletí!',
    task: `🎯 DNEŠNÍ ÚKOL - DEN 1:
❄️ ZIMNÍ PÉČE:
Zaměř se na intenzivní hydrataci a ochranu před chladem.

💧 HYDRATACE:
- Vypij alespoň 2 litry vody
- Použij hydratační krém ráno i večer

🧘‍♀️ MINDFULNESS:
- 5 minut meditace nebo hlubokého dýchání
- Pozitivní afirmace: "Moje pleť se každým dnem zlepšuje"

📝 REFLEXE:
Zamysli se nad tím, co dnes uděláš pro svou pleť a celkovou pohodu.`
  })

  const saveToFirebase = async () => {
    if (!user) {
      setResult('❌ Nejsi přihlášen!')
      return
    }

    setSaving(true)
    setResult('🔄 Ukládám do Firebase...')

    try {
      const docRef = doc(db, 'dailyContent', `day-${content.day}`)
      const dataToSave = {
        ...content,
        updatedAt: new Date().toISOString(),
        updatedBy: user.email,
        isPhotoDay: content.day % 7 === 1,
        isDualPhotoDay: content.day % 14 === 0
      }

      await setDoc(docRef, dataToSave)
      
      setResult(`✅ Den ${content.day} úspěšně uložen do Firebase!\nČas: ${new Date().toLocaleString()}\nJdi zkontrolovat Firebase Console a pak uživatelskou část.`)
      
    } catch (error) {
      setResult(`❌ Chyba: ${error.message}`)
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  const saveMultipleDays = async () => {
    if (!user) {
      setResult('❌ Nejsi přihlášen!')
      return
    }

    setSaving(true)
    setResult('🔄 Ukládám více dnů do Firebase...')

    try {
      const days = [
        {
          day: 1,
          motivation: 'První den - Pokračuj ve své cestě za krásnou pletí! 💖',
          task: `🎯 DNEŠNÍ ÚKOL - DEN 1:
❄️ ZIMNÍ PÉČE:
Zaměř se na intenzivní hydrataci a ochranu před chladem.

💧 HYDRATACE:
- Vypij alespoň 2 litry vody
- Použij hydratační krém ráno i večer

🧘‍♀️ MINDFULNESS:
- 5 minut meditace nebo hlubokého dýchání
- Pozitivní afirmace: "Moje pleť se každým dnem zlepšuje"

📝 REFLEXE:
Zamysli se nad tím, co dnes uděláš pro svou pleť a celkovou pohodu.`
        },
        {
          day: 2,
          motivation: 'Druhý den - Včera jsi začala, dnes pokračuj! 🌟',
          task: `🎯 DNEŠNÍ ÚKOL - DEN 2:
🌅 RANNÍ RUTINA:
Vytvoř si stabilní ranní rutinu pro pleť.

💪 ÚKOL:
- Jemné čištění pleti vlažnou vodou
- Aplikace hydratačního krému
- 5 minut relaxace

🎯 CÍLE:
- Pravidelnost je klíč k úspěchu
- Buď trpělivá se sebou`
        },
        {
          day: 3,
          motivation: 'Třetí den - Už vytváříš zdravé návyky! 💪',
          task: `🎯 DNEŠNÍ ÚKOL - DEN 3:
🥗 VÝŽIVA PRO PLEŤ:
Co jíš, to se odráží na tvé pleti.

💚 ÚKOL:
- Zaměř se na čerstvé ovoce a zeleninu
- Omeз cukr a zpracované potraviny
- Více omega-3 mastných kyselin

💡 TIP:
Avokádo, ořechy a ryby jsou skvělé pro pleť!`
        }
      ]

      for (const dayData of days) {
        const docRef = doc(db, 'dailyContent', `day-${dayData.day}`)
        const dataToSave = {
          ...dayData,
          updatedAt: new Date().toISOString(),
          updatedBy: user.email,
          isPhotoDay: dayData.day % 7 === 1,
          isDualPhotoDay: dayData.day % 14 === 0
        }
        await setDoc(docRef, dataToSave)
        setResult(prev => prev + `\n✅ Den ${dayData.day} uložen`)
      }
      
      setResult(prev => prev + `\n\n🎉 Všechny dny úspěšně uloženy!\nJdi zkontrolovat Firebase Console.`)
      
    } catch (error) {
      setResult(`❌ Chyba: ${error.message}`)
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border-2 border-green-500 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          🚀 Rychlé uložení obsahu do Firebase
        </h1>
        
        <div className="space-y-4">
          
          {/* Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p><strong>Uživatel:</strong> {user?.email || 'Nepřihlášen'}</p>
            <p><strong>Čas:</strong> {new Date().toLocaleString()}</p>
          </div>

          {/* Den selector */}
          <div>
            <label className="block font-medium mb-2">Den:</label>
            <input
              type="number"
              min="1"
              max="365"
              value={content.day}
              onChange={(e) => setContent({...content, day: parseInt(e.target.value) || 1})}
              className="w-24 p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Motivace */}
          <div>
            <label className="block font-medium mb-2">Motivace:</label>
            <textarea
              value={content.motivation}
              onChange={(e) => setContent({...content, motivation: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows={2}
              placeholder="Krátká motivační zpráva..."
            />
          </div>

          {/* Úkol */}
          <div>
            <label className="block font-medium mb-2">Úkol:</label>
            <textarea
              value={content.task}
              onChange={(e) => setContent({...content, task: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows={12}
              placeholder="Detailní úkol pro daný den..."
            />
          </div>

          {/* Akce */}
          <div className="flex space-x-3">
            <button
              onClick={saveToFirebase}
              disabled={saving}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {saving ? '🔄 Ukládám...' : `🔥 Uložit den ${content.day} do Firebase`}
            </button>
            
            <button
              onClick={saveMultipleDays}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {saving ? '🔄 Ukládám...' : '📦 Uložit dny 1-3 (demo)'}
            </button>
          </div>

          {/* Výsledek */}
          {result && (
            <div className="bg-gray-100 border rounded-lg p-4">
              <h3 className="font-bold mb-2">📋 Výsledek:</h3>
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}

          {/* Instrukce */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-bold text-yellow-800 mb-2">📝 Jak na to:</h3>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>Vyplň obsah motivace a úkolu</li>
              <li>Klikni "Uložit do Firebase"</li>
              <li>Zkontroluj Firebase Console</li>
              <li>Jdi do uživatelské části a refresh</li>
              <li>Profit! 🎉</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  )
}