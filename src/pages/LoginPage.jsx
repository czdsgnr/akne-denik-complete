import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Heart, ArrowLeft, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      await login(email, password)
      // Přesměrování se řeší automaticky v AppContent
    } catch (error) {
      setError('Nesprávný email nebo heslo. Zkuste to znovu.')
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
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Vítej zpět!
              </CardTitle>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Přihlas se do svého Akné Deníku
              </p>
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tvuj@email.cz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 text-base"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Heslo
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tvoje heslo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 text-base"
                    required
                    autoComplete="current-password"
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

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-pink-600 hover:text-pink-700 hover:underline focus:outline-none focus:underline"
                >
                  Zapomněl/a jsi heslo?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full h-12 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Přihlašuji...</span>
                  </div>
                ) : (
                  'Přihlásit se'
                )}
              </Button>

            </form>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm">
                Nemáš ještě účet?{' '}
                <Link 
                  to="/register"
                  className="font-semibold text-pink-600 hover:text-pink-700 hover:underline focus:outline-none focus:underline transition-colors"
                >
                  Zaregistruj se zdarma
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

export default LoginPage