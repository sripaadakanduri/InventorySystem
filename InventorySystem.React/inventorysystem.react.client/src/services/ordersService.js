
import api from "./api";

const ORDER_BASE_URL = "/orders";

export const createOrder = async (orderData) => {
    const response = await api.post(ORDER_BASE_URL, orderData);
    alert("order craeted successfully")
    return response.data;
};

export const getAllOrders = async () => {
    const response = await api.get(ORDER_BASE_URL);
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await api.get(`${ORDER_BASE_URL}/${id}`);
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await api.put(`${ORDER_BASE_URL}/${orderId}/cancel`);
    alert("order cancelled successfully")
    return response.data;
};

export const updateOrder = async (orderId, updatedItems) => {
    const payload = { items: updatedItems };
    const response = await api.put(`${ORDER_BASE_URL}/${orderId}`, payload);
    alert("order updated successfully")
    return response.data;
};