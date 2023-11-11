import { Query } from 'node-appwrite'
import { databases } from './appwriteConfig.js'

export const getCurrentSubscription = async (req, resp) => {
  console.log(req.query)
  const { email } = req.query
  const userDoc = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_COLLECTION_ID,
    [Query.equal('email', [email])]
  )

  const userSubscription = userDoc.documents[0]
  console.log(userDoc)
  resp.json(userSubscription)
}
