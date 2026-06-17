import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

const PublicRoute = ({ children }) => {
    const [state, setState] = useState({
        loading: true,
        authenticated: false
    });

    useEffect(() => {
        let active = true;

        const checkAuthentication = async () => {
            const authenticated = await isAuthenticated();

            if (active) {
                setState({
                    loading: false,
                    authenticated
                });
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

    if (state.authenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;
