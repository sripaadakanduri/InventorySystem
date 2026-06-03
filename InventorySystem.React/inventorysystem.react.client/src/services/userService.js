import api from "./api";

export const getUsers = async (filters = {}) => {
    const params = {};

    if (filters.Username) params.User = filters.Username;
    if (filters.Role) params.Role = filters.Role;

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
