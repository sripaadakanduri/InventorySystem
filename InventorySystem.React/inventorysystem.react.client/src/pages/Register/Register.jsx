import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { validateRegister } from "../../validators/authValidator";
import "./Register.css";

export default function Register() {
    const { handleRegister } = useAuth();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        const validationErrors = validateRegister(form);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await handleRegister(form);
        } catch (err) {
            setErrors({
                general: err?.response?.data || "Registration failed"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={submit} className="auth-box glass card">
                <h2>Register</h2>

                {/* General error */}
                {errors.general && (
                    <p className="error-text">{errors.general}</p>
                )}

                {/* Username */}
                <input
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                    }
                />
                {errors.username && (
                    <p className="error-text">{errors.username}</p>
                )}

                {/* Email */}
                <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />
                {errors.email && (
                    <p className="error-text">{errors.email}</p>
                )}

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />
                {errors.password && (
                    <p className="error-text">{errors.password}</p>
                )}

                {/* Submit */}
                <button type="submit"  className= "btn-primary" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="link-text">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}