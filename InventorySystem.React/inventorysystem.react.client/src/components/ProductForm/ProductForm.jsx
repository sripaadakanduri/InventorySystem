import { useEffect, useState } from "react";

import "./ProductForm.css";

function ProductForm({
    onSubmit,
    selectedProduct,
    onClose
}) {

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
        <div className="product-form-container">

            <form
                className="product-form"
                onSubmit={handleSubmit}
            >

                <h2>
                    {selectedProduct
                        ? "Update Product"
                        : "Create Product"}
                </h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="stockQuantity"
                    placeholder="Stock Quantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />

                <div className="form-buttons">

                    <button type="submit">
                        {selectedProduct
                            ? "Update"
                            : "Create"}
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
}

export default ProductForm;