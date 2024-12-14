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
        return "#ff3333"; // Critical - Bright Red
      case 2:
        return "#ffb84d"; // Moderate - Orange
      case 1:
        return "#4d94ff"; // Normal - Blue (changed from green)
      default:
        return "#4d94ff"; // Default - Blue (changed from green)
    }
  };

  return (
    <div className="terminal-dashboard">
      {/* Navbar */}

      <h2 className="dashboard-title">ADMIN DASHBOARD</h2>

      {/* New Alert Section */}
      <div className="broadcast-section">
        <h3>EMERGENCY BROADCAST SYSTEM</h3>
        <textarea
          value={newAlert}
          onChange={(e) => setNewAlert(e.target.value)}
          placeholder="BROADCAST A CRITICAL UPDATE"
          className="broadcast-input"
        />
        <div className="severity-selector">
          <label htmlFor="severity">SEVERITY LEVEL:</label>
          <select
            id="severity"
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="severity-select"
          >
            <option value={3}>CRITICAL</option>
            <option value={2}>MODERATE</option>
            <option value={1}>NORMAL</option>
          </select>
        </div>
        <button onClick={broadcastAlert} className="broadcast-button">
          [SEND EMERGENCY BROADCAST]
        </button>
      </div>

      {/* Loading/Error States */}
      {loading && <p className="status-message">LOADING ALERTS...</p>}
      {error && <p className="status-message error">{error}</p>}

      {/* Alerts List */}
      <div className="alerts-section">
        <h3>CRITICAL ALERTS HISTORY</h3>
        {criticalAlerts.length === 0 ? (
          <p className="no-alerts">NO ALERTS FOUND</p>
        ) : (
          criticalAlerts.map((alert) => (
            <div key={alert.id} className="alert-item">
              <div
                className="alert-message"
                style={{
                  color: getSeverityColor(alert.severity),
                  textShadow: `0 0 5px ${getSeverityColor(alert.severity)}`,
                }}
              >
                {alert.message}
              </div>
              <div className="alert-timestamp">
                {formattedTimestamp(alert.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
