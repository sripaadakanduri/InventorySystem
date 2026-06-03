
import api from "./api";

const ORDER_BASE_URL = "/orders";

export const createOrder = async (orderData) => {
    const response = await api.post(ORDER_BASE_URL, orderData);
    return response.data;
};

export const getAllOrders = async (filters = {}) => {
    const response = await api.get(ORDER_BASE_URL, {
        params: filters
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

export const updateOrder = async (orderId, updatedItems) => {
    const payload = { items: updatedItems };
    const response = await api.put(`${ORDER_BASE_URL}/${orderId}`, payload);
    return response.data;
};
