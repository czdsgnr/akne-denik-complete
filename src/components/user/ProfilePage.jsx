import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { useNavigate } from 'react-router-dom'
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
  Clock,
  Star,
  CalendarDays,
  FileText,
  CreditCard,
  Crown,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
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
  
  // 🆕 ZÁLOŽKY STATE
  const [activeTab, setActiveTab] = useState('overview')
  const [basicInfoExpanded, setBasicInfoExpanded] = useState(false)

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

  // 📅 FUNKCE PRO VÝPOČET DNÍ OD REGISTRACE
  const getDaysFromRegistration = () => {
    if (!userData?.createdAt) return 0
    const registrationDate = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt)
    const today = new Date()
    const diffInMs = today.getTime() - registrationDate.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    return Math.max(0, diffInDays)
  }

  // 🎯 FUNKCE PRO ZJIŠTĚNÍ STAVU TRIALU
  const getTrialStatus = () => {
    const daysFromRegistration = getDaysFromRegistration()
    const extendedDays = userData?.trialExtendedDays || 0
    const totalTrialDays = 3 + extendedDays // 3 základní + prodloužené
    const remainingDays = Math.max(0, totalTrialDays - daysFromRegistration)
    
    return {
      isTrialActive: remainingDays > 0,
      remainingDays,
      daysFromRegistration,
      hasExtended: extendedDays > 0,
      totalTrialDays
    }
  }

  const trialStatus = getTrialStatus()

  // 📱 FUNKCE PRO UPLOAD FOTKY
  const handlePhotoSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Základní validace
    if (!file.type.startsWith('image/')) {
      setError('Prosím nahrajte pouze obrázek')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Obrázek je příliš velký (max 5MB)')
      return
    }

    try {
      setUploadingPhoto(true)
      setError(null)

      // Vytvoření náhledu
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target.result)
      reader.readAsDataURL(file)

      // Simulace uploadu (v produkci by to bylo do Firebase Storage)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Aktualizace profilu s novou fotkou
      await updateDoc(doc(db, 'users', user.uid), {
        profilePhoto: photoPreview, // V produkci by to byla URL z Storage
        updatedAt: new Date()
      })

      setSuccess('Profilová fotka byla úspěšně nahrána!')
      
    } catch (error) {
      console.error('Chyba při nahrávání fotky:', error)
      setError('Chyba při nahrávání fotky')
      setPhotoPreview(null)
    } finally {
      setUploadingPhoto(false)
    }
  }

  // 💾 FUNKCE PRO ULOŽENÍ ÚDAJŮ
  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      await updateDoc(doc(db, 'users', user.uid), {
        ...editedData,
        preferredReminderTime,
        updatedAt: new Date()
      })

      setUserData({ ...userData, ...editedData, preferredReminderTime })
      setEditing(false)
      setSuccess('Profil byl úspěšně aktualizován!')
      
    } catch (error) {
      console.error('Chyba při ukládání:', error)
      setError('Chyba při ukládání profilu')
    } finally {
      setSaving(false)
    }
  }

  // 📊 POMOCNÉ FUNKCE PRO STATISTIKY
  const getProgressPercentage = () => {
    if (!userData?.completedDays || !userData?.currentDay) return 0
    return Math.round((userData.completedDays.length / userData.currentDay) * 100)
  }

  const getJoinDays = () => {
    if (!userData?.createdAt) return 0
    const joinDate = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt)
    const today = new Date()
    const diffInMs = today.getTime() - joinDate.getTime()
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
  }

  const translateSkinType = (type) => {
    const translations = {
      'dry': 'Suchá pleť',
      'oily': 'Mastná pleť', 
      'combination': 'Kombinovaná pleť',
      'sensitive': 'Citlivá pleť',
      'normal': 'Normální pleť'
    }
    return translations[type] || type
  }

  // 🔄 FUNKCE PRO ODHLÁŠENÍ
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Chyba při odhlašování:', error)
      setError('Chyba při odhlašování')
    }
  }

  // 🆕 FUNKCE PRO PŘECHOD NA PŘEDPLATNÉ
  const handleSubscriptionClick = () => {
    navigate('/subscription')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Načítání profilu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
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

        {/* Profil uživatele - HLAVNÍ KARTA */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
            
            {/* Profilová fotka */}
            <div className="relative flex-shrink-0 mb-4 sm:mb-0">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200">
                {userData?.profilePhoto || photoPreview ? (
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
                
                {/* Trial Badge */}
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 px-3 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {trialStatus.isTrialActive 
                    ? `${trialStatus.hasExtended ? 'Prodloužený' : 'Třídenní'} trial (${trialStatus.remainingDays} ${trialStatus.remainingDays === 1 ? 'den' : 'dnů'})`
                    : 'Trial skončil'
                  }
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
                    Člen od {new Date(userData?.createdAt?.toDate ? 
                      userData.createdAt.toDate() : userData?.createdAt || Date.now()).toLocaleDateString('cs-CZ')}
                  </span>
                </div>
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

        {/* 🚨 TRIAL UPOZORNĚNÍ */}
        {trialStatus.isTrialActive && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-1">
                  Zbývá {trialStatus.remainingDays} {trialStatus.remainingDays === 1 ? 'den' : 'dny'} {trialStatus.hasExtended ? 'prodlouženého' : ''} trialu
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  {trialStatus.hasExtended 
                    ? 'Užij si poslední den zdarma! Poté si vyber předplatné.'
                    : 'Užij si všechny funkce akné deníku během zkušebního období!'
                  }
                </p>
                <Button
                  onClick={handleSubscriptionClick}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  Zjistit více o předplatném
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 🆕 ZÁKLADNÍ INFORMACE - ZÁLOŽKA */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="p-6">
            <button
              onClick={() => setBasicInfoExpanded(!basicInfoExpanded)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Základní informace</h3>
                  <p className="text-sm text-gray-600">Tvoje osobní údaje</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!basicInfoExpanded && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-pink-600 border-pink-300 hover:bg-pink-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      setBasicInfoExpanded(true)
                      setEditing(true)
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Upravit
                  </Button>
                )}
                
                {basicInfoExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* 🔽 ROZBALENÝ OBSAH ZÁKLADNÍCH INFORMACÍ */}
            {basicInfoExpanded && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Jméno</Label>
                    {editing ? (
                      <Input
                        id="name"
                        value={editedData.name || ''}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{userData?.name || 'Nenastaveno'}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="age" className="text-sm font-medium text-gray-700">Věk</Label>
                    {editing ? (
                      <Input
                        id="age"
                        type="number"
                        value={editedData.age || ''}
                        onChange={(e) => setEditedData({ ...editedData, age: parseInt(e.target.value) })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{userData?.age || 'Nenastaveno'} let</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="skinType" className="text-sm font-medium text-gray-700">Typ pleti</Label>
                    {editing ? (
                      <select
                        id="skinType"
                        value={editedData.skinType || ''}
                        onChange={(e) => setEditedData({ ...editedData, skinType: e.target.value })}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Vyberte typ pleti</option>
                        <option value="dry">Suchá pleť</option>
                        <option value="oily">Mastná pleť</option>
                        <option value="combination">Kombinovaná pleť</option>
                        <option value="sensitive">Citlivá pleť</option>
                        <option value="normal">Normální pleť</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-gray-900">{translateSkinType(userData?.skinType) || 'Nenastaveno'}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">Město</Label>
                    {editing ? (
                      <Input
                        id="city"
                        value={editedData.city || ''}
                        onChange={(e) => setEditedData({ ...editedData, city: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{userData?.city || 'Nenastaveno'}</p>
                    )}
                  </div>
                </div>

                {editing && (
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-100">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditing(false)
                        setEditedData(userData || {})
                      }}
                      disabled={saving}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Zrušit
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Ukládám...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Uložit změny
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 🆕 TLAČÍTKO PŘEDPLATNÉHO */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Předplatné členství</h3>
                <p className="text-gray-600">Odemkni všechny prémiové funkce</p>
              </div>
            </div>
            
            <Button
              onClick={handleSubscriptionClick}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 text-lg font-semibold shadow-lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Zobrazit plány
            </Button>
          </div>
        </div>

        {/* Statistiky */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tvoje statistiky</h3>
              <p className="text-sm text-gray-600">Přehled tvého pokroku</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Nastavení */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Nastavení</h3>
              <p className="text-sm text-gray-600">Personalizace aplikace</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="reminderTime" className="text-sm font-medium text-gray-700">
                Preferovaný čas připomenutí
              </Label>
              <Input
                id="reminderTime"
                type="time"
                value={preferredReminderTime}
                onChange={(e) => setPreferredReminderTime(e.target.value)}
                className="mt-1 w-48"
              />
              <p className="text-xs text-gray-500 mt-1">
                Denní připomenutí pro vyplnění akné deníku
              </p>
            </div>
          </div>
        </div>

        {/* Akce */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Účet</h3>
              <p className="text-sm text-gray-600">Správa účtu</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Odhlásit se
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage