import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/ProductForm/ProductForm";
import ProductImportModal from "../../components/ProductImportModal/ProductImportModal";
import ProductTable from "../../components/ProductTable/ProductTable";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../../services/ProductService";

import { getLatestRates } from "../../services/exchangeRateService";

import {
    ChevronDown,
    Plus,
    Upload,
    Package
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

function Products() {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [productPendingDelete, setProductPendingDelete] = useState(null);
    const [filters, setFilters] = useState({
        name: "",
        priceSort: "",
        category: "",
        stock: ""
    });
    const [showImportModal, setShowImportModal] = useState(false);
    const [exchangeRates, setExchangeRates] = useState({ USD: 1.0 });
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [categories, setCategories] = useState([]);
    const formRef = useRef(null);

    const { user } = useAuth();
    const role = user?.role?.toUpperCase();

    const fetchCategories = async () => {
        try {
            const allProducts = await getProducts({});
            const uniqueCategories = [...new Set(allProducts.map((p) => p.category?.trim().toLowerCase()).filter(Boolean))].sort();
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Unable to load categories:", error);
        }
    };

    const fetchProducts = async (activeFilters = filters) => {
        try {
            setIsLoading(true);

            const [productsData, ratesData] = await Promise.all([
                getProducts(activeFilters),
                getLatestRates().catch(() => ({ USD: 1.0 }))
            ]);

            setProducts(productsData);
            setExchangeRates(ratesData);
        } catch (error) {
            console.log(error);
            toast.error("Unable to load products.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        if (queryParams.has("userEmail")) {
            queryParams.delete("userEmail");

            const newSearch = queryParams.toString();

            window.history.replaceState(
                {},
                document.title,
                window.location.pathname +
                (newSearch ? `?${newSearch}` : "")
            );
        }

        const stockParam = queryParams.get("stock");

        const initialFilters = {
            name: "",
            priceSort: "",
            category: "",
            stock: stockParam ? Number(stockParam) : ""
        };

        if (stockParam) {
            setFilters(initialFilters);
        }

        fetchProducts(initialFilters);
        fetchCategories();
    }, []);

    useEffect(() => {
        if (showForm) {
            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }, [showForm]);

    const handleSubmit = async (formData) => {
        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct.id, formData);
                toast.success("Product updated successfully.");
            } else {
                await createProduct(formData);
                toast.success("Product created successfully.");
            }

            setSelectedProduct(null);
            setShowForm(false);
            await Promise.all([fetchProducts(filters), fetchCategories()]);
        } catch (error) {
            console.log(error);

            if (error.response?.status === 409) {
                const { name, category } = error.response.data;
                const duplicateFilters = {
                    ...filters,
                    name,
                    category
                };

                setFilters(duplicateFilters);
                await fetchProducts(duplicateFilters);
                toast.error(`Product Already Exists :${name} (${category})`);
                setShowForm(false);
                return;
            }

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
            await Promise.all([fetchProducts(filters), fetchCategories()]);
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
        setOpen(false);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => ({
            ...prev,
            [name]: name === "stock"
                ? (value === "" ? "" : Number(value))
                : value
        }));
    };

    const handleCategoryFilterChange = (e) => {
        const updatedFilters = {
            ...filters,
            category: e.target.value
        };

        setFilters(updatedFilters);
        fetchProducts(updatedFilters);
    };

    const handlePriceSortChange = (e) => {
        const updatedFilters = {
            ...filters,
            priceSort: e.target.value
        };

        setFilters(updatedFilters);
        fetchProducts(updatedFilters);
    };
    const handleFilterApply = () => {
        fetchProducts(filters);
    };

    return (
        <div className="page-container">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-lg">
                <div>
                    <div className="flex items-center gap-3">
                        <Package className="text-indigo-600" size={28} />
                        <h1 className="text-2xl font-bold text-gray-900">
                            Products Management
                        </h1>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage your inventory, prices, and stock levels
                    </p>
                </div>

                {role === "ADMIN" && (
                    <div
                        className="relative inline-block"
                        onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}
                    >
                        <button
                            className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 shadow-md transition-all duration-300 ${open ? "rounded-t-xl rounded-b-none" : "rounded-xl"
                                }`}
                        >
                            Add Products
                            <ChevronDown
                                size={18}
                                className={`transition-transform duration-300 ${open ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        <div
                            className={`absolute left-0 top-full w-full z-50 transition-all duration-300 ${open
                                ? "opacity-100 translate-y-0 visible"
                                : "opacity-0 -translate-y-3 invisible pointer-events-none"
                                }`}
                        >
                            <button
                                className="flex items-center justify-center gap-4 w-full bg-white px-4 py-3 text-left border-x border-b border-gray-200 hover:bg-gray-100 duration-300 delay-100"
                                onClick={handleCreate}
                            >
                                <Plus size={16} />
                                Create Product
                            </button>

                            <button
                                className="flex items-center justify-center gap-4 w-full bg-white px-4 py-3 text-left border-x border-b border-gray-200 hover:bg-gray-100 rounded-b-xl duration-300 delay-200"
                                onClick={() => setShowImportModal(true)}
                            >
                                <Upload size={16} />
                                Upload File
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showForm && role === "ADMIN" && (
                <div
                    ref={formRef}
                    className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl"
                >
                    <ProductForm
                        onSubmit={handleSubmit}
                        selectedProduct={selectedProduct}
                        categories={categories}
                        onClose={() => {
                            setShowForm(false);
                            setSelectedProduct(null);
                        }}
                    />
                </div>
            )}

            <ProductTable
                products={products}
                role={role}
                filters={filters}
                categories={categories}
                onFilterChange={handleFilterChange}
                onCategoryFilterChange={handleCategoryFilterChange}
                onPriceSortChange={handlePriceSortChange}
                onFilterApply={handleFilterApply}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
                deletingProductId={deletingProductId}
                isLoading={isLoading}
                exchangeRates={exchangeRates}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
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

            {showImportModal && (
                <ProductImportModal
                    onClose={() => setShowImportModal(false)}
                    onImported={() => Promise.all([fetchProducts(filters), fetchCategories()])}
                />
            )}
        </div>
    );
}

export default Products;
