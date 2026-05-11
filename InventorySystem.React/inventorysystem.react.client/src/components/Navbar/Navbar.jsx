import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { handleLogout } = useAuth();

    const logout = () => {
        handleLogout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path ? "active" : "";

    return (
        <nav className="navbar glass">
            <div className="navbar-container">
                <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
                    <div className="logo-icon">📦</div>
                    <h2>Inventory System</h2>
                </div>

                <div className="nav-links">
                    <button
                        className={`nav-btn ${isActive("/dashboard")}`}
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`nav-btn ${isActive("/products")}`}
                        onClick={() => navigate("/products")}
                    >
                        Products
                    </button>
                    <button
                        className={`nav-btn ${isActive("/orders")}`}
                        onClick={() => navigate("/orders")}
                    >
                        Orders
                    </button>
                    <button
                        className={`nav-btn ${isActive("/transactions")}`}
                        onClick={() => navigate("/transactions")}
                    >
                        Audit Trail
                    </button>
                </div>

                <div className="nav-actions">
                    <button className="btn-logout" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}