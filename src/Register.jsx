import { useState } from "react";
import { api } from "./api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      await api("/users/register", "POST", form);
      setMsg("Registered! You can now login.");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-lg border border-blue-200 rounded-2xl shadow-2xl p-10 flex flex-col gap-6 w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl text-blue-400">📝</span>
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-wide">
            Register
          </h2>
        </div>
        {err && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
            {err}
          </div>
        )}
        {msg && (
          <div className="bg-green-100 text-green-700 p-2 rounded text-sm">
            {msg}
          </div>
        )}
        <input
          className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          autoComplete="name"
        />
        <input
          className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          autoComplete="username"
        />
        <input
          className="border border-blue-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-400 to-green-400 text-white px-6 py-2 rounded-lg font-bold shadow hover:from-blue-500 hover:to-green-500 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
