

import { useState, useEffect } from "react";
import api from "../../services/api";
import Pagination from "../Pagination/Pagination";
import "./OrderList.css";

function OrderList({
    orders,
    onCancelOrder,
    onSelectForEdit,
    filters
}) {

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [products, setProducts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [pageSize, setPageSize] =
        useState(10);
    const {
        filterUser,
        setFilterUser,
        filterStatus,
        setFilterStatus,
        filterStartDate,
        setFilterStartDate,
        filterEndDate,
        setFilterEndDate
    } = filters;


    const fetchProducts = async () => {

        try {

            const response =
                await api.get("/products");

            setProducts(response.data);

        }
        catch (err) {

            console.error(err);

        }

    };

    useEffect(() => {

        fetchProducts();

    }, []);

    let filteredOrders = [...orders];

    if (filterUser) {

        filteredOrders =
            filteredOrders.filter(order =>
                order.username
                    .toLowerCase()
                    .includes(
                        filterUser.toLowerCase()
                    )
            );

    }

    if (filterStatus) {

        filteredOrders =
            filteredOrders.filter(order =>
                String(order.status) === filterStatus
            );

    }

    if (filterStartDate) {

        filteredOrders =
            filteredOrders.filter(order => {

                const orderDate =
                    new Date(order.createdAt);

                const startDate =
                    new Date(filterStartDate);

                return orderDate >= startDate;

            });

    }

    if (filterEndDate) {

        filteredOrders =
            filteredOrders.filter(order => {

                const orderDate =
                    new Date(order.createdAt);

                const endDate =
                    new Date(filterEndDate);

                endDate.setHours(
                    23,
                    59,
                    59,
                    999
                );

                return orderDate <= endDate;

            });

    }

    const indexOfLastOrder =
        currentPage * pageSize;

    const indexOfFirstOrder =
        indexOfLastOrder - pageSize;

    const currentOrders =
        filteredOrders.slice(
            indexOfFirstOrder,
            indexOfLastOrder
        );



    const getStatusClass = (status) => {

        switch (status) {

            case 1:
                return "pending";

            case 2:
                return "confirmed";

            case 3:
                return "failed";

            case 4:
                return "cancelled";
            case 5:
                return "Updated";

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

            case 4:
                return "Cancelled";
            case 5:
                return "Updated..";

            default:
                return "Unknown";

        }

    };



    const openViewModal = (order) => {

        setSelectedOrder(order);

    };



    return (

        <div className="order-list-container">

            <table className="orders-table">

                <thead>

                    <tr>

                        <th>

                            User

                            <input
                                type="text"
                                placeholder="Filter"
                                value={filterUser}
                                onChange={(e) =>
                                    setFilterUser(
                                        e.target.value
                                    )
                                }
                                className="table-filter-input"
                            />

                        </th>

                        <th>
                            Total
                        </th>

                        <th>
                            Quantity
                        </th>

                        <th>

                            Status

                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(
                                        e.target.value
                                    )
                                }
                                className="table-filter-select"
                            >

                                <option value="">
                                    All
                                </option>

                                <option value="1">
                                    Pending
                                </option>

                                <option value="2">
                                    Confirmed
                                </option>

                                <option value="3">
                                    Failed
                                </option>

                                <option value="4">
                                    Cancelled
                                </option>
                                <option value="5">
                                    Updated
                                </option>

                            </select>

                        </th>

                        <th>

                            Created

                            <div className="date-filters">

                                <input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) =>
                                        setFilterStartDate(
                                            e.target.value
                                        )
                                    }
                                />

                                <input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) =>
                                        setFilterEndDate(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {currentOrders.length > 0 ? (

                        currentOrders.map(order => (

                            <tr
                                key={order.id}
                                onClick={() =>
                                    openViewModal(order)
                                }
                            >

                                <td>
                                    {order.username}
                                </td>

                                <td>
                                    ${order.totalAmount}
                                </td>

                                <td>
                                    {order.totalQuantity}
                                </td>

                                <td>

                                    <span
                                        className={`status-badge ${getStatusClass(order.status)}`}
                                    >

                                        {getStatusText(order.status)}

                                    </span>

                                </td>

                                <td>

                                    {new Date(
                                        order.createdAt
                                    ).toLocaleString()}

                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td colSpan="5">

                                No Orders Found

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

            

            <Pagination
                currentPage={currentPage}
                totalItems={orders.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
            />


            {selectedOrder && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setSelectedOrder(null)
                    }
                >

                    <div
                        className="modal-content"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <h3>

                                Order #
                                {selectedOrder.id}

                            </h3>

                            <button
                                className="close-btn"
                                onClick={() =>
                                    setSelectedOrder(null)
                                }
                            >
                                ✕
                            </button>

                        </div>

                        <div className="modal-body">
                            <table className="orders-table" style={{ marginBottom: "1.5rem" }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid var(--border-color)" }}>Product</th>
                                        <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid var(--border-color)" }}>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item, idx) => {
                                        const prod = products.find((p) => p.id === item.productId);
                                        return (
                                            <tr key={idx}>
                                                <td style={{ padding: "10px", borderBottom: "1px solid var(--border-color)" }}>{prod ? prod.name : `Product #${item.productId}`}</td>
                                                <td style={{ padding: "10px", borderBottom: "1px solid var(--border-color)" }}>{item.quantity}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="modal-actions" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                {selectedOrder.status !== 4 && (

                                    <button
                                        type="button"
                                        className="edit-btn"
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
                                        className="cancel-btn"
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

                </div>

            )}

        </div>

    );

}

export default OrderList;