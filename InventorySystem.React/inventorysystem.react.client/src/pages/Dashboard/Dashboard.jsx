import { useEffect, useState } from "react";
import API from "../../services/api";
import "./Dashboard.css";

export default function Dashboard() {
    const [user, setUser] = useState("");

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const res = await API.get("/auth/me"); // optional if you add endpoint
            setUser(res.data.username);
        } catch (e) {
            setUser("User");
        }
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Welcome back, {user}! 👋</h1>
                <p>Here's what's happening with your inventory today.</p>
            </header>

            <div className="dashboard-grid">
                <div className="stat-card card">
                    <div className="stat-icon" style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)" }}>📦</div>
                    <div className="stat-info">
                        <h3>Total Products</h3>
                        <p className="stat-value">124</p>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>🛒</div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="stat-value">38</p>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>⚠️</div>
                    <div className="stat-info">
                        <h3>Low Stock Items</h3>
                        <p className="stat-value">5</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content card">
                <h2>Recent Activity</h2>
                <div className="empty-state">
                    <p>No recent activity to show.</p>
                </div>
            </div>
        </div>
    );
}