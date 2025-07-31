import Stripe from 'stripe'
import { buffer } from 'micro'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  })
}

const db = getFirestore()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret)
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log(`🎯 Webhook event: ${event.type}`)

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      const { userId, planType } = paymentIntent.metadata
      
      if (userId) {
        try {
          // Aktualizuj uživatele v Firebase
          await db.collection('users').doc(userId).update({
            subscriptionStatus: 'active',
            subscriptionType: planType,
            subscriptionStartDate: new Date(),
            subscriptionEndDate: planType === 'yearly' 
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            lastPaymentId: paymentIntent.id,
            updatedAt: new Date()
          })
          
          console.log(`✅ User ${userId} subscription updated`)
        } catch (error) {
          console.error('❌ Error updating user:', error)
        }
      }
      break
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      console.log(`❌ Payment failed: ${failedPayment.id}`)
      break
      
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
}