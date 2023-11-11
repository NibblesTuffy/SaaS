import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()

// console.log(process.env.STRIPE_SECRET_KEY)
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const CLIENT_ADDRESS = process.env.CLIENT_ADDRESS
const createCheckoutSession = async (req, resp) => {
  console.log(req.body);
  const { user } = req.body
  const {name, email} = JSON.parse(user)
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ['data.product'],
  })
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: 'subscription',
    customer_email: email,
    success_url: `${CLIENT_ADDRESS}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${CLIENT_ADDRESS}?canceled=true`,
  })

  resp.redirect(303, session.url)
}

export default createCheckoutSession
