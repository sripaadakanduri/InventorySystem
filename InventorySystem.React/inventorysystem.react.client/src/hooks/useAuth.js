import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import * as authService from "../services/authService";
import { getRedirectDestination } from "../utils/getRedirectDestination";

const useAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuthContext();

    const handleLogin = async (data) => {
        const destination = getRedirectDestination(location.state?.from);

        await authService.login(data);
        await auth.refreshUser();

        navigate(destination, { replace: true });

    };

    const handleGoogleLogin = async (idToken) => {
        console.log("Google location.state:", location.state);

        const destination = getRedirectDestination(location.state?.from);

        await authService.googleLogin(idToken);
        await auth.refreshUser();

        console.log("Redirecting to:", destination);

        navigate(destination, { replace: true });
    };

    const handleRegister = async (data) => {
        await authService.register(data);
        await auth.refreshUser();

        navigate("/dashboard", { replace: true });
    };

    const handleLogout = (state) => {
        authService.logout();
        auth.refreshUser();

        navigate("/login", { replace: true },state);
    };

    return {
        ...auth,
        handleLogin,
        handleGoogleLogin,
        handleRegister,
        handleLogout,
    };
};

export default useAuth;
