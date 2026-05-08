import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {

    const navigate = useNavigate();

    const { handleLogout } = useAuth();

    const logout = () => {

        handleLogout();

        navigate("/login");
    };

    return (
        <div className="navbar">

            <h2>Inventory System</h2>

            <div className="nav-links">

                <button onClick={() => navigate("/products")}>
                    Products
                </button>
                <button onClick={() => navigate("/Orders")}>
                    Orders
                </button>

                <button onClick={logout}>
                    Logout
                </button>

            </div>

        </div>
    );
}