import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import * as authService from "../services/authService";

const useAuth = () => {
    const navigate = useNavigate();
    const auth = useAuthContext();

    const handleLogin = async (data) => {
        await authService.login(data);
        await auth.refreshUser();
        navigate("/dashboard", { replace: true });
    };

    const handleGoogleLogin = async (idToken) => {
        await authService.googleLogin(idToken);
        await auth.refreshUser();
        navigate("/dashboard", { replace: true });
    };

    const handleRegister = async (data) => {
        await authService.register(data);
        await auth.refreshUser();
        navigate("/dashboard", { replace: true });
    };

    const handleLogout = () => {
        authService.logout();
        auth.refreshUser();
        navigate("/login", { replace: true });
    };

    return {
        ...auth,
        handleLogin,
        handleGoogleLogin,
        handleRegister,
        handleLogout
    };
};

export default useAuth;
