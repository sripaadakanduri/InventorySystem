import api from './api';

const getTransactions = async () => {
    const response = await api.get('/InventoryTransactions');
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
