# Render Deployment Guide

## Frontend Deployment (Static Site)

1. Go to Render dashboard → Create New → Static Site
2. Connect your GitHub repository
3. Set these values:
   - **Name**: airline-frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish directory**: `frontend/dist`
   - **Branch**: main

4. Add Environment Variables (in Render dashboard):
   - **VITE_API_BASE_URL**: `https://airline-0hnr.onrender.com`

## Backend Deployment (Web Service)

1. Go to Render dashboard → Create New → Web Service
2. Connect your GitHub repository
3. Set these values:
   - **Name**: airline
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js` (or `npm start`)
   - **Branch**: main
   - **Root Directory**: `backend`

4. Add Environment Variables (in Render dashboard):
   - **PORT**: `10000` (Render assigns this, but can override)
   - **MONGO_URI**: Your MongoDB Atlas connection string
   - **JWT_SECRET**: A strong random secret
    - **CORS_ORIGIN**: `https://your-frontend-url.onrender.com`

    Notes:
    - Set `CORS_ORIGIN` to the exact origin(s) of your deployed frontend. For example, if your frontend URL is `https://airline-1-ap7y.onrender.com`, set:
       - `CORS_ORIGIN=https://airline-1-ap7y.onrender.com`
    - To allow multiple origins, provide a comma-separated list (no spaces):
       - `CORS_ORIGIN=https://app.example.com,https://admin.example.com`
    - After updating environment variables, **redeploy** the backend service so the new CORS settings take effect.

### Quick CORS verification
- Use this curl command to verify the backend responds to preflight requests (replace the URL and origin):

```bash
curl -i -X OPTIONS "https://your-backend-url.onrender.com/api/users" \
   -H "Origin: https://your-frontend-url.onrender.com" \
   -H "Access-Control-Request-Method: POST"
```

If the response includes `Access-Control-Allow-Origin: https://your-frontend-url.onrender.com`, CORS is configured correctly.

## If Build Still Fails

1. **Clear build cache**: In Render dashboard, go to Settings → Clear build cache
2. **Redeploy**: Trigger a new deployment after clearing cache
3. **Check logs**: Look for detailed error messages in Render's deployment logs

## Local Testing

Before pushing to Render, test locally:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run build
npm run preview
```

## Troubleshooting

- **"vite: Permission denied"**: Clear build cache and redeploy
- **API calls failing**: Verify VITE_API_BASE_URL matches your backend URL
- **CORS errors**: Check CORS_ORIGIN environment variable on backend
