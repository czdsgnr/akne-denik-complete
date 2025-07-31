export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planType, price } = req.body;
    
    console.log('Creating payment intent:', { planType, price });
    console.log('Stripe key exists:', !!process.env.STRIPE_SECRET_KEY);
    
    const amount = price === '899' ? 89900 : 44900;
    
    // POUŽÍVÁME FETCH, NE STRIPE SDK!
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency: 'czk',
        'payment_method_types[]': 'card',
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Stripe error:', data);
      throw new Error(data.error?.message || 'Stripe API error');
    }

    console.log('Payment intent created:', data.id);

    return res.status(200).json({
      clientSecret: data.client_secret,
      paymentIntentId: data.id,
    });
  } catch (error) {
    console.error('Error in create-payment-intent:', error);
    return res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error.message,
      stripeKeyExists: !!process.env.STRIPE_SECRET_KEY
    });
  }
}