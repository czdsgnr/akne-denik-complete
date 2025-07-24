import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { 
  MessageSquare, 
  Send, 
  User, 
  Shield, 
  Clock,
  Heart,
  Info,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { db } from '../../lib/firebase'
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc 
} from 'firebase/firestore'

function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserData(data)
        } else {
          setError('Uživatelská data nenalezena. Zkuste se znovu přihlásit.')
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        setError('Chyba při načítání uživatelských dat: ' + error.message)
      }
    }

    loadUserData()
  }, [user])

  useEffect(() => {
    if (!user) return

    // Real-time poslouchání zpráv pro konkrétního uživatele
    const messagesQuery = query(
      collection(db, 'messages'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'asc')
    )

    const unsubscribe = onSnapshot(messagesQuery, 
      (snapshot) => {
        const messagesData = []
        
        snapshot.forEach((doc) => {
          messagesData.push({ id: doc.id, ...doc.data() })
        })
        
        setMessages(messagesData)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error('Messages listener error:', error)
        
        // Fallback pro případ, že index ještě není ready
        if (error.code === 'failed-precondition') {
          const fallbackQuery = query(
            collection(db, 'messages'), 
            where('userId', '==', user.uid)
          )
          
          const fallbackUnsubscribe = onSnapshot(fallbackQuery, (snapshot) => {
            const messagesData = []
            snapshot.forEach((doc) => {
              messagesData.push({ id: doc.id, ...doc.data() })
            })
            
            // Řazení na klientu
            messagesData.sort((a, b) => {
              const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
              const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
              return aTime - bTime
            })
            
            setMessages(messagesData)
            setLoading(false)
          })
          
          return fallbackUnsubscribe
        }
        
        setError('Chyba při načítání zpráv: ' + error.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    if (!user) {
      setError('Nejste přihlášeni')
      return
    }

    setSending(true)
    setError(null)

    try {
      const messageData = {
        userId: user.uid,
        userEmail: user.email,
        userName: userData?.name || 'Uživatel',
        message: newMessage.trim(),
        isFromUser: true,
        createdAt: new Date(),
        isRead: false
      }
      
      await addDoc(collection(db, 'messages'), messageData)
      
      setNewMessage('')
      setError(null)
      
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Uživatelsky přívětivé chybové hlášky
      if (error.code === 'permission-denied') {
        setError('Nemáte oprávnění k odeslání zprávy. Zkontrolujte přihlášení.')
      } else if (error.code === 'unauthenticated') {
        setError('Nejste přihlášeni. Přihlaste se znovu.')
      } else {
        setError('Chyba při odesílání zprávy: ' + error.message)
      }
    } finally {
      setSending(false)
    }
  }

  const formatTime = (date) => {
    if (!date) return ''
    const messageDate = date.toDate ? date.toDate() : new Date(date)
    return messageDate.toLocaleString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Načítání konverzace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Chat s podporou</h1>
                <p className="text-sm text-gray-500">Jsme tu pro tebe!</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Error Alert */}
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
        
        {/* Info card */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Podpora a pomoc</h3>
              <p className="text-sm text-gray-600">
                Můžeš se ptát na cokoliv ohledně péče o pleť, aplikace nebo svého pokroku. 
                Odpovídáme obvykle do 24 hodin.
              </p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="h-[500px] overflow-y-auto">
            
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Zatím žádné zprávy</h3>
                  <p className="text-gray-500">Pošli svou první zprávu a začni konverzaci!</p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end space-x-3 ${
                      message.isFromUser ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.isFromUser 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {message.isFromUser ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`max-w-xs lg:max-w-md ${
                      message.isFromUser ? 'text-right' : 'text-left'
                    }`}>
                      <div
                        className={`inline-block rounded-2xl px-4 py-3 ${
                          message.isFromUser
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.message}</p>
                      </div>
                      
                      {/* Timestamp */}
                      <div className={`flex items-center mt-1 space-x-1 text-xs text-gray-400 ${
                        message.isFromUser ? 'justify-end' : 'justify-start'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(message.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="flex space-x-3">
              <div className="flex-1">
                <Textarea
                  placeholder="Napiš svou zprávu..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-0 resize-none border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                disabled={!newMessage.trim() || sending || !user}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 self-end"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Stiskni Enter pro odeslání, Shift+Enter pro nový řádek</span>
              {user && (
                <span className="text-green-600 font-medium">
                  ✓ Přihlášen jako: {user.email}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Quick Messages */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Rychlé zprávy:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Jak mám pečovat o pleť?',
              'Mám problém s aplikací',
              'Kdy uvidím výsledky?',
              'Potřebuji pomoc s fotografováním'
            ].map((quickMessage) => (
              <Button
                key={quickMessage}
                variant="outline"
                size="sm"
                onClick={() => setNewMessage(quickMessage)}
                className="text-xs border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                disabled={sending}
              >
                {quickMessage}
              </Button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ChatPage