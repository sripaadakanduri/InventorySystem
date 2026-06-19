import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import ProductForm from "../../components/ProductForm/ProductForm";
import ProductTable from "../../components/ProductTable/ProductTable";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    importProducts
} from "../../services/ProductService";

import { getLatestRates } from "../../services/exchangeRateService";

import {
  ChevronDown,
  Plus,
  Upload,
  Package,
} from "lucide-react";
function Products() {
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
        category: ""
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [exchangeRates, setExchangeRates] = useState({ USD: 1.0 });
    const [selectedCurrency, setSelectedCurrency] = useState("USD");

    const role = localStorage.getItem("role")?.toUpperCase();

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
            await fetchProducts(filters);
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

                toast.error(
                    `Product Already Exists :${name} (${category})`
                );

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
            await fetchProducts(filters);
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


   const handleImport = async () => {
    if (!selectedFile) {
        toast.error("Please select a CSV file.");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await importProducts(formData);

        const originalText = await selectedFile.text();

        const totalProducts =
            originalText
                .split("\n")
                .filter(line => line.trim())
                .length - 1;

        let failedCount = 0;

        if (response.data.size > 0) {
            const failedCsvText = await response.data.text();

            failedCount =
                failedCsvText
                    .split("\n")
                    .filter(line => line.trim())
                    .length - 1;

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;
            link.download = "FailedProducts.csv";

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        }

        const importedCount = totalProducts - failedCount;

        if (importedCount > 0) {
            toast.success(
                `${importedCount} product${importedCount !== 1 ? "s" : ""} imported successfully`
            );
        }

        if (failedCount > 0) {
            toast.error(
                `${failedCount} product${failedCount !== 1 ? "s" : ""} failed to import`
            );
        }

        setShowAddModal(false);
        setSelectedFile(null);

        await fetchProducts(filters);
    } catch (error) {
        console.error(error);
        toast.error("Unable to import products.");
    }
};

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl mt-8 border border-gray-200 shadow-lg">
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
                        {/* Main Button */}
                        <button
                            className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 shadow-md transition-all duration-300 ${
                                open ? "rounded-t-xl rounded-b-none" : "rounded-xl"
                            }`}
                        >
                            Add Products

                            <ChevronDown
                                size={18}
                                className={`transition-transform duration-300 ${
                                    open ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {/* Dropdown */}
                        <div
                            className={`absolute left-0 top-full w-full z-50 transition-all duration-300 ${
                                open
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
                                onClick={() => setShowAddModal(true)}
                            >
                                <Upload size={16} />
                                Upload File
                            </button>
                        </div>
                    </div>
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
                products={products}
                role={role}
                filters={filters}
                onFilterChange={handleFilterChange}
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

            {/* Upload Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                    onClick={() => setShowAddModal(false)}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Import Products
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Upload a CSV file containing product data.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-2xl text-gray-400 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        {/* Dropzone */}
                        <label
                            htmlFor="csv-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();

                                const file = e.dataTransfer.files[0];

                                if (!file) return;

                                if (file.name.endsWith(".csv")) {
                                    setSelectedFile(file);
                                } else {
                                    toast.error("Only CSV files are allowed.");
                                }
                            }}
                        >
                            <svg
                                className="w-10 h-10 mb-4 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
                                />
                            </svg>

                            <p className="mb-2 text-sm text-gray-700">
                                <span className="font-semibold">
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </p>

                            <p className="text-xs text-gray-500">
                                CSV only (Max. 30 MB)
                            </p>

                            {selectedFile && (
                                <p className="mt-4 text-sm font-medium text-green-600">
                                    {selectedFile.name}
                                </p>
                            )}

                            <input
                                id="csv-file"
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];

                                    if (!file) return;

                                    if (file.name.endsWith(".csv")) {
                                        setSelectedFile(file);
                                    } else {
                                        toast.error("Only CSV files are allowed.");
                                    }
                                }}
                            />
                        </label>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setSelectedFile(null);
                                }}
                                className="rounded-xl border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 hover:bg-red-500 hover:text-white transition duration-300"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={!selectedFile}
                                className="rounded-xl bg-green-500 px-5 py-2 text-white hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed duration-300"
                                onClick={() => {
                                    handleImport(selectedFile);
                                }}
                            >
                                Import
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Products;
