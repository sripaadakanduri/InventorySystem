import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { createOrder, updateOrder } from "../../services/ordersService";
import api from "../../services/api";
import CurrencySelector from "../CurrencySelector";

import {
    Plus,
    Minus,
    PackagePlus,
    ChevronDown,
    ArrowRight,
} from "lucide-react";

const BASE_CURRENCY = "USD";



const SearchableProductSelect = ({ value, onChange, products }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const selectedProduct = products.find(
        (p) => p.id === Number(value)
    );

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                className={`w-full border border-gray-300 rounded-lg px-4 py-3 bg-white flex justify-between items-center cursor-pointer ${!selectedProduct
                        ? "text-gray-500"
                        : "text-gray-900"
                    }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">
                    {selectedProduct
                        ? selectedProduct.name
                        : "Select Product"}
                </span>

                <ChevronDown className="w-4 h-4 ml-2 text-gray-500 flex-shrink-0" />
            </div>

            {isOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl">
                    <div className="p-2 border-b border-gray-100">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            autoFocus
                        />
                    </div>

                    <ul className="max-h-48 overflow-y-auto">
                        {products
                            .filter((p) =>
                                p.name
                                    .toLowerCase()
                                    .includes(
                                        search.toLowerCase()
                                    )
                            )
                            .map((product) => (
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

                        {products.filter((p) =>
                            p.name
                                .toLowerCase()
                                .includes(
                                    search.toLowerCase()
                                )
                        ).length === 0 && (
                                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                                    No products found
                                </li>
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
    onCancelEdit,
    exchangeRates,
    selectedCurrency,
    setSelectedCurrency
}) {
    const [products, setProducts] = useState([]);
    const [selectedCurrencyInfo, setSelectedCurrencyInfo] = useState(null);

    const [items, setItems] = useState([
        {
            productId: "",
            quantity: 1
        }
    ]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (orderToEdit) {
            setItems(
                orderToEdit.items.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity
                }))
            );
        } else {
            setItems([
                {
                    productId: "",
                    quantity: 1
                }
            ]);
        }
    }, [orderToEdit]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            setProducts(response.data);
        } catch (err) {
            console.error(err);
        }
    };

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
        setItems(items.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const formatMoney = (value) => Number(value || 0).toFixed(2);

    const orderBaseTotal = items.reduce((total, item) => {
        const product = products.find((p) => p.id === Number(item.productId));
        const quantity = Number(item.quantity) || 0;
        return total + (Number(product?.price) || 0) * quantity;
    }, 0);

    const currencySymbol = selectedCurrencyInfo?.symbol || selectedCurrency || BASE_CURRENCY;
    const hasSelectedProducts = items.some((item) => item.productId);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const payload = {
                items: items.map((item) => ({
                    productId: Number(item.productId),
                    quantity: Number(item.quantity)
                })),
                currency: selectedCurrency,
                exchangeRate:
                    exchangeRates[selectedCurrency] || 1
            };

            if (orderToEdit) {
                const result = await updateOrder(
                    orderToEdit.id,
                    payload
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
            toast.error(
                err.response?.data?.message ||
                "Failed to submit order."
            );
        }

        setLoading(false);
    };

    return (
        <div className="w-full px-10">
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
                {/* Currency Selection */}
                <div className="flex items-center gap-4">
                    <label
                        htmlFor="currency"
                        className="text-lg font-semibold text-slate-700 whitespace-nowrap"
                    >
                        Select Currency
                    </label>

                    <CurrencySelector
                        selectedCurrency={selectedCurrency}
                        onCurrencyChange={setSelectedCurrency}
                        disabled={!hasSelectedProducts}
                        onCurrencyDetailsChange={setSelectedCurrencyInfo}
                        className="w-full max-w-xs"
                        selectClassName="w-full"
                    />
                </div>

                <div className="space-y-3">
                    <div className="hidden md:flex gap-4">
                        <div className="flex-1 text-sm font-semibold text-gray-700">
                            Product
                        </div>

                        <div className="w-32 text-sm font-semibold text-gray-700 text-center">
                            Unit Price
                        </div>

                        <div className="w-32 text-sm font-semibold text-gray-700">
                            Quantity
                        </div>

                        <div className="w-32 text-sm font-semibold text-gray-700 text-center">
                            Total Price
                        </div>

                        <div className="w-32 text-sm font-semibold text-gray-700 text-center">
                            Availability
                        </div>

                        <div className="w-[104px]"></div>
                    </div>

                    {items.map((item, index) => {
                        const selectedProduct = products.find(
                            (p) =>
                                p.id === Number(item.productId)
                        );

                        const availableQuantity =
                            selectedProduct?.stockQuantity;

                        return (
                            <div
                                key={index}
                                className="flex flex-col md:flex-row gap-4 items-start md:items-center"
                            >
                                <div className="flex-1 w-full">
                                    <SearchableProductSelect
                                        value={item.productId}
                                        onChange={(value) =>
                                            handleChange(
                                                index,
                                                "productId",
                                                value
                                            )
                                        }
                                        products={products}
                                    />
                                </div>

                                <div className="w-full md:w-54 flex justify-center">
                                    {selectedProduct ? (
                                        <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-3 rounded-lg w-full text-center border border-gray-200">
                                            {(
                                                parseFloat(selectedProduct.price) *
                                                (exchangeRates[selectedCurrency] || 1)
                                            ).toFixed(2)} {currencySymbol}
                                        </span>
                                    ) : (
                                        <span className="w-full text-center text-gray-400">
                                            --
                                        </span>
                                    )}
                                </div>

                                <div className="w-full md:w-32">
                                    <input
                                        type="number"
                                        min="1"
                                        max={
                                            availableQuantity || 1
                                        }
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "quantity",
                                                e.target.value
                                            )
                                        }
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div className="w-full md:w-32 flex justify-center">
                                    {selectedProduct ? (
                                        <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-3 rounded-lg w-full text-center border border-gray-200">
                                            {(
                                                parseFloat(selectedProduct.price) *
                                                (exchangeRates[selectedCurrency] || 1) *
                                                (item.quantity || 1)
                                            ).toFixed(2)} {currencySymbol}
                                        </span>
                                    ) : (
                                        <span className="w-full text-center text-gray-400">
                                            --
                                        </span>
                                    )}
                                </div>

                                <div className="w-full md:w-32 flex justify-center">
                                    {selectedProduct ? (
                                        <span className="bg-blue-100 text-blue-700 text-sm font-medium px-4 py-3 rounded-lg w-full text-center border border-blue-200">
                                            Stock: {availableQuantity}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">
                                            --
                                        </span>
                                    )}
                                </div>

                                <div className="w-full md:w-[104px] flex gap-2 justify-end">
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(
                                                    index
                                                )
                                            }
                                            className="bg-red-50 hover:bg-red-100 text-red-500 p-3 rounded-lg"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>
                                    )}

                                    {index === items.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    ) : (
                                            <div className="w-[44px]"></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col items-end gap-5 pt-5 mt-4 border-t border-gray-200">
                    {/* Grand Total */}
                    {hasSelectedProducts && (
                        <div className="flex items-center gap-3 text-lg">
                            <span className="font-semibold text-gray-600">Grand Total:</span>
                            <span className="font-bold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                                {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                    orderBaseTotal * (exchangeRates[selectedCurrency] || 1)
                                )} {currencySymbol}
                            </span>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 items-center">
                        {orderToEdit && (
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                className="min-w-[160px] rounded-lg bg-red-500 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-red-600"
                            >
                                Cancel Edit
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="min-w-[160px] rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading
                                ? "Processing..."
                                : orderToEdit
                                    ? "Update Order"
                                    : "Place Order"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default OrderForm;
