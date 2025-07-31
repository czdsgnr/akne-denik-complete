import React, { useState } from 'react'
import { Button } from './button'
import { Badge } from './badge'
import { useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../hooks/useAuth'
import { 
  X, 
  Crown, 
  Calendar, 
  Clock, 
  Star, 
  Gift, 
  Check,
  Loader2,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Heart,
  Sparkles
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51Gum7DEvtJZVfPXM38InkyMzdr4xXts29GTxTcy7ZjewhRVpKT4wcdrm0yKiRgQxhqYDxKmZGu2mz0oti5eyUzSi00ppfmdv7o'

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

// Card element styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  },
  hidePostalCode: true
}

function TrialExpiredBottomSheet({ isOpen, onClose, userData, onTrialExtended }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [extending, setExtending] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  const hasExtended = userData?.trialExtendedDays > 0
  const canExtend = !hasExtended
  
  const handleExtendTrial = async () => {
    if (hasExtended || !user) return
    
    try {
      setExtending(true)
      setError(null)
      
      console.log('🔄 Prodlužuji trial pro:', user.uid)
      
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        trialExtendedDays: 1,
        trialExtendedAt: new Date(),
        updatedAt: new Date()
      })
      
      console.log('✅ Trial prodloužen úspěšně')
      setSuccess('Trial byl prodloužen o 1 den! 🎉')
      
      if (onTrialExtended) {
        await onTrialExtended()
      }
      
      setTimeout(() => {
        onClose()
        setSuccess(null)
      }, 2000)
      
    } catch (error) {
      console.error('❌ Chyba při prodlužování trialu:', error)
      setError('Chyba při prodlužování trialu. Zkus to znovu.')
    } finally {
      setExtending(false)
    }
  }

  const handleNavigateToSubscription = () => {
    navigate('/subscription')
    onClose()
  }

  const handleNavigateToProfile = () => {
    navigate('/profile')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Trial skončil</h2>
                <p className="text-sm text-gray-600">Co budeš dělat dál?</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {canExtend && !success && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  🎁 Bonus den zdarma!
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Můžeš si prodloužit trial o <strong>1 další den zcela zdarma</strong>. 
                  Tuto možnost máš pouze jednou, tak ji využij! ✨
                </p>
                
                <Button
                  onClick={handleExtendTrial}
                  disabled={extending}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 font-semibold shadow-lg transform transition-all hover:scale-105"
                >
                  {extending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Prodlužuji trial...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 mr-2" />
                      Prodloužit o 1 den zdarma
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-600 mt-3">
                  💡 Po využití bonusového dne si můžeš vybrat předplatné
                </p>
              </div>
            </div>
          )}

          {!success && (
            <>
              <div className="text-center py-4">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-xl font-bold text-gray-900">Nebo si vyber předplatné</h3>
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-gray-600">
                  Pokračuj s <strong>neomezeným přístupem</strong> ke všem funkcím
                </p>
              </div>

              <div className="relative">
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10 flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>NEJLEPŠÍ</span>
                </div>
                
                <Elements stripe={stripePromise}>
                  <SubscriptionCard
                    title="Roční plán"
                    price="899"
                    originalPrice="2364"
                    period="za celý rok"
                    monthlyEquivalent="jen 75 Kč/měsíc"
                    savings="Ušetříš 1462 Kč!"
                    features={[
                      "Celoroční program (365 dnů)",
                      "Pokročilé statistiky a grafy", 
                      "Fotodokumentace pokroku",
                      "Chat s odborníky",
                      "Prioritní zákaznická podpora",
                      "Roční report pokroku zdarma"
                    ]}
                    gradient="from-yellow-500 to-orange-500"
                    planType="yearly"
                    onClose={onClose}
                    isRecommended={true}
                  />
                </Elements>
              </div>

              <Elements stripe={stripePromise}>
                <SubscriptionCard
                  title="Měsíční plán"
                  price="197"
                  period="za měsíc"
                  features={[
                    "Všechny prémiové funkce",
                    "Flexibilní měsíční platba",
                    "Možnost zrušení kdykoliv"
                  ]}
                  gradient="from-blue-500 to-indigo-500"
                  planType="monthly" 
                  onClose={onClose}
                />
              </Elements>
            </>
          )}

          <div className="pt-6 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleNavigateToSubscription}
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Zobrazit plány
              </Button>
              
              <Button
                variant="outline"
                onClick={handleNavigateToProfile}
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                <Heart className="w-4 h-4 mr-2" />
                Můj profil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubscriptionCard({ 
  title, 
  price, 
  originalPrice, 
  period, 
  monthlyEquivalent, 
  savings, 
  features, 
  gradient, 
  planType,
  onClose,
  isRecommended = false
}) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [showCardForm, setShowCardForm] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  
  const handleSubscribe = async () => {
    if (!stripe || !elements || !user) {
      setError('Načítání platebního systému...')
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Zadejte platební údaje')
      return
    }

    try {
      setProcessing(true)
      setError(null)

      console.log('🔄 Vytváření platby pro:', { planType, price })
      
      // Vytvoř Payment Intent
      const response = await fetch('/api/stripe-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          userId: user.uid,
          email: user.email
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Chyba při vytváření platby')
      }
      
      const { clientSecret } = await response.json()
      console.log('✅ Payment intent vytvořen')

      // Potvrď platbu
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: user.email,
              name: user.displayName || user.email
            }
          }
        }
      )

      if (stripeError) {
        setError(stripeError.message)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('✅ Platba úspěšná:', paymentIntent.id)
        setSucceeded(true)
        
        // Aktualizuj uživatele v Firebase
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {
          subscriptionStatus: 'active',
          subscriptionType: planType,
          subscriptionStartDate: new Date(),
          subscriptionEndDate: planType === 'yearly' 
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          lastPaymentId: paymentIntent.id,
          updatedAt: new Date()
        })
        
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 2000)
      }
      
    } catch (error) {
      console.error('❌ Chyba při platbě:', error)
      setError(error.message || 'Chyba při zpracování platby')
    } finally {
      setProcessing(false)
    }
  }

  if (succeeded) {
    return (
      <div className={`bg-gradient-to-r ${gradient} p-1 rounded-2xl shadow-lg`}>
        <div className="bg-white rounded-xl p-6">
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Platba byla úspěšná! 🎉
            </h3>
            <p className="text-gray-600">
              Děkujeme za důvěru. Přesměrováváme...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r ${gradient} p-1 rounded-2xl shadow-lg ${isRecommended ? 'ring-2 ring-yellow-300' : ''}`}>
      <div className="bg-white rounded-xl p-6">
        <div className="text-center mb-6">
          <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
          {savings && (
            <p className="text-sm text-orange-600 font-semibold bg-orange-50 px-3 py-1 rounded-full inline-block">
              {savings}
            </p>
          )}
          
          <div className="mt-4">
            {originalPrice && (
              <div className="text-sm text-gray-500 line-through">{originalPrice} Kč</div>
            )}
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-bold text-gray-900">{price}</span>
              <span className="text-lg text-gray-600 ml-1">Kč</span>
            </div>
            <div className="text-gray-600">{period}</div>
            {monthlyEquivalent && (
              <div className="text-sm text-orange-600 font-medium mt-1">{monthlyEquivalent}</div>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 text-sm">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </p>
          </div>
        )}

        {showCardForm && (
          <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platební karta
            </label>
            <div className="bg-white p-3 border rounded-md">
              <CardElement options={cardElementOptions} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Testovací karta: 4242 4242 4242 4242
            </p>
          </div>
        )}

        <Button
          onClick={showCardForm ? handleSubscribe : () => setShowCardForm(true)}
          disabled={processing || !stripe}
          className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white py-3 font-semibold shadow-lg transition-all`}
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Zpracovávám platbu...
            </>
          ) : showCardForm ? (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Zaplatit {price} Kč
            </>
          ) : (
            <>
              <Crown className="w-5 h-5 mr-2" />
              Vybrat {title.toLowerCase()}
            </>
          )}
        </Button>

        {!showCardForm && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Bezpečná platba přes Stripe
          </p>
        )}
      </div>
    </div>
  )
}

export default TrialExpiredBottomSheet