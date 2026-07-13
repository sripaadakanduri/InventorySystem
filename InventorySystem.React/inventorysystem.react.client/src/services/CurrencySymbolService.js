import api from './api';
export const getCurrencySymbol = async (code) => {
    try {
        const response = await api.get(`/Currency/symbol/${code}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllCurrencySymbols =async ()=>{
    try{
        const response =await api.get(`/currency/symbols`);
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}