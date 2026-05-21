import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import {
    Package,
    ShoppingCart,
    Users,
    ClipboardList
} from "lucide-react";

import { getProducts } from "../../services/ProductService";
import { getAllOrders } from "../../services/OrderService";

export default function Dashboard() {

    const role = localStorage.getItem("role");

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
            description: "Manage inventory products",
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
            path: "/admin/audit",
            iconBg: "#fff7ed",
            iconColor: "#ea580c",
        },
    ];

    const allCards =
        role === "Admin"
            ? [...cards, ...adminCards]
            : cards;

    return (

        <div className="dashboard-container">

            {/* HERO SECTION */}
            <section className="hero-section">

                <div
                    className="
                        hero-card m-8 rounded-3xl
                        border border-gray-200
                        p-8 shadow-lg
                    "
                >

                    <div
                        className="
                            hero-grid grid grid-cols-1
                            gap-10 lg:grid-cols-2
                        "
                    >

                        {/* LEFT */}
                        <div className="hero-left">

                            <span
                                className="
                                    hero-tag mb-3 inline-flex
                                    rounded-full bg-blue-50
                                    px-3 py-1 text-sm
                                    text-blue-400
                                "
                            >
                                Inventory Management Platform
                            </span>

                            <h1
                                className="
                                    hero-title mb-4
                                    text-4xl font-bold
                                "
                            >
                                Manage inventory
                                <br />
                                with simplicity.
                            </h1>

                            <p
                                className="
                                    hero-desc mb-6
                                    text-gray-400
                                "
                            >
                                A clean and modern platform
                                to manage products, orders,
                                stock tracking and administration
                                — all in one place.
                            </p>

                            <div className="hero-buttons">

                                <Link
                                    to="/products"
                                    className="
                                        btn-primary mr-5
                                        rounded-2xl bg-black
                                        px-4 py-3 text-white
                                        transition duration-300
                                        hover:bg-gray-800
                                    "
                                >
                                    Explore Products
                                </Link>

                                <Link
                                    to="/orders"
                                    className="
                                        btn-secondary rounded-2xl
                                        border border-gray-200
                                        px-4 py-3
                                        transition duration-300
                                        hover:bg-black hover:text-white transition duration-300
                                    "
                                >
                                    View Orders
                                </Link>

                            </div>

                        </div>

                        {/* RIGHT */}
                        <div className="hero-right flex flex-col">

                            <div
                                className="
                                    grid grid-cols-1
                                    gap-4 md:grid-cols-2
                                "
                            >

                                {/* TOTAL PRODUCTS */}
                                <div
                                    className="
                                        stat-card rounded-2xl
                                        border border-gray-200
                                        bg px-6 py-5
                                        transition duration-300
                                        hover:-translate-y-0.5
                                        hover:shadow-2xl
                                    "
                                >

                                    <p
                                        className="
                                            stat-label mb-5
                                            text-sm text-gray-400
                                        "
                                    >
                                        Total Products
                                    </p>

                                    <h1
                                        className="
                                            stat-value text-4xl
                                            font-bold text-black
                                        "
                                    >
                                        {stats.totalProducts}
                                    </h1>

                                </div>

                                {/* ORDERS TODAY */}
                                <div
                                    className="
                                        stat-card rounded-2xl
                                        border border-gray-200
                                        bg px-6 py-5
                                        transition duration-300
                                        hover:-translate-y-0.5
                                        hover:shadow-2xl
                                    "
                                >

                                    <p
                                        className="
                                            stat-label mb-5
                                            text-sm text-gray-400
                                        "
                                    >
                                        Orders Today
                                    </p>

                                    <h1
                                        className="
                                            stat-value text-4xl
                                            font-bold text-black
                                        "
                                    >
                                        {stats.ordersToday}
                                    </h1>

                                </div>

                            </div>

                            {/* LOW STOCK */}
                            <div
                                className="
                                    stat-card mt-4 rounded-2xl
                                    border border-gray-200
                                    bg px-6 py-5
                                    transition duration-300
                                    hover:-translate-y-0.5
                                    hover:shadow-2xl
                                "
                            >

                                <p
                                    className="
                                        stat-label mb-5
                                        text-sm text-gray-400
                                    "
                                >
                                    Low Stock Alerts
                                </p>

                                <h1
                                    className="
                                        stat-value text-4xl
                                        font-bold text-black
                                    "
                                >
                                    {stats.lowStock} Items
                                </h1>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* QUICK ACCESS */}
            <section className="quick-access-section p-8">

                <div className="quick-access-header mb-6">

                    <h1 className="mb-2 text-2xl font-bold">
                        Quick Access
                    </h1>

                    <h3 className="text-sm text-gray-400">
                        Navigate through your workspace
                    </h3>

                </div>

                {/* CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                    {allCards.map((card, index) => (

                        <Link
                            key={index}
                            to={card.path}
                            className="
                                w-72 rounded-3xl
                                border border-gray-200
                                bg-white p-6 shadow-md
                                transition duration-300
                                hover:-translate-y-1
                                hover:shadow-xl
                            "
                        >

                            {/* TOP */}
                            <div className="flex items-center gap-4">

                                {/* ICON */}
                                <div
                                    className="
                                        flex h-14 w-14
                                        items-center justify-center
                                        rounded-2xl
                                    "
                                    style={{
                                        backgroundColor: card.iconBg,
                                        color: card.iconColor
                                    }}
                                >
                                    {card.icon}
                                </div>

                                {/* TEXT */}
                                <div class="space-y-2">

                                    <h2
                                        className="
                                            text-lg font-bold
                                            text-gray-900
                                        "
                                    >
                                        {card.title}
                                    </h2>

                                    <p className="text-sm text-gray-400">
                                        {card.description}
                                    </p>

                                </div>

                            </div>

                            <h2 class="flex items-center gap-2 mt-10"> Open <ArrowRight size={18} /></h2>

                        </Link>

                    ))}

                </div>

            </section>

            {/* FOOTER */}
            <footer
                className="
                    dashboard-footer mt-10
                    flex items-center justify-between
                    border-t border-gray-200
                    px-8 py-6
                "
            >

                <p className="text-sm text-gray-400">
                    © 2026 Inventory System
                </p>

            </footer>

        </div>
    );
}