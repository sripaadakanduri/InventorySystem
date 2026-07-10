import { useEffect, useState } from "react";
import { requestForgotPasswordOtp, resetPassword } from "../services/authService";
import { toast } from "react-toastify";
import { Check, X } from "lucide-react";
import {
    EnvelopeIcon,
    KeyIcon,
    ShieldCheckIcon,
    EyeIcon,
    EyeSlashIcon,
} from "@heroicons/react/24/outline";

const ForgotPassword = ({ isOpen, onClose }) => {
    const emptyForm = {
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    };

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showReqs, setShowReqs] = useState(false);

    const hasStartedNew = form.newPassword.trim() !== "";
    const hasStartedConfirm = form.confirmPassword.trim() !== "";
    const hasStartedTyping = hasStartedNew || hasStartedConfirm;

    const passwordsMatch =
        hasStartedTyping &&
        form.newPassword !== "" &&
        form.newPassword === form.confirmPassword;

    const passwordsDoNotMatch =
        hasStartedConfirm &&
        form.newPassword !== form.confirmPassword;

    const passwordReqs = [
        { label: "At least 8 characters", met: form.newPassword.length >= 8 },
        { label: "One uppercase letter", met: /(?=.*[A-Z])/.test(form.newPassword) },
        { label: "One lowercase letter", met: /(?=.*[a-z])/.test(form.newPassword) },
        { label: "One number", met: /(?=.*\d)/.test(form.newPassword) },
        { label: "One special character", met: /(?=.*[!@#$%^&*.,<>?|])/.test(form.newPassword) },
    ];

    useEffect(() => {
        if (!isOpen) {
            setForm(emptyForm);
            setOtpSent(false);
            setOtpTimer(0);
            setShowReqs(false);
        }
    }, [isOpen]);

    useEffect(() => {
        let interval;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSendOtp = async () => {
        if (!form.email) {
            toast.error("Please enter your email.");
            return;
        }
        try {
            setSendingOtp(true);
            await requestForgotPasswordOtp(form.email);
            toast.success("OTP sent to your email.");
            setOtpSent(true);
            setOtpTimer(60);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP.");
        } finally {
            setSendingOtp(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.newPassword !== form.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (!passwordReqs.every((req) => req.met)) {
            toast.error("Please meet all password requirements.");
            setShowReqs(true);
            return;
        }

        try {
            setLoading(true);
            await resetPassword({
                email: form.email,
                otp: form.otp,
                newPassword: form.newPassword
            });
            toast.success("Password reset successfully.");
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all duration-300">
            <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">Forgot Password</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Email Address */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                                    placeholder="Enter your email"
                                    disabled={otpSent}
                                    required
                                />
                            </div>
                        </div>

                        {!otpSent ? (
                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={sendingOtp || !form.email}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {sendingOtp ? "Sending..." : "Send OTP"}
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* OTP */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Enter OTP
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="otp"
                                                value={form.otp}
                                                onChange={handleChange}
                                                maxLength={6}
                                                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm tracking-widest focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="000000"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={sendingOtp || otpTimer > 0}
                                            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {sendingOtp
                                                ? "Sending..."
                                                : otpTimer > 0
                                                ? `Resend in ${otpTimer}s`
                                                : "Resend OTP"}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <KeyIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={form.newPassword}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setShowReqs(true);
                                            }}
                                            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Enter new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showNewPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    
                                    {showReqs && (
                                        <div className="mt-2 space-y-1 rounded-md bg-gray-50 p-3 text-xs border border-gray-200">
                                            {passwordReqs.map((req, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex items-center gap-2 ${
                                                        req.met ? "text-green-600" : "text-gray-500"
                                                    }`}
                                                >
                                                    {req.met ? (
                                                        <Check className="h-3 w-3" />
                                                    ) : (
                                                        <div className="h-3 w-3 rounded-full border border-gray-300" />
                                                    )}
                                                    <span>{req.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="mb-1 flex items-center justify-between text-sm font-medium text-gray-700">
                                        Confirm Password
                                        {passwordsMatch && (
                                            <span className="flex items-center text-xs font-semibold text-green-600">
                                                <Check className="mr-1 h-3 w-3" /> Match
                                            </span>
                                        )}
                                        {passwordsDoNotMatch && (
                                            <span className="flex items-center text-xs font-semibold text-red-500">
                                                <X className="mr-1 h-3 w-3" /> No match
                                            </span>
                                        )}
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <KeyIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            className={`block w-full rounded-md border py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-1 ${
                                                passwordsMatch
                                                    ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                                                    : passwordsDoNotMatch
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            }`}
                                            placeholder="Confirm new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? "Resetting..." : "Reset Password"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
