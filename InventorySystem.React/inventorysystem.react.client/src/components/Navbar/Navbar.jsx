import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";
import { isAuthenticated } from "../../services/auth";

const Navbar = () => {
    const { handleLogout, role, username } = useAuth();
    const location = useLocation();

    if (!isAuthenticated()) return null;

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Brand */}
                <div className="navbar-brand">
                    <span className="logo-icon">🛒</span>
                    <span className="brand-name">Inventory</span>
                </div>

                {/* Hover Menu */}
                <div className="menu-container">
                    <div className="menu-trigger">
                        <span className="menu-trigger-avatar">
                            {username ? username[0].toUpperCase() : "U"}
                        </span>
                        <span className="menu-trigger-name">{username}</span>
                        <span className="menu-trigger-chevron">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>

                    <div className="dropdown-menu">
                        {/* User info header */}
                        <div className="dropdown-header">
                            <div className="dropdown-avatar">
                                {username ? username[0].toUpperCase() : "U"}
                            </div>
                            <div className="dropdown-user-info">
                                <span className="dropdown-username">{username}</span>
                                <span className="dropdown-role">{role}</span>
                            </div>
                        </div>

                        <div className="dropdown-divider" />

                        <Link to="/dashboard" className={`dropdown-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
                            <span className="item-icon">🏠</span>
                            <span>Dashboard</span>
                            {location.pathname === "/dashboard" && <span className="active-dot" />}
                        </Link>
                        <Link to="/orders" className={`dropdown-item ${location.pathname === "/orders" ? "active" : ""}`}>
                            <span className="item-icon">📦</span>
                            <span>Orders</span>
                            {location.pathname === "/orders" && <span className="active-dot" />}
                        </Link>
                        <Link to="/products" className={`dropdown-item ${location.pathname === "/products" ? "active" : ""}`}>
                            <span className="item-icon">🛍</span>
                            <span>Products</span>
                            {location.pathname === "/products" && <span className="active-dot" />}
                        </Link>

                        {role === "Admin" && (
                            <>
                                <div className="dropdown-divider" />
                                <p className="dropdown-section-label">Admin</p>
                                <Link to="/admin/users" className={`dropdown-item ${location.pathname === "/admin/users" ? "active" : ""}`}>
                                    <span className="item-icon">👥</span>
                                    <span>Users</span>
                                    {location.pathname === "/admin/users" && <span className="active-dot" />}
                                </Link>
                                <Link to="/transactions" className={`dropdown-item ${location.pathname === "/transactions" ? "active" : ""}`}>
                                    <span className="item-icon">💳</span>
                                    <span>Transactions</span>
                                    {location.pathname === "/transactions" && <span className="active-dot" />}
                                </Link>
                            </>
                        )}

                        <div className="dropdown-divider" />

                        <button className="btn-logout" onClick={handleLogout}>
                            <span className="item-icon">🔒</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;