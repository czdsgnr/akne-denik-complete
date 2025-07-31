import Stripe from 'stripe'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Debug logs
    console.log('📍 Request body:', JSON.stringify(req.body))
    console.log('🔍 Environment check:', {
      hasKey: !!process.env.STRIPE_SECRET_KEY,
      keyStart: process.env.STRIPE_SECRET_KEY?.substring(0, 7),
      keyType: process.env.STRIPE_SECRET_KEY?.includes('test') ? 'TEST' : 'LIVE'
    })

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    })

    const { planType, userId, email } = req.body

    // Validace vstupů
    if (!planType || !userId) {
      throw new Error('Missing required fields: planType or userId')
    }

    // Ceny v halířích
    const amount = planType === 'yearly' ? 89900 : 19700

    console.log('💳 Creating payment intent:', { planType, amount, userId })

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'czk',
      automatic_payment_methods: {
        enabled: true,
      },

metadata: {  // ✅ SPRÁVNĚ!
  planType,
  userId,
  email: email || ''
}

    })

    console.log('✅ Payment intent created:', paymentIntent.id)

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })

  } catch (error) {
    console.error('❌ Error in create-payment-intent:', error)
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
