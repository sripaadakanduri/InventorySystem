import { useState, useEffect } from "react";
import api from "../../services/api";
import "./OrderList.css";

function OrderList({ orders, onCancelOrder, onEditOrder, filters }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [products, setProducts] = useState([]);
    const [editItems, setEditItems] = useState([]);

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

    // Fetch all products for the edit form
    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            setProducts(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 1: return "pending";
            case 2: return "confirmed";
            case 3: return "failed";
            case 4: return "cancelled";
            default: return "";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 1: return "Pending";
            case 2: return "Confirmed";
            case 3: return "Failed";
            case 4: return "Cancelled";
            default: return "Unknown";
        }
    };

    // Handle input changes in modal edit form
    const handleChange = (index, field, value) => {
        const updated = [...editItems];
        updated[index][field] = value;
        setEditItems(updated);
    };

    const handleAddItem = () => {
        setEditItems([...editItems, { productId: "", quantity: 1 }]);
    };

    const handleRemoveItem = (index) => {
        setEditItems(editItems.filter((_, i) => i !== index));
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = editItems.map(i => ({
            productId: Number(i.productId),
            quantity: Number(i.quantity)
        }));
        await onEditOrder(selectedOrder.id, payload);
        setSelectedOrder(null);
    };

    const openEditModal = (order) => {
        setSelectedOrder(order);
        // populate editItems
        const mappedItems = order.items.map(i => ({
            productId: i.productId,
            quantity: i.quantity
        }));
        setEditItems(mappedItems);
    };

    return (
        <div className="order-list-container">

            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>
                            User
                            <input
                                type="text"
                                placeholder="Filter"
                                value={filterUser}
                                onChange={e => setFilterUser(e.target.value)}
                                className="table-filter-input"
                            />
                        </th>
                        <th>Total</th>
                        <th>Quantity</th>
                        <th>
                            Status
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                                className="table-filter-select"
                            >
                                <option value="">All</option>
                                <option value="1">Pending</option>
                                <option value="2">Confirmed</option>
                                <option value="3">Failed</option>
                                <option value="4">Cancelled</option>
                            </select>
                        </th>
                        <th>
                            Created
                            <div className="date-filters">
                                <input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) => setFilterStartDate(e.target.value)}
                                />
                                <input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} onClick={() => openEditModal(order)}>
                            <td>#{order.id}</td>
                            <td>{order.username}</td>
                            <td>${order.totalAmount}</td>
                            <td>{order.totalQuantity}</td>
                            <td>
                                <span className={`status-badge ${getStatusClass(order.status)}`}>
                                    {getStatusText(order.status)}
                                </span>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Order #{selectedOrder.id}</h3>
                            <button className="close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
                        </div>

                        <form className="modal-body" onSubmit={handleSubmitEdit}>
                            {editItems.map((item, idx) => (
                                <div key={idx} className="order-item-row">
                                    <select
                                        value={item.productId}
                                        onChange={e => handleChange(idx, "productId", e.target.value)}
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} | Stock: {p.stockQuantity} | ${p.price}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={e => handleChange(idx, "quantity", e.target.value)}
                                        required
                                    />

                                    {editItems.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveItem(idx)}>Remove</button>
                                    )}
                                </div>
                            ))}

                            <button type="button" onClick={handleAddItem}>Add Product</button>

                            <div className="modal-actions">
                                <button type="submit" className="edit-btn">Update Order</button>
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
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderList;