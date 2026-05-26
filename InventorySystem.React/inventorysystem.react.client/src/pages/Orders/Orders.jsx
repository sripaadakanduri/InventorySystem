/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import OrderList from "../../components/OrderList/OrderList";
import OrderForm from "../../components/OrderForm/OrderForm";
import { getAllOrders, cancelOrder, updateOrder } from "../../services/ordersService";
// import "./Orders.css";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderToEdit, setOrderToEdit] = useState(null);

    const [filterUser, setFilterUser] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");


    

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 4 } : o));
            await cancelOrder(orderId);
        } catch (err) {
            console.error(err);
            alert("Failed to cancel order");
            fetchOrders();
        }
    };

    const filteredOrders = orders.filter(o => {
        let userMatch = filterUser ? o.username.toLowerCase().includes(filterUser.toLowerCase()) : true;
        let statusMatch = filterStatus ? o.status.toString() === filterStatus : true;
        let startMatch = filterStartDate ? new Date(o.createdAt) >= new Date(filterStartDate) : true;
        let endMatch = filterEndDate ? new Date(o.createdAt) <= new Date(filterEndDate) : true;
        return userMatch && statusMatch && startMatch && endMatch;
    });

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
                    onOrderCreated={(newOrder) =>
                        setOrders(prev => [newOrder, ...prev])
                    }
                    onOrderUpdated={(updatedOrder) => {
                        setOrders(prev => prev.map(o => (o.id === updatedOrder.id ? updatedOrder : o)));
                        setOrderToEdit(null);
                    }}
                    onCancelEdit={() => {
                        setOrderToEdit(null);
                    }}
                />
            </div>

            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <OrderList
                    orders={filteredOrders}
                    onCancelOrder={handleCancelOrder}
                    onSelectForEdit={(order) => {
                        setOrderToEdit(order);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    filters={{
                        filterUser,
                        setFilterUser,
                        filterStatus,
                        setFilterStatus,
                        filterStartDate,
                        setFilterStartDate,
                        filterEndDate,
                        setFilterEndDate
                    }}
                />
            )}
        </div>
    );
}

export default Orders;