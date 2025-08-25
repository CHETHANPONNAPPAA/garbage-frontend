import { useState } from "react";
import { api } from "./api";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const data = await api("/users/login", "POST", { email, password });
      login(data.user, data.token);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-blue-100/80 backdrop-blur-md shadow-md relative z-50">
        <div className="flex items-center gap-2">
          <img
            src="/image.png"
            alt="Recycle Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
            style={{ background: "none" }}
          />
          <span className="text-lg md:text-2xl font-bold text-blue-700">
            Garbage Management System
          </span>
        </div>        
      </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-blue-100"
        >
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="bg-blue-100 rounded-full p-3 mb-2">
              <svg
                className="w-7 h-7 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm2 6a6 6 0 10-12 0h12z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Sign in with email
            </h2>
            <p className="text-gray-500 text-center text-sm">
              Garbage Management System
            </p>
          </div>
          {err && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
              {err}
            </div>
          )}
          <div className="flex flex-col gap-3">
            <input
              className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 bg-gray-50"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
            <div className="relative">
              <input
                className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 bg-gray-50 w-full"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a6 6 0 1112 0 6 6 0 01-12 0z"
                  />
                </svg>
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-gray-900 transition"
          >
            Get Started
          </button>
          <div className="text-center mt-2">
            <span className="text-gray-600">Don't have an account?</span>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline font-semibold ml-1"
            >
              Register
            </button>
          </div>
        </form>
      </div>
      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm bg-white/60">
        &copy; {new Date().getFullYear()} Garbage Management System. All rights
        reserved.
      </footer>
    </div>
  );
}
