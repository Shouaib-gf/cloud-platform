import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rent from "./pages/Rent";
import Admin from "./pages/Admin";

export default function App() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState(null);

  // 🔥 Load role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-blue-600 text-white p-4 flex gap-4">
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("register")}>Register</button>
        <button onClick={() => setPage("rent")}>Rent VM</button>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>

        {role === "admin" && (
          <button onClick={() => setPage("admin")}>Admin</button>
        )}

        {/* LOGOUT */}
        {role && (
          <button
            onClick={() => {
              localStorage.clear();
              setRole(null);
              setPage("login");
            }}
            className="ml-auto bg-red-500 px-3 rounded"
          >
            Logout
          </button>
        )}
      </nav>

      {/* PAGES */}
      <div className="p-6">
        {page === "login" && <Login setPage={setPage} setRole={setRole} />}
        {page === "register" && <Register setPage={setPage} />}
        {page === "rent" && <Rent />}
        {page === "dashboard" && <Dashboard />}
        {page === "admin" && <Admin />}
      </div>

    </div>
  );
}
