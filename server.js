import express from 'express'
import cors from 'cors'
import createCheckoutSession from './createCheckoutSession.js'
import dotenv from 'dotenv'
const app = express()
dotenv.config()

app.use(cors()) // Use this after the variable declaration
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// import Stripe from 'stripe'
// console.log(process.env.STRIPE_SECRET_KEY)
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

app.get('/', (req, resp) => {
  resp.json({
    home: 'home',
  })
})
app.post('/checkout', createCheckoutSession)

app.listen(5000, () => {
  console.log('server running on port 5000...')
})
