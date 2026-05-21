import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";

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

    const [selectedProduct, setSelectedProduct] =
        useState(null);

    const [showForm, setShowForm] =
        useState(false);

    const [filters, setFilters] = useState({
        name: "",
        priceSort: "",
        category: ""
    });

    // Role
    const role =
        localStorage.getItem("role")?.toUpperCase();

    const fetchProducts = async () => {

        try {

            const data = await getProducts();

            setProducts(data);

        } catch (error) {

            console.log(error);
        }
    };

    // Load Products
    useEffect(() => {

        fetchProducts();

    }, []);

    const handleSubmit = async (formData) => {

        try {

            if (selectedProduct) {

                await updateProduct(
                    selectedProduct.id,
                    formData
                );

            } else {

                await createProduct(formData);
            }

            setSelectedProduct(null);

            setShowForm(false);

            await fetchProducts();

        } catch (error) {

            console.log(error);
        }
    };

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this product?"
            );

        if (!confirmDelete) return;

        try {

            await deleteProduct(id);

            await fetchProducts();

        } catch (error) {

            console.log(error);
        }
    };

    const handleEdit = (product) => {

        setSelectedProduct(product);

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleCreate = () => {

        setSelectedProduct(null);

        setShowForm(true);
    };

    const handleFilterChange = (e) => {

        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const filteredProducts = useMemo(() => {

        let filtered = products.filter((product) => {

            const matchesName =
                product.name
                    .toLowerCase()
                    .includes(filters.name.toLowerCase());

            const matchesCategory =
                product.category
                    .toLowerCase()
                    .includes(filters.category.toLowerCase());

            return matchesName && matchesCategory;
        });

        if (filters.priceSort === "lowToHigh") {

            filtered.sort(
                (a, b) => a.price - b.price
            );

        } else if (
            filters.priceSort === "highToLow"
        ) {

            filtered.sort(
                (a, b) => b.price - a.price
            );
        }

        return filtered;

    }, [products, filters]);

    return (

        <div className="products-container card">

            <div className="products-header">

                <h1 className="text-gray-800 font-bold text-lg">
                    Products Management
                </h1>

                {role === "ADMIN" && (

                    <button
                        className="create-btn"
                        onClick={handleCreate}
                    >
                        <FaPlus size={14} />
                        Create Product
                    </button>

                )}

            </div>

            {showForm && role === "ADMIN" && (

                <ProductForm
                    onSubmit={handleSubmit}
                    selectedProduct={selectedProduct}
                    onClose={() => {

                        setShowForm(false);

                        setSelectedProduct(null);
                    }}
                />

            )}

            <ProductTable
                products={filteredProducts}
                role={role}
                filters={filters}
                onFilterChange={handleFilterChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

        </div>
    );
}

export default Products;