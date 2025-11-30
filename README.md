# Inspira with Google OAuth

A full-stack Pinterest clone built with React, Node.js, GraphQL, and MySQL with Google OAuth authentication.

## Features

- Google OAuth 2.0 Authentication
- Create and upload pins with images
- Save pins to your collection
- Responsive Pinterest-style grid layout
- GraphQL API
- MySQL database with Sequelize ORM

## Tech Stack

### Frontend
- React 18
- Apollo Client (GraphQL)
- Material-UI
- Styled Components
- React Router

### Backend
- Node.js
- Express
- GraphQL (express-graphql)
- Passport.js (Google OAuth)
- Sequelize ORM
- MySQL

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- Google OAuth credentials

## Setup Instructions

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/Sparsh1401/Pinterest_Clone.git
cd Pinterest_Clone
\`\`\`

### 2. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs:
     - Development: \`http://localhost:3001/auth/google/callback\`
     - Production: \`https://your-backend-url.com/auth/google/callback\`
7. Copy Client ID and Client Secret

### 3. Set up MySQL Database

\`\`\`bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE FakeDatabase;
\`\`\`

### 4. Backend Setup

\`\`\`bash
cd server

# Install dependencies
npm install

# Copy environment template and configure
cp .env-copy .env

# Edit .env file with your credentials:
# - Add your Google OAuth Client ID and Secret
# - Configure MySQL credentials
# - Set a random SESSION_SECRET

# The database tables will be created automatically when you start the server
npm start
\`\`\`

The server will run on http://localhost:3001

### 5. Frontend Setup

\`\`\`bash
cd client

# Install dependencies
npm install

# Copy environment template and configure
cp .env-copy .env

# For development, the default values should work
# For production, update the API URLs

npm start
\`\`\`

The client will run on http://localhost:3000

## Environment Variables

### Server (.env)

\`\`\`env
# Database Configuration
DB_NAME=FakeDatabase
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_DIALECT=mysql

# Server Configuration
PORT=3001
NODE_ENV=development

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Session Secret (use a long random string)
SESSION_SECRET=your_random_session_secret

# Client URL
CLIENT_URL=http://localhost:3000
\`\`\`

### Client (.env)

\`\`\`env
# API Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_GRAPHQL_URL=http://localhost:3001/graphql
REACT_APP_GOOGLE_AUTH_URL=http://localhost:3001/auth/google
\`\`\`

## Deployment

### Backend Deployment (Heroku, Railway, etc.)

1. Set all environment variables in your hosting platform
2. Ensure MySQL database is accessible
3. Update \`GOOGLE_CALLBACK_URL\` to production URL
4. Update \`CLIENT_URL\` to production frontend URL

### Frontend Deployment (Netlify)

1. Build the application:
   \`\`\`bash
   cd client
   npm run build
   \`\`\`

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: \`npm run build\`
   - Set publish directory: \`build\`
   - Add environment variables in Netlify dashboard:
     - \`REACT_APP_API_URL\`: Your backend URL
     - \`REACT_APP_GRAPHQL_URL\`: Your GraphQL endpoint
     - \`REACT_APP_GOOGLE_AUTH_URL\`: Your Google auth endpoint

3. Configure redirects for React Router:
   Create \`client/public/_redirects\`:
   \`\`\`
   /*    /index.html   200
   \`\`\`

## Usage

1. Visit the application URL
2. Click "Continue with Google" to login
3. Browse pins on the home page
4. Click "Create" to upload new pins
5. Save pins to your collection

## Database Schema

### Users Table
- id (Primary Key)
- googleId (Unique)
- email (Unique)
- firstName
- lastName

### Pins Table
- id (Primary Key)
- imageUrl
- title
- description
- link
- userId (Foreign Key)

### SavedPins Table
- id (Primary Key)
- googleId
- imageUrl

## GraphQL API

The GraphQL playground is available at http://localhost:3001/graphql

### Queries
- \`latestPins\`: Get latest 20 pins
- \`myPins(userId)\`: Get pins by user
- \`getPinByImageURL(imageUrl)\`: Get pin by image URL
- \`getSavedPins(googleId)\`: Get saved pins by user

### Mutations
- \`createUser\`: Register new user
- \`createPin\`: Create new pin
- \`deletePin\`: Delete pin
- \`savePin\`: Save pin to collection

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
