import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import "./Dashboard.css";

export default function Dashboard() {
    const [user, setUser] = useState("");

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const res = await API.get("/auth/me"); // optional if you add endpoint
        setUser(res.data.username);
    };

    return (
        <div>
            <Navbar />

            <div className="dashboard">
                <h1>Welcome {user}</h1>
                <p>This is your dashboard</p>
            </div>
        </div>
    );
}