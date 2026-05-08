import { useEffect, useState } from "react";
// import "./ProductForm.css";

function ProductForm({ onSubmit, selectedProduct }) {

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

        setFormData({
            name: "",
            price: "",
            stockQuantity: "",
            category: ""
        });
    };

    return (
        <form className="product-form" onSubmit={handleSubmit}>

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

            <button type="submit">
                {selectedProduct ? "Update" : "Add"} Product
            </button>

        </form>
    );
}

export default ProductForm;