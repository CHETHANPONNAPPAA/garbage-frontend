import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const API_URL = "http://localhost:5000/api";

export default function GarbageRequests() {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    materialType: "plastic",
    quantity: "",
    pickupAddress: "",
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      let url = `${API_URL}/requests`;
      if (user.role !== "admin") url += `?userId=${user.id}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setRequests(await res.json());
    } catch (err) {
      setError("Failed to fetch requests.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.quantity.trim() || !form.pickupAddress.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, userId: user.id }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      setForm({ ...form, quantity: "", pickupAddress: "" });
      fetchRequests();
    } catch (err) {
      setError("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      fetchRequests();
    } catch (err) {
      setError("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  // Delete request handler
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const delRes = await fetch(`${API_URL}/requests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (delRes.status === 404) {
        // Already deleted, just refresh
        fetchRequests();
        return;
      }
      if (!delRes.ok) {
        setError("Failed to delete request.");
        setLoading(false);
        return;
      }
      fetchRequests();
    } catch (err) {
      setError("Failed to delete request.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, [user?.id]);

  // Sort requests: pending > scheduled > completed, each by newest first
  const statusOrder = { pending: 0, scheduled: 1, completed: 2 };
  const sortedRequests = [...requests].sort((a, b) => {
    // Sort by status first
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    // Then by updatedAt or createdAt (newest first)
    const aTime = new Date(a.updatedAt || a.createdAt).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt).getTime();
    return bTime - aTime;
  });

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-auto mt-8 border border-green-100">
      <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">
        <span className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-3 py-1 rounded-full shadow">
          ♻️
        </span>
        Waste Pickup Request
      </h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>
      )}
      {loading && <div className="text-gray-500 mb-2">Loading...</div>}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-8">
        <select
          value={form.materialType}
          onChange={(e) => setForm({ ...form, materialType: e.target.value })}
          className="border rounded-lg px-3 py-2 flex-1 bg-gray-50 focus:ring-2 focus:ring-green-300"
        >
          <option value="plastic">Plastic</option>
          <option value="paper">Paper</option>
          <option value="glass">Glass</option>
          <option value="metal">Metal</option>
          <option value="e-waste">E-waste</option>
          <option value="textile">Textile</option>
          <option value="organic">Organic</option>
          <option value="other">Other</option>
        </select>
        <input
          placeholder="Quantity *"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
          className="border rounded-lg px-3 py-2 flex-1 bg-gray-50 focus:ring-2 focus:ring-green-300"
        />
        <input
          placeholder="Pickup Address *"
          value={form.pickupAddress}
          onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
          required
          className="border rounded-lg px-3 py-2 flex-2 bg-gray-50 focus:ring-2 focus:ring-green-300"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:from-green-600 hover:to-blue-600 transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      <h3 className="font-semibold mb-4 text-lg">
        {user.role === "admin" ? "All Requests" : "Your Requests"}
      </h3>
      {requests.length === 0 && !loading ? (
        <p className="text-gray-500">No requests found.</p>
      ) : (
        <ul className="space-y-6">
          {sortedRequests.map((r) => {
            // Choose card background based on status
            let cardBg =
              r.status === "pending"
                ? "bg-yellow-50 border-yellow-200"
                : r.status === "scheduled"
                ? "bg-blue-50 border-blue-200"
                : "bg-green-50 border-green-200";

            // Format time
            const time = r.updatedAt || r.createdAt;
            const formattedTime = time ? new Date(time).toLocaleString() : "";

            // Allow delete for admin or the user who booked
            const canDelete =
              user.role === "admin" || (r.userId && r.userId._id === user.id);

            return (
              <li
                key={r._id}
                className={`${cardBg} rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 transition hover:shadow-2xl border`}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-bold text-green-700 uppercase text-lg tracking-wide">
                      {r.materialType}
                    </span>
                    <span className="uppercase text-gray-700 font-semibold">
                      {r.quantity}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        r.status === "pending"
                          ? "bg-yellow-200 text-yellow-900"
                          : r.status === "scheduled"
                          ? "bg-blue-200 text-blue-900"
                          : "bg-green-200 text-green-900"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="text-gray-600 uppercase text-sm mb-2">
                    {r.pickupAddress}
                  </div>
                  {/* <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
                    {r.userId && (
                      <span className="bg-green-100 px-2 py-1 rounded">
                        <span className="font-semibold text-green-700">
                          Booked by:
                        </span>{" "}
                        {r.userId.name}
                      </span>
                    )}
                    {r.updatedBy && (
                      <span className="bg-blue-100 px-2 py-1 rounded">
                        <span className="font-semibold text-blue-700">
                          Last updated by:
                        </span>{" "}
                        {r.updatedBy.name}
                      </span>
                    )}
                  </div> */}
                  <div className="text-xs text-gray-400">
                    {r.status === "pending" && <>Requested: {formattedTime}</>}
                    {r.status === "scheduled" && (
                      <>Scheduled: {formattedTime}</>
                    )}
                    {r.status === "completed" && (
                      <>Completed: {formattedTime}</>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {user.role === "admin" && (
                    <>
                      <label className="text-xs text-gray-500 font-semibold mb-1">
                        Change Status:
                      </label>
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r._id, e.target.value)}
                        className="border border-green-300 rounded px-3 py-2 bg-white uppercase font-bold text-green-700 focus:ring-2 focus:ring-green-300"
                      >
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </>
                  )}
                  {/* {canDelete && (
                    <button
                      className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded font-bold"
                      onClick={() => handleDelete(r._id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  )} */}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
