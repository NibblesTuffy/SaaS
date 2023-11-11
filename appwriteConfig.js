import sdk from 'node-appwrite'
import dotenv from 'dotenv'

const client = new sdk.Client()

export const databases = new sdk.Databases(client)


// APPWRITE_PROJECT_ID=6548cdb4aa7394989fef
// APPWRITE_ENDPOINT=http://localhost/v1
// APPWRITE_DATABASE_ID=654a04fe675fb1c5f56f
// APPWRITE_COLLECTION_ID=654a050561c65ccaa61c

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your API Endpoint
  .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID


 