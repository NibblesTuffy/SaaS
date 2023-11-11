import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
export const createPortalSession = async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = process.env.CLIENT_ADDRESS

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  })

  res.redirect(303, portalSession.url)
}


export default createPortalSession
