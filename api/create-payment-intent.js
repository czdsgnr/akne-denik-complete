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
    // Debug log
    console.log('🔍 Environment check:', {
      hasKey: !!process.env.STRIPE_SECRET_KEY,
      keyStart: process.env.STRIPE_SECRET_KEY?.substring(0, 7)
    })

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    })

    const { planType, userId, email } = req.body

    // Ceny v halířích
    const amount = planType === 'yearly' ? 89900 : 19700

    console.log('💳 Creating payment intent:', { planType, amount, userId })

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'czk',
      automatic_payment_methods: {
        enabled: true,
      },
      meta{  // ⚠️ TADY BYLA CHYBA - bylo "meta{" místo "metadata: {"
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
    console.error('❌ Error:', error)
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}