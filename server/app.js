const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

//GraphQL imports
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schemas");

//MySQL Connection
const db = require("./models");

//Passport Configuration
const passport = require("./config/passport");

//Auth Routes
//Auth Routes
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Auth routes
// Auth routes
app.use("/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('drawing', (data) => {
    // Broadcast to everyone else in the room
    socket.to(data.roomId).emit('drawing', data);
  });

  socket.on('clear', (roomId) => {
    io.to(roomId).emit('clear');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

db.sequelize.sync({ alter: true }).then((req) => {
  server.listen(process.env.PORT || 3001, () => {
    console.log("server running on port 3001");
  });
});
