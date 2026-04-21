import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registered!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>🌸 Register</h2>

        <input
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={handleSubmit}>Create Account</button>
      </div>
    </div>
  );
}