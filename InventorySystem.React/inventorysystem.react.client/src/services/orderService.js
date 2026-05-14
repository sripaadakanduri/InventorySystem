// ============================================
// FILE: orderService.js
// ============================================
import api from "./api";

const ORDER_BASE_URL = "/orders";

// Create a new order
export const createOrder = async (orderData) => {
    const response = await api.post(ORDER_BASE_URL, orderData);
    return response.data;
};

// Get all orders
export const getAllOrders = async () => {
    const response = await api.get(ORDER_BASE_URL);
    return response.data;
};

// Get a single order by ID
export const getOrderById = async (id) => {
    const response = await api.get(`${ORDER_BASE_URL}/${id}`);
    return response.data;
};

// Cancel an order
export const cancelOrder = async (orderId) => {
    const response = await api.put(`${ORDER_BASE_URL}/${orderId}/cancel`);
    return response.data;
};

// Edit / update an order
export const updateOrder = async (orderId, updatedItems) => {
    // updatedItems = [{ productId, quantity }]
    const payload = { items: updatedItems };
    const response = await api.put(`${ORDER_BASE_URL}/${orderId}`, payload);
    return response.data;
};