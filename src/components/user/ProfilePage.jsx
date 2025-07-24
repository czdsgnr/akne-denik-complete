import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { 
  User, 
  Settings, 
  LogOut, 
  Mail, 
  Calendar,
  Target,
  Heart,
  Edit,
  Save,
  X,
  Camera,
  BarChart3,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Crown,
  Star,
  Clock,
  CalendarDays,
  FileText
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { uploadPhotoToStorage, validatePhotoFile } from '../../lib/uploadPhotoToStorage'

function ProfilePage() {
  const { user, logout } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedData, setEditedData] = useState({})
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const fileInputRef = useRef(null)
  const [preferredReminderTime, setPreferredReminderTime] = useState('09:00')

  // 🚀 SCROLL TO TOP při načtení profilu
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserData(data)
          setEditedData(data)
          
          // Načtení preferovaného času připomenutí
          if (data.preferredReminderTime) {
            setPreferredReminderTime(data.preferredReminderTime)
          }
        }
      } catch (error) {
        console.error('Chyba při načítání profilu:', error)
        setError('Chyba při načítání profilu')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user])

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      validatePhotoFile(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target.result)
      }
      reader.readAsDataURL(file)

      handlePhotoUpload(file)
    } catch (error) {
      setError(error.message)
    }
  }

  const handlePhotoUpload = async (file) => {
    setUploadingPhoto(true)
    setError(null)

    try {
      console.log('🔄 Profile photo upload start...')
      
      const photoUrl = await uploadPhotoToStorage(
        file, 
        user.uid, 
        'profile',
        'profile'
      )

      console.log('✅ Profile photo uploaded:', photoUrl)

      await updateDoc(doc(db, 'users', user.uid), {
        profilePhoto: photoUrl,
        updatedAt: new Date()
      })

      const updatedData = { ...userData, profilePhoto: photoUrl }
      setUserData(updatedData)
      setEditedData(updatedData)
      
      setSuccess('Profilová fotka byla úspěšně nahrána! ✅')
      setTimeout(() => setSuccess(null), 3000)

    } catch (error) {
      console.error('❌ Profile photo upload error:', error)
      setError('Chyba při nahrávání fotky: ' + error.message)
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleLogout = async () => {
    if (confirm('Opravdu se chceš odhlásit?')) {
      try {
        await logout()
      } catch (error) {
        console.error('Chyba při odhlašování:', error)
        setError('Chyba při odhlašování')
      }
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setError(null)
    
    try {
      const updateData = {
        ...editedData,
        preferredReminderTime,
        updatedAt: new Date()
      }
      
      await updateDoc(doc(db, 'users', user.uid), updateData)
      
      setUserData(updateData)
      setEditing(false)
      setSuccess('Profil byl úspěšně aktualizován! ✅')
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('Chyba při ukládání profilu:', error)
      setError('Chyba při ukládání profilu: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedData(userData)
    setEditing(false)
    setError(null)
  }

  // 📅 Export kalendářového připomenutí
  const handleExportCalendar = () => {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1) // Celý rok

    const [hour, minute] = preferredReminderTime.split(':')
    startDate.setHours(parseInt(hour), parseInt(minute), 0, 0)

    // ICS format pro kalendář
    const icsContent = generateICSFile(startDate, endDate, preferredReminderTime)
    
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'akne-denik-pripomenuti.ics'
    a.click()
    URL.revokeObjectURL(url)

    setSuccess('Kalendářové připomenutí bylo exportováno! 📅')
    setTimeout(() => setSuccess(null), 3000)
  }

  const generateICSFile = (startDate, endDate, time) => {
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Akné Deník//Denní připomenutí//CS
BEGIN:VEVENT
UID:akne-denik-${user.uid}-${Date.now()}@aknedenik.cz
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(new Date(startDate.getTime() + 15 * 60000))}
RRULE:FREQ=DAILY;UNTIL=${formatDate(endDate)}
SUMMARY:Akné Deník - Denní úkol
DESCRIPTION:Čas na denní péči o pleť! Otevři Akné Deník a zjisti dnešní úkol.
LOCATION:Akné Deník App
CATEGORIES:ZDRAVÍ,KRÁSA
PRIORITY:5
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Za 15 minut: Akné Deník úkol
END:VALARM
BEGIN:VALARM
TRIGGER:PT0M
ACTION:DISPLAY
DESCRIPTION:Akné Deník - Čas na denní úkol! 💖
END:VALARM
END:VEVENT
END:VCALENDAR`
  }

  // Překlad hodnot
  const translateSkinType = (skinType) => {
    const translations = {
      'oily': 'Mastná pleť',
      'dry': 'Suchá pleť', 
      'combination': 'Smíšená pleť',
      'sensitive': 'Citlivá pleť',
      'normal': 'Normální pleť'
    }
    return translations[skinType] || skinType
  }

  const translateGoals = (goals) => {
    const translations = {
      'clear_acne': 'Zbavit se akné',
      'prevent_acne': 'Prevence akné',
      'reduce_scars': 'Redukce jizev',
      'maintain_clear': 'Udržení čisté pleti',
      'improve_texture': 'Zlepšení textury pleti'
    }
    return translations[goals] || goals
  }

  const getJoinDays = () => {
    if (!userData?.createdAt) return 0
    const joinDate = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt)
    return Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24))
  }

  const getProgressPercentage = () => {
    if (!userData?.completedDays) return 0
    return Math.round((userData.completedDays.length / 365) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Načítání profilu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Čistý jednoduchý header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Můj profil</h1>
                <p className="text-sm text-gray-500">Tvoje nastavení a informace</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-red-900 mb-1">Chyba</h3>
                <p className="text-sm text-red-700">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setError(null)}
                  className="mt-3 text-red-600 border-red-300 hover:bg-red-50"
                >
                  Zavřít
                </Button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-green-900 mb-1">Úspěch</h3>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profil uživatele - ČISTÝ DESIGN */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
            
            {/* Profilová fotka */}
            <div className="relative flex-shrink-0 mb-4 sm:mb-0">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200">
                {userData?.profilePhoto ? (
                  <img 
                    src={photoPreview || userData.profilePhoto} 
                    alt="Profilová fotka" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                {/* Upload overlay při nahrávání */}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              {/* Tlačítko pro změnu fotky */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>
            
            {/* Informace o uživateli */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {userData?.name || 'Uživatel'}
                </h2>
                
                {/* Premium Badge */}
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium User
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Člen od {new Date(userData?.createdAt?.toDate ? userData.createdAt.toDate() : userData?.createdAt || Date.now()).toLocaleDateString('cs-CZ')}
                  </span>
                </div>
                
                {userData?.skinType && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>{translateSkinType(userData.skinType)}</span>
                  </div>
                )}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-pink-600">{userData?.currentDay || 1}</p>
                  <p className="text-xs text-gray-500">Den</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{getProgressPercentage()}%</p>
                  <p className="text-xs text-gray-500">Dokončeno</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{getJoinDays()}</p>
                  <p className="text-xs text-gray-500">Dnů</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiky - VYLEPŠENÉ */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Detailní statistiky</h3>
              <p className="text-sm text-gray-600">Sleduj svůj pokrok v čase</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-8 h-8 text-pink-600" />
                <Badge variant="secondary" className="bg-pink-200 text-pink-800">
                  Aktuální
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{userData?.currentDay || 1}</p>
              <p className="text-sm text-gray-600">Den programu</p>
              <div className="mt-2">
                <div className="w-full bg-pink-200 rounded-full h-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((userData?.currentDay || 1) / 365) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <Heart className="w-8 h-8 text-purple-600" />
                <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                  Pokrok
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{getProgressPercentage()}%</p>
              <p className="text-sm text-gray-600">Dokončeno</p>
              <div className="mt-2">
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-8 h-8 text-green-600" />
                <Badge variant="secondary" className="bg-green-200 text-green-800">
                  Aktivita
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{getJoinDays()}</p>
              <p className="text-sm text-gray-600">Dnů s námi</p>
              <p className="text-xs text-gray-500 mt-1">
                Průměr: {userData?.completedDays ? (userData.completedDays.length / getJoinDays() * 100).toFixed(0) : 0}% aktivita
              </p>
            </div>
          </div>
        </div>

        {/* Základní informace */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Základní informace</h3>
                <p className="text-sm text-gray-600">Tvoje osobní údaje</p>
              </div>
            </div>
            
            {!editing && (
              <Button
                onClick={() => setEditing(true)}
                variant="outline"
                size="sm"
                className="text-pink-600 border-pink-300 hover:bg-pink-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Upravit údaje
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Jméno</Label>
              {editing ? (
                <Input
                  id="name"
                  value={editedData.name || ''}
                  onChange={(e) => setEditedData({...editedData, name: e.target.value})}
                  className="mt-2"
                  placeholder="Zadej své jméno"
                />
              ) : (
                <p className="mt-2 text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {userData?.name || 'Není vyplněno'}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Věk</Label>
              {editing ? (
                <Input
                  type="number"
                  min="13"
                  max="100"
                  value={editedData.age || ''}
                  onChange={(e) => setEditedData({...editedData, age: parseInt(e.target.value)})}
                  className="mt-2"
                  placeholder="Zadej svůj věk"
                />
              ) : (
                <p className="mt-2 text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {userData?.age ? `${userData.age} let` : 'Není vyplněno'}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Typ pleti</Label>
              {editing ? (
                <select
                  value={editedData.skinType || ''}
                  onChange={(e) => setEditedData({...editedData, skinType: e.target.value})}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Vyberte typ pleti</option>
                  <option value="oily">Mastná pleť</option>
                  <option value="dry">Suchá pleť</option>
                  <option value="combination">Smíšená pleť</option>
                  <option value="sensitive">Citlivá pleť</option>
                  <option value="normal">Normální pleť</option>
                </select>
              ) : (
                <p className="mt-2 text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {userData?.skinType ? translateSkinType(userData.skinType) : 'Není vyplněno'}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Cíle</Label>
              {editing ? (
                <select
                  value={editedData.goals || ''}
                  onChange={(e) => setEditedData({...editedData, goals: e.target.value})}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Vyberte hlavní cíl</option>
                  <option value="clear_acne">Zbavit se akné</option>
                  <option value="prevent_acne">Prevence akné</option>
                  <option value="reduce_scars">Redukce jizev</option>
                  <option value="maintain_clear">Udržení čisté pleti</option>
                  <option value="improve_texture">Zlepšení textury pleti</option>
                </select>
              ) : (
                <p className="mt-2 text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {userData?.goals ? translateGoals(userData.goals) : 'Není vyplněno'}
                </p>
              )}
            </div>
          </div>

          {editing && (
            <div className="flex items-center space-x-3 pt-6 mt-6 border-t">
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Uložit změny
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                <X className="w-4 h-4 mr-2" />
                Zrušit
              </Button>
            </div>
          )}
        </div>

        {/* 📅 PŘIPOMENUTÍ - NOVÁ SEKCE (místo notifikací) */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Připomenutí & Návyky</h3>
              <p className="text-sm text-gray-600">Nastav si způsob, jak nezapomenout na denní rutinu</p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Preferovaný čas */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-gray-900">Preferovaný čas pro péči</h4>
              </div>
              <div className="flex items-center space-x-3">
                <Input
                  type="time"
                  value={preferredReminderTime}
                  onChange={(e) => setPreferredReminderTime(e.target.value)}
                  className="w-32"
                />
                <span className="text-sm text-gray-600">
                  Ideální čas pro denní rutinu péče o pleť
                </span>
              </div>
            </div>

            {/* Export kalendáře */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Kalendářové připomenutí</h4>
                    <p className="text-sm text-gray-600">
                      Exportuj připomenutí do svého kalendáře na {preferredReminderTime}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleExportCalendar}
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportovat .ics
                </Button>
              </div>
            </div>

            {/* Další možnosti připomenutí */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* In-app připomenutí */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900">V aplikaci</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Připomenutí se zobrazí při otevření aplikace, pokud jsi dnes ještě nevyplnila úkol
                </p>
              </div>

              {/* Browser bookmark */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900">Záložka</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Přidej si aplikaci do oblíbených nebo na domovskou obrazovku
                </p>
              </div>

            </div>

            {/* Tips pro vytvoření návyku */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-yellow-900 mb-2">💡 Tipy pro pravidelnost:</p>
                  <ul className="text-yellow-800 space-y-1">
                    <li>• Navažte péči o pleť na existující návyk (např. čištění zubů)</li>
                    <li>• Připravte si produkty na viditelné místo</li>
                    <li>• Vyplňujte úkoly vždy ve stejnou denní dobu</li>
                    <li>• Oslavte malé úspěchy - každý dokončený den se počítá! 🎉</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Odhlášení */}
        <div className="bg-white border border-red-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Odhlásit se</p>
                <p className="text-sm text-gray-600">Ukončit relaci v aplikaci</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white border"
            >
              Odhlásit se
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfilePage