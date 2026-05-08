import "./OrderList.css";

function OrderList({ orders }) {

    const getStatusClass = (status) => {

        switch (status) {

            case 1:
                return "pending";

            case 2:
                return "confirmed";

            case 3:
                return "failed";

            default:
                return "";
        }
    };

    const getStatusText = (status) => {

        switch (status) {

            case 1:
                return "Pending";

            case 2:
                return "Confirmed";

            case 3:
                return "Failed";

            default:
                return "Unknown";
        }
    };

    return (
        <div className="order-list-container">

            <h2>Orders</h2>

            {
                orders.length === 0 && (
                    <p>No orders found</p>
                )
            }

            {
                orders.map(order => (

                    <div
                        className="order-card"
                        key={order.id}
                    >

                        <div className="order-header">

                            <h3>
                                Order #{order.id}
                            </h3>

                            <span
                                className={
                                    `status-badge ${getStatusClass(order.status)}`
                                }
                            >
                                {getStatusText(order.status)}
                            </span>

                        </div>

                        <p>
                            Total:
                            {" "}
                            ${order.totalAmount}
                        </p>

                        <p>
                            Created:
                            {" "}
                            {
                                new Date(
                                    order.createdAt
                                ).toLocaleString()
                            }
                        </p>

                        <div className="order-items">

                            {
                                order.items.map((item, index) => (

                                    <div
                                        className="order-item"
                                        key={index}
                                    >

                                        <span>
                                            {item.productName}
                                        </span>

                                        <span>
                                            Qty: {item.quantity}
                                        </span>

                                        <span>
                                            ${item.totalPrice}
                                        </span>

                                    </div>
                                ))
                            }

                        </div>

                    </div>
                ))
            }

        </div>
    );
}

export default OrderList;