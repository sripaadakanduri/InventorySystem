import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    ShoppingCart,
    Users,
    ClipboardList,
    ArrowRight,
} from "lucide-react";

import { getProducts } from "../../services/ProductService";
import { getAllOrders } from "../../services/OrderService";

import "./Dashboard.css";

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

                const today = new Date().toISOString().split("T")[0];

                const ordersToday = orders.filter(order =>
                    order.createdAt.startsWith(today)
                ).length;

                const lowStock = products.filter(product => {
                    const qty = Number(product.stockQuantity ?? 0);
                    return qty < 5;
                }).length;

                setStats({
                    totalProducts: products.length,
                    ordersToday,
                    lowStock,
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
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

    const allCards = role === "Admin" ? [...cards, ...adminCards] : cards;

    return (
        <div className="dashboard-container">
            {/* HERO */}
            <section className="hero-section">
                <div className="hero-card">
                    <div className="hero-grid">
                        <div className="hero-left">
                            <span className="hero-tag">Inventory Management Platform</span>
                            <h1 className="hero-title">
                                Manage inventory<br />with simplicity.
                            </h1>
                            <p className="hero-desc">
                                A clean and modern platform to manage products,
                                orders, stock tracking and administration — all in one place.
                            </p>
                            <div className="hero-buttons">
                                <Link to="/products" className="btn-primary">Explore Products</Link>
                                <Link to="/orders" className="btn-secondary">View Orders</Link>
                            </div>
                        </div>

                        <div className="hero-right">
                            <div className="stat-card">
                                <p className="stat-label">Total Products</p>
                                <p className="stat-value">{stats.totalProducts}</p>
                            </div>

                            <div className="stat-card">
                                <p className="stat-label">Orders Today</p>
                                <p className="stat-value">{stats.ordersToday}</p>
                            </div>

                            <div className="stat-card span-two">
                                <p className="stat-label">Low Stock Alerts</p>
                                <p className="stat-value alert">{stats.lowStock} Items</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="quick-access-section">
                <div className="quick-access-header">
                    <h2>Quick Access</h2>
                    <p>Navigate through your workspace</p>
                </div>
                <div className="cards-grid">
                    {allCards.map((card, index) => (
                        <CardItem key={index} card={card} />
                    ))}
                </div>
            </section>

            <footer className="dashboard-footer">
                <p>© 2026 Inventory System</p>
            </footer>
        </div>
    );
}

function CardItem({ card }) {
    return (
        <Link
            to={card.path}
            className="card-item"
            style={{ backgroundColor: "#fff" }}
        >
            <div
                className="card-icon"
                style={{ backgroundColor: card.iconBg, color: card.iconColor }}
            >
                {card.icon}
            </div>

            <h3 className="card-title">{card.title}</h3>
            <p className="card-desc">{card.description}</p>

            <div className="card-footer">
                Open <ArrowRight size={14} />
            </div>
        </Link>
    );
}