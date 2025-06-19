const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const stripeGateway = async (req, res) => {
  const { cartItems } = req.body;
  console.log("Cart Items:", cartItems);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    console.error("Stripe Error:", err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports =  stripeGateway ;
