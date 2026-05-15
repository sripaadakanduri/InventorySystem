import { useEffect, useState } from "react";
import OrderList from "../../components/OrderList/OrderList";
import OrderForm from "../../components/OrderForm/OrderForm";
import { getAllOrders, cancelOrder, updateOrder } from "../../services/orderService";
import "./Orders.css";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderToEdit, setOrderToEdit] = useState(null);

    // Filters
    const [filterUser, setFilterUser] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

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

    // Filtered orders
    const filteredOrders = orders.filter(o => {
        let userMatch = filterUser ? o.username.toLowerCase().includes(filterUser.toLowerCase()) : true;
        let statusMatch = filterStatus ? o.status.toString() === filterStatus : true;
        let startMatch = filterStartDate ? new Date(o.createdAt) >= new Date(filterStartDate) : true;
        let endMatch = filterEndDate ? new Date(o.createdAt) <= new Date(filterEndDate) : true;
        return userMatch && statusMatch && startMatch && endMatch;
    });

    return (
        <div className="orders-page card">
            <h1 style={{ marginBottom: "2rem" }}>Order Management</h1>
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