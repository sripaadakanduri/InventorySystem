import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7236/api",
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();

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
