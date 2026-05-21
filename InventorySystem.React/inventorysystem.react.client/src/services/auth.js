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

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getRole = () => {
    return localStorage.getItem("role");
};

export const getUsername = () => {
    return localStorage.getItem("username");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};