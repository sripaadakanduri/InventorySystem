import { useState, useEffect } from "react";
import api from "../../services/api";
import Pagination from "../Pagination/Pagination";
import { getAllCurrencySymbols } from '../../services/CurrencySymbolService';
import { formatApiDate } from "../../utils/dateUtils";
import DataTable from "../DataTable";
const getCurrencySymbolText = (currency) => {
    if (!currency) {
        return "$";
    }

    if (typeof currency === "string") {
        return currency;
    }

    return currency.symbol || currency.code || "$";
};

function OrderList({
    orders,
    onCancelOrder,
    onSelectForEdit,
    filters,
    onFilterChange,
    onFilterApply,
    onInstantFilterChange,
}) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [symbols, setSymbols] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                setProducts(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        const fetchSymbols = async () => {
            try {
                const data = await getAllCurrencySymbols();
                setSymbols(data);
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchProducts();
        fetchSymbols();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [orders]);


    const handleFilterKeyDown = (e) => {
        if (e.key === "Enter") {
            onFilterApply();
        }
    };

    const indexOfLastOrder = currentPage * pageSize;
    const indexOfFirstOrder = indexOfLastOrder - pageSize;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const getStatusText = (status) => {
        switch (status) {
            case 1:
                return "Pending";
            case 2:
                return "Confirmed";
            case 3:
                return "Failed";
            case 4:
                return "Cancelled";
            case 5:
                return "Updated..";
            default:
                return "Unknown";
        }
    };
    const getStatusClass = (status) => {
        switch (status) {
            case 1:
                return "bg-yellow-100 text-yellow-700";
            case 2:
                return "bg-green-50 text-green-700";
            case 3:
                return "bg-red-100 text-red-700";
            case 4:
                return "bg-gray-200 text-gray-700";
            default:
                return "bg-blue-50 text-blue-700";
        }
    };

    const openViewModal = (order) => {
        setSelectedOrder(order);
    };

    const formatMoney = (value) => Number(value || 0).toFixed(2);

    const columns = [
        {
            key: "username",
            title: "Username",
            render: (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : `User ${row.userId}`,
        
        },
        {
            key: "orderNumber",
            title:"Order No",
        },
        {
            key: "totalAmount",
            title: "Total Amount",
            render: (value,row) =>(<>{formatMoney(value)}{" "}{getCurrencySymbolText(symbols[row.currency])}</>) 
        },
        {
            key: "totalQuantity",
            title: "Quantity",
        
        },
        {
            key: "status",
            title: "Status",
            render: (value) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusClass(value)}`}
                >
                    {getStatusText(value)}
                </span>
            ),
        },
        {
            key: "createdAt",
            title: "Date & Time",
            render: (value) => (
                <span className="text-gray-500 text-sm">{formatApiDate(value)}</span>
                
            ),
        }

        
    ]

    const filterConfig = [
        {
            key: "username",
            type: "text",
            placeholder: "Filter user..."
        },
        {
            key: "orderNumber",
            type: "text",
            placeholder: "Filter order..."
        },
        {
            key: "status",
            type: "select",
            instant: true,
            options: [
                {
                    value: "",
                    label: "All"
                },
                {
                    value: 1,
                    label: "Pending"
                },
                {
                    value: 2,
                    label: "Confirmed"
                },
                {
                    value: 3,
                    label: "Failed"
                },
                {
                    value: 4,
                    label: "Cancelled"
                },
                {
                    value: 5,
                    label: "Updated"
                }
            ]
        },
        {
            key: "createdAt",
            type:"date-range",
            startKey: "startDate",
            endKey: "endDate",
            instant: true,
        }
    ]
    return (
        <div className="w-full overflow-x-auto rounded-3xl border border-gray-200 shadow-lg bg-white">
            
            <DataTable
                data={orders}
                columns={columns}   
                filters={filters}
                filterConfig={filterConfig}
                onFilterChange={onFilterChange}
                onInstantFilterChange={onInstantFilterChange}
                onFilterApply={onFilterApply}
                pagination={true}
                onPageSizeChange={setPageSize}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={orders.length}
                emptyMessage="No orders found."
                onRowClick={(order)=>{openViewModal(order)}}
            />
            {selectedOrder && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b pb-4 mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Order #{selectedOrder.id}
                            </h3>

                            <button
                                className="text-gray-500 hover:text-red-500 text-2xl font-bold"
                                onClick={() => setSelectedOrder(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th className="text-left p-4">Product</th>
                                        <th className="text-left p-4">Price</th>
                                        <th className="text-left p-4">Quantity</th>
                                        <th className="text-left p-4">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {(selectedOrder.items || []).map((item, idx) => {
                                        const prod = products.find(
                                            (p) => p.id === item.productId
                                        );
                                        const currency = selectedOrder.currency || "USD";

                                        return (
                                            <tr
                                                key={idx}
                                                className="border-b border-gray-200 hover:bg-gray-100 transition duration-300"
                                            >
                                                <td className="p-4">
                                                    {prod
                                                        ? prod.name
                                                        : `Product #${item.productId}`}
                                                </td>

                                                <td className="p-4 text-gray-700">
                                                    {formatMoney(item.unitPrice)}{" "}
                                                    {currency}
                                                </td>

                                                <td className="p-4">
                                                    {item.quantity}
                                                </td>

                                                <td className="p-4 font-medium">
                                                    {formatMoney(item.totalPrice)}{" "}
                                                    {currency}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            {selectedOrder.status !== 4 && (
                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-600 text-white shadow-xl px-6 py-3 rounded-xl transition"
                                    onClick={() => {
                                        onSelectForEdit(selectedOrder);
                                        setSelectedOrder(null);
                                    }}
                                >
                                    Update Order
                                </button>
                            )}

                            {selectedOrder.status !== 4 && (
                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-600 text-white shadow-xl px-6 py-3 rounded-xl transition"
                                    onClick={() => {
                                        onCancelOrder(selectedOrder.id);
                                        setSelectedOrder(null);
                                    }}
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderList;
