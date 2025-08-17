# Vercel Deployment Guide for EMS Project

## Prerequisites
- Vercel account
- MongoDB Atlas account
- Git repository

## Backend Deployment

### 1. Deploy Backend to Vercel

1. **Connect Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Select the root directory (not the client folder)

2. **Configure Environment Variables in Vercel Dashboard:**
   ```
   MONGODB_URI=mongodb+srv://dhirajraj97084:ems123@cluster0.1onqagx.mongodb.net/
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=production
   ```

3. **Build Settings:**
   - Framework Preset: Node.js
   - Build Command: `npm install`
   - Output Directory: Leave empty (not needed for Node.js)
   - Install Command: `npm install`

4. **Deploy:**
   - Click Deploy
   - Note the backend URL (e.g., `https://your-project.vercel.app`)

### 2. Update Frontend Environment

After getting your backend URL, update the frontend environment:

1. **In Vercel Dashboard (Frontend Project):**
   - Go to your frontend project
   - Add Environment Variable:
     - Name: `VITE_API_URL`
     - Value: `https://your-backend-domain.vercel.app` (replace with your actual backend URL)

2. **Or update `client/vercel.json`:**
   ```json
   {
     "env": {
       "VITE_API_URL": "https://your-actual-backend-url.vercel.app"
     }
   }
   ```

## Frontend Deployment

### 1. Deploy Frontend to Vercel

1. **Connect Repository to Vercel:**
   - Create a new Vercel project
   - Import the same Git repository
   - Set Root Directory to `client`

2. **Build Settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables:**
   - Add `VITE_API_URL` with your backend URL

4. **Deploy:**
   - Click Deploy
   - Note the frontend URL

## Important Notes

### Backend Issues Fixed:
- ✅ Added proper Vercel configuration
- ✅ Updated CORS for production
- ✅ Added serverless function export
- ✅ Included necessary files in build

### Frontend Issues Fixed:
- ✅ Added environment variable handling
- ✅ Updated API configuration
- ✅ Added proper Vercel build settings
- ✅ Added fallback for development

### Environment Variables Required:

**Backend (Vercel Dashboard):**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `NODE_ENV`: Set to `production`

**Frontend (Vercel Dashboard):**
- `VITE_API_URL`: Your backend Vercel URL

## Testing Deployment

1. **Test Backend:**
   - Visit: `https://your-backend-url.vercel.app/api/health`
   - Should return: `{"status":"OK","message":"EMS Backend is running"}`

2. **Test Frontend:**
   - Visit your frontend URL
   - Try to login/register
   - Check if API calls work

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Update the CORS origin in `index.js` with your actual frontend domain
   - Make sure both URLs are correct

2. **Environment Variables Not Loading:**
   - Check Vercel dashboard environment variables
   - Redeploy after adding variables

3. **Build Failures:**
   - Check if all dependencies are in `package.json`
   - Verify Node.js version compatibility

4. **API Connection Issues:**
   - Verify `VITE_API_URL` is correct
   - Check if backend is accessible
   - Test backend endpoints directly

## Security Notes

- Change `JWT_SECRET` to a strong, unique key
- Update MongoDB connection string if needed
- Consider adding rate limiting for production
- Enable HTTPS (automatic with Vercel)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test endpoints individually
4. Check MongoDB connection
