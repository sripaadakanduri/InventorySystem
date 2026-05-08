import { useNavigate } from "react-router-dom";
import * as auth from "../services/auth";

export default function useAuth() {
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        try {
            await auth.login(data);
            navigate("/dashboard");
        } catch (err) {
            throw err; // ✅ send error back
        }
    };

    const handleRegister = async (data) => {
        try {
            await auth.register(data);
            navigate("/login");
        } catch (err) {
            throw err;
        }
    };

    const handleLogout = () => {
        auth.logout();
        navigate("/login");
    };

    return { handleLogin, handleRegister, handleLogout };
}