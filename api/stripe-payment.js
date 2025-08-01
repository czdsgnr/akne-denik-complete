const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planType } = req.body;
    
    // Použijte Price ID
    const priceId = planType === 'monthly' 
      ? 'price_1Rr3mQEvtJZVfPXMSOdytuZq'  // 197 Kč
      : 'price_1Rr3mDEvtJZVfPXMYkrF0pAL'; // 899 Kč

    // Vytvořte checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}