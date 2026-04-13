import { useState } from "react";
import axios from "axios";

export default function Register({ setPage }) {
  const [data, setData] = useState({});

  const register = async () => {
    await axios.post("http://192.168.159.157:3000/api/auth/register", data);
    alert("Registered ✅");
    setPage("login");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      <input className="w-full border p-2 mb-2"
        placeholder="Username"
        onChange={e => setData({...data, username: e.target.value})}
      />

      <input className="w-full border p-2 mb-2"
        placeholder="Email"
        onChange={e => setData({...data, email: e.target.value})}
      />

      <input className="w-full border p-2 mb-4"
        type="password"
        placeholder="Password"
        onChange={e => setData({...data, password: e.target.value})}
      />

      <button className="bg-green-600 text-white w-full p-2 rounded"
        onClick={register}>
        Register
      </button>
    </div>
  );
}
