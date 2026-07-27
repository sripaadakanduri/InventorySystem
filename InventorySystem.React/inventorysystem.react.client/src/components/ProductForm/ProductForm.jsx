
import { useEffect, useState } from "react";
import { Package } from "lucide-react";

function ProductForm({ onSubmit, selectedProduct, categories = [], onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stockQuantity: "",
        category: ""
    });
    const [isNewCategory, setIsNewCategory] = useState(false);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                name: selectedProduct.name || "",
                price: selectedProduct.price || "",
                stockQuantity: selectedProduct.stockQuantity || "",
                category: selectedProduct.category || ""
            });
            const exists = categories.some(
                (c) => c.toLowerCase() === (selectedProduct.category || "").toLowerCase()
            );
            setIsNewCategory(categories.length === 0 || (!exists && !!selectedProduct.category));
        } else {
            setFormData({
                name: "",
                price: "",
                stockQuantity: "",
                category: ""
            });
            setIsNewCategory(categories.length === 0);
        }
    }, [selectedProduct, categories]);

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
        <div className="w-full">
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
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700">Category</label>
                            <button
                                type="button"
                                onClick={() => {
                                    const nextIsNew = !isNewCategory;
                                    setIsNewCategory(nextIsNew);
                                    if (nextIsNew) {
                                        setFormData(prev => ({ ...prev, category: "" }));
                                    } else {
                                        setFormData(prev => ({ ...prev, category: categories[0] || "" }));
                                    }
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline focus:outline-none font-medium"
                            >
                                {isNewCategory ? "Choose Existing" : "+ Add New Category"}
                            </button>
                        </div>
                        {isNewCategory ? (
                            <input
                                type="text"
                                name="category"
                                placeholder="Enter new category name..."
                                value={formData.category}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        ) : (
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                required
                            >
                                <option value="" disabled>-- Select Category --</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
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
                            min="1"
                            name="stockQuantity"
                            placeholder="1"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-200"
                    >
                        {selectedProduct ? "Update Product" : "Save Product"}
                    </button>

                </div>
            </form>
        </div>
    );
}

export default ProductForm;