import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import * as authService from "../services/authService";

const EmailGuard = ({ children }) => {
    const { user, setUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const expectedEmail = params.get("userEmail");

    const emailMismatch =
        expectedEmail &&
        user?.email &&
        expectedEmail.toLowerCase() !== user.email.toLowerCase();

    useEffect(() => {
        if (!emailMismatch) return;

        authService.logout(); 
        setUser(null); 

        navigate("/login", {
            replace: true,
            state: { from: location }
        });
    }, [emailMismatch, location, navigate, setUser]);

    if (emailMismatch) {
        return null;
    }

    return children;
};

export default EmailGuard;