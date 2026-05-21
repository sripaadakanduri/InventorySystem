import { useEffect, useState } from "react";
import { createOrder, updateOrder } from "../../services/orderService";
import api from "../../services/api";

import {
    Plus,
    Minus,
    PackagePlus
} from "lucide-react";

function OrderForm({
    onOrderCreated,
    orderToEdit,
    onOrderUpdated,
    onCancelEdit
}) {
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([
        { productId: "", quantity: 1 }
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load edit order data
    useEffect(() => {
        if (orderToEdit) {
            const mappedItems = orderToEdit.items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity
            }));

            setItems(mappedItems);
        }
    }, [orderToEdit]);

    // Fetch products
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

    // Add item
    const handleAddItem = () => {
        setItems([
            ...items,
            {
                productId: "",
                quantity: 1
            }
        ]);
    };

    // Remove item
    const handleRemoveItem = (index) => {
        const updatedItems = items.filter(
            (_, i) => i !== index
        );

        setItems(updatedItems);
    };

    // Handle input change
    const handleChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                items: items.map((item) => ({
                    productId: Number(item.productId),
                    quantity: Number(item.quantity)
                }))
            };

            if (orderToEdit) {
                // Update order
                const result = await updateOrder(
                    orderToEdit.id,
                    payload.items
                );

                setSuccess("Order updated successfully");

                if (onOrderUpdated) {
                    onOrderUpdated(result);
                }
            } else {
                // Create order
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
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to submit order"
            );
        }

        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200 mb-10">

            {/* Heading */}
            <div className="flex items-center gap-3 mb-8">
                <PackagePlus className="w-8 h-8 text-blue-500" />

                <h2 className="text-3xl font-bold text-gray-800">
                    {orderToEdit
                        ? `Edit Order #${orderToEdit.id}`
                        : "Create Order"}
                </h2>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-2"
            >

                {/* Items */}
                {items.map((item, index) => {
                    const selectedProduct = products.find(
                        (p) => p.id === Number(item.productId)
                    );

                    const availableQuantity =
                        selectedProduct
                            ? selectedProduct.stockQuantity
                            : null;

                    return (
                        <div
                            key={index}
                            className="rounded-xl  flex flex-col md:flex-row gap-4 items-center"
                        >

                            {/* Product Select */}
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
                                className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">
                                    Select Product
                                </option>

                                {products.map((product) => (
                                    <option
                                        key={product.id}
                                        value={product.id}
                                    >
                                        {product.name}
                                    </option>
                                ))}
                            </select>

                            {/* Stock */}
                            {selectedProduct && (
                                <span className="bg-green-50 text-green-700 text-sm px-4 py-2 rounded-full whitespace-nowrap">
                                    Available: {availableQuantity}
                                </span>
                            )}

                            {/* Quantity */}
                            <input
                                type="number"
                                min="1"
                                max={availableQuantity || 1}
                                value={item.quantity}
                                onChange={(e) =>
                                    handleChange(
                                        index,
                                        "quantity",
                                        e.target.value
                                    )
                                }
                                required
                                className="w-28 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            {/* Remove Button */}
                            {items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveItem(index)
                                    }
                                    className="bg-red-500 hover:bg-red-600 text-whit p-3 rounded-lg transition duration-200 shadow"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    );
                })}

                {/* Add Item Button */}
                <div class="inline-flex border border-gray-200 rounded-xl">
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="flex border border-gray-200 items-center gap-2 bg-blue-500 hover:bg-blue-600 text-balck px-6 py-3 rounded-xl shadow-lg transition duration-200"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-600 text-black px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-200"
                    >
                        {loading
                            ? "Processing..."
                            : orderToEdit
                                ? "Update Order"
                                : "Place Order"}
                    </button>

                    {/* Cancel */}
                    {orderToEdit && (
                        <button
                            type="button"
                            onClick={() => {
                                setItems([
                                    {
                                        productId: "",
                                        quantity: 1
                                    }
                                ]);

                                setError("");
                                setSuccess("");

                                if (onCancelEdit) {
                                    onCancelEdit();
                                }
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-black px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-200"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg border border-red-300">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg border border-green-300">
                        {success}
                    </div>
                )}
            </form>
        </div>
    );
}

export default OrderForm;