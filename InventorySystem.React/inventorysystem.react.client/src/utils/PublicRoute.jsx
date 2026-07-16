import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getRedirectDestination } from "./getRedirectDestination";

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Loading...
            </div>
        );
    }

    if (user) {
        return (
            <Navigate
                to={getRedirectDestination(location.state?.from)}
                replace
            />
        );
    }

    return children;
};

export default PublicRoute;
