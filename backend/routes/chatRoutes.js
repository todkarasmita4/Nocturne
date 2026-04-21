import express from "express";
import Message from "../models/Message.js";
import { protect } from "../middleware/authMiddleware.js";
import { encrypt, decrypt } from "../crypto/aes.js";

const router = express.Router();

// SEND MESSAGE
router.post("/send", protect, async (req, res) => {
  try {
    const { receiver, message } = req.body;

    const sender = req.user.id;

    const secret = sender + receiver;

    const encrypted = encrypt(message, secret);

    const newMsg = await Message.create({
      sender,
      receiver,
      content: encrypted
    });

    res.json(newMsg);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET CHAT HISTORY
router.get("/:receiverId", protect, async (req, res) => {
  try {
    const sender = req.user.id;
    const receiver = req.params.receiverId;

    const secret = sender + receiver;

    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ createdAt: 1 });

    const decryptedMessages = messages.map((msg) => ({
      ...msg._doc,
      content: decrypt(msg.content, secret)
    }));

    res.json(decryptedMessages);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;