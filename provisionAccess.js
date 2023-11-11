import Stripe from 'stripe'
import dotenv from 'dotenv'

import { databases } from './appwriteConfig.js'
import { ID } from 'node-appwrite'
import axios from 'axios'
import { Query } from 'node-appwrite'
dotenv.config()

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const handleSubscriptionUpdate = async (data) => {
  const {
    id,
    collection_method,
    customer,
    start_date,
    end_date,
    metadata,
    status,
    lookup_key,
    cancel_at_period_end,
  } = data
  const customer_resp = await axios.get(
    process.env.STRIPE_API + '\\customers\\' + `${customer}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    }
  )
  const customer_info = customer_resp.data
  console.log('customer information.............')
  console.log(customer_info)
  const { email, name } = customer_info

  const userDoc = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_COLLECTION_ID,
    [Query.equal('email', [email])]
  )
  console.log('user Doc...')
  console.log(userDoc)

  if (userDoc.total === 0) {
    const create = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      ID.unique(),
      {
        id,
        collection_method,
        start_date,
        end_date,
        metadata,
        status,
        name,
        email,
        lookup_key,
        cancel_at_period_end,
      }
    )
    console.log(create)
  }
}

const handleDelete = async (id) => {
  const cancel_user = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_COLLECTION_ID,
    [Query.equal('id', [id])]
  )
  if (cancel_user.total !== 0) {
    const cancel = await databases.delete(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      cancel_user.documents[0].$id
    )
    console.log(cancel)
  }
}

export const provisionAccess = (request, response) => {
  let event = request.body
  // at https://dashboard.stripe.com/webhooks
  const endpointSecret = process.env.STRIPE_LOCAL_WEBHOOK_SECRET

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature']
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      )
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message)
      return response.sendStatus(400)
    }
  }
  let subscription

  switch (event.type) {
    case 'customer.subscription.updated':
      subscription = event.data.object
      console.log(subscription)
      const {
        id,
        collection_method,
        current_period_end,
        current_period_start,
        plan: metadata,
        status,
        customer,
        items,
        cancel_at_period_end,
      } = subscription
      const lookup_key = items.data[0].price.lookup_key
      //   console.log(subscription);
      const start_date = new Date(current_period_start)
      const end_date = new Date(current_period_end)
      console.log(`Subscription updated, status is ${status}.`)
      console.log({
        id,
        collection_method,
        start_date,
        end_date,
        metadata: JSON.stringify(metadata),
        status,
        customer,
        lookup_key,
        cancel_at_period_end,
      })

      handleSubscriptionUpdate({
        id,
        collection_method,
        customer,
        start_date,
        end_date,
        metadata: JSON.stringify(metadata),
        status,
        lookup_key,
        cancel_at_period_end,
      })

      break
    case 'customer.subscription.deleted ':
      subscription = event.data.object
      console.log(subscription)
      const { canceled_id } = subscription
      handleDelete(canceled_id)
      break

    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`)
  }
  response.send()
  // Return a 200 response to acknowledge receipt of the event
}
