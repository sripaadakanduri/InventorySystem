
import api from "./api";

const ORDER_BASE_URL = "/orders";

export const createOrder = async (orderData) => {
    const response = await api.post(ORDER_BASE_URL, orderData);
    return response.data;
};

export const getAllOrders = async (filters = {}) => {
    const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "")
    );

    const response = await api.get(ORDER_BASE_URL, {
        params
    });

    return response.data;
};

export const getOrderById = async (id) => {
    const response = await api.get(`${ORDER_BASE_URL}/${id}`);
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await api.put(`${ORDER_BASE_URL}/${orderId}/cancel`);
    return response.data;
};

export const updateOrder = async (orderId, payload) => {
    const response = await api.put(`${ORDER_BASE_URL}/${orderId}`, payload);
    return response.data;
};
