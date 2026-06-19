import { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { Pencil, Trash2 } from "lucide-react";

function ProductTable({
    products,
    role,
    filters,
    onFilterChange,
    onPriceSortChange,
    onFilterApply,
    onEdit,
    onDelete,
    deletingProductId,
    isLoading,
    exchangeRates,
    selectedCurrency,
    setSelectedCurrency
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        setCurrentPage(1);
    }, [products]);

    const handleFilterKeyDown = (e) => {
        if (e.key === "Enter") {
            onFilterApply();
        }
    };

    const indexOfLastProduct = currentPage * pageSize;
    const indexOfFirstProduct = indexOfLastProduct - pageSize;
    const currentProducts = products.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const currencySymbols = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        INR: "₹",
        JPY: "¥"
    };

    return (
        <div className="w-full overflow-x-auto rounded-3xl border border-gray-200 shadow-lg bg-white mt-6">
            <table className="w-full border-collapse">
                <thead className="bg-blue-50 text-gray-700 border-b border-gray-200">
                    <tr>
                        <th className="p-4 text-center font-semibold border-b border-gray-200">
                            Name
                        </th>

                        <th className="p-4 text-center font-semibold border-b border-gray-200">
                            <div className="flex items-center justify-center gap-2">
                                <span>Price</span>

                                <select
                                    value={selectedCurrency}
                                    onChange={(e) =>
                                        setSelectedCurrency(e.target.value)
                                    }
                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none"
                                >
                                    {Object.keys(exchangeRates).map(
                                        (currency) => (
                                            <option
                                                key={currency}
                                                value={currency}
                                            >
                                                {currency}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </th>

                        <th className="p-4 text-center font-semibold border-b border-gray-200">
                            Category
                        </th>

                        <th className="p-4 text-center font-semibold border-b border-gray-200">
                            Stock Quantity
                        </th>

                        {role === "ADMIN" && (
                            <th className="p-4 text-center font-semibold border-b border-gray-200">
                                Actions
                            </th>
                        )}
                    </tr>

                    <tr>
                        <th className="p-2 px-4">
                            <div className="flex justify-center">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Filter Name..."
                                    value={filters.name}
                                    onChange={onFilterChange}
                                    onKeyDown={handleFilterKeyDown}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                />
                            </div>
                        </th>

                        <th className="p-2 px-4">
                            <div className="flex justify-center">
                                <select
                                    name="priceSort"
                                    value={filters.priceSort}
                                    onChange={onPriceSortChange}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                >
                                    <option value="">Sort Price</option>
                                    <option value="lowToHigh">
                                        Low to High
                                    </option>
                                    <option value="highToLow">
                                        High to Low
                                    </option>
                                </select>
                            </div>
                        </th>

                        <th className="p-2 px-4">
                            <div className="flex justify-center">
                                <input
                                    type="text"
                                    name="category"
                                    placeholder="Filter Category..."
                                    value={filters.category}
                                    onChange={onFilterChange}
                                    onKeyDown={handleFilterKeyDown}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                />
                            </div>
                        </th>

                        <th className="p-2 px-4"></th>

                        {role === "ADMIN" && <th className="p-2 px-4"></th>}
                    </tr>
                </thead>

                <tbody>
                    {isLoading ? (
                        <tr>
                            <td
                                colSpan={role === "ADMIN" ? 5 : 4}
                                className="p-8 text-center text-gray-500 text-lg"
                            >
                                Loading products...
                            </td>
                        </tr>
                    ) : currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b border-gray-200 hover:bg-gray-100 hover:translate-x-0.5 hover:cursor-pointer transform transition duration-200"
                            >
                                <td className="p-4 font-medium text-gray-900 text-center">
                                    {product.name}
                                </td>

                                <td className="p-4 text-gray-700 text-center">
                                    {currencySymbols[selectedCurrency] || ""}
                                    {(
                                        parseFloat(product.price) *
                                        (exchangeRates[selectedCurrency] || 1)
                                    ).toFixed(2)}
                                </td>

                                <td className="p-4 text-gray-600 font-medium text-center">
                                    {product.category}
                                </td>

                                <td className="p-4 text-center font-bold">
                                    <span
                                        className={`${product.stockQuantity > 20
                                                ? "text-green-600"
                                                : product.stockQuantity > 0
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                    >
                                        {product.stockQuantity}
                                    </span>
                                </td>

                                {role === "ADMIN" && (
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                className="text-blue-600 hover:text-white bg-blue-50 hover:scale-110 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 p-2 rounded-lg transition transform shadow-sm"
                                                onClick={() => onEdit(product)}
                                                title="Edit Product"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>

                                            <button
                                                className="inline-flex items-center text-red-600 hover:text-white hover:scale-110 bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 p-2 rounded-lg transform transition duration-200 shadow-sm disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                                onClick={() =>
                                                    onDelete(product)
                                                }
                                                disabled={
                                                    deletingProductId ===
                                                    product.id
                                                }
                                                title="Delete Product"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={role === "ADMIN" ? 5 : 4}
                                className="p-8 text-center text-gray-500 text-lg"
                            >
                                No Products Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="p-4 bg-white rounded-b-3xl">
                <Pagination
                    currentPage={currentPage}
                    totalItems={products.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                />
            </div>
        </div>
    );
}

export default ProductTable;