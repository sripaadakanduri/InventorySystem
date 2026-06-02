import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

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

    const [isLoading, setIsLoading] =
        useState(true);

    const [deletingProductId, setDeletingProductId] =
        useState(null);

    const [productPendingDelete, setProductPendingDelete] =
        useState(null);

    const [filters, setFilters] = useState({
        name: "",
        priceSort: "",
        category: ""
    });

    const role =
        localStorage.getItem("role")?.toUpperCase();

    const fetchProducts = async () => {

        try {

            setIsLoading(true);

            const data = await getProducts();

            setProducts(data);

        } catch (error) {

            console.log(error);
            toast.error("Unable to load products.");
        } finally {

            setIsLoading(false);
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
                toast.success("Product updated successfully.");

            } else {

                await createProduct(formData);
                toast.success("Product created successfully.");
            }

            setSelectedProduct(null);

            setShowForm(false);

            await fetchProducts();

        } catch (error) {

            console.log(error);
            toast.error("Unable to save product.");
        }
    };

    const handleDeleteRequest = (product) => {

        setProductPendingDelete(product);
    };

    const handleDeleteConfirm = async () => {

        if (!productPendingDelete) return;

        try {

            setDeletingProductId(productPendingDelete.id);

            await deleteProduct(productPendingDelete.id);

            await fetchProducts();

            toast.success("Product deleted and transaction recorded.");
            setProductPendingDelete(null);

        } catch (error) {

            console.log(error);
            toast.error("Unable to delete product.");
        } finally {

            setDeletingProductId(null);
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
                onDelete={handleDeleteRequest}
                deletingProductId={deletingProductId}
                isLoading={isLoading}
            />

            {productPendingDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-gray-900">
                            Delete product?
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {productPendingDelete.name} will be removed from active inventory and a ProductDeleted transaction will be recorded.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
                                onClick={() => setProductPendingDelete(null)}
                                disabled={deletingProductId === productPendingDelete.id}
                            >
                                Cancel
                            </button>
                            <button
                                className="rounded-xl bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={handleDeleteConfirm}
                                disabled={deletingProductId === productPendingDelete.id}
                            >
                                {deletingProductId === productPendingDelete.id ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Products;
