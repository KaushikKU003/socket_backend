// // routes/chat.js
// const express = require("express");
// const router = express.Router();
// const Chat = require("../models/chat");

// router.post("/sendMessage", async (req, res) => {
//   const { senderId, receiverId, senderType, receiverType, message } = req.body;

//   try {
//     const chatMessage = new Chat({
//       senderId,
//       receiverId,
//       senderType,
//       receiverType,
//       message,
//     });

//     await chatMessage.save();
//     res.status(200).json({ success: true, chatMessage });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // routes/chat.js
// router.get("/getMessages", async (req, res) => {
//     const { userId1, userId2 } = req.query;
  
//     try {
//       const chatMessages = await Chat.find({
//         $or: [
//           { senderId: userId1, receiverId: userId2 },
//           { senderId: userId2, receiverId: userId1 },
//         ],
//       }).sort({ createdAt: 1 }); // Sort by timestamp to get messages in order
  
//       res.status(200).json({ success: true, chatMessages });
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   });
  
// module.exports = router;
