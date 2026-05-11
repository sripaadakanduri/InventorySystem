// Navbar.jsx
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
    const { logoutUser, role, username } = useAuth();

    return (
        <nav
            style={{
                padding: "15px 20px",
                borderBottom: "1px solid gray",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                flexWrap: "wrap",
                backgroundColor: "#f8f8f8"
            }}
        >
            {/* Common links for all users */}
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/Products">Products</Link>

            {/* Admin-only links */}
            {role === "Admin" && (
                <>
                    <Link to="/admin/users">Users</Link>
                    <Link to="/transactions">Transactions</Link>

                </>
            )}

            {/* Spacer pushes username and logout to right */}
            <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
                <span>Welcome {username}</span>
                <button
                    onClick={logoutUser}
                    style={{
                        padding: "5px 10px",
                        cursor: "pointer",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px"
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;