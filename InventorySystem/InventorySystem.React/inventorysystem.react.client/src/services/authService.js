import Cookies from "js-cookie";
import API from "./api";

const TOKEN_KEY = "AuthToken";

const readValue = (data, key) =>
    data?.[key] ?? data?.[key.charAt(0).toUpperCase() + key.slice(1)];

export const getToken = () => Cookies.get(TOKEN_KEY);

export const saveToken = (token) => {
    if (!token) return;

    Cookies.set(TOKEN_KEY, token, {
        expires: 1,
        secure: true,
        sameSite: "Strict"
    });
};

export const clearToken = () => {
    Cookies.remove(TOKEN_KEY);
};

const persistTokenFromResponse = (data) => {
    saveToken(readValue(data, "token"));
    return data;
};

export const login = async (data) => {
    const res = await API.post("/Auth/login", data);
    return persistTokenFromResponse(res.data);
};

export const register = async (data) => {
    const res = await API.post("/Auth/register", data);
    return persistTokenFromResponse(res.data);
};

export const googleLogin = async (idToken) => {
    const res = await API.post("/Auth/google-login", { idToken });
    return persistTokenFromResponse(res.data);
};

export const logout = () => {
    clearToken();
};
