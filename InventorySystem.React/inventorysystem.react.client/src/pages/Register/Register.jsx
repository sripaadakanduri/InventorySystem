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

    const [showPassword, setShowPassword] = useState(false);

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
                general:
                    err?.response?.data ||
                    "Registration failed"
            });

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="auth-container">

            <form
                onSubmit={submit}
                className="auth-box glass card"
            >

                <h2>Register</h2>

                {/* General Error */}

                {
                    errors.general && (

                        <p className="error-text">
                            {errors.general}
                        </p>
                    )
                }

                {/* Username */}

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            username: e.target.value
                        })
                    }
                    class="px-2 py-1 foucs:bg-blue-500 transition duration-300"
                />

                {
                    errors.username && (

                        <p className="error-text">
                            {errors.username}
                        </p>
                    )
                }

                {/* Email */}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value
                        })
                    }
                    class="px-2 py-1 foucs:bg-blue-500 transition duration-300"
                />

                {
                    errors.email && (

                        <p className="error-text">
                            {errors.email}
                        </p>
                    )
                }

                {/* Password */}

                <div className="password-container">

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                password: e.target.value
                            })
                        }
                        class="px-2 py-1 foucs:bg-blue-500 transition duration-300"
                    />

                    <button
                        type="button"
                        className="show-password-btn"
                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }

                    >
                        {
                            showPassword
                                ? "Hide"
                                : "Show"
                        }
                    </button>

                </div>

                {
                    errors.password && (

                        <p className="error-text">
                            {errors.password}
                        </p>
                    )
                }

                {/* Submit Button */}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 border border-gray-200 shadow-xl rounded-xl px-3 py-2 text-sm disabled:opacity-50 w-40 flex justify-center"

                >
                    {
                        loading
                            ? "Registering..."
                            : "Register"
                    }
                </button>

                <p className="link-text">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </form>

        </div>
    );
}