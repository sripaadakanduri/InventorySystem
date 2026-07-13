import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: "https://localhost:7236/api",
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("AuthToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove("AuthToken");

            if (
                window.location.pathname !== "/login" &&
                window.location.pathname !== "/register"
            ) {
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    }
);

export default api;
