import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useNavigate } from 'react-router-dom'
import { 
  Crown,
  Check,
  X,
  ArrowLeft,
  Star,
  Shield,
  Sparkles,
  Calendar,
  Clock,
  Camera,
  BarChart3,
  MessageSquare,
  Smartphone,
  Heart,
  Zap,
  Gift,
  CreditCard,
  ChevronRight
} from 'lucide-react'

function SubscriptionPage() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('yearly') // default yearly pro slevu

  const handleBackClick = () => {
    navigate('/profile')
  }

  const handleSubscribe = (planType) => {
    // TODO: Zde bude Stripe integrace
    console.log(`Vybrán plán: ${planType}`)
    
    // Zatím pouze alert
    alert(`Brzy zde bude platba přes Stripe pro ${planType === 'monthly' ? 'měsíční' : 'roční'} plán!`)
  }

  const features = [
    {
      icon: Calendar,
      title: "Celoroční program",
      description: "365 dnů strukturovaného obsahu místo pouhých 21 dnů",
      premium: true
    },
    {
      icon: Camera,
      title: "Fotodokumentace pokroku",
      description: "Sledování změn s pravidelným fotografováním",
      premium: true
    },
    {
      icon: BarChart3,
      title: "Detailní statistiky",
      description: "Pokročilé grafy a analýzy tvého pokroku",
      premium: true
    },
    {
      icon: MessageSquare,
      title: "Chat s odborníky",
      description: "Přímá komunikace s dermatology a kosmetičkami",
      premium: true
    },
    {
      icon: Smartphone,
      title: "Mobilní aplikace",
      description: "Plně responzivní aplikace pro všechna zařízení",
      premium: false
    },
    {
      icon: Heart,
      title: "Základní sledování",
      description: "Záznam nálady a stavu pleti",
      premium: false
    },
    {
      icon: Shield,
      title: "Bezpečnost dat",
      description: "100% soukromé a šifrované informace",
      premium: false
    },
    {
      icon: Zap,
      title: "Personalizovaný obsah",
      description: "Úkoly přizpůsobené tvému typu pleti",
      premium: true
    }
  ]

  const trialFeatures = [
    "3 dny zdarma všech funkcí",
    "Celoroční program",
    "Fotodokumentace",
    "Základní statistiky"
  ]

  const premiumFeatures = [
    "Všechny funkce bez omezení",
    "365 denní program",
    "Pokročilé statistiky a grafy", 
    "Fotodokumentace pokroku",
    "Chat s odborníky",
    "Personalizované tipy",
    "Export dat a reportů",
    "Prioritní podpora"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zpět na profil</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Předplatné</h1>
                <p className="text-sm text-gray-600">Odemkni všechny funkce</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero sekce */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <span className="text-orange-800 font-medium">Získej plný přístup</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Přeměň svou pleť s naším
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> prémiým programem</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Získej přístup k celoročnímu programu péče o pleť, pokročilým statistikám 
            a personalizovaným tipům od odborníků.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Měsíční plán */}
          <Card className={`relative overflow-hidden border-2 transition-all duration-300 ${
            selectedPlan === 'monthly' 
              ? 'border-orange-400 shadow-xl scale-105' 
              : 'border-gray-200 hover:border-orange-200'
          }`}>
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Měsíční plán</CardTitle>
              <p className="text-gray-600">Flexibilní řešení</p>
              
              <div className="mt-6">
                <div className="text-5xl font-bold text-gray-900">197</div>
                <div className="text-lg text-gray-600">Kč / měsíc</div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button
                onClick={() => handleSubscribe('monthly')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold mb-6"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Vybrat měsíční plán
              </Button>
              
              <div className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Roční plán - DOPORUČENÝ */}
          <Card className={`relative overflow-hidden border-2 transition-all duration-300 ${
            selectedPlan === 'yearly' 
              ? 'border-yellow-400 shadow-2xl scale-105' 
              : 'border-yellow-300 hover:border-yellow-400'
          }`}>
            
            {/* RECOMMENDED Badge */}
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-bl-xl rounded-tr-xl font-bold text-sm shadow-lg">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>DOPORUČENO</span>
              </div>
            </div>
            
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Roční plán</CardTitle>
              <p className="text-orange-600 font-semibold">Ušetři 1462 Kč ročně!</p>
              
              <div className="mt-6">
                <div className="text-sm text-gray-500 line-through">2364 Kč/rok</div>
                <div className="text-5xl font-bold text-gray-900">899</div>
                <div className="text-lg text-gray-600">Kč / rok</div>
                <div className="text-sm text-orange-600 font-medium mt-1">
                  Jen 75 Kč/měsíc
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button
                onClick={() => handleSubscribe('yearly')}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 text-lg font-semibold mb-6 shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Vybrat roční plán
              </Button>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">Bonus při ročním plánu:</span>
                </div>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Prioritní zákaznická podpora</li>
                  <li>• Exkluzivní tipy od odborníků</li>
                  <li>• Roční report pokroku zdarma</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Porovnání funkcí */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Porovnání funkcí
          </h3>
          
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-6">
                  <h4 className="font-semibold text-gray-900">Funkce</h4>
                </div>
                <div className="col-span-3 text-center">
                  <div className="inline-flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800 font-medium text-sm">Trial</span>
                  </div>
                </div>
                <div className="col-span-3 text-center">
                  <div className="inline-flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                    <Crown className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-800 font-medium text-sm">Premium</span>
                  </div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-0">
              {features.map((feature, index) => (
                <div key={index} className={`grid grid-cols-12 gap-4 items-center px-6 py-4 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}>
                  <div className="col-span-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{feature.title}</h5>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 text-center">
                    {feature.premium ? (
                      <div className="inline-flex items-center space-x-1 text-blue-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">3 dny</span>
                      </div>
                    ) : (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    )}
                  </div>
                  <div className="col-span-3 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* FAQ sekce */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Často kladené otázky
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Můžu zrušit kdykoliv?</h4>
                <p className="text-gray-600">
                  Ano, předplatné můžeš zrušit kdykoliv bez udání důvodu. 
                  Při ročním plánu získáš poměrnou část zpět.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Je to bezpečné?</h4>
                <p className="text-gray-600">
                  Platby zpracovává Stripe - nejbezpečnější platební brána. 
                  Tvoje data jsou šifrována a chráněna podle GDPR.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Funguje to skutečně?</h4>
                <p className="text-gray-600">
                  Náš program je založen na vědeckých poznatcích a už pomohl 
                  tisícům uživatelek dosáhnout krásné pleti.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Dostanu podporu?</h4>
                <p className="text-gray-600">
                  Ano! Premium uživatelé mají přístup k chatu s odborníky 
                  a prioritní emailové podpoře.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA sekce */}
        <div className="text-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Začni svou cestu ke krásné pleti ještě dnes
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Připoj se k tisícům spokojeným uživatelkám, které už dosáhly svých cílů.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => handleSubscribe('yearly')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Začít s ročním plánem
              </Button>
              
              <Button
                onClick={() => handleSubscribe('monthly')}
                variant="outline"
                className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-3 text-lg font-semibold"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Zkusit měsíční plán
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 mt-4">
              💳 Bezpečné platby přes Stripe • 🔒 100% soukromé • ❌ Možnost zrušení kdykoliv
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPage