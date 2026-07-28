import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getProfile, updateProfile, requestOtp } from "../../services/userService";
import { toast } from "react-toastify";
import {
    UserIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/outline";
import ChangePassword from "./ChangePassword";
import {logout} from "../../services/authService";
const SettingsPopup = ({ isOpen, onClose }) => {
    const emptyForm = {
        username: "",
        email: "",
        oldPassword: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
        notificationSchedule: "N",
        role: "User"
    };

    const [loading, setLoading] = useState(false);
    const [changePassword, setChangePassword] = useState(false);


    const [notifications, setNotifications] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState();
    const options = ["Daily", "Weekly", "Monthly", "Yearly"];

    const [weekDay, setWeekDay] = useState(null);
    const [monthDate, setMonthDate] = useState(1);
    const [yearYear, setYearYear] = useState(new Date().getFullYear());
    const [yearMonth, setYearMonth] = useState(1);
    const [yearDate, setYearDate] = useState(1);

    const updateSchedule = (type, value1 = null, value2 = null) => {
        let value = "N";

        switch (type) {
            case "daily":
                value = "D";
                break;

            case "weekly":
                value = `W-${value1}`;
                break;

            case "monthly":
                value = `M-${value1}`;
                break;

            case "yearly":
                value = `Y-${value1}-${value2}`;
                break;
        }

        updateFormField("notificationSchedule", value);
    };

    const weekDays = [
        { label: "Sun", value: 0 },
        { label: "Mon", value: 1 },
        { label: "Tue", value: 2 },
        { label: "Wed", value: 3 },
        { label: "Thu", value: 4 },
        { label: "Fri", value: 5 },
        { label: "Sat", value: 6 },
    ];


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
                    notificationSchedule: data?.notificationSchedule || "N",
                    role: data?.role || "User"
                });

                if (data?.role === "Admin") {
                    setNotifications(true);
                    setSelectedOpt("Daily");
                } else if (data?.notificationSchedule && data.notificationSchedule !== "N") {
                    setNotifications(true);
                    if (data.notificationSchedule === "D") {
                        setSelectedOpt("Daily");
                    } else if (data.notificationSchedule.startsWith("W-")) {
                        setSelectedOpt("Weekly");
                        setWeekDay(parseInt(data.notificationSchedule.split("-")[1], 10));
                    } else if (data.notificationSchedule.startsWith("M-")) {
                        setSelectedOpt("Monthly");
                        setMonthDate(parseInt(data.notificationSchedule.split("-")[1], 10));
                    } else if (data.notificationSchedule.startsWith("Y-")) {
                        setSelectedOpt("Yearly");
                        const parts = data.notificationSchedule.split("-");
                        setYearMonth(parseInt(parts[1], 10));
                        setYearDate(parseInt(parts[2], 10));
                        setYearYear(new Date().getFullYear());
                    }
                } else {
                    setNotifications(false);
                    setSelectedOpt(null);
                }

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
    const updateFormField = (name, value) => {
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

        if (!form.username.trim()) {
            toast.error("Username cannot be empty.");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!form.email.trim()) {
            toast.error("Email cannot be empty.");
            return;
        }
        if (!emailRegex.test(form.email.trim())) {
            toast.error("Please enter a valid email address (e.g., user@example.com).");
            return;
        }

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
            notificationSchedule: form.role === "Admin" ? "D" : form.notificationSchedule
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
            if(form.newPassword){
                logout();
            }
            await refreshUser();

            toast.success("Profile updated successfully.");
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
                            disabled
                            className="w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200 bg-gray-100 text-gray-500 cursor-not-allowed"
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

                    <div className="grid  grid-cols-2 justify-start pt-2">
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                            <input
                                type="checkbox"
                                checked={changePassword}
                                onChange={(e) => setChangePassword(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Change Password</span>
                        </label>
                        <div>
                            <label className="flex items-center justify-end gap-2 cursor-pointer whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    checked={notifications}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setNotifications(checked);
                                        setSelectedOpt(null)

                                        if (!checked) {
                                            setSchedule("N");
                                            setWeekDay(null);
                                            setMonthDate(1);
                                            setYearMonth(1);
                                            setYearDate(1);
                                        } else {
                                            updateSchedule(selectedOpt.toLowerCase());
                                        }
                                    }}
                                    disabled={form.role === "Admin"}
                                    className={`h-4 w-4 rounded border-gray-300 focus:ring-blue-500 ${form.role === "Admin" ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
                                        }`}
                                />
                                <span className="text-sm font-medium text-gray-700">Get Notifications</span>
                            </label>

                            {
                                notifications && (
                                    <div className="flex justify-end mt-3">
                                        <div className="flex rounded-full bg-gray-100 p-1">
                                            {options.map((option) => (
                                                <button
                                                    type="button"
                                                    key={option}
                                                    onClick={() => setSelectedOpt(option)}
                                                    disabled={form.role === "Admin"}
                                                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${selectedOpt === option
                                                        ? "bg-blue-600 text-white shadow"
                                                        : "text-gray-600"
                                                        } ${form.role === "Admin" && selectedOpt !== option
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : form.role === "Admin"
                                                                ? "cursor-not-allowed"
                                                                : "hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>

                                    </div>
                                )
                            }
                            {
                                selectedOpt === "Weekly" && (
                                    <div className="flex justify-end mt-3">
                                        <div className="flex gap-2 flex-wrap">
                                            {weekDays.map((day) => (
                                                <button
                                                    key={day.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setWeekDay(day.value);
                                                        updateSchedule("weekly", day.value);
                                                    }}
                                                    className={`px-3 py-2 rounded-lg border transition ${weekDay === day.value
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-white hover:bg-gray-100 border-gray-300"
                                                        }`}
                                                >
                                                    {day.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
                            {
                                selectedOpt === "Monthly" && (
                                    <div className="flex flex-col gap-2 mt-3">
                                        <div className="flex items-center gap-4 justify-end">
                                            <label className="whitespace-nowrap font-medium">
                                                Choose a date
                                            </label>

                                            <select
                                                value={monthDate}
                                                onChange={(e) => {
                                                    const date = Number(e.target.value);
                                                    setMonthDate(date);
                                                    updateSchedule("monthly", date);
                                                }}
                                                className="flex w-[70px] border rounded-lg px-3 py-2"
                                            >
                                                {Array.from({ length: 31 }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <span className="text-xs text-gray-500 text-right">
                                            *If a month has fewer days, it will be sent on the last day of the month.
                                        </span>
                                    </div>
                                )
                            }
                            {
                                selectedOpt === "Yearly" && (
                                    <div className="flex justify-end mt-3 gap-3">
                                        <input
                                            type="date"
                                            value={`${yearYear}-${String(yearMonth).padStart(2, "0")}-${String(yearDate).padStart(2, "0")}`}
                                            onChange={(e) => {
                                                const selectedDate = e.target.value;
                                                if (selectedDate) {
                                                    const [yearStr, monthStr, dateStr] = selectedDate.split("-");
                                                    const year = Number(yearStr);
                                                    const month = Number(monthStr);
                                                    const date = Number(dateStr);

                                                    setYearYear(year);
                                                    setYearMonth(month);
                                                    setYearDate(date);
                                                    updateSchedule("yearly", month, date);
                                                }
                                            }}
                                            className="border rounded-lg px-3 py-2 w-full sm:w-auto text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )
                            }
                        </div>

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
