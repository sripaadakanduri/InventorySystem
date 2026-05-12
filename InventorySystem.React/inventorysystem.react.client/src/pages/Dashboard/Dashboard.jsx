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
        </div>
    );
}