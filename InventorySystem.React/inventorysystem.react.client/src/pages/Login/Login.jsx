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
                    class="py-1 px-2 foucs:bg-blue-500 transition duration-300"
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
                        class="px-2 py-1 foucs:bg-blue-500 transition duration-300"
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

                <div className="flex justify-center">
                    <button
                        type="submit"
                        classN="bg-blue-500 border border-gray-200 shadow-xl rounded-xl px-3 py-2 text-sm disabled:opacity-50 w-40 flex justify-center"
                        disabled={loading}
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>
                </div>

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