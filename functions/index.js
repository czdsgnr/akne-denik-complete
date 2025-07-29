const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
const stripe = require('stripe')(functions.config().stripe.secret_key)

admin.initializeApp()

// 💳 VYTVOŘENÍ PAYMENT INTENT - POUZE TATO FUNKCE
exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed')
    }

    try {
      const { planType, userId } = req.body

      console.log(`💳 Creating payment intent for ${planType} plan`)

      // Určit cenu podle plánu
      const amount = planType === 'yearly' ? 89900 : 19700 // v halířích
      const productId = planType === 'yearly' ? 'prod_SiGVz8wtZ3qYbz' : 'prod_SiGW3JOWeE28TS'

      // Vytvořit Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'czk',
        metadata: {
          planType,
          productId,
          userId
        }
      })

      console.log(`✅ Payment intent created: ${paymentIntent.id}`)

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      })

    } catch (error) {
      console.error('❌ Error creating payment intent:', error)
      res.status(500).json({ error: error.message })
    }
  })
})

// 🎯 JEDNODUCHÝ WEBHOOK - pokud se první verze povede
// exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
//   console.log('📨 Webhook received')
//   res.status(200).send('OK')
// })