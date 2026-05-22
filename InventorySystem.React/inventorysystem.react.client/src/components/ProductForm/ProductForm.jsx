import { useEffect, useState } from "react";
import { Package } from "lucide-react";

function ProductForm({ onSubmit, selectedProduct, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stockQuantity: "",
        category: ""
    });

    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                name: selectedProduct.name || "",
                price: selectedProduct.price || "",
                stockQuantity: selectedProduct.stockQuantity || "",
                category: selectedProduct.category || ""
            });
        } else {
            setFormData({
                name: "",
                price: "",
                stockQuantity: "",
                category: ""
            });
        }
    }, [selectedProduct]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200 mb-10">
            <div className="flex items-center gap-3 mb-8">
                <Package className="w-8 h-8 text-blue-500" />
                <h2 className="text-3xl font-bold text-gray-800">
                    {selectedProduct ? "Update Product" : "Create Product"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Wireless Mouse"
                            value={formData.name}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <input
                            type="text"
                            name="category"
                            placeholder="e.g. Electronics"
                            value={formData.category}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Stock Quantity</label>
                        <input
                            type="number"
                            name="stockQuantity"
                            placeholder="0"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-200"
                    >
                        {selectedProduct ? "Update Product" : "Create Product"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;