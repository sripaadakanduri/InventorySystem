/* eslint-disable no-useless-catch */

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
                navigate("/admin/dashboard");
            }
            else {
                navigate("/dashboard");
            }

        } catch (err) {
            throw err;
        }
    };

    const handleRegister = async (data) => {

        try {

            await register(data);

            navigate("/login");

        } catch (err) {
            throw err;
        }
    };

    const handleLogout = () => {

        logout();

        navigate("/login");
    };

    return {
        handleLogin,
        handleRegister,
        handleLogout,
        isAuthenticated: isAuthenticated(),
        role: getRole(),
        username: getUsername()
    };
};

export default useAuth;