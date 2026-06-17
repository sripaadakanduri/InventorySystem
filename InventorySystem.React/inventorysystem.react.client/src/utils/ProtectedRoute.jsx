import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../services/api";

const readValue = (data, key) => data?.[key] ?? data?.[key.charAt(0).toUpperCase() + key.slice(1)];

const ProtectedRoute = ({ children, role }) => {
    const [state, setState] = useState({
        loading: true,
        authenticated: false,
        userRole: null
    });

    useEffect(() => {
        let active = true;

        const checkAuthentication = async () => {
            try {
                const res = await API.get("/Auth/me");
                const userRole = readValue(res.data, "role");
                const username = readValue(res.data, "username");

                if (userRole) {
                    localStorage.setItem("role", userRole);
                }

                if (username) {
                    localStorage.setItem("username", username);
                }

                if (active) {
                    setState({
                        loading: false,
                        authenticated: true,
                        userRole
                    });
                }
            } catch {
                localStorage.clear();

                if (active) {
                    setState({
                        loading: false,
                        authenticated: false,
                        userRole: null
                    });
                }
            }
        };

        checkAuthentication();

        return () => {
            active = false;
        };
    }, []);

    if (state.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Loading...
            </div>
        );
    }

    if (!state.authenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && state.userRole !== role) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
