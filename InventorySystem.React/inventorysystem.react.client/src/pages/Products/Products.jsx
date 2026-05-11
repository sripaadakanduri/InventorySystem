import { useEffect, useState } from "react";


import ProductForm from "../../components/ProductForm/ProductForm";
import ProductTable from "../../components/ProductTable/ProductTable";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../../services/ProductService";

import "./Products.css";

function Products() {

    const [products, setProducts] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fetch all products
    const fetchProducts = async () => {

        try {

            const data = await getProducts();

            setProducts(data);

        } catch (error) {

            console.log(error);
        }
    };

    // Load products when component mounts
    useEffect(() => {

        let isMounted = true;

        (async () => {
            try {
                const data = await getProducts();
                if (isMounted) {
                    setProducts(data);
                }
            } catch (error) {
                console.log(error);
            }
        })();

        return () => {
            isMounted = false;
        };

    }, []);

    // Create or Update Product
    const handleSubmit = async (formData) => {

        try {

            if (selectedProduct) {

                await updateProduct(selectedProduct.id, formData);

                setSelectedProduct(null);

            } else {

                await createProduct(formData);
            }

            await fetchProducts();

        } catch (error) {

            console.log(error);
        }
    };

    // Delete Product
    const handleDelete = async (id) => {

        try {

            await deleteProduct(id);

            await fetchProducts();

        } catch (error) {

            console.log(error);
        }
    };

    // Select product for editing
    const handleEdit = (product) => {

        setSelectedProduct(product);
    };

    return (
        <div className="products-container card">
            <h1 style={{ marginBottom: "2rem" }}>Products Management</h1>

            <ProductForm
                onSubmit={handleSubmit}
                selectedProduct={selectedProduct}
            />

            <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />


        </div>
    );
}

export default Products;