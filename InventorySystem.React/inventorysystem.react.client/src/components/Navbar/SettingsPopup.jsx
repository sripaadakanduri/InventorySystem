import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getProfile, updateProfile, requestOtp } from "../../services/userService";
import { toast } from "react-toastify";
import {
    UserIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/outline";
import ChangePassword from "./ChangePassword";

const SettingsPopup = ({ isOpen, onClose }) => {
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
    const [isOtp, setIsOtp] = useState(false);
    // values: "password" | "otp"

    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [form, setForm] = useState(emptyForm);


    useEffect(() => {
        if (!isOpen) {
            setForm(emptyForm);
            setChangePassword(false);
            setIsOtp(false);
            setOtpSent(false);
            setOtpTimer(0);
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
                setOtpTimer(0);
            } catch (err) {
                console.error(err);
            }
        };

        loadProfile();
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
            setOtpTimer(60);
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
                const passwordReqs = [
                    form.newPassword.length >= 8,
                    /(?=.*[A-Z])/.test(form.newPassword),
                    /(?=.*[a-z])/.test(form.newPassword),
                    /(?=.*\d)/.test(form.newPassword),
                    /(?=.*[!@#$%^&*.,<>?|])/.test(form.newPassword),
                ];
                const passwordValid = passwordReqs.every(Boolean);

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
                           <EnvelopeIcon className="h-5 w-5"/> Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div className="flex justify-start pt-2">
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                            <input
                                type="checkbox"
                                checked={changePassword}
                                onChange={(e) => setChangePassword(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Change Password</span>
                        </label>
                    </div>
                    
                    {changePassword && (
                        <ChangePassword
                            form={form}
                            setForm={setForm}
                            handleChange={handleChange}
                            isOtp={isOtp}
                            setIsOtp={setIsOtp}
                            otpSent={otpSent}
                            setOtpSent={setOtpSent}
                            sendingOtp={sendingOtp}
                            otpTimer={otpTimer}
                            setOtpTimer={setOtpTimer}
                            handleSendOtp={handleSendOtp}
                        />
                    )}
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

export default SettingsPopup;
