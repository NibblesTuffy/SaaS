import express from 'express'
import cors from 'cors'
import createCheckoutSession from './createCheckoutSession.js'
import dotenv from 'dotenv'
import { provisionAccess } from './provisionAccess.js'
import createPortalSession from './createPortalSession.js'
import { getCurrentSubscription } from './getCurrentSubscription.js'
import { pausePlan } from './pausePlan.js'
import { resumePlan } from './resumePlan.js'

const app = express()
dotenv.config()

app.use(cors()) // Use this after the variable declaration
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.post('/webhook', express.raw({ type: 'application/json' }), provisionAccess)
app.use(express.json())

// import Stripe from 'stripe'
// console.log(process.env.STRIPE_SECRET_KEY)
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

// app.get('/', (req, resp) => {
//   resp.json({
//     home: 'home',
//   })
// })

app.get('/currentSubscription', getCurrentSubscription)
app.post('/checkout', createCheckoutSession)
app.post('/create-portal-session', createPortalSession)

app.post('/pauseplan', pausePlan)
app.post('/resumeplan', resumePlan)
app.listen(5000, () => {
  console.log('server running on port 5000...')
})
