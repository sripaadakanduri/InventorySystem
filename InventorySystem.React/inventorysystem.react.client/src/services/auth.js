import API from "./api";

export const login = async (data) => {
    const res = await API.post("/Auth/login", data);
    localStorage.setItem("token", res.data.token);
    return res.data;
};

export const register = async (data) => {
    const res = await API.post("/Auth/register", data);
    return res.data;
};

export const logout = () => {
    localStorage.removeItem("token");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};