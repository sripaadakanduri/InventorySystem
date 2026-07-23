import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import {
    Package,
    ShoppingCart,
    Users,
    ClipboardList,
    FileBarChart 
} from "lucide-react";

import { getProducts } from "../../services/ProductService";
import { getAllOrders } from "../../services/ordersService";
import useAuth from "../../hooks/useAuth";
import Analytics from "../Analytics/Analytics";

export default function Dashboard() {
    const analyticsRef = useRef(null);
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const role = user?.role;

    const [stats, setStats] = useState({
        totalProducts: 0,
        ordersToday: 0,
        lowStock: 0,
    });

    useEffect(() => {

        const fetchStats = async () => {

            try {

                const products = await getProducts();

                const orders = await getAllOrders();

                const today = new Date()
                    .toISOString()
                    .split("T")[0];

                const ordersToday = orders.filter(order =>
                    order.createdAt.startsWith(today)
                ).length;

                const lowStock = products.filter(product => {

                    const qty = Number(
                        product.stockQuantity ?? 0
                    );

                    return qty < 5;

                }).length;

                setStats({
                    totalProducts: products.length,
                    ordersToday,
                    lowStock,
                });

            } catch (error) {

                console.error(
                    "Error fetching dashboard stats:",
                    error
                );
            }
        };

        fetchStats();

    }, []);

    const cards = [
        {
            title: "Products",
            description: "Manage inventory",
            icon: <Package size={22} />,
            path: "/products",
            iconBg: "#eff6ff",
            iconColor: "#2563eb",
        },

        {
            title: "Orders",
            description: "Track and manage orders",
            icon: <ShoppingCart size={22} />,
            path: "/orders",
            iconBg: "#f5f3ff",
            iconColor: "#7c3aed",
        },
    ];

    const adminCards = [
        {
            title: "Users",
            description: "Manage system users",
            icon: <Users size={22} />,
            path: "/admin/users",
            iconBg: "#ecfdf5",
            iconColor: "#059669",
        },

        {
            title: "Audit Trail",
            description: "Monitor activity logs",
            icon: <ClipboardList size={22} />,
            path: "/transactions", // Corrected path to match routing
            iconBg: "#fff7ed",
            iconColor: "#ea580c",
        },
        {
            title: "Reports",
            description: "View Product sales",
            icon: <FileBarChart   size={22} />,
            path: "/admin/reports", // Corrected path to match routing
            iconBg: "#dbeafe",
            iconColor: "#2563eb"
        },
    ];

    const allCards =
        role === "Admin"
            ? [...cards, ...adminCards]
            : cards;

    return (

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* HERO SECTION */}
            <section className="mb-12">

                <div
                    className="
                        rounded-3xl border border-gray-200
                        bg-white p-8 md:p-12 shadow-lg
                    "
                >

                    <div
                        className="
                            grid grid-cols-1
                            gap-12 lg:gap-16 lg:grid-cols-2
                        "
                    >

                        {/* LEFT */}
                        <div className="flex flex-col justify-center space-y-6">

                            <div>
                                <div
                                    className="
                                        inline-flex rounded-full bg-blue-50
                                        px-4 py-1.5 text-sm font-medium
                                        text-blue-600 justify-center items-center gap-x-2
                                    "
                                >
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                    Inventory Management Platform
                                </div>
                            </div>

                            <h1
                                className="
                                    text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight
                                "
                            >
                                Manage inventory
                                <br />
                                with simplicity.
                            </h1>

                            <p
                                className="
                                    text-lg text-gray-500 leading-relaxed max-w-lg
                                "
                            >
                                A clean and modern platform
                                to manage products, orders,
                                stock tracking and administration
                                — all in one place.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">

                                <Link
                                    to="/products"
                                    className="
                                        rounded-xl bg-black
                                        px-6 py-3.5 font-semibold text-white
                                        transition duration-300
                                        hover:bg-gray-900 shadow-md
                                        hover:-translate-y-0.5 transform
                                    "
                                >
                                    Explore Products
                                </Link>

                                <Link
                                    to="/orders"
                                    className="
                                        rounded-xl border border-gray-300
                                        px-6 py-3.5 font-semibold text-black
                                        transition duration-300 bg-white shadow-sm
                                        hover:bg-black hover:text-white
                                    "
                                >
                                    View Orders
                                </Link>

                            </div>

                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col gap-6">

                            <div
                                className="
                                    grid grid-cols-1
                                    gap-6 sm:grid-cols-2
                                "
                            >

                                {/* TOTAL PRODUCTS */}
                                <div
                                    className="
                                        group flex flex-col justify-center rounded-2xl border border-gray-100
                                        bg-gray-50 p-6 shadow-sm
                                        transition duration-300
                                        hover:-translate-y-1 hover:shadow-md
                                    "
                                >

                                    <p
                                        className="
                                            mb-3 text-sm font-medium text-gray-500 group-hover:text-black transition duration-300
                                        "
                                    >
                                        Total Products
                                    </p>

                                    <h1
                                        className="
                                            text-4xl font-bold text-gray-900 group-hover:text-5xl duration-300
                                        "
                                    >
                                        {stats.totalProducts}
                                    </h1>

                                </div>

                                {/* ORDERS TODAY */}
                                <div
                                    className="
                                       group flex flex-col justify-center rounded-2xl border border-gray-100
                                        bg-gray-50 p-6 shadow-sm
                                        transition duration-300
                                        hover:-translate-y-1 hover:shadow-md
                                    "
                                >

                                    <p
                                        className="
                                            mb-3 text-sm font-medium text-gray-500  group-hover:text-black transition duration-300
                                        "
                                    >
                                        Orders Today
                                    </p>

                                    <h1
                                        className="
                                            text-4xl font-bold text-gray-900  group-hover:text-5xl duration-300
                                        "
                                    >
                                        {stats.ordersToday}
                                    </h1>

                                </div>

                            </div>

                            {/* LOW STOCK */}
                            <div
                                className="
                                    group flex flex-col justify-center rounded-2xl border border-red-100
                                    bg-red-50 p-6 shadow-sm
                                    transition duration-300
                                    hover:-translate-y-1 hover:shadow-md
                                "
                            >

                                <p
                                    className="
                                        mb-3 text-sm font-medium text-red-600
                                    "
                                >
                                    Low Stock Alerts
                                </p>

                                <h1
                                    className="
                                        text-4xl font-bold text-gray-900 group-hover:text-5xl duration-300
                                    "
                                >
                                    {stats.lowStock} <span className="text-xl font-medium text-gray-500">Items</span>
                                </h1>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* QUICK ACCESS */}
            <section className="mb-12">

                <div className="mb-8 flex flex-col gap-1">

                    <h1 className="text-2xl font-bold text-gray-900">
                        Quick Access
                    </h1>

                    <h3 className="text-sm text-gray-500">
                        Navigate through your workspace
                    </h3>

                </div>

                {/* CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

                    {allCards.map((card, index) => (

                        <Link
                            key={index}
                            to={card.path}
                            className="
                                group flex flex-col justify-between rounded-3xl
                                border border-gray-200 bg-white p-6 shadow-sm
                                transition duration-300 hover:-translate-y-1 hover:shadow-xl
                            "
                        >
                            <div>
                                {/* TOP */}
                                <div className="mb-6 flex items-start gap-4">

                                    {/* ICON */}
                                    <div
                                        className="
                                            flex h-14 w-14 shrink-0
                                            items-center justify-center
                                            rounded-2xl transition-transform duration-300
                                            group-hover:scale-110
                                        "
                                        style={{
                                            backgroundColor: card.iconBg,
                                            color: card.iconColor
                                        }}
                                    >
                                        {card.icon}
                                    </div>

                                    {/* TEXT */}
                                    <div className="space-y-1.5">

                                        <h2
                                            className="
                                                text-lg font-bold text-gray-900
                                            "
                                        >
                                            {card.title}
                                        </h2>

                                        <p className="text-sm text-gray-500 leading-snug">
                                            {card.description}
                                        </p>

                                    </div>

                                </div>
                            </div>

                            <div className="flex items-center text-sm font-semibold text-gray-700 transition-colors group-hover:text-gray-900">
                                Open Module
                                <ArrowRight size={16} className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </div>

                        </Link>

                    ))}

                </div>

            </section>

                <div onClick={() => {
                    const nextState = !open;
                    setOpen(nextState);

                    if (nextState) {
                        setTimeout(() => {
                            analyticsRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });
                        }, 300);
                    }
                }}
                className=" group flex items-center justify-between mb-2">
                <div ref={analyticsRef}
                     className="flex flex-col gap-1">
                    <h1 className="font-bold text-xl">View Analytics</h1>
                    <p className="font-semibold text-sm">Use the charts to analyze</p>
                </div>
                <button
                    className="w-10 h-10 flex items-center justify-center border border-gray-500 rounded-full text-balck group-hover:bg-black group-hover:text-white transition-all duration-300"
                >
                    <svg
                        className={`w-6 h-6 transform transition-transform duration-300 ${open ? "rotate-180" : ""
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>
            <div
                className={`
                    overflow-hidden
                    transition-all
                    duration-700
                    ease-in-out
                    ${open
                        ? "max-h-[5000px] opacity-100 mt-8"
                        : "max-h-0 opacity-0"
                    }
                `}
                        >
                 <Analytics />
            </div>

            {/* FOOTER */}
            <footer
                className="
                    mt-auto flex items-center justify-between
                    border-t border-gray-200 py-6
                "
            >

                <p className="text-sm text-gray-500">
                    © 2026 Inventory System
                </p>

            </footer>

        </div>
    );
}
