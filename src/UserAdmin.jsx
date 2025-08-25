import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { api } from "./api";

export default function UserAdmin() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchUsers = async () => {
    try {
      setUsers(await api("/users", "GET", null, token));
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (u) => {
    setEdit(u._id);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
  };

  const handleUpdate = async (id) => {
    try {
      await api(`/users/${id}`, "PUT", { ...form, password: undefined }, token);
      setEdit(null);
      fetchUsers();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (id === user.id) return setError("You cannot delete yourself.");
    if (!window.confirm("Delete user?")) return;
    try {
      await api(`/users/${id}`, "DELETE", null, token);
      fetchUsers();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("All fields required for new user.");
      return;
    }
    try {
      await api("/users/register", "POST", form, token);
      setForm({ name: "", email: "", password: "", role: "user" });
      setAdding(false);
      fetchUsers();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl text-blue-400">👤</span>
        <h2 className="text-2xl font-bold text-blue-700">User Management</h2>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>
      )}
      <button
        className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg mb-4 font-bold shadow hover:from-blue-600 hover:to-green-600 transition"
        onClick={() => setAdding(!adding)}
      >
        {adding ? "Cancel" : "Add User"}
      </button>
      {adding && (
        <form onSubmit={handleAdd} className="flex flex-wrap gap-2 mb-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="border border-blue-200 rounded-lg px-3 py-2 flex-1 bg-gray-50 focus:ring-2 focus:ring-blue-300"
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            className="border border-blue-200 rounded-lg px-3 py-2 flex-1 bg-gray-50 focus:ring-2 focus:ring-blue-300"
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            required
            className="border border-blue-200 rounded-lg px-3 py-2 flex-1 bg-gray-50 focus:ring-2 focus:ring-blue-300"
          />
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="border border-blue-200 rounded-lg px-3 py-2 flex-1 bg-gray-50 focus:ring-2 focus:ring-blue-300"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
          >
            Create
          </button>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-blue-100 rounded-xl shadow">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-green-100">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-blue-50 transition">
                {edit === u._id ? (
                  <>
                    <td>
                      <input
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="border rounded px-2 py-1"
                      />
                    </td>
                    <td>
                      <input
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        className="border rounded px-2 py-1"
                      />
                    </td>
                    <td>
                      <select
                        value={form.role}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, role: e.target.value }))
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleUpdate(u._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEdit(null)}
                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(u)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
