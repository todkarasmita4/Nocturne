import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  content: String
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);