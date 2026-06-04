import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { createOrder, updateOrder } from "../../services/ordersService";
import api from "../../services/api";

import {
    Plus,
    Minus,
    PackagePlus,
    ChevronDown,
    X
} from "lucide-react";

const SearchableProductSelect = ({ value, onChange, products }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedProduct = products.find(p => p.id === Number(value));

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                className={`w-full border border-gray-300 rounded-lg px-4 py-3 bg-white flex justify-between items-center cursor-pointer ${!selectedProduct ? 'text-gray-500' : 'text-gray-900'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">{selectedProduct ? selectedProduct.name : "Select Product"}</span>
                <ChevronDown className="w-4 h-4 ml-2 text-gray-500 flex-shrink-0" />
            </div>

            {isOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl">
                    <div className="p-2 border-b border-gray-100">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            autoFocus
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto">
                        {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(product => (
                            <li
                                key={product.id}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 text-sm"
                                onClick={() => {
                                    onChange(product.id);
                                    setIsOpen(false);
                                    setSearch("");
                                }}
                            >
                                {product.name}
                            </li>
                        ))}
                        {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                            <li className="px-4 py-3 text-sm text-gray-500 text-center">No products found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

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

    useEffect(() => {
        if (orderToEdit) {
            const mappedItems = orderToEdit.items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity
            }));

            setItems(mappedItems);
        } else {
            setItems([{ productId: "", quantity: 1 }]);
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
        setItems([
            ...items,
            {
                productId: "",
                quantity: 1
            }
        ]);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = items.filter(
            (_, i) => i !== index
        );

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

        try {
            const payload = {
                items: items.map((item) => ({
                    productId: Number(item.productId),
                    quantity: Number(item.quantity)
                }))
            };

            if (orderToEdit) {
                const result = await updateOrder(
                    orderToEdit.id,
                    payload.items
                );

                toast.success("Order updated successfully.");

                if (onOrderUpdated) {
                    onOrderUpdated(result);
                }
            } else {
                const result = await createOrder(payload);

                toast.success("Order placed successfully.");

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
            const message = err.response?.data?.message || "Failed to submit order.";
            toast.error(message);
        }

        setLoading(false);
    };

    return (
        <div className="w-full">

            <div className="flex items-center gap-3 mb-8">
                <PackagePlus className="w-8 h-8 text-blue-500" />

                <h2 className="text-3xl font-bold text-gray-800">
                    {orderToEdit
                        ? `Edit Order #${orderToEdit.id}`
                        : "Create Order"}
                </h2>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 mt-5"
            >
                <div className="space-y-3">
                    <div className="hidden md:flex gap-4">
                        <div className="flex-1 text-sm font-semibold text-gray-700">Product</div>
                        <div className="w-32 text-sm font-semibold text-gray-700">Quantity</div>
                        <div className="w-32 text-sm font-semibold text-gray-700 text-center">Availability</div>
                        <div className="w-[104px]"></div>
                    </div>

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
                                className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full"
                            >
                                <div className="flex-1 w-full">
                                    <label className="md:hidden text-sm font-semibold text-gray-700 mb-1 block">Product</label>
                                    <SearchableProductSelect
                                        value={item.productId}
                                        onChange={(newVal) =>
                                            handleChange(
                                                index,
                                                "productId",
                                                newVal
                                            )
                                        }
                                        products={products}
                                    />
                                </div>

                                <div className="w-full md:w-32">
                                    <label className="md:hidden text-sm font-semibold text-gray-700 mb-1 block">Quantity</label>
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
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                    />
                                </div>

                                <div className="w-full md:w-32 flex justify-center">
                                    {selectedProduct ? (
                                        <span className="bg-blue-100 text-blue-700 text-sm font-medium px-4 py-3 rounded-lg w-full text-center border border-blue-200">
                                            Stock: {availableQuantity}
                                        </span>
                                    ) : (
                                        <span className="hidden md:block w-full px-4 py-3 text-center text-gray-400 text-sm">
                                            --
                                        </span>
                                    )}
                                </div>

                                <div className="w-full md:w-[104px] flex gap-2 justify-end md:justify-center">
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="bg-red-50 hover:bg-red-100 text-red-500 p-3 rounded-lg transition duration-200 border border-red-200 shadow-sm flex items-center justify-center w-full md:w-auto"
                                            title="Remove Item"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>
                                    )}
                                    {index === items.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="group bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white p-3 rounded-lg transform transition duration-200 shadow-sm flex items-center justify-center w-full md:w-auto"
                                            title="Add Item"
                                        >
                                            <Plus className="w-5 h-5 group-hover:rotate-90 transition transform duration-300" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-wrap gap-4 justify-end pt-4">
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

                                if (onCancelEdit) {
                                    onCancelEdit();
                                }
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-200"
                        >
                            Cancel Edit
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-200"
                    >
                        {loading
                            ? "Processing..."
                            : orderToEdit
                                ? "Update Order"
                                : "Place Order"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default OrderForm;
