import { useEffect, useState } from "react";
import "./ProductForm.css";

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
        <div className="flex-col space-y-4 justify-center items-center min-h-1000 bg-gray-100 p-6">

            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg"
            >

                {/* Title */}
                <h2 className="text-xl font-bold text-center mb-6">
                    {selectedProduct ? "Update Product" : "Create Product"}
                </h2>

                {/* Inputs */}
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <input
                    type="number"
                    name="stockQuantity"
                    placeholder="Stock Quantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                {/* Buttons */}
                <div className="">

                    <button
                        type="submit"
                        className="submit-btn bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium"
                    >
                        {selectedProduct ? "Update" : "Create"}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="cancel-btn bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium"
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
}

export default ProductForm;