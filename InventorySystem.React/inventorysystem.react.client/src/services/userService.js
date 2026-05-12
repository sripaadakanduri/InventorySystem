import api from "./api";

export const getUsers = async () => {

    const response = await api.get("/users");

    return response.data;
};

export const updateUserRole = async (id, role) => {

    const response = await api.put(`/users/${id}/role`, {
        role
    });

    return response.data;
};