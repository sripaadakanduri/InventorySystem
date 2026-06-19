import api from './api';
export const getLatestRates = async () => {
    try {
        const response = await api.get('/exchangerates');
        return response.data;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        throw error;
    }
};