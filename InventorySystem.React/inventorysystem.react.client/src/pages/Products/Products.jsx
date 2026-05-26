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

    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 p-4 sm:p-6">

            <div className="flex flex-col sm:flex-row sm:items-center shadow-lg justify-between gap-4 bg-white p-6 rounded-3xl mt-8 border border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Products Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your inventory, prices, and stock levels</p>
                </div>

                {role === "ADMIN" && (
                    <button
                        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition duration-200 shadow-md w-full sm:w-auto"
                        onClick={handleCreate}
                    >
                        <FaPlus size={14} />
                        Create Product
                    </button>
                )}
            </div>

            {showForm && role === "ADMIN" && (
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl">
                    <ProductForm
                        onSubmit={handleSubmit}
                        selectedProduct={selectedProduct}
                        onClose={() => {
                            setShowForm(false);
                            setSelectedProduct(null);
                        }}
                    />
                </div>
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