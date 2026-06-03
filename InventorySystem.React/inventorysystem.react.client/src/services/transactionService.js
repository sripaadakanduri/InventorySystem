import api from './api';

const getTransactions = async (filters = {}) => {
    const response = await api.get('/InventoryTransactions', {
        params: filters
    });

    return response.data;
};

const getTransactionsByProduct = async (productId) => {
    const response = await api.get(`/InventoryTransactions/product/${productId}`);
    return response.data;
};

export default {
    getTransactions,
    getTransactionsByProduct
};
