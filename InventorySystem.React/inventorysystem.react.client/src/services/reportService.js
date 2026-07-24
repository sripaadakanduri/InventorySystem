import api from "./api";

const REPORT_BASE_URL = "/Report";

export const getOrdersByFilters = async (productId, startDate, endDate,currency) => {
    const response = await api.get(`${REPORT_BASE_URL}/report-data`, {
        params: {
            productId,
            startDate,
            endDate,
            currency
        },
    });
    console.log("API Response:", response.data);
    console.log("Orders:", response.data.orders);
    return response.data;
};
