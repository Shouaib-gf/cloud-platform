import { useState } from "react";
import axios from "axios";

export default function Login({ setPage }) {

  const [data, setData] = useState({});
  const API = "http://192.168.159.157:3000";

  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, data);

      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") {
        setPage("admin");
      } else {
        setPage("dashboard");
      }

    } catch {
      alert("Login failed ❌");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <input className="w-full border p-2 mb-2"
        placeholder="Email"
        onChange={e => setData({...data, email: e.target.value})}
      />

      <input className="w-full border p-2 mb-4"
        type="password"
        placeholder="Password"
        onChange={e => setData({...data, password: e.target.value})}
      />

      <button className="bg-blue-600 text-white w-full p-2 rounded"
        onClick={login}>
        Login
      </button>
    </div>
  );
}
