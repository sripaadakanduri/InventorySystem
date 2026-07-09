import API from "./api";
import { clearToken } from "./authService";

export * from "./authService";

export const isAuthenticated = async () => {
    try {
        await API.get("/Auth/me");
        return true;
    } catch {
        clearToken();
        return false;
    }
};
