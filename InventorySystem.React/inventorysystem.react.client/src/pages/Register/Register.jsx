import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { validateRegister } from "../../validators/authValidator";
import { Eye, EyeOff, UserPlus, User, Mail, Lock } from "lucide-react";

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
                general: err?.response?.data || "Registration failed"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-500 mt-2">Join us and manage your inventory seamlessly.</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {errors.general && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 text-center">
                            {errors.general}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                className={`w-full pl-10 pr-4 py-3 border ${errors.username ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl focus:outline-none focus:ring-2 transition-colors`}
                            />
                        </div>
                        {errors.username && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.username}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl focus:outline-none focus:ring-2 transition-colors`}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create a password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-xl focus:outline-none focus:ring-2 transition-colors`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-2"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Registering...
                            </span>
                        ) : "Create Account"}
                    </button>

                    <p className="text-center text-gray-600 text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                            Sign in instead
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}