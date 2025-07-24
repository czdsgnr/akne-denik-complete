import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { 
  MessageSquare, 
  Send, 
  User, 
  Shield, 
  Clock,
  Mail,
  Filter,
  Search,
  MailOpen,
  Reply,
  Archive,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react'
import { db } from '../../lib/firebase'
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  where,
  onSnapshot
} from 'firebase/firestore'

function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [filter, setFilter] = useState('all') // all, unread, replied
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    console.log('🔥 Setting up admin messages real-time listener')
    
    // REAL-TIME poslouchání všech zpráv
    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      console.log('📬 Admin messages snapshot received, docs:', snapshot.size)
      const messagesData = []
      
      // Získání všech zpráv
      for (const messageDoc of snapshot.docs) {
        const messageData = { id: messageDoc.id, ...messageDoc.data() }
        messagesData.push(messageData)
      }

      console.log('📋 Processing messages for conversations...')

      // Seskupení zpráv podle userId do konverzací
      const conversationsMap = new Map()
      
      for (const message of messagesData) {
        const userId = message.userId
        
        if (!conversationsMap.has(userId)) {
          conversationsMap.set(userId, {
            userId,
            userName: message.userName || 'Neznámý uživatel',
            userEmail: message.userEmail || '',
            messages: [],
            lastMessage: null,
            unreadCount: 0,
            hasUnread: false
          })
        }
        
        const conversation = conversationsMap.get(userId)
        conversation.messages.push(message)
        
        // Nastavení poslední zprávy
        if (!conversation.lastMessage || message.createdAt > conversation.lastMessage.createdAt) {
          conversation.lastMessage = message
        }
        
        // Počítání nepřečtených zpráv (pouze od uživatelů)
        if (message.isFromUser && !message.isRead) {
          conversation.unreadCount++
          conversation.hasUnread = true
        }
      }

      // Seřazení konverzací podle nejnovější zprávy
      const conversationsArray = Array.from(conversationsMap.values())
      conversationsArray.sort((a, b) => {
        const aTime = a.lastMessage?.createdAt?.toDate?.() || new Date(a.lastMessage?.createdAt)
        const bTime = b.lastMessage?.createdAt?.toDate?.() || new Date(b.lastMessage?.createdAt)
        return bTime - aTime
      })

      console.log('✅ Admin conversations processed:', conversationsArray.length)
      setConversations(conversationsArray)
      setLoading(false)
    }, (error) => {
      console.error('❌ Admin messages listener error:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const selectConversation = async (conversation) => {
    console.log('👆 Selected conversation:', conversation.userId)
    setSelectedConversation(conversation)
    
    // Označit všechny zprávy v konverzaci jako přečtené
    for (const message of conversation.messages) {
      if (message.isFromUser && !message.isRead) {
        try {
          console.log('✓ Marking message as read:', message.id)
          await updateDoc(doc(db, 'messages', message.id), {
            isRead: true,
            readAt: new Date()
          })
        } catch (error) {
          console.error('❌ Error marking message as read:', error)
        }
      }
    }
  }

  const sendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return

    console.log('📤 Admin sending reply:', {
      userId: selectedConversation.userId,
      message: replyText.trim()
    })

    setSending(true)
    
    try {
      const replyData = {
        userId: selectedConversation.userId,
        userEmail: selectedConversation.userEmail,
        userName: selectedConversation.userName,
        message: replyText.trim(),
        isFromUser: false,       // ← Admin odpověď
        isFromAdmin: true,       // ← Navíc pro jistotu  
        createdAt: new Date(),
        isRead: true
      }
      
      console.log('📤 Sending admin reply data:', replyData)
      
      const docRef = await addDoc(collection(db, 'messages'), replyData)
      
      console.log('✅ Admin reply sent successfully, ID:', docRef.id)
      setReplyText('')
      
    } catch (error) {
      console.error('❌ Error sending admin reply:', error)
      alert('Chyba při odesílání odpovědi: ' + error.message)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (date) => {
    if (!date) return ''
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredConversations = conversations.filter(conversation => {
    // Filtr podle stavu
    if (filter === 'unread' && !conversation.hasUnread) return false
    if (filter === 'replied' && !conversation.messages.some(m => !m.isFromUser)) return false
    
    // Vyhledávání
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        conversation.userName.toLowerCase().includes(searchLower) ||
        conversation.userEmail.toLowerCase().includes(searchLower) ||
        conversation.messages.some(m => m.message.toLowerCase().includes(searchLower))
      )
    }
    
    return true
  })

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Načítání zpráv...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 h-screen flex flex-col">
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zprávy od uživatelů</h1>
          <p className="text-gray-600 mt-1">
            {conversations.length} konverzací
            {totalUnread > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {totalUnread} nepřečtených
              </span>
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Všechny
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Nepřečtené ({totalUnread})
          </Button>
          <Button
            variant={filter === 'replied' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('replied')}
          >
            Odpovězené
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Hledat v konverzacích..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Conversations List */}
        <Card className="w-1/3 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Konverzace</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm ? 'Žádné výsledky' : 'Zatím žádné zprávy'}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.userId}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.userId === conversation.userId ? 'bg-pink-50 border-pink-200' : ''
                    }`}
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          conversation.hasUnread ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className={`font-medium text-sm truncate ${
                              conversation.hasUnread ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {conversation.userName}
                            </p>
                            {conversation.hasUnread && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {conversation.userEmail}
                          </p>
                          {conversation.lastMessage && (
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              {conversation.lastMessage.isFromUser ? '' : '✓ '}
                              {conversation.lastMessage.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-orange-500 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                        {conversation.lastMessage && (
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat View */}
        <Card className="flex-1 border-0 shadow-lg flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedConversation.userName}</CardTitle>
                      <p className="text-sm text-gray-600">{selectedConversation.userEmail}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedConversation.messages.length} zpráv
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages
                    .sort((a, b) => {
                      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt)
                      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt)
                      return aTime - bTime
                    })
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${message.isFromUser ? 'order-1' : 'order-2'}`}>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.isFromUser
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-pink-600 text-white'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.message}</p>
                            <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                              message.isFromUser ? 'text-gray-500' : 'text-pink-100'
                            }`}>
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(message.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`flex-shrink-0 ${message.isFromUser ? 'order-0 mr-3' : 'order-3 ml-3'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.isFromUser 
                              ? 'bg-gray-100 text-gray-600' 
                              : 'bg-pink-100 text-pink-600'
                          }`}>
                            {message.isFromUser ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Shield className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>

              {/* Reply Form */}
              <div className="border-t border-gray-100 p-4">
                <form onSubmit={(e) => { e.preventDefault(); sendReply(); }} className="flex space-x-3">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Napište odpověď..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-0 resize-none"
                      rows={2}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!replyText.trim() || sending}
                    className="bg-pink-600 hover:bg-pink-700 px-6"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
                
                {/* Debug info */}
                <div className="mt-2 text-xs text-gray-500">
                  💬 Admin odpovědi: isFromUser: false, isFromAdmin: true
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Vyberte konverzaci</h3>
                <p className="text-gray-500">
                  Klikněte na konverzaci vlevo pro zobrazení zpráv
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default MessagesPage