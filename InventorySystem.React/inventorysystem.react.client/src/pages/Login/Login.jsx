import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Login.css";

const Login = () => {

    const { handleLogin } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError("");

        try {

            await handleLogin(formData);

        } catch (err) {

            setError(
                err?.response?.data || "Invalid credentials"
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (

        <div className="auth-container">

            <form
                onSubmit={handleSubmit}
                className="auth-box glass card"
            >

                <h2>Login</h2>

                {
                    error && (
                        <p className="error-text">
                            {error}
                        </p>
                    )
                }

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                />

                <div className="password-container">

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        className="show-password-btn"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                    >
                        {
                            showPassword
                                ? "Hide"
                                : "Show"
                        }
                    </button>

                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ?" LogingIn...." :"Login"}
                </button>

                <p className="link-text">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Register
                    </Link>

                </p>

            </form>

        </div>
    );
};

export default Login;