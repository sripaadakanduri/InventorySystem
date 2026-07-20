import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import {getAllCurrencySymbols} from "../../services/CurrencySymbolService";
import ReportTable from '../../components/ReportsTable/reportTable';

import 
{Search ,RotateCcw,Download} from "lucide-react";
function Report() {
    const [selectedProduct, setSelectedProduct] = useState('');
    const[selectedCurrency, setSelectedCurrency] = useState('');
    const[selectedStartDate, setSelectedStartDate] = useState('');
    const[selectedEndDate, setSelectedEndDate] = useState('');
    const[products, setProducts] = useState([]);
    const [currencies, setCurrencies] = useState([]);

    const getCurrencyDisplay = (currency, code) => {
        if (!currency) {
            return { code, name: code, symbol: code };
        }

        if (typeof currency === "string") {
            return { code, name: currency, symbol: currency };
        }

        return {
            code: currency.code || code,
            name: currency.name || code,
            symbol: currency.symbol || currency.code || code,
        };
    };
    const fetchProducts=async ()=>
    {
        try{
            const response = await api.get('/products');
            setProducts(response.data);
        }
        catch(error){
            console.error("Error fetching products:", error);
        }
    }
    const fetchCurrencies =async ()=>{
        try{
            const response = await getAllCurrencySymbols();
            setCurrencies(response);
        }
        catch(error){
            console.error("Error fetching exchange rates:", error); 
        }
    }
    useEffect(() => {
        fetchProducts();
        fetchCurrencies();
    }, []);
    return (
    <div className="max-w-screen mx-auto my-6 p-4">
            <div className="flex justify-between
             items-center"> 
                <div>
                    <h1 className="text-2xl">Product Sales Report</h1>
                    <p className="text-sm">View product wise sales details and summary for the selected period and currency</p>
                </div>
                <button className="flex items-center justify-center gap-x-2 px-5 py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white">
                    <Download className="w-4 h-4"/> Download PDF</button>
            </div>

            <div className="flex justify-between items-center mt-6 space-x-4 shadow-md rounded-md p-4">
               <div className="flex flex-col space-y-2">
                    <h1>Product</h1>
                    <select className="border border-gray-300 rounded-md p-2 focus:border-1 focus:border-blue-500" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    <h1>{selectedProduct}</h1>
                </div> 
                <div className="flex flex-col space-y-2">
                    <h1>From Date</h1>
                    <input type="date" className="border border-gray-300 rounded-md p-2 focus:border-1 focus:border-blue-500" value={selectedStartDate} onChange={(e) => setSelectedStartDate(e.target.value)} />
                    <h1>{selectedStartDate}</h1>
                </div>
                <div className="flex flex-col space-y-2">
                    <h1>To Date</h1>
                    <input type="date" className="border border-gray-300 rounded-md p-2 focus:border-1 focus:border-blue-500" value={selectedEndDate} onChange={(e) => setSelectedEndDate(e.target.value)} />
                    <h1>{selectedEndDate}</h1>
                </div>
                <div className="flex flex-col space-y-2">
                    <h1>Currency</h1>
                    <select className="border border-gray-300 rounded-md p-2 focus:border-1 focus:border-blue-500" value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                        <option value="">Select Currency</option>
                        {Object.entries(currencies).map(([code, currency]) => {
                            const display = getCurrencyDisplay(currency, code);

                            return (
                                <option key={code} value={code}>
                                    {display.code} - {display.name}
                                </option>
                            );
                        })}
                    </select>
                    <h1>{selectedCurrency}</h1>
                </div>
                <div className="flex flex-col justify-end space-y-2">
                    <button className="group flex items-center justify-center gap-x-2 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white">
                        <Search className="w-5 h-5 group-hover:scale-102 transition-transform"/> Search</button>
                    <button className="group flex items-center justify-center gap-x-2 px-5 py-2 rounded-md border-1 border-gray-300 hover:bg-gray-200" >
                        <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-300" /> Reset</button>
                </div>
            </div>

            {
                selectedProduct && selectedStartDate && selectedEndDate && selectedCurrency && (
                    <ReportTable
                        selectedProduct={selectedProduct}
                        selectedStartDate={selectedStartDate}
                        selectedEndDate={selectedEndDate}
                        selectedCurrency={selectedCurrency}
                    />
                )
            }
    </div>
  );
}

export default Report;