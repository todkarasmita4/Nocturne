import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import Message from "./models/Message.js";
import { encrypt, decrypt } from "./crypto/aes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

let users = {};

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    users[userId] = socket.id;
  });

  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    const secret = sender + receiver;

    const encrypted = encrypt(message, secret);

    await Message.create({
      sender,
      receiver,
      content: encrypted
    });

    const receiverSocket = users[receiver];

    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", {
        sender,
        message: decrypt(encrypted, secret)
      });
    }
  });
});

server.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on ${process.env.PORT}`)
);