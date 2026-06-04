import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { validateRegister } from "../../validators/authValidator";
import { Eye, EyeOff, UserPlus, User, Mail, Lock, Check, X, ChevronDown } from "lucide-react";

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
    const [showReqs, setShowReqs] = useState(false);

    const passwordReqs = [
        { label: "At least 8 characters", met: form.password.length >= 8 },
        { label: "One uppercase letter", met: /(?=.*[A-Z])/.test(form.password) },
        { label: "One lowercase letter", met: /(?=.*[a-z])/.test(form.password) },
        { label: "One number", met: /(?=.*\d)/.test(form.password) },
        { label: "One special character", met: /(?=.*[!@#$%^&*.,<>?|])/.test(form.password) }
    ];

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
            toast.success("Registration successful! Redirecting to login...");
        } catch (err) {
            const data = err?.response?.data;
            const message = data?.message || (typeof data === 'string' ? data : "Registration failed");
            toast.error(message);
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

                <form onSubmit={submit} className="space-y-5" noValidate>
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
                        <div className="mt-3 ml-1 border border-gray-100 rounded-lg overflow-hidden bg-gray-50/50">
                            <button
                                type="button"
                                onClick={() => setShowReqs(!showReqs)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors hover:bg-gray-100 ${passwordReqs.every(req => req.met) ? 'text-green-600' : 'text-red-500 hover:text-red-600'}`}
                            >
                                <span>Password Requirements</span>
                                <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${showReqs ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`transition-all duration-300 ease-in-out ${showReqs ? 'max-h-48 opacity-100 pb-3' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                <div className="space-y-1.5 px-3">
                                    {passwordReqs.map((req, index) => (
                                        <div key={index} className={`flex items-center text-xs font-medium transition-colors ${req.met ? 'text-green-600' : 'text-red-500'}`}>
                                            {req.met ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <X className="w-3.5 h-3.5 mr-1.5" />}
                                            {req.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-2"
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
                        <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-800 transition-colors">
                            Sign in instead
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
