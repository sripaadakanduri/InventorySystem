import { useState } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import {
    LockClosedIcon,
    KeyIcon,
    ShieldCheckIcon,
    EyeIcon,
    EyeSlashIcon,
} from "@heroicons/react/24/outline";

const ChangePassword = ({
    form,
    setForm,
    handleChange,
    isOtp,
    setIsOtp,
    otpSent,
    setOtpSent,
    sendingOtp,
    otpTimer,
    setOtpTimer,
    handleSendOtp
}) => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showReqs, setShowReqs] = useState(false);

    const hasStartedNew = form.newPassword.trim() !== "";
    const hasStartedConfirm = form.confirmPassword.trim() !== "";
    const hasStartedTyping = hasStartedNew || hasStartedConfirm;
    const passwordsMatch = hasStartedTyping && form.newPassword !== "" && form.newPassword === form.confirmPassword;
    const passwordsDoNotMatch = hasStartedConfirm && form.newPassword !== form.confirmPassword;

    const passwordReqs = [
        { label: "At least 8 characters", met: form.newPassword.length >= 8 },
        { label: "One uppercase letter", met: /(?=.*[A-Z])/.test(form.newPassword) },
        { label: "One lowercase letter", met: /(?=.*[a-z])/.test(form.newPassword) },
        { label: "One number", met: /(?=.*\d)/.test(form.newPassword) },
        { label: "One special character", met: /(?=.*[!@#$%^&*.,<>?|])/.test(form.newPassword) },
    ];

    return (
        <>
            <div className="border-t pt-2" />

            {/* Old Password */}
            <div>
                <label className={`flex items-center gap-1 mb-1 text-md font-semibold text-gray-500`}>
                    <LockClosedIcon className="h-5 w-5" />
                    {isOtp ? "Enter OTP" : "Old Password"}
                </label>

                <div className="w-full">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type={isOtp ? "text" : showOldPassword ? "text" : "password"}
                                name={isOtp ? "otp" : "oldPassword"}
                                value={isOtp ? form.otp : form.oldPassword}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={isOtp ? "Enter OTP" : "Enter Old Password"}
                            />

                            {!isOtp && (
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showOldPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setIsOtp((prev) => !prev);
                                setForm((prev) => ({ ...prev, oldPassword: "", otp: "" }));
                                setOtpSent(false);
                                setOtpTimer(0);
                            }}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 whitespace-nowrap"
                        >
                            {isOtp ? "Use Password" : "Use OTP"}
                        </button>

                        {isOtp && (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={sendingOtp || otpTimer > 0}
                                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                            >
                                {sendingOtp ? "Sending..." : otpSent ? (otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend OTP") : "Send OTP"}
                            </button>
                        )}
                    </div>

                    {isOtp && otpSent && (
                        <p className="mt-2 text-sm text-green-600">
                            OTP sent to your email.
                        </p>
                    )}
                </div>
            </div>

            {/* New Password */}
            <div>
                <label className={`flex items-center gap-1 mb-1 text-base font-medium ${!hasStartedTyping ? "text-gray-500" : passwordsDoNotMatch ? "text-red-500" : passwordsMatch ? "text-blue-500" : "text-gray-500"}`}>
                    <KeyIcon className="h-5 w-5" />
                    New Password
                </label>

                <div className="relative">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        className={`w-full rounded-md border px-3 py-2 pr-10 outline-none ${passwordsDoNotMatch ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-blue-200"}`}
                    />

                    <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                        {showNewPassword ? <EyeIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" /> : <EyeSlashIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />}
                    </button>
                </div>
            </div>

            <div className="mt-3 border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                <button
                    type="button"
                    onClick={() => setShowReqs(!showReqs)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors hover:bg-gray-100 ${passwordReqs.every((req) => req.met) ? "text-green-600" : "text-red-500"}`}
                >
                    <span>Password Requirements</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showReqs ? "rotate-180" : ""}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${showReqs ? "max-h-48 opacity-100 pb-3" : "max-h-0 opacity-0"}`}>
                    <div className="space-y-1.5 px-3">
                        {passwordReqs.map((req, index) => (
                            <div key={index} className={`flex items-center text-xs font-medium ${req.met ? "text-green-600" : "text-red-500"}`}>
                                {req.met ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <X className="w-3.5 h-3.5 mr-1.5" />}
                                {req.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Confirm Password */}
            <div>
                <label className={`flex items-center gap-1 mb-1 text-base font-medium ${!hasStartedTyping ? "text-gray-500" : passwordsDoNotMatch ? "text-red-500" : passwordsMatch ? "text-blue-500" : "text-gray-500"}`}>
                    <ShieldCheckIcon className="h-5 w-5" />
                    Confirm New Password
                </label>

                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={`w-full rounded-md border px-3 py-2 pr-10 outline-none ${!hasStartedTyping ? "border-gray-300 focus:ring-2 focus:ring-blue-400" : passwordsDoNotMatch ? "border-red-500 focus:ring-2 focus:ring-red-200" : passwordsMatch ? "border-blue-500 focus:ring-2 focus:ring-blue-300" : "border-gray-300 focus:ring-2 focus:ring-blue-200"}`}
                    />

                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                        {showConfirmPassword ? <EyeIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" /> : <EyeSlashIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />}
                    </button>
                </div>

                {passwordsDoNotMatch && (
                    <p className="mt-1 text-sm text-red-500">
                        Passwords do not match.
                    </p>
                )}
            </div>
        </>
    );
};

export default ChangePassword;
