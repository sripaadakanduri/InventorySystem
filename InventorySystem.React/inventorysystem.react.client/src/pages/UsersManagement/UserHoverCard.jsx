import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { formatApiDate } from "../../utils/dateUtils";

const UserHoverCard = ({ user, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + rect.width / 2 + window.scrollX,
            });
        }
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsHovered(false);
        }, 150); // slight delay to allow mouse to move into the card
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <>
            <span
                ref={triggerRef}
                className="cursor-pointer border-b border-dashed border-gray-400 inline-block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </span>
            {isHovered && createPortal(
                <div
                    className="absolute z-[9999] w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 text-left transition-opacity duration-200 opacity-100 cursor-default"
                    style={{
                        top: `${coords.top - 8}px`, // 8px spacing above the text
                        left: `${coords.left}px`,
                        transform: 'translate(-50%, -100%)' // Move up by its own height and center horizontally
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Invisible bridge to prevent mouse leave when moving between trigger and card */}
                    <div className="absolute w-full h-8 bottom-[-32px] left-0 bg-transparent"></div>
                    
                    <div className="flex flex-col gap-2 text-sm text-gray-700 font-normal relative">
                        <div className="font-semibold text-gray-900 border-b pb-1 mb-1">{user.username}</div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium">Email</span>
                            <span className="break-all">{user.email}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium">Created At</span>
                            <span>{formatApiDate(user.createdAt)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium">Last Login</span>
                            <span>{user.lastLoginAt ? formatApiDate(user.lastLoginAt) : 'Never'}</span>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default UserHoverCard;
