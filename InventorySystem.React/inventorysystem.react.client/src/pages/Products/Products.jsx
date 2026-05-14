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

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [selectedRowId, setSelectedRowId] = useState(null);

    const [selectionMode, setSelectionMode] = useState(null);

    const [filters, setFilters] = useState({
        name: "",
        priceSort: "",
        category: ""
    });

    // Role
    const role =
        localStorage.getItem("role")?.toUpperCase();

    // Fetch Products
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

    // Create / Update Product
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

    // Delete Product
    const handleDelete = async (id) => {

        try {

            await deleteProduct(id);

            setSelectedRowId(null);

            await fetchProducts();

        } catch (error) {

            console.log(error);
        }
    };

    // Edit Product
    const handleEdit = (product) => {

        setSelectedProduct(product);

        setShowForm(true);
    };

    // Create Product
    const handleCreate = () => {

        setSelectedProduct(null);

        setShowForm(true);
    };

    // Filters
    const handleFilterChange = (e) => {

        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // Filter + Sort
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

        // Price Sorting
        if (filters.priceSort === "lowToHigh") {

            filtered.sort((a, b) => a.price - b.price);

        } else if (
            filters.priceSort === "highToLow"
        ) {

            filtered.sort((a, b) => b.price - a.price);
        }

        return filtered;

    }, [products, filters]);

    // Admin Dropdown Actions
    const handleAdminAction = (e) => {

        const value = e.target.value;

        // CREATE
        if (value === "create") {

            setSelectionMode(null);

            handleCreate();
        }

        // EDIT MODE
        else if (value === "edit") {

            setSelectionMode("edit");

            alert("Select a product row to edit.");
        }

        // DELETE MODE
        else if (value === "delete") {

            setSelectionMode("delete");

            alert("Select a product row to delete.");
        }

        e.target.value = "";
    };

    // Row Selection
    const handleRowSelection = (product) => {

        setSelectedRowId(product.id);

        // EDIT FLOW
        if (selectionMode === "edit") {

            handleEdit(product);

            setSelectionMode(null);
        }

        // DELETE FLOW
        else if (selectionMode === "delete") {

            const confirmDelete = window.confirm(
                `Delete ${product.name}?`
            );

            if (confirmDelete) {

                handleDelete(product.id);
            }

            setSelectionMode(null);
        }
    };

    return (
        <div className="products-container card">

            {/* Header */}
            <div className="products-header">

                <h1>
                    Products Management
                </h1>

                {role === "ADMIN" && (

                    <button
                        className="create-btn"
                        onClick={() => handleCreate()}
                    ><FaPlus size={14} /> Create Product</button>

                )}



            </div>

            {/* Product Form */}
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

            {/* Product Table */}
            <ProductTable
                products={filteredProducts}
                role={role}
                filters={filters}
                onFilterChange={handleFilterChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                selectedRowId={selectedRowId}
                selectionMode={selectionMode}
                handleRowSelection={handleRowSelection}
            />

        </div>
    );
}

export default Products;