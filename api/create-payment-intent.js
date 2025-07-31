import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { planType, userId } = req.body

    // Určit cenu podle plánu
    const amount = planType === 'yearly' ? 89900 : 19700 // v halířích
    const productId = planType === 'yearly' ? 'prod_SiGVz8wtZ3qYbz' : 'prod_SiGW3JOWeE28TS'

    console.log(`💳 Creating payment intent for ${planType} plan, amount: ${amount}`)

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

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })

  } catch (error) {
    console.error('❌ Error creating payment intent:', error)
    res.status(500).json({ error: error.message })
  }
}