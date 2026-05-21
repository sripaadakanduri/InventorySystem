import { useNavigate } from "react-router-dom";

import {
    login,
    register,
    logout,
    isAuthenticated,
    getRole,
    getUsername
} from "../services/auth";

const useAuth = () => {

    const navigate = useNavigate();

    const handleLogin = async (data) => {

        try {

            const response = await login(data);

            if (response.role === "Admin") {
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/dashboard", { replace: true });
            }

        } catch (err) {
            throw err;
        }
    };

    const handleRegister = async (data) => {

        try {

            await register(data);

            navigate("/login", { replace: true });

        } catch (err) {
            throw err;
        }
    };

    const handleLogout = () => {

        logout();

        navigate("/login", { replace: true });
    };

    return {
        handleLogin,
        handleRegister,
        handleLogout,
        authenticated: isAuthenticated(),
        role: getRole(),
        username: getUsername()
    };
};

export default useAuth;