# Quick Setup Guide

## Step 1: Get Google OAuth Credentials

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - **Client ID Type**: Web application
   - **Authorized redirect URIs**:
     - `http://localhost:3001/auth/google/callback` (for development)
     - `https://YOUR_BACKEND_URL/auth/google/callback` (for production)
5. Save your **Client ID** and **Client Secret**

## Step 2: Set Up MySQL Database

\`\`\`bash
# Login to MySQL
mysql -u root -p

# Create the database
CREATE DATABASE FakeDatabase;

# Exit MySQL
exit
\`\`\`

## Step 3: Configure Server

\`\`\`bash
cd server

# Copy the environment template
cp .env-copy .env

# Edit .env and fill in:
# - GOOGLE_CLIENT_ID (from Step 1)
# - GOOGLE_CLIENT_SECRET (from Step 1)
# - DB_PASSWORD (your MySQL root password)
# - SESSION_SECRET (any random long string)

# Install dependencies
npm install

# Start the server
npm start
\`\`\`

Server should start on http://localhost:3001

## Step 4: Configure Client

\`\`\`bash
cd client

# Copy the environment template
cp .env-copy .env

# For local development, default values should work
# No changes needed unless you changed ports

# Install dependencies
npm install

# Start the client
npm start
\`\`\`

Client should open on http://localhost:3000

## Step 5: Test the Application

1. Open http://localhost:3000 in your browser
2. You should be redirected to the login page
3. Click "Continue with Google"
4. Login with your Google account
5. You should be redirected back to the home page

## Troubleshooting

### "Repository not found" error
- Make sure your GitHub repository is public or you have access

### MySQL Connection Error
- Verify MySQL is running: `mysql -u root -p`
- Check database exists: `SHOW DATABASES;`
- Verify credentials in server/.env

### Google OAuth Error
- Verify redirect URI matches exactly in Google Console
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env
- Ensure Google+ API is enabled

### CORS Error
- Verify CLIENT_URL in server/.env matches your frontend URL
- For development: `http://localhost:3000`

### Port Already in Use
- Change PORT in server/.env (backend)
- Change port in client/.env REACT_APP_API_URL (frontend)

## Production Deployment

### Backend (Heroku/Railway/Render)

1. Create a MySQL database instance
2. Set environment variables:
   - All variables from .env-copy
   - Update URLs to production domains
   - GOOGLE_CALLBACK_URL must match Google Console
3. Deploy the server directory

### Frontend (Netlify)

1. Connect GitHub repository to Netlify
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Base directory**: `client`
3. Add environment variables:
   - `REACT_APP_API_URL`: Your backend URL
   - `REACT_APP_GRAPHQL_URL`: Your backend GraphQL endpoint
   - `REACT_APP_GOOGLE_AUTH_URL`: Your backend Google auth URL
4. Deploy!

### Update Google OAuth

After deployment, add production redirect URI in Google Console:
- `https://your-backend-url.com/auth/google/callback`

## Next Steps

- Customize the styling
- Add image upload functionality (Cloudinary/AWS S3)
- Add more features (comments, likes, etc.)
- Improve error handling
- Add tests
