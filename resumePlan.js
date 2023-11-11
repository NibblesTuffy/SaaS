import dotenv from 'dotenv'
import Stripe from 'stripe'
import { databases } from './appwriteConfig.js'
import { Query } from 'node-appwrite'
dotenv.config()
// APPWRITE_DATABASE_ID=654a04fe675fb1c5f56f
// APPWRITE_COLLECTION_ID=654a050561c65ccaa61c

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export const resumePlan = async (req, resp) => {
  console.log(req.body)
  const { id } = req.body
  const subscription = await stripe.subscriptions.update(id, {
    cancel_at_period_end: false,
  })
  console.log('after updated...')
  console.log(subscription)
  //change database info

  const changeDoc = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_COLLECTION_ID,
    [Query.equal('id', [id])]
  )

  const update = await databases.updateDocument(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_COLLECTION_ID,
    changeDoc.documents[0].$id,
    {
      cancel_at_period_end: false,
    }
  )
  console.log(update)
  resp.send()
}

