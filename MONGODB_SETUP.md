# MongoDB Atlas Setup for Render

Your backend is deployed on Render but can't connect to MongoDB because it's trying to reach localhost:27017, which doesn't exist on the server.

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new organization and project

## Step 2: Create a Cluster

1. Click "Create" → Select "Free" tier (M0)
2. Choose your provider (AWS) and region
3. Click "Create Deployment"
4. Wait for the cluster to be created (2-5 minutes)

## Step 3: Get Connection String

1. In MongoDB Atlas, click "Database" → your cluster
2. Click "Connect" button
3. Select "Drivers" → "Node.js"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster-name.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 4: Add Database User

1. In MongoDB Atlas, go to "Database Users"
2. Click "Add New Database User"
3. Create a username and password
4. Choose "Read and write to any database"
5. Add the user

## Step 5: Update Connection String

1. Replace `<username>` and `<password>` with your database user credentials
2. Replace `/` at the end with `/airline_db` (your database name)

Final format:
```
mongodb+srv://username:password@cluster-name.mongodb.net/airline_db?retryWrites=true&w=majority
```

## Step 6: Set Environment Variable on Render

1. Go to Render dashboard → Your airline backend service
2. Click "Settings" → "Environment"
3. Add/Update:
   - **Key**: `MONGO_URI`
   - **Value**: Your MongoDB Atlas connection string
4. Click "Save changes"
5. Click "Manual Deploy" → "Deploy latest commit"

## Step 7: Whitelist Render IP (if needed)

If connections still fail:
1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Enter `0.0.0.0/0` (allows all IPs - use more restrictive in production)
4. Click "Confirm"

## Verify Connection

Once deployed, check Render logs to confirm:
- No more "ECONNREFUSED" errors
- "MongoDB Connected" message in logs
- Database is being seeded with sample data
