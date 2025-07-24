import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Camera, Upload, X, Star, Heart } from 'lucide-react'

const moods = [
  { emoji: "😞", label: "Velmi špatně", value: 1 },
  { emoji: "🙁", label: "Špatně", value: 2 },
  { emoji: "😐", label: "Neutrálně", value: 3 },
  { emoji: "🙂", label: "Dobře", value: 4 },
  { emoji: "😄", label: "Velmi dobře", value: 5 },
]

export default function DailyLogForm({ 
  onSubmit, 
  onCancel, 
  dayNumber, 
  isPhotoDay = false,
  isDualPhotoDay = false,
  existingEntry = null 
}) {
  const [selectedMood, setSelectedMood] = useState(existingEntry?.mood || null)
  const [note, setNote] = useState(existingEntry?.note || "")
  const [skinRating, setSkinRating] = useState(existingEntry?.skinRating || 0)
  
  // ✅ PHOTO STATES - SINGLE PHOTO
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(
    existingEntry?.photos?.[0]?.url || null
  )
  const photoInputRef = useRef(null)

  // ✅ PHOTO STATES - DUAL PHOTOS
  const [photoFront, setPhotoFront] = useState(null)
  const [photoFrontPreview, setPhotoFrontPreview] = useState(
    existingEntry?.photos?.find(p => p.type === 'front')?.url || null
  )
  const photoFrontInputRef = useRef(null)

  const [photoSide, setPhotoSide] = useState(null)
  const [photoSidePreview, setPhotoSidePreview] = useState(
    existingEntry?.photos?.find(p => p.type === 'side')?.url || null
  )
  const photoSideInputRef = useRef(null)

  // ✅ VYLEPŠENÁ FUNKCE PRO HANDLING SOUBORŮ
  const handleFileChange = (event, setter, previewSetter) => {
    const file = event.target.files?.[0]
    
    if (file) {
      // Validace typu souboru
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        alert('Neplatný formát souboru. Použijte JPG, PNG nebo WebP.')
        return
      }

      // Validace velikosti (max 10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert('Soubor je příliš velký. Maximální velikost je 10MB.')
        return
      }

      setter(file)
      
      // Vytvoření preview
      const reader = new FileReader()
      reader.onloadend = () => {
        previewSetter(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setter(null)
      previewSetter(existingEntry?.photos?.find(p => p.type)?.url || null)
    }
  }

  // ✅ FUNKCE PRO VYMAZÁNÍ FOTKY
  const clearPhoto = (fileSetter, previewSetter, inputRef, photoType = null) => {
    fileSetter(null)
    
    // Pokud je existing entry, nastav původní URL, jinak null
    let originalUrl = null
    if (existingEntry?.photos) {
      if (photoType) {
        originalUrl = existingEntry.photos.find(p => p.type === photoType)?.url || null
      } else {
        originalUrl = existingEntry.photos[0]?.url || null
      }
    }
    previewSetter(originalUrl)
    
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  // ✅ VYLEPŠENÁ VALIDACE A SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Základní validace
    if (!selectedMood) {
      alert("Prosím, vyberte svou náladu.")
      return
    }
    
    if (!note.trim()) {
      alert("Prosím, napište krátký popis svého dne.")
      return
    }

    if (skinRating === 0) {
      alert("Prosím, ohodnoťte stav své pleti.")
      return
    }

    // Validace fotek
    if (isPhotoDay && !isDualPhotoDay) {
      if (!photo && !photoPreview) {
        alert("Prosím, přidejte fotografii pro tento den.")
        return
      }
    }

    if (isDualPhotoDay) {
      const hasFrontPhoto = photoFront || photoFrontPreview
      const hasSidePhoto = photoSide || photoSidePreview
      
      if (!hasFrontPhoto || !hasSidePhoto) {
        alert("Prosím, přidejte obě fotografie (zepředu a z boku).")
        return
      }
    }

    // ✅ SESTAVENÍ DAT PRO ODESLÁNÍ
    const logData = {
      mood: selectedMood,
      note: note.trim(),
      skinRating,
      day: dayNumber
    }

    // Přidání foto dat
    if (isPhotoDay && !isDualPhotoDay && photo) {
      logData.photo = photo
    }

    if (isDualPhotoDay) {
      if (photoFront) logData.photoFront = photoFront
      if (photoSide) logData.photoSide = photoSide
    }

    console.log('📤 Odesílám log data:', logData)
    onSubmit(logData)
  }

  return (
    <div className="space-y-6 pb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nálada */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Jak se dnes cítíš?</h3>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => setSelectedMood(mood.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedMood === mood.value
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs text-gray-600">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Hodnocení pleti */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Jak vypadá tvoje pleť?</h3>
          <div className="flex items-center space-x-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSkinRating(index + 1)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`w-8 h-8 ${
                    index < skinRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {skinRating > 0 ? `${skinRating}/5` : 'Nehodnoceno'}
            </span>
          </div>
        </div>

        {/* Poznámka */}
        <div className="space-y-3">
          <label className="text-lg font-medium text-gray-900">
            Jak probíhal tvůj den?
          </label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Sdílej svoje pocity, pokrok nebo cokoliv, co tě napadne..."
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <div className="text-right text-sm text-gray-500">
            {note.length}/500
          </div>
        </div>

        {/* ✅ SINGLE PHOTO UPLOAD */}
        {isPhotoDay && !isDualPhotoDay && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Fotka pokroku</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {photoPreview ? (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => clearPhoto(setPhoto, setPhotoPreview, photoInputRef)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {photo && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Nová fotka
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => photoInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Nahrát fotografii
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Přidej fotografii svého obličeje pro sledování pokroku
                  </p>
                </div>
              )}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleFileChange(e, setPhoto, setPhotoPreview)}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* ✅ DUAL PHOTOS UPLOAD */}
        {isDualPhotoDay && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Fotodokumentace pokroku
              </h3>
              <p className="text-sm text-gray-600">
                Přidej dvě fotografie - zepředu a z boku pro lepší sledování pokroku
              </p>
            </div>

            {/* Front Photo */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Fotka zepředu *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {photoFrontPreview ? (
                  <div className="relative">
                    <img 
                      src={photoFrontPreview} 
                      alt="Front Preview" 
                      className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => clearPhoto(setPhotoFront, setPhotoFrontPreview, photoFrontInputRef, 'front')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {photoFront && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Nová
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => photoFrontInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Fotka zepředu
                    </Button>
                  </div>
                )}
                <input
                  ref={photoFrontInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleFileChange(e, setPhotoFront, setPhotoFrontPreview)}
                  className="hidden"
                />
              </div>
            </div>

            {/* Side Photo */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Fotka z boku *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {photoSidePreview ? (
                  <div className="relative">
                    <img 
                      src={photoSidePreview} 
                      alt="Side Preview" 
                      className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => clearPhoto(setPhotoSide, setPhotoSidePreview, photoSideInputRef, 'side')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {photoSide && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Nová
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => photoSideInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Fotka z boku
                    </Button>
                  </div>
                )}
                <input
                  ref={photoSideInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleFileChange(e, setPhotoSide, setPhotoSidePreview)}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Zrušit
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Heart className="w-4 h-4 mr-2" />
            Uložit záznam
          </Button>
        </div>
      </form>
    </div>
  )
}