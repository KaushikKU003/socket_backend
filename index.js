const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb'); 

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// MongoDB connection string
const mongoUri = "mongodb+srv://babithpoojari:KV8DJhZz6SQJfT2y@mycluster.aksujvw.mongodb.net/my_database";

let db;

// Store connected users and their socket IDs
const connectedUsers = {};

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
    let user = await db.collection('students').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      user = await db.collection('alumnis').findOne({ _id: new ObjectId(userId) });
    }

    if (user) {
      res.json({ name: user.name });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user name:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Socket.IO Connection and Event Handlers
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for the user's identification and map their userId to socket.id
  socket.on("identifyUser", (userId) => {
    connectedUsers[userId] = socket.id; // Map userId to their socket ID
    console.log(`User ${userId} is connected with socket ID ${socket.id}`);
  });

  // Listen for the "sendMessage" event from the client
  socket.on("sendMessage", async (newMessage) => {
    const { senderId, receiverId, text } = newMessage;

    try {
      // Save the message to MongoDB
      const messageDoc = {
        senderId: new ObjectId(senderId),
        receiverId: new ObjectId(receiverId),
        text,
        timestamp: new Date(),
      };
      await db.collection("messages").insertOne(messageDoc);

      // Emit the message to the receiver if they're connected
      const receiverSocketId = connectedUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", newMessage);
      }

      // Emit the message back to the sender as well
      socket.emit("receiveMessage", newMessage);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // Remove user from connectedUsers on disconnect
  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(connectedUsers)) {
      if (socketId === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
    console.log("User disconnected");
  });
});

// Start server
server.listen(5000, () => {
  console.log('Server running on port 5000');
});
