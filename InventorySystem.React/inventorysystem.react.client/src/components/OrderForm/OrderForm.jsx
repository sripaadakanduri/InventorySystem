import { useEffect, useState } from "react";
import { createOrder } from "../../services/orderService";
import api from "../../services/api";
import "./OrderForm.css";

function OrderForm({ onOrderCreated }) {

    const [products, setProducts] = useState([]);

    const [items, setItems] = useState([
        {
            productId: "",
            quantity: 1
        }
    ]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");



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

        setItems([
            ...items,
            {
                productId: "",
                quantity: 1
            }
        ]);
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

            const result = await createOrder(payload);

            setSuccess("Order placed successfully");

            setItems([
                {
                    productId: "",
                    quantity: 1
                }
            ]);

            if (onOrderCreated) {
                onOrderCreated(result);
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to create order"
            );
        }

        setLoading(false);
    };

    return (
        <div className="order-form-container">

            <h2>Create Order</h2>

            <form onSubmit={handleSubmit}>

                {
                    items.map((item, index) => (

                        <div
                            className="order-item-row"
                            key={index}
                        >

                            <select
                                value={item.productId}
                                onChange={(e) =>
                                    handleChange(
                                        index,
                                        "productId",
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select Product
                                </option>

                                {
                                    products.map(product => (

                                        <option
                                            key={product.id}
                                            value={product.id}
                                        >
                                            {product.name}
                                            {" | "}
                                            Stock: {product.stockQuantity}
                                            {" | "}
                                            ${product.price}
                                        </option>
                                    ))
                                }

                            </select>

                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                    handleChange(
                                        index,
                                        "quantity",
                                        e.target.value
                                    )
                                }
                                required
                            />

                            {
                                items.length > 1 && (

                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() =>
                                            handleRemoveItem(index)
                                        }
                                    >
                                        Remove
                                    </button>
                                )
                            }

                        </div>
                    ))
                }

                <button
                    type="button"
                    className="add-btn"
                    onClick={handleAddItem}
                >
                    Add Product
                </button>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {
                        loading
                            ? "Processing..."
                            : "Place Order"
                    }
                </button>

                {
                    error && (
                        <p className="error-text">
                            {error}
                        </p>
                    )
                }

                {
                    success && (
                        <p className="success-text">
                            {success}
                        </p>
                    )
                }

            </form>
        </div>
    );
}

export default OrderForm;