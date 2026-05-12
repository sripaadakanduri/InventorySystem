// Navbar.jsx

import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";
import { isAuthenticated } from "../../services/auth";

const Navbar = () => {

    const { handleLogout, role, username } = useAuth();

    const location = useLocation();
    if (!isAuthenticated()) {
        return null;
    }

    return (
        <nav className="navbar">

            <div className="navbar-container">

                {/* Brand */}
                <div className="navbar-brand">
                    <span className="logo-icon">🛒</span>
                    <h2>Inventory App</h2>
                </div>

                {/* Navigation Links */}
                <div className="nav-links">

                    <Link to="/dashboard">
                        <button
                            className={`nav-btn ${location.pathname === "/dashboard" ? "active" : ""
                                }`}
                        >
                            Dashboard
                        </button>
                    </Link>

                    <Link to="/orders">
                        <button
                            className={`nav-btn ${location.pathname === "/orders" ? "active" : ""
                                }`}
                        >
                            Orders
                        </button>
                    </Link>

                    <Link to="/products">
                        <button
                            className={`nav-btn ${location.pathname === "/products" ? "active" : ""
                                }`}
                        >
                            Products
                        </button>
                    </Link>

                    {/* Admin Links */}
                    {role === "Admin" && (
                        <>
                            <Link to="/admin/users">
                                <button
                                    className={`nav-btn ${location.pathname === "/admin/users"
                                        ? "active"
                                        : ""
                                        }`}
                                >
                                    Users
                                </button>
                            </Link>

                            <Link to="/transactions">
                                <button
                                    className={`nav-btn ${location.pathname === "/transactions"
                                        ? "active"
                                        : ""
                                        }`}
                                >
                                    Transactions
                                </button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Right Side */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem"
                    }}
                >

                    <button
                        onClick={handleLogout}
                        className="btn-logout"
                    >
                        Logout
                    </button>
                </div>

            </div>

        </nav>
    );
};

export default Navbar;