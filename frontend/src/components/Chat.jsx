import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");

  useEffect(() => {
    socket.emit("join", user._id);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, { text: data.message, me: false }]);
    });
  }, []);

  const fetchMessages = async () => {
    if (!receiver) return;

    const res = await axios.get(`http://localhost:5000/api/chat/${receiver}`, {
      headers: { Authorization: token }
    });

    const formatted = res.data.map((m) => ({
      text: m.content,
      me: m.sender === user._id
    }));

    setMessages(formatted);
  };

  const sendMessage = async () => {
    await axios.post(
      "http://localhost:5000/api/chat/send",
      { receiver, message: msg },
      { headers: { Authorization: token } }
    );

    socket.emit("sendMessage", {
      sender: user._id,
      receiver,
      message: msg
    });

    setMessages([...messages, { text: msg, me: true }]);
    setMsg("");
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h3>🌙 Nocturne</h3>

        <input placeholder="Enter Receiver ID" onChange={(e) => setReceiver(e.target.value)} />
        <button onClick={fetchMessages}>Load Chat</button>
      </div>

      <div className="chat-box">
        <div className="blob"></div>
        <div className="star">Hi!</div>

        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.me ? "me" : "other"}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="input-row">
          <input value={msg} onChange={(e) => setMsg(e.target.value)} />
          <button onClick={sendMessage}>Send 🚀</button>
        </div>
      </div>
    </div>
  );
}