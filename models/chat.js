// // models/Chat.js
// const mongoose = require("mongoose");

// const chatSchema = new mongoose.Schema({
//   senderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//   },
//   receiverId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//   },
//   senderType: {
//     type: String,
//     enum: ["student", "alumni"],
//     required: true,
//   },
//   receiverType: {
//     type: String,
//     enum: ["student", "alumni"],
//     required: true,
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Chat", chatSchema);
