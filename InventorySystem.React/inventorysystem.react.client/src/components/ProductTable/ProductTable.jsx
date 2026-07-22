import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import api from "../../services/api";
import { getCurrencySymbol } from "../../services/CurrencySymbolService";
import DataTable from "../DataTable/DataTable";

function ProductTable({
    products,
    role,
    filters,
    categories = [],
    onFilterChange,
    onCategoryFilterChange,
    onPriceSortChange,
    onFilterApply,
    onEdit,
    onDelete,
    deletingProductId,
    isLoading,
    exchangeRates,
    selectedCurrency,
    setSelectedCurrency
}){
    const [symbol, setSymbol] = useState();
    const [currencies, setCurrencies] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

   useEffect(() => {
        const fetchCurrencies = async () => {
            const response = await api.get("/currency/symbols");
            setCurrencies(response.data);
        };

        fetchCurrencies();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [products]);

    useEffect(() => {
        if(selectedCurrency){
            handleSymbol(selectedCurrency);
        }

    },[selectedCurrency])
     const handleSymbol = async (code) => {
        try {
            const sym = await getCurrencySymbol(code);
            setSymbol(sym.symbol);
        }
        catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            key: "name",
            title: "Name"
        },

        {
            key: "price",
            title: "Price",
            render: (_, row) => (
                <>
                    {symbol || ""}
                    {(
                        parseFloat(row.price) *
                        (exchangeRates[selectedCurrency] || 1)
                    ).toFixed(2)}
                </>
            )
        },

        {
            key: "category",
            title: "Category"
        },

        {
            key: "stock",
            title: "Stock Quantity",
            render: (_, row) => (
                <span
                    className={
                        row.stockQuantity > 20
                            ? "text-green-600 font-bold"
                            : row.stockQuantity > 0
                            ? "text-yellow-600 font-bold"
                            : "text-red-600 font-bold"
                    }
                >
                    {row.stockQuantity}
                </span>
            )
        },

        ...(role === "ADMIN"
            ? [
                {
                    key: "actions",
                    title: "Actions",

                    render: (_, row) => (
                        <div className="flex justify-center gap-3">

                            <button
                                className="text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 p-2 rounded-lg transition"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(row);
                                }}
                            >
                                <Pencil className="w-5 h-5" />
                            </button>

                            <button
                                className="text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 p-2 rounded-lg transition"
                                disabled={deletingProductId === row.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(row);
                                }}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>

                        </div>
                    )
                }
            ]
            : [])
    ];

    const filterConfig = [
        {
            key: "name",
            type: "text",
            placeholder: "Filter Name..."
        },

        {
            key: "price",
            type: "custom",

            render: () => (
                <div className="flex flex-col items-center gap-2">

                    {/* Price Sort */}
                    <select
                        name="priceSort"
                        value={filters.priceSort}
                        onChange={onPriceSortChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-32 font-medium text-gray-400"
                    >
                        <option value="">Sort Price</option>
                        <option value="lowToHigh">Low to High</option>
                        <option value="highToLow">High to Low</option>
                    </select>

                    {/* Currency */}
                    <select
                        name="currency"
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-32 font-medium text-gray-400"
                    >
                        {Object.entries(currencies ?? {}).map(([code, currency]) => (
                            <option
                                key={code}
                                value={code}
                            >
                                {currency.code} - {currency.name}
                            </option>
                        ))}
                    </select>

                </div>
            )
        },

        {
            key: "category",
            type: "select",
            instant: true,
            options: [
                {
                    value: "",
                    label: "All Categories"
                },
                ...categories.map(category => ({
                    value: category,
                    label: category
                }))
            ]
        },

        {
            key: "stock",
            type: "number",
            placeholder: "Filter Stock..."
        }
    ];

    return (

    <DataTable

        data={products}

        columns={columns}

        loading={isLoading}

        emptyMessage="No Products Found"

        filters={filters}

        filterConfig={filterConfig}

        onFilterChange={onFilterChange}

        onInstantFilterChange={(e)=>{

            switch(e.target.name){

                case "category":
                    onCategoryFilterChange(e);
                    break;

                case "priceSort":
                    onPriceSortChange(e);
                    break;

                default:
                    onFilterChange(e);

            }

        }}

        onFilterApply={onFilterApply}

        pagination={true}

        currentPage={currentPage}

        pageSize={pageSize}

        totalItems={products.length}

        onPageChange={setCurrentPage}

        onPageSizeChange={setPageSize}

    />

    );
}

export default ProductTable;