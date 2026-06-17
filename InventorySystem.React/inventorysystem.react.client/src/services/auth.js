import API from "./api";

const readValue = (data, key) => data?.[key] ?? data?.[key.charAt(0).toUpperCase() + key.slice(1)];

const saveUserData = (data) => {
    const role = readValue(data, "role");
    const username = readValue(data, "username");

    if (role) {
        localStorage.setItem("role", role);
    }

    if (username) {
        localStorage.setItem("username", username);
    }
};

const clearUserData = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
};

export const login = async (data) => {
    const res = await API.post("/Auth/login", data);
    saveUserData(res.data);
    return res.data;
};

export const googleLogin = async (idToken) => {
    const res = await API.post("/Auth/google-login", { idToken });
    saveUserData(res.data);
    return res.data;
};

export const register = async (data) => {
    const res = await API.post("/Auth/register", data);
    saveUserData(res.data);
    return res.data;
};

export const logout = async () => {
    try {
        await API.post("/Auth/logout");
    } finally {
        clearUserData();
        window.location.replace("/login");
    }
};

export const isAuthenticated = async () => {
    try {
        const res = await API.get("/Auth/me");
        saveUserData(res.data);
        return true;
    } catch {
        clearUserData();
        return false;
    }
};

export const getRole = () => {
    return localStorage.getItem("role");
};

export const getUsername = () => {
    return localStorage.getItem("username");
};
