import API from "./api";

export const login = async (data) => {
    const res = await API.post("/Auth/login", data);

    saveAuthData(res.data);

    return res.data;
};

export const register = async (data) => {
    const res = await API.post("/Auth/register", data);
    alert("User registered successfully!");
    return res.data;
};

export const saveAuthData = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("username", data.username);
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
};

const decodeJwtPayload = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = atob(base64);

        return JSON.parse(payload);
    } catch {
        return null;
    }
};

export const isTokenExpired = (token) => {
    const payload = decodeJwtPayload(token);

    if (!payload?.exp) {
        return true;
    }

    return Date.now() >= payload.exp * 1000;
};

export const getToken = () => {
    const token = localStorage.getItem("token");

    if (token && isTokenExpired(token)) {
        logout();
        return null;
    }

    return token;
};

export const getRole = () => {
    return localStorage.getItem("role");
};

export const getUsername = () => {
    return localStorage.getItem("username");
};

export const isAuthenticated = () => {
    return !!getToken();
};
