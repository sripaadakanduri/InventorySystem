import { Navigate } from "react-router-dom";
import {
    isAuthenticated,
    getRole
} from "../services/auth";

const ProtectedRoute = ({ children, role }) => {

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    if (role && getRole() !== role) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;