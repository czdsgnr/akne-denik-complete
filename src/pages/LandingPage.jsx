import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { 
  Heart, 
  MessageSquare, 
  Camera, 
  Target, 
  Calendar, 
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react'

function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Tvůj denní společník",
      description: "Akné Deník tě každý den provede péčí o pleť s osobními radami a motivací přesně pro tebe."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Denní motivace", 
      description: "Začni každý den s pozitivní zprávou a inspirací. Budeš se těšit na každé ranní otevření aplikace!"
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Fotodokumentace pokroku",
      description: "Zachyť svou cestu k dokonalé pleti. Sleduj vizuální pokrok a buď hrdá na každý krok vpřed."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalizované cíle",
      description: "Nastav si vlastní cíle a sleduj jejich plnění. Aplikace se přizpůsobí tvému tempu a potřebám."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Celoroční program",
      description: "365 dnů strukturovaného programu péče o pleť s postupným zlepšováním tvých návyků."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Systém odměn",
      description: "Získávej odznaky a odměny za dosažené milníky. Motivace, která tě bude hnát vpřed každý den."
    }
  ]

  const testimonials = [
    {
      name: "Anna K.",
      text: "Za 3 měsíce používání se moje pleť úplně změnila. Konečně mám rutinu, které se držím!",
      rating: 5,
      avatar: "A"
    },
    {
      name: "Tereza M.", 
      text: "Denní motivace mě vždy povzbudí. Aplikace je krásně navržená a intuitivní.",
      rating: 5,
      avatar: "T"
    },
    {
      name: "Klára S.",
      text: "Fotodokumentace mi ukázala, jak moc pokrok jsem udělala. Doporučuji všem!",
      rating: 5,
      avatar: "K"
    }
  ]

  const steps = [
    {
      number: "01",
      title: "Zaregistruj se",
      description: "Vytvoř si účet a vyplň základní informace o své pleti a cílech."
    },
    {
      number: "02", 
      title: "Získej svůj plán",
      description: "Dostaneš personalizovaný 365denní program péče o pleť."
    },
    {
      number: "03",
      title: "Sleduj pokrok",
      description: "Každý den plň úkoly, fotograf pokrok a získávej motivaci."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Akné Deník
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-pink-600"
              >
                Přihlášení
              </Button>
              <Button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg"
              >
                Začít zdarma
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Tvoje cesta k{' '}
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                dokonalé pleti
              </span>{' '}
              začíná dnes
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Akné Deník je tvůj osobní kouč pro péči o pleť. 365 dnů motivace, 
              úkolů a sledování pokroku na cestě za čistou a zdravou pletí.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-xl px-8 py-4 text-lg"
              >
                Začít svou cestu
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-pink-200 text-pink-700 hover:bg-pink-50 px-8 py-4 text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Jak to funguje
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Zdarma na 7 dní</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Bez závazků</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Okamžitý přístup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Jak to funguje?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tři jednoduché kroky k tvé nové každodenní rutině péče o pleť
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vše co potřebuješ pro úspěch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kompletní sada nástrojů pro transformaci tvé pleti
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl flex items-center justify-center text-pink-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Co říkají naše uživatelky
            </h2>
            <p className="text-xl text-gray-600">
              Přečti si zkušenosti těch, které už změnily svou pleť
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">Ověřený uživatel</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Jsi připravená změnit svou pleť?
          </h2>
          <p className="text-xl text-pink-100 mb-8 leading-relaxed">
            Připoj se k tisícům spokojených uživatelek a začni svou cestu za dokonalou pletí už dnes.
            První týden máš zdarma!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-white text-pink-600 hover:bg-gray-100 shadow-xl px-8 py-4 text-lg font-semibold"
            >
              Začít zdarma
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-pink-600 px-8 py-4 text-lg"
            >
              Více informací
            </Button>
          </div>

          <p className="text-pink-200 text-sm mt-6">
            Bez závazků • Kdykoli můžeš zrušit • Okamžitý přístup
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Akné Deník</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Tvůj každodenní průvodce na cestě za krásnou a zdravou pletí.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produkt</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Funkce</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ceník</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Podpora</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nápověda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Právní</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Podmínky použití</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ochrana soukromí</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Akné Deník. Všechna práva vyhrazena.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage