export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planType, price } = req.body;
    
    // Použijte Stripe API přímo přes fetch
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: price === '899' ? '89900' : '44900',
        currency: 'czk',
        'payment_method_types[]': 'card',
        'metadata[planType]': planType,
      }),
    });

    const paymentIntent = await stripeResponse.json();

    if (!stripeResponse.ok) {
      throw new Error(paymentIntent.error?.message || 'Stripe error');
    }

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error.message 
    });
  }
}