import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderList from "../../components/OrderList/OrderList";
import OrderForm from "../../components/OrderForm/OrderForm";
import { getAllOrders, cancelOrder } from "../../services/ordersService";
import api from "../../services/api";
import {
    exportToCSV,
    exportToExcel,
    exportToPDF,
    printOrders
} from "../../components/orderExportUtils";
import {
    ChevronDown,
    FileSpreadsheet,
    FileText,
    File,
    Printer,
} from "lucide-react";
function Orders() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderToEdit, setOrderToEdit] = useState(null);
    const [open, setOpen] = useState(false);

    const [filters, setFilters] = useState({
        user: "",
        status: "",
        startDate: "",
        endDate: ""
    });

    const fetchOrders = async (activeFilters = filters) => {
        try {
            setLoading(true);
            const data = await getAllOrders(activeFilters);
            setOrders(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                setProducts(response.data);
            }
            catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleFilterApply = () => {
        fetchOrders(filters);
    };

    const handleInstantFilterChange = (e) => {
        const updatedFilters = {
            ...filters,
            [e.target.name]: e.target.value
        };

        setFilters(updatedFilters);
        fetchOrders(updatedFilters);
    };

    const handleCancelOrder = async (orderId) => {
        try {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 4 } : o));
            await cancelOrder(orderId);
            toast.success("Order cancelled successfully.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to cancel order.");
            fetchOrders(filters);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl mt-8 border border-gray-200 shadow-lg">
                <h1 className="text-2xl font-bold text-gray-900">
                    Order Management
                </h1>

                <div
                    className="relative inline-block group"
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                >
                    {/* Main Button */}
                    <button
                        className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 shadow-md transition-all duration-300 ${open ? "rounded-t-xl rounded-b-none" : "rounded-xl"}`}
                    >
                        Export Orders
                        <ChevronDown
                            size={18}
                            className={`transition-transform duration-300 ${open ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {/* Dropdown */}
                    <div className="absolute left-0 top-full w-full z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                        <button
                            onClick={() => exportToExcel(orders, products)}
                            className={`flex items-center gap-4 w-full bg-white px-4 py-3 text-left border-x hover:bg-gray-100 border-gray-200 transition-all duration-300  ${open
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-3 pointer-events-none"
                                } `}
                        >
                            <FileSpreadsheet className="text-green-600" size={20} />
                            <div className="text-left">
                                <p className="font-medium text-md text-gray-800">Export to Excel</p>
                                <p className="text-xs text-gray-500">
                                    Download sheets
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={() => exportToCSV(orders, products)}
                            className={`flex items-center gap-4 w-full bg-white px-4 py-3 text-left border-x hover:bg-gray-100 border-gray-200 transition-all duration-300 delay-75 ${open
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-3 pointer-events-none"
                                }`}
                        >
                            <FileText className="text-blue-600" size={20} />
                            <div className="text-left">
                                <p className="font-medium text-gray-800">Export to CSV</p>
                                <p className="text-xs text-gray-500">
                                    Universal data format
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={() => exportToPDF(orders, products)}
                            className={`flex items-center gap-4 w-full bg-white px-4 py-3 text-left border-x border-gray-200 hover:bg-gray-100 transition-all duration-300 delay-150 ${open
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-3 pointer-events-none"
                                }`}
                        >
                            <File className="text-red-600" size={20} />
                            <div className="text-left">
                                <p className="font-medium text-gray-800">Export to PDF</p>
                                <p className="text-xs text-gray-500">
                                    Shareable document
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={printOrders}
                            className={`flex items-center gap-4 w-full bg-white px-4 py-3 text-left border border-gray-200 hover:bg-gray-100 rounded-b-xl shadow-lg transition-all duration-300 delay-200  ${open
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-3 pointer-events-none"
                                } `}
                        >
                            <Printer className="text-gray-600" size={20} />
                            <div className="text-left">
                                <p className="font-medium text-gray-800">Print Orders</p>
                                <p className="text-xs text-gray-500">
                                    Print current order list
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

                
            </div>

            

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg">
                <OrderForm
                    orderToEdit={orderToEdit}
                    onOrderCreated={() => fetchOrders(filters)}
                    onOrderUpdated={() => {
                        fetchOrders(filters);
                        setOrderToEdit(null);
                    }}
                    onCancelEdit={() => {
                        setOrderToEdit(null);
                    }}
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center bg-transparent">
                    <div className="relative flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce [animation-delay:0.15s]"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce [animation-delay:0.3s]"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce [animation-delay:0.45s]"></div>
                    </div>
                </div>
            ) : (
                <OrderList
                    orders={orders}
                    onCancelOrder={handleCancelOrder}
                    onSelectForEdit={(order) => {
                        setOrderToEdit(order);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onFilterApply={handleFilterApply}
                    onInstantFilterChange={handleInstantFilterChange}
                />
            )}
        </div>
    );
}

export default Orders;
