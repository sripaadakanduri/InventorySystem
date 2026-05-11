import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
    const { handleLogin } = useAuth();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState(""); // ✅ store error message

    const submit = async (e) => {
        e.preventDefault();
        setError(""); // clear previous error

        try {
            await handleLogin(form);
        } catch (err) {
            setError(err?.response?.data || "Login failed");
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={submit} className="auth-box glass card">
                <h2>Login</h2>

                {error && <p className="error-text">{error}</p>}

                <input
                    placeholder="Username"
                    onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />

                <button type="submit" className="btn-primary">Login</button>

                <p className="link-text">
                    Don't have an account?{" "}
                    <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}