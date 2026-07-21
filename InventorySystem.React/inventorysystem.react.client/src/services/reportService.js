import api from "./api";

const REPORT_BASE_URL = "/Report";

export const getOrdersByFilters = async (productId, startDate, endDate) => {
    const response = await api.get(`${REPORT_BASE_URL}/orders-by-product`, {
        params: {
            productId,
            startDate,
            endDate,
        },
    });

    return response.data;
};

export const getFrequencyOfCurrency = async (productId, startDate, endDate) => {
    const response = await api.get(`${REPORT_BASE_URL}/currency-frequency`, {
        params: {
            productId,
            startDate,
            endDate,
        },
    });

    return response.data;
};

export const getTotalQuantityAndRange = async (productId, startDate, endDate) => {
    const response = await api.get(`${REPORT_BASE_URL}/total-quantity`, {
        params: {
            productId,
            startDate,
            endDate,
        },
    });

    return response.data;
};
