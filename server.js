// // backend/server.js
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // React app origin
//     methods: ["GET", "POST"],
//   },
// });

// // backend/server.js
// io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);
  
//     socket.on("sendMessage", (message) => {
//       // Broadcast message to all clients (including sender)
//       io.emit("receiveMessage", { text: message.text, isOwn: false });
//       // Send back to sender as well, marking it as their own message
//       socket.emit("receiveMessage", { text: message.text, isOwn: true });
//     });
  
//     socket.on("disconnect", () => {
//       console.log("User disconnected");
//     });
//   });
  

// server.listen(5000, () => {
//   console.log('Server running on port 5000');
// });


// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { MongoClient } = require('mongodb'); // Import MongoClient

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React app origin
    methods: ["GET", "POST"],
  },
});

// MongoDB connection string
const mongoUri = "mongodb+srv://babithpoojari:KV8DJhZz6SQJfT2y@mycluster.aksujvw.mongodb.net/my_database";

let db;

MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db();
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));


// API route to get user's name based on the userId
app.get('/getUserName/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Check in the 'students' collection first
    let user = await db.collection('students').findOne({ _id: new require('mongodb').ObjectId(userId) });

    if (!user) {
      // If not found in students, check in 'alumnis' collection
      user = await db.collection('alumnis').findOne({ _id: new require('mongodb').ObjectId(userId) });
    }

    if (user) {
      res.json({ name: user.name }); // Send back the name
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user name:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
