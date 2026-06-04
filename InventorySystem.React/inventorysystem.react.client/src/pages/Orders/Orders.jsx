import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderList from "../../components/OrderList/OrderList";
import OrderForm from "../../components/OrderForm/OrderForm";
import { getAllOrders, cancelOrder } from "../../services/ordersService";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderToEdit, setOrderToEdit] = useState(null);

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4 bg-white p-6 rounded-3xl mt-8 border border-gray-200 shadow-lg">
                <h1 className="text-2xl font-bold text-gray-900">
                    Order Management
                </h1>
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
