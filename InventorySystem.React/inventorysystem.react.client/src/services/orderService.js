import api from "./api";

const ORDER_BASE_URL = "/orders";

export const createOrder = async (orderData) => {
    const response = await api.post(ORDER_BASE_URL, orderData);
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