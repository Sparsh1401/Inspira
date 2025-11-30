# Inspira - Creative Pin Sharing Platform

<div align="center">

![Inspira Logo](https://img.shields.io/badge/Inspira-Creative%20Platform-ff6b6b?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A modern full-stack creative pin sharing platform with real-time collaboration**

[Live Demo](https://inspira-fullstack.onrender.com) • [Report Bug](https://github.com/Sparsh1401/Inspira/issues) • [Request Feature](https://github.com/Sparsh1401/Inspira/issues)

</div>

---

## ✨ Features

🔐 **Authentication**
- Google OAuth 2.0 integration
- Secure session management
- User profile management

📌 **Pin Management**
- Create and share creative pins
- Upload images with descriptions
- Save pins to your collection
- Delete your own pins

🎨 **User Experience**
- Responsive grid layout
- Material-UI design system
- Real-time collaborative canvas
- AI-powered image generation (optional)

🚀 **Technical Features**
- GraphQL API
- PostgreSQL database
- WebSocket support for real-time features
- RESTful authentication endpoints

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Apollo Client** - GraphQL client
- **Material-UI** - Component library
- **Styled Components** - CSS-in-JS styling
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Fabric.js** - Canvas manipulation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **GraphQL** - API query language
- **Passport.js** - Authentication middleware
- **Sequelize** - ORM for PostgreSQL
- **PostgreSQL** - Production database
- **Socket.IO** - WebSocket server
- **OpenAI** - AI image generation (optional)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- PostgreSQL database
- Google OAuth credentials ([Get here](https://console.cloud.google.com/))
- (Optional) OpenAI API key

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/Sparsh1401/Inspira.git
cd Inspira
```

#### 2. Configure Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API or People API
4. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Create OAuth Client:
   - Type: Web application
   - Authorized redirect URIs: `http://localhost:3001/auth/google/callback`
7. Copy Client ID and Client Secret

#### 3. Database Setup
```bash
# Install PostgreSQL (if not installed)
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb inspira_db

# Or using psql
psql -U postgres
CREATE DATABASE inspira_db;
```

#### 4. Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env-copy .env

# Edit .env with your credentials:
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
# - DATABASE_URL (if not using SQLite for development)
# - SESSION_SECRET (random string)
# - OPENAI_API_KEY (optional)

# Start server
npm start
```

Server runs on `http://localhost:3001`

#### 5. Frontend Setup
```bash
cd client
npm install
npm start
```

Client runs on `http://localhost:3000`

---

## 📦 Environment Variables

### Server (`.env`)
```env
# Server
PORT=3001
NODE_ENV=development

# Database (PostgreSQL for production)
DATABASE_URL=postgresql://user:password@localhost:5432/inspira_db

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Security
SESSION_SECRET=your_random_32+_character_secret

# CORS
CLIENT_URL=http://localhost:3000

# AI Features (Optional)
OPENAI_API_KEY=your_openai_api_key
```

### Client (`.env`)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_GRAPHQL_URL=http://localhost:3001/graphql
```

---

## 🌐 Production Deployment

### Deployed on Render

**Live URL:** [https://inspira-fullstack.onrender.com](https://inspira-fullstack.onrender.com)

The application is deployed as a fullstack service with:
- PostgreSQL database (Free tier)
- Combined frontend + backend service
- Automatic deployments from `Main` branch

### Deploy Your Own

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

---

## 📊 Database Schema

### Users
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| googleId | STRING | Google OAuth ID (unique) |
| email | STRING | User email (unique) |
| firstName | STRING | First name |
| lastName | STRING | Last name |

### Pins
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| imageUrl | STRING | Image URL |
| title | STRING | Pin title |
| description | TEXT | Pin description |
| link | STRING | External link |
| userId | INTEGER | Foreign key to Users |

### SavedPins
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| googleId | STRING | User's Google ID |
| imageUrl | STRING | Saved pin image URL |

---

## 🔌 GraphQL API

Access GraphQL Playground: `http://localhost:3001/graphql`

### Queries
```graphql
# Get latest pins
latestPins

# Get user's pins
myPins(userId: Int!)

# Get pin by image URL
getPinByImageURL(imageUrl: String!)

# Get saved pins
getSavedPins(googleId: String!)
```

### Mutations
```graphql
# Create user
createUser(input: UserInput!): User

# Create pin
createPin(input: PinInput!): Pin

# Delete pin
deletePin(id: Int!): Boolean

# Save pin
savePin(input: SavedPinInput!): SavedPin
```

---

## 🎨 Features in Detail

### Real-Time Collaborative Canvas
- Multiple users can draw simultaneously
- WebSocket-powered real-time updates
- Fabric.js for canvas manipulation
- Room-based collaboration

### AI Image Generation
- Powered by OpenAI DALL-E
- Generate custom images from text prompts
- Integrated into pin creation flow
- Optional feature (requires API key)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Google OAuth for authentication
- Material-UI for beautiful components
- Apollo GraphQL for efficient data fetching
- Sequelize for database ORM
- Render for hosting

---

<div align="center">

Made with ❤️ by [Sparsh Agarwal](https://github.com/Sparsh1401)

⭐ Star this repo if you find it helpful!

</div>
