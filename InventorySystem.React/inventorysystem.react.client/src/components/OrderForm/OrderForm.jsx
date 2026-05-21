
import { useEffect, useState } from "react";
import { createOrder, updateOrder } from "../../services/orderService";
import api from "../../services/api";
import "./OrderForm.css";
import {
    Plus,
    Minus,
    Pencil,
    X,
    Save,
    PackagePlus
} from "lucide-react";
function OrderForm({ onOrderCreated, orderToEdit, onOrderUpdated, onCancelEdit }) {
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (orderToEdit) {
            const mappedItems = orderToEdit.items.map(i => ({
                productId: i.productId,
                quantity: i.quantity
            }));
            setItems(mappedItems);
        }
    }, [orderToEdit]);

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

    const handleAddItem = () => {
        setItems([...items, { productId: "", quantity: 1 }]);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const handleChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                items: items.map(item => ({
                    productId: Number(item.productId),
                    quantity: Number(item.quantity)
                }))
            };

            if (orderToEdit) {
                // Edit mode
                const result = await updateOrder(orderToEdit.id, payload.items);
                setSuccess("Order updated successfully");
                if (onOrderUpdated) onOrderUpdated(result);
            } else {
                // Create mode
                const result = await createOrder(payload);
                setSuccess("Order placed successfully");
                setItems([{ productId: "", quantity: 1 }]);
                if (onOrderCreated) onOrderCreated(result);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit order");
        }

        setLoading(false);
    };

    return (
        <div className="order-form-container">
            <h2>{orderToEdit ? `Edit Order #${orderToEdit.id}` : "Create Order"}</h2>

            <form onSubmit={handleSubmit}>
                {items.map((item, index) => {
                    const selectedProduct = products.find(
                        p => p.id === Number(item.productId)
                    );
                    const availableQuantity = selectedProduct ? selectedProduct.stockQuantity : null;

                    return (
                        <div className="order-item-row" key={index}>
                            <select
                                value={item.productId}
                                onChange={(e) =>
                                    handleChange(index, "productId", e.target.value)
                                }
                                required
                            >
                                <option value="">Select Product</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            {selectedProduct && (
                                <span className="stock-badge">
                                    Available: {availableQuantity}
                                </span>
                            )}
                            <input
                                type="number"
                                min="1"
                                max={availableQuantity || 1}
                                value={item.quantity}
                                onChange={(e) => handleChange(index, "quantity", e.target.value)}
                                required
                            />



                            {items.length > 1 && (
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(index)}
                                >
                                    <Minus/>
                                </button>
                            )}
                        </div>
                    );
                })}

                <button type="button" className="add-btn" onClick={handleAddItem}>
                        <Plus />
                </button>

                <div style={{ display: "flex", gap: "20px" }}>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading
                            ? "Processing..."
                            : orderToEdit
                                ? "Update Order"
                                : "Place Order"
                        }
                    </button>
                    {orderToEdit && (
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => {
                                setItems([{ productId: "", quantity: 1 }]);
                                setError("");
                                setSuccess("");
                                if (onCancelEdit) onCancelEdit();
                            }}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>

                {error && <p className="error-text">{error}</p>}
                {success && <p className="success-text">{success}</p>}
            </form>
        </div>
    );
}

export default OrderForm;