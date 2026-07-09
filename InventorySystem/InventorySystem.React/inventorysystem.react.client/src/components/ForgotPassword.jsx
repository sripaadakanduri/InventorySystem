import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getProfile, updateProfile, requestOtp } from "../../services/userService";
import { toast } from "react-toastify";
import { ChevronDown, Check, X } from "lucide-react";
import {
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    KeyIcon,
    ShieldCheckIcon,
    EyeIcon,
    EyeSlashIcon,
} from "@heroicons/react/24/outline";

const ForgotPassword = ({ isOpen, onClose }) => {
    const emptyForm = {
        username: "",
        email: "",
        oldPassword: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    };

    const [loading, setLoading] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const { refreshUser } = useAuth();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [isOtp, setIsOtp] = useState(false);
    // values: "password" | "otp"

    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [form, setForm] = useState(emptyForm);
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
        {
            label: "At least 8 characters",
            met: form.newPassword.length >= 8,
        },
        {
            label: "One uppercase letter",
            met: /(?=.*[A-Z])/.test(form.newPassword),
        },
        {
            label: "One lowercase letter",
            met: /(?=.*[a-z])/.test(form.newPassword),
        },
        {
            label: "One number",
            met: /(?=.*\d)/.test(form.newPassword),
        },
        {
            label: "One special character",
            met: /(?=.*[!@#$%^&*.,<>?|])/.test(form.newPassword),
        },
    ];


    useEffect(() => {
        if (!isOpen) {
            setForm(emptyForm);
            setChangePassword(false);
            setIsOtp(false);
            setOtpSent(false);
            setShowReqs(false);
            return;
        }

        const loadProfile = async () => {
            try {
                const data = await getProfile();

                setForm({
                    username: data?.username ?? "",
                    email: data?.email ?? "",
                    oldPassword: "",
                    otp: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                setChangePassword(false);
                setIsOtp(false);
                setOtpSent(false);
                setShowReqs(false);
            } catch (err) {
                console.error(err);
            }
        };

        loadProfile();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSendOtp = async () => {
        try {
            setSendingOtp(true);

            await requestOtp();

            toast.success("OTP sent to your email.");

            setOtpSent(true);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to send OTP."
            );
        } finally {
            setSendingOtp(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            changePassword &&
            form.newPassword !== form.confirmPassword
        ) {
            toast.error("Passwords do not match.");
            return;
        }

        const payload = {
            username: form.username.trim(),
            email: form.email.trim(),
        };

        if (changePassword) {
            if (isOtp && !otpSent) {
                toast.error("Please send an OTP before saving.");
                return;
            }

            if (isOtp && !form.otp.trim()) {
                toast.error("Please enter the OTP sent to your email.");
                return;
            }

            if (!isOtp && !form.oldPassword) {
                toast.error("Please enter your old password.");
                return;
            }

            payload.newPassword = form.newPassword;

            if (isOtp) {
                payload.otp = form.otp.trim();
            } else {
                payload.oldPassword = form.oldPassword;
            }
        }

        try {
            setLoading(true);
            if (changePassword) {
                const passwordValid = passwordReqs.every(req => req.met);

                if (!passwordValid) {
                    toast.error("Password does not meet all requirements.");
                    return;
                }

                if (form.newPassword !== form.confirmPassword) {
                    toast.error("Passwords do not match.");
                    return;
                }
            }
            await updateProfile(payload);
            await refreshUser();

            alert("Profile updated successfully.");
            onClose();
        } catch (err) {
            toast.error(err.response?.data || "Failed to update profile.");
        } finally {
            setLoading(false);
        }



    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="w-[60%] max-h-[75%] overflow-y-auto rounded-xl bg-white p-8 lg:p-16 shadow-xl border-8 border-gray-200 "
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between">
                    <div className="w-full flex items-center gap-3 justify-center text-2xl lg:text-3xl font-bold">
                        <UserIcon className="h-8 w-8 text-blue-600" strokeWidth={2.5} />
                        <h1>Account Settings</h1>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-2xl font-bold hover:text-red-500"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-md font-medium">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 mb-1 block text-md font-medium">
                            <EnvelopeIcon className="h-5 w-5" /> Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>


                    {changePassword && (
                        <>
                            <div className="border-t pt-2" />

                            {/* Old Password */}
                            <div>
                                <label className={`flex items-center gap-1 mb-1 text-md font-semibold text-gray-500
                                `}>
                                    <LockClosedIcon className="h-5 w-5" />
                                    {isOtp ? "Enter OTP" : "Old Password"}
                                </label>

                                <div className="w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type={
                                                    isOtp
                                                        ? "text"
                                                        : showOldPassword
                                                            ? "text"
                                                            : "password"
                                                }
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
                                                    {showOldPassword ? (
                                                        <EyeIcon className="h-5 w-5" />
                                                    ) : (
                                                        <EyeSlashIcon className="h-5 w-5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsOtp((prev) => !prev);
                                                setForm((prev) => ({
                                                    ...prev,
                                                    oldPassword: "",
                                                    otp: "",
                                                }));
                                                setOtpSent(false);
                                            }}
                                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 whitespace-nowrap"
                                        >
                                            {isOtp ? "Use Password" : "Use OTP"}
                                        </button>

                                        {isOtp && (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={sendingOtp}
                                                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                                            >
                                                {sendingOtp
                                                    ? "Sending..."
                                                    : otpSent
                                                        ? "Resend OTP"
                                                        : "Send OTP"}
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
                                <label
                                    className={`flex items-center gap-1 mb-1 text-base font-medium ${!hasStartedTyping
                                        ? "text-gray-500"
                                        : passwordsDoNotMatch
                                            ? "text-red-500"
                                            : passwordsMatch
                                                ? "text-blue-500"
                                                : "text-gray-500"
                                        }`}
                                >
                                    <KeyIcon className="h-5 w-5" />
                                    New Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        className={`w-full rounded-md border px-3 py-2 pr-10 outline-none ${passwordsDoNotMatch
                                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                            : "border-gray-300 focus:ring-2 focus:ring-blue-200"
                                            }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(prev => !prev)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                        {showNewPassword ? (
                                            <EyeIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                        ) : (
                                            <EyeSlashIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3 border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setShowReqs(!showReqs)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors hover:bg-gray-100 ${passwordReqs.every(req => req.met)
                                        ? "text-green-600"
                                        : "text-red-500"
                                        }`}
                                >
                                    <span>Password Requirements</span>

                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${showReqs ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${showReqs
                                        ? "max-h-48 opacity-100 pb-3"
                                        : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <div className="space-y-1.5 px-3">
                                        {passwordReqs.map((req, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center text-xs font-medium ${req.met
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                {req.met ? (
                                                    <Check className="w-3.5 h-3.5 mr-1.5" />
                                                ) : (
                                                    <X className="w-3.5 h-3.5 mr-1.5" />
                                                )}

                                                {req.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Confirm Password */}
                            <div>
                                <label
                                    className={`flex items-center gap-1 mb-1 text-base font-medium ${!hasStartedTyping
                                        ? "text-gray-500"
                                        : passwordsDoNotMatch
                                            ? "text-red-500"
                                            : passwordsMatch
                                                ? "text-blue-500"
                                                : "text-gray-500"
                                        }`}
                                >
                                    <ShieldCheckIcon className="h-5 w-5" />
                                    Confirm New Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full rounded-md border px-3 py-2 pr-10 outline-none ${!hasStartedTyping
                                            ? "border-gray-300 focus:ring-2 focus:ring-blue-400"
                                            : passwordsDoNotMatch
                                                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                                : passwordsMatch
                                                    ? "border-blue-500 focus:ring-2 focus:ring-blue-300"
                                                    : "border-gray-300 focus:ring-2 focus:ring-blue-200"
                                            }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(prev => !prev)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                        ) : (
                                            <EyeSlashIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                        )}
                                    </button>
                                </div>

                                {passwordsDoNotMatch && (
                                    <p className="mt-1 text-sm text-red-500">
                                        Passwords do not match.
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                    <div className="flex justify-end">
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                            <input
                                type="checkbox"
                                checked={changePassword}
                                onChange={(e) => setChangePassword(e.target.checked)}
                                className="h-4 w-4"
                            />
                            <span>Change Password</span>
                        </label>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border px-4 py-2 hover:bg-red-500 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
