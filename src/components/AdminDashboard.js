import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Import Firebase auth for logout
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState("");
  const [severity, setSeverity] = useState(3); // Default severity is critical (3)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Use effect to subscribe to critical alerts and load them
  useEffect(() => {
    const alertsQuery = query(
      collection(firestore, "criticalAlerts"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      alertsQuery,
      (snapshot) => {
        const alerts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCriticalAlerts(alerts);
        setLoading(false);
      },
      (err) => {
        setError("Failed to load alerts");
        setLoading(false);
        console.error("Error fetching alerts:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Broadcasting a new alert with selected severity
  const broadcastAlert = async () => {
    if (newAlert.trim()) {
      try {
        await addDoc(collection(firestore, "criticalAlerts"), {
          message: newAlert,
          timestamp: new Date(),
          severity: severity, // Store the severity value (1, 2, or 3)
        });
        setNewAlert("");
        setSeverity(3); // Reset severity to default (critical)
      } catch (error) {
        console.error("Error broadcasting alert:", error);
      }
    }
  };

  // Formatting the timestamp to a readable format
  const formattedTimestamp = (timestamp) => {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  // Logout functionality
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to home or login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Function to determine the color based on severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 3:
        return "red"; // Critical - Red
      case 2:
        return "yellow"; // Moderate - Yellow
      case 1:
        return "blue"; // Normal - Blue
      default:
        return "gray"; // Default color
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
        <span>{auth.currentUser?.email}</span>
        <button onClick={handleLogout} style={{ marginLeft: "20px" }}>
          Logout
        </button>
        <button
          onClick={() => navigate("/trade")}
          style={{ marginLeft: "20px" }}
        >
          Go to Trade
        </button>
        <button
          onClick={() => navigate("/survival")}
          style={{ marginLeft: "20px" }}
        >
          Go to Survival
        </button>
      </nav>

      <h2>Admin Dashboard</h2>

      {/* New Alert Section */}
      <textarea
        value={newAlert}
        onChange={(e) => setNewAlert(e.target.value)}
        placeholder="Broadcast a critical update"
        style={{ width: "100%", height: "100px" }}
      />
      <div>
        <label htmlFor="severity">Severity:</label>
        <select
          id="severity"
          value={severity}
          onChange={(e) => setSeverity(Number(e.target.value))}
        >
          <option value={3}>Critical</option>
          <option value={2}>Moderate</option>
          <option value={1}>Normal</option>
        </select>
      </div>
      <button onClick={broadcastAlert}>Send Emergency Broadcast</button>

      {/* Loading/Error States */}
      {loading && <p>Loading alerts...</p>}
      {error && <p>{error}</p>}

      {/* Alerts List */}
      <div>
        <h3>Critical Alerts History</h3>
        {criticalAlerts.length === 0 ? (
          <p>No alerts found.</p>
        ) : (
          criticalAlerts.map((alert) => (
            <div key={alert.id} style={{ marginBottom: "20px" }}>
              <div style={{ color: getSeverityColor(alert.severity) }}>
                {alert.message}
              </div>
              <div>{formattedTimestamp(alert.timestamp)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
