import { useEffect, useState } from "react";
import OrderForm from "../../components/OrderForm/OrderForm";
import OrderList from "../../components/OrderList/OrderList";
import { getAllOrders } from "../../services/orderService";
import "./Orders.css";

function Orders() {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

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

    const handleOrderCreated = (newOrder) => {

        setOrders(prev => [
            newOrder,
            ...prev
        ]);

        fetchOrders();
    };

    return (
        <div className="orders-page">

            <h1>Order Management</h1>

            <OrderForm
                onOrderCreated={handleOrderCreated}
            />

            {
                loading
                    ? <p>Loading orders...</p>
                    : <OrderList orders={orders} />
            }

        </div>
    );
}

export default Orders;