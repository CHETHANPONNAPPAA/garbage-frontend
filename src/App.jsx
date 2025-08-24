import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

function App() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    userId: "",
    materialType: "plastic",
    quantity: "",
    pickupAddress: "",
  });

  // Fetch requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/requests?userId=${form.userId}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to fetch requests. Please check if the backend server is running.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.userId.trim() || !form.quantity.trim() || !form.pickupAddress.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setForm({ ...form, quantity: "", pickupAddress: "" });
      fetchRequests();
    } catch (err) {
      console.error("Error submitting request:", err);
      setError("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update status (Admin)
  const updateStatus = async (id, status) => {
    try {
      setError("");
      const response = await fetch(`${API_URL}/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchRequests();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status. Please try again.");
    }
  };

  useEffect(() => {
    // Only fetch requests if userId is provided
    if (form.userId.trim()) {
      fetchRequests();
    } else {
      setRequests([]);
    }
  }, [form.userId]);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>♻️ Recyclable Waste Pickup</h1>

      {/* Error Message */}
      {error && (
        <div style={{ 
          color: "red", 
          backgroundColor: "#ffe6e6", 
          padding: "1rem", 
          borderRadius: "4px", 
          marginBottom: "1rem",
          border: "1px solid #ffcccc"
        }}>
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={{ 
          textAlign: "center", 
          padding: "1rem",
          marginBottom: "1rem"
        }}>
          Loading...
        </div>
      )}

      {/* Request Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          placeholder="User ID *"
          value={form.userId}
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
          style={{ margin: "0.5rem", padding: "0.5rem" }}
          required
        />
        <select
          value={form.materialType}
          onChange={(e) => setForm({ ...form, materialType: e.target.value })}
          style={{ margin: "0.5rem", padding: "0.5rem" }}
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
          style={{ margin: "0.5rem", padding: "0.5rem" }}
          required
        />
        <input
          placeholder="Pickup Address *"
          value={form.pickupAddress}
          onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
          style={{ margin: "0.5rem", padding: "0.5rem" }}
          required
        />
        <button 
          type="submit" 
          style={{ margin: "0.5rem", padding: "0.5rem 1rem" }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {/* Requests List */}
      {form.userId.trim() && (
        <>
          <h2>Your Requests</h2>
          {requests.length === 0 && !loading ? (
            <p>No requests found for this user ID.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {requests.map((r) => (
                <li key={r._id} style={{ 
                  marginBottom: "1rem", 
                  padding: "1rem", 
                  border: "1px solid #ddd", 
                  borderRadius: "4px" 
                }}>
                  <strong>{r.materialType}</strong> • {r.quantity} • 
                  <span style={{ 
                    color: r.status === "completed" ? "green" : 
                           r.status === "scheduled" ? "orange" : "gray",
                    fontWeight: "bold"
                  }}> {r.status}</span> 
                  <br />
                  {r.pickupAddress}
                  <div style={{ marginTop: "0.5rem" }}>
                    <select 
                      value={r.status} 
                      onChange={(e) => updateStatus(r._id, e.target.value)}
                      style={{ padding: "0.25rem" }}
                    >
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default App;
