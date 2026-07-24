import api from "./api";

export const getUsers = async (filters = {}) => {
    const params = {};

    if (filters.username) params.User = filters.username;
    if (filters.role) params.Role = filters.role;

    const response = await api.get("/users", { params });

    return response.data;
};

export const updateUserRole = async (id, role) => {
    const response = await api.put(`/users/${id}/role`, {
        role
    });

    return response.data;
};

export const createUser = async (userData) => {

    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;

};

export const updateProfile = async (profileData) => {
    const response = await api.put("/user-management/profile", profileData);

    return response.data;
};

export const getProfile = async () => {
    const response = await api.get("/user-management/profile");

    return response.data;
};

export const requestOtp = async () => {
    const response = await api.post("/user-management/request-otp");

    return response.data;
};

