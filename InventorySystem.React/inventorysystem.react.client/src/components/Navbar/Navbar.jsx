import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import {
    Home,
    ShoppingCart,
    Package,
    Users,
    CreditCard,
    LogOut
} from "lucide-react";

const Navbar = () => {

    const {
        handleLogout,
        role,
        username,
        authenticated
    } = useAuth();

    const location = useLocation();

    const navigate = useNavigate();

    if (!authenticated) return null;

    return (

        <nav className="sticky top-4 z-50 flex justify-center mx-6">

            <div
                className="
                    flex w-full max-w-6xl
                    items-center justify-between
                    rounded-full border border-gray-200
                    bg-white/80 px-4 py-2
                    shadow-lg backdrop-blur
                "
            >

                <div
                    className="flex cursor-pointer items-center gap-3"
                    onClick={() => navigate("/dashboard")}
                >

                    <div
                        className="
                            flex h-12 w-12 items-center justify-center
                            rounded-2xl bg-blue-50
                            text-xl font-bold text-black
                        "
                    >
                        🛒
                    </div>

                    <div>

                        <h1 className="md:text-2xl text-lg  font-black tracking-[0.1 em] uppercase">
                            Inventory<span className="text-primary ml-2 md:ml-3">System</span>
                        </h1>

                    </div>

                </div>

                {/* Right Side */}
                <div className="relative group">

                    <div
                        className="
                            flex items-center gap-2
                            rounded-3xl px-3 py-2
                            transition duration-300
                            hover:bg-gray-100 hover:shadow-2xl
                        "
                    >

                        <span
                            className="
                                flex h-12 w-12 items-center justify-center
                                rounded-full bg-blue-500
                                text-lg font-bold text-white
                            "
                        >
                            {username
                                ? username[0].toUpperCase()
                                : "U"}
                        </span>

                        <div className="text-left">

                            <span className="font-semibold">
                                {username.charAt(0).toUpperCase() + username.slice(1) }
                            </span>

                            <p className="text-sm text-gray-400">
                                {role}
                            </p>

                        </div>

                        <span
                            className="
                                text-gray-400 transition duration-300
                                group-hover:rotate-180
                            "
                        >

                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                            >
                                <path
                                    d="M2 4L6 8L10 4"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                        </span>

                    </div>

                    <div
                        className="
                            invisible absolute right-0 top-full
                            mt-2 w-80 origin-top-right
                            rounded-2xl border border-gray-200
                            bg-white p-6 shadow-2xl
                            opacity-0 scale-95
                            transition-all duration-300
                            group-hover:visible
                            group-hover:opacity-100
                            group-hover:scale-100
                        "
                    >

                        <div className="flex gap-6 justify-center items-center">

                            <div
                                className="
                                    mt-2 flex h-12 w-12 items-center justify-center
                                    rounded-full bg-purple-500
                                    text-lg font-bold text-white 
                                "
                            >
                                {username
                                    ? username[0].toUpperCase()
                                    : "U"}
                            </div>

                            <div>

                                <h1 className="text-lg font-semibold">
                                    {username.charAt(0).toUpperCase() + username.slice(1)}
                                </h1>

                                <h2 className="text-sm text-gray-400">
                                    {role}
                                </h2>

                            </div>

                        </div>

                        <div className="my-3 border border-gray-200"></div>

                        <div classNam="flex flex-col gap-y-3">
                        <Link
                            to="/dashboard"
                            className={`
                                flex w-full items-center gap-3
                                rounded-2xl px-3 py-2
                                transition duration-300
                                hover:bg-blue-50
                                mb-2
                                ${location.pathname === "/dashboard"
                                    ? "bg-blue-50 text-blue-600"
                                    : ""
                                }
                            `}
                        >

                            <Home size={16} />

                            <span>Dashboard</span>

                        </Link>

                        <Link
                            to="/orders"
                            className={`
                                flex w-full items-center gap-3
                                rounded-2xl px-3 py-2
                                transition duration-300
                                hover:bg-blue-50
                                mb-2
                                ${location.pathname === "/orders"
                                    ? "bg-blue-50 text-blue-600"
                                    : ""
                                }
                            `}
                        >

                            <ShoppingCart size={16} />

                            <span>Orders</span>

                        </Link>

                        <Link
                            to="/products"
                            className={`
                                flex w-full items-center gap-3
                                rounded-2xl px-3 py-2
                                transition duration-300
                                hover:bg-blue-50 mb-2
                                ${location.pathname === "/products"
                                    ? "bg-blue-50 text-blue-600"
                                    : ""
                                }
                            `}
                        >

                            <Package size={16} />

                            <span>Products</span>

                        </Link>

                        {role === "Admin" && (
                            <>

                                <div className="my-3 border border-gray-200"></div>

                                <p
                                    className="
                                        mb-2 ml-2 text-xs
                                        font-semibold uppercase
                                        tracking-wider text-gray-400 mb-2
                                    "
                                >
                                    Admin
                                </p>

                                <Link
                                    to="/admin/users"
                                    className={`
                                        flex w-full items-center gap-3
                                        rounded-2xl px-3 py-2
                                        transition duration-300
                                        hover:bg-blue-50 mb-2
                                        ${location.pathname === "/admin/users"
                                            ? "bg-blue-50 text-blue-600"
                                            : ""
                                        }
                                    `}
                                >

                                    <Users size={16} />

                                    <span>Users</span>

                                </Link>

                                <Link
                                    to="/transactions"
                                    className={`
                                        flex w-full items-center gap-3
                                        rounded-2xl px-3 py-2
                                        transition duration-300
                                        hover:bg-blue-50 mb-2
                                        ${location.pathname === "/transactions"
                                            ? "bg-blue-50 text-blue-600"
                                            : ""
                                        }
                                    `}
                                >

                                    <CreditCard size={16} />

                                    <span>Audit Trail</span>

                                </Link>

                            </>
                        )}
                        </div>


                        <div className="my-3 border border-gray-200"></div>

                  
                        <button
                            className="
                                ml-2 flex w-full items-center gap-3
                                rounded-2xl px-3 py-2
                                text-red-500 transition duration-300
                                hover:bg-red-50
                            "
                            onClick={handleLogout}
                        >

                            <LogOut size={16} />

                            <span>Logout</span>

                        </button>

                    </div>

                </div>

            </div>

        </nav>
    );
};

export default Navbar;
