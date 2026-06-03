import { useEffect, useRef, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

function InlineNotification({ notification, onClose }) {
    const closeRef = useRef(onClose);
    const [secondsLeft, setSecondsLeft] = useState(5);

    useEffect(() => {
        closeRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!notification?.message || !onClose) {
            return undefined;
        }

        setSecondsLeft(5);
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    closeRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [notification, onClose]);

    if (!notification?.message) {
        return null;
    }

    const isSuccess = notification.type === "success";
    const progress = Math.max(0, Math.min(100, (secondsLeft / 5) * 100));

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div
                className={`flex items-start justify-between gap-3 rounded-t-xl px-4 py-3 text-sm font-medium ${isSuccess
                    ? "border-b border-green-100 bg-green-50 text-green-800"
                    : "border-b border-red-100 bg-red-50 text-red-800"
                    }`}
            >
                <div className="flex items-start gap-3">
                    {isSuccess ? (
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    ) : (
                        <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    )}
                    <div>
                        <div>{notification.message}</div>
                        <div className="text-xs text-slate-500 mt-1">
                            Disappears in {secondsLeft}s
                        </div>
                    </div>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1 transition hover:bg-black/5"
                        aria-label="Dismiss notification"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <div className="h-1 bg-slate-200">
                <div
                    className={`h-full transition-all duration-500 ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

export default InlineNotification;
