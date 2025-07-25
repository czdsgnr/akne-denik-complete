import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { 
  Heart, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Calendar,
  Target,
  Palette,
  AlertCircle, 
  CheckCircle,
  Eye, 
  EyeOff,
  Shield,
  Check
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { register } = useAuth()

  // Form data
  const [formData, setFormData] = useState({
    // Krok 1 - Základní údaje
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    
    // Krok 2 - Profil péče o pleť
    age: '',
    skinType: '',
    currentSkinCondition: '',
    goals: '',
    previousTreatments: '',
    currentRoutine: ''
  })

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Prosím vyplňte všechna povinná pole')
      return false
    }
    if (formData.password !== formData.passwordConfirm) {
      setError('Hesla se neshodují')
      return false
    }
    if (formData.password.length < 6) {
      setError('Heslo musí mít alespoň 6 znaků')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.age || !formData.skinType || !formData.goals) {
      setError('Prosím vyplňte všechna povinná pole')
      return false
    }
    return true
  }

  const handleNext = () => {
    setError('')
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    setError('')
    setStep(1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateStep2()) return

    setLoading(true)
    try {
      await register(formData.email, formData.password, {
        name: formData.name,
        age: parseInt(formData.age),
        skinType: formData.skinType,
        currentSkinCondition: formData.currentSkinCondition,
        goals: formData.goals,
        previousTreatments: formData.previousTreatments,
        currentRoutine: formData.currentRoutine
      })
      // Přesměrování se řeší automaticky v AppContent
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      
      <div className="w-full max-w-md space-y-6">
        
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {step === 1 ? 'Začni svou cestu' : 'Řekni nám o sobě'}
              </CardTitle>
              <p className="text-gray-600 mt-2 text-sm">
                {step === 1 
                  ? 'Vytvoř si účet v Akné Deníku' 
                  : 'Personalizuj svůj program péče o pleť'
                }
              </p>
            </div>

            {/* Vylepšený Progress indicator */}
            <div className="flex items-center justify-center space-x-3 pt-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  step >= 1 ? 'bg-pink-600 text-white shadow-lg' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className={`text-xs font-medium ${step >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
                  Účet
                </span>
              </div>
              
              <div className={`h-1 w-8 sm:w-12 rounded transition-all duration-300 ${
                step >= 2 ? 'bg-pink-600' : 'bg-gray-200'
              }`} />
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  step >= 2 ? 'bg-pink-600 text-white shadow-lg' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`text-xs font-medium ${step >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
                  Profil
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-4 sm:px-6">
            
            {/* Error Message */}
            {error && (
              <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">{error}</p>
              </div>
            )}

            {/* Krok 1 - Základní údaje */}
            {step === 1 && (
              <div className="space-y-4">
                
                {/* Jméno */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Jméno *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Tvoje jméno"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 text-base"
                      required
                      autoComplete="given-name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tvuj@email.cz"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 text-base"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Heslo */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Heslo *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Alespoň 6 znaků"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 text-base"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Potvrzení hesla */}
                <div className="space-y-2">
                  <Label htmlFor="passwordConfirm" className="text-sm font-medium text-gray-700">
                    Potvrzení hesla *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="passwordConfirm"
                      type="password"
                      placeholder="Zopakuj heslo"
                      value={formData.passwordConfirm}
                      onChange={(e) => updateFormData('passwordConfirm', e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 text-base"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800 leading-relaxed">
                      <p className="font-medium mb-1">Tvoje data jsou v bezpečí</p>
                      <p>Všechny informace jsou šifrovaně uložené a nikdy je nesdílíme s třetími stranami.</p>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <Button
                  onClick={handleNext}
                  className="w-full h-12 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200"
                >
                  Pokračovat
                </Button>

              </div>
            )}

            {/* Krok 2 - Profil péče o pleť */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Věk */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                    Věk *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="age"
                      type="number"
                      min="13"
                      max="99"
                      placeholder="Kolik ti je let?"
                      value={formData.age}
                      onChange={(e) => updateFormData('age', e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 text-base"
                      required
                    />
                  </div>
                </div>

                {/* Typ pleti - Optimalizované pro Safari */}
                <div className="space-y-2">
                  <Label htmlFor="skinType" className="text-sm font-medium text-gray-700">
                    Typ pleti *
                  </Label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                    <select
                      id="skinType"
                      value={formData.skinType}
                      onChange={(e) => updateFormData('skinType', e.target.value)}
                      className="w-full pl-10 pr-8 h-12 border border-gray-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-400 bg-white text-base appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Vyber typ pleti</option>
                      <option value="oily">Mastná pleť</option>
                      <option value="dry">Suchá pleť</option>
                      <option value="combination">Smíšená pleť</option>
                      <option value="sensitive">Citlivá pleť</option>
                      <option value="normal">Normální pleť</option>
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Současný stav pleti */}
                <div className="space-y-2">
                  <Label htmlFor="currentCondition" className="text-sm font-medium text-gray-700">
                    Současný stav pleti
                  </Label>
                  <div className="relative">
                    <select
                      id="currentCondition"
                      value={formData.currentSkinCondition}
                      onChange={(e) => updateFormData('currentSkinCondition', e.target.value)}
                      className="w-full pr-8 h-12 border border-gray-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-400 bg-white text-base appearance-none cursor-pointer"
                    >
                      <option value="">Vyber současný stav</option>
                      <option value="mild">Mírné akné (občasné pupínky)</option>
                      <option value="moderate">Střední akné (pravidelné pupínky)</option>
                      <option value="severe">Silné akné (hodně pupínků)</option>
                      <option value="recovering">Zotavující se (po léčbě)</option>
                      <option value="maintenance">Udržovací režim (čistá pleť)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Cíle */}
                <div className="space-y-2">
                  <Label htmlFor="goals" className="text-sm font-medium text-gray-700">
                    Hlavní cíl *
                  </Label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                    <select
                      id="goals"
                      value={formData.goals}
                      onChange={(e) => updateFormData('goals', e.target.value)}
                      className="w-full pl-10 pr-8 h-12 border border-gray-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-400 bg-white text-base appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Vyber svůj hlavní cíl</option>
                      <option value="clear_acne">Zbavit se akné</option>
                      <option value="prevent_acne">Prevence akné</option>
                      <option value="reduce_scars">Redukce jizev po akné</option>
                      <option value="maintain_clear">Udržení čisté pleti</option>
                      <option value="build_routine">Vybudovat rutinu</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Privacy Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-green-800 leading-relaxed">
                      <p className="font-medium mb-1">100% soukromé informace</p>
                      <p>Tvůj profil slouží jen pro personalizaci programu a nikdo jiný k němu nemá přístup.</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex space-x-3 pt-2">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Zpět
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Vytvářím...</span>
                      </div>
                    ) : (
                      'Vytvořit účet'
                    )}
                  </Button>
                </div>

              </form>
            )}

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm">
                Už máš účet?{' '}
                <Link 
                  to="/login"
                  className="font-semibold text-pink-600 hover:text-pink-700 hover:underline focus:outline-none focus:underline transition-colors"
                >
                  Přihlas se
                </Link>
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Back to Home - Pod formulářem */}
        <div className="text-center">
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Zpět na hlavní stránku</span>
          </Link>
        </div>

      </div>

    </div>
  )
}

export default RegisterPage