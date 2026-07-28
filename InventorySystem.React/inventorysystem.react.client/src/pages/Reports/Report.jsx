import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { Download, Search, FileBarChart } from "lucide-react";
import CurrencySelector from "../../components/CurrencySelector";
import DataTable from "../../components/DataTable";
import { getProducts } from "../../services/ProductService";
import * as reportService from "../../services/reportService";
import SearchableProductSelect from "../../components/SearchableProductSelect";
import { PAGINATION } from "../../components/DataTable/paginationConfig";
import { exportToPDF,buildDataForReport } from "../../services/Exports/exportIndex";

function Report() {
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedProductName, setSelectedProductName] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");

    const [reportCurrency, setReportCurrency] = useState("");

    const [stats, setStats] = useState({ totalQuantity: 0, totalDays: 0 });
    const [currencyCounts, setCurrencyCounts] = useState({});
    const [orders, setOrders] = useState([]);

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);

    const formatAmount = (value) => Number(value ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const normalizeReportRow = (row) => ({
        productName: row.productName ?? row.ProductName ?? "",
        orderNumber: row.orderNumber ?? row.OrderNumber ?? "",
        orderDate: row.orderDate ?? row.OrderDate ?? "",
        quantity: row.quantity ?? row.Quantity ?? 0,
        originalAmount: row.originalAmount ?? row.OriginalAmount ?? 0,
        originalCurrency: row.originalCurrency ?? row.OriginalCurrency ?? "",
        convertedAmount: row.convertedAmount ?? row.convertedAmount ?? 0
    });

    useEffect(() => {
        const loadFilters = async () => {
            try {
                const productsData = await getProducts({});
                setProducts(productsData ?? []);
            } catch (error) {
                console.error("Error loading report filters:", error);
            }
        };

        loadFilters();
    }, []);

    const fetchReport = async () => {
        if (!selectedProduct || !selectedStartDate || !selectedEndDate || !selectedCurrency) {
            toast.error("Please select product, from date, to date and currency.");
            return;
        }

        if (new Date(selectedStartDate) > new Date(selectedEndDate)) {
            toast.error("From date cannot be after to date.");
            return;
        }

        try {
            setIsLoading(true);
            setHasSearched(true);

            const name =
                products.find((product) => String(product.id) === String(selectedProduct))
                    ?.name || selectedProduct;

            setSelectedProductName(name);

            const data = await reportService.getOrdersByFilters(
                selectedProduct,
                selectedStartDate,
                selectedEndDate,
                selectedCurrency
            );
            setReportCurrency(selectedCurrency);
            setCurrencyCounts(data?.currencyFrequency ?? {});

            const normalizedOrders = (data?.orders ?? []).map((order) => ({
                ...normalizeReportRow(order),
                orderDate: order.orderDate
                    ? new Date(order.orderDate).toISOString().split("T")[0]
                    : null,
            }));

            setOrders(normalizedOrders);

            setStats({
                totalQuantity: data?.totalQuantity ?? 0,
                totalDays: data?.totalDays ?? 0,
            });
            setCurrentPage(PAGINATION.DEFAULT_PAGE);
        }
        catch (error) {
            console.error("Error fetching report orders:", error);
            setOrders([]);
            toast.error("Unable to load report data.");
        } finally {
            setIsLoading(false);
        }
    };
   const metadata = [
        {
            label: "Product Name:",
            value: selectedProductName
        },
        {
            label: "Total Quantity:",
            value: stats.totalQuantity
        },
        {
            label: "Total Days:",
            value: stats.totalDays
        },
        {
            label: "Period:",
            value: `${selectedStartDate} to ${selectedEndDate}`
        },
        {
            label: "Selected Currency:",
            value: selectedCurrency
        },
        {
            label: "Currency Frequency:",
            value: Object.entries(currencyCounts)
                .map(([currency, count]) => `${currency}: ${count}`)
                .join(", ")
        }
    ];
   const reportColumns = [
        {
            key: "productName",
            title: "Product Name",
            accessor: "productName"
        },
        {
            key: "orderNumber",
            title: "Order Number",
            accessor: "orderNumber"
        },
        {
            key: "orderDate",
            title: "Order Date",
            accessor: "orderDate",
            render: (value) =>
                value ? new Date(value).toLocaleDateString() : "-"
        },
        {
            key: "quantity",
            title: "Quantity",
            accessor: "quantity"
        },
        {
            key: "originalAmount",
            title: "Original Amount",
            accessor: "originalAmount",
            render: (value, row) =>
                `${row.originalCurrency} ${formatAmount(value)}`
        },
        {
            key: "convertedAmount",
            title: "Selected Currency Amount",
            accessor:"convertedAmount",
            render: (value) =>
                `${reportCurrency || "USD"} ${formatAmount(value)}`
        }
    ];

    return (
        <div className="page-container">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center justify-start gap-2">
                        <FileBarChart className="h-10 w-10 text-blue-800 " />
                        <div>
                            <h1 className="text-2xl font-semibold">Product Sales Report</h1>
                            <p className="text-sm text-gray-600 ">
                                View product wise sales details and summary for the selected period and currency
                            </p>
                        </div>
                    </div>

                </div>

                <button
                    className="flex items-center justify-center gap-x-2 rounded-md bg-blue-500 px-5 py-3 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={()=> exportToPDF({
                        data:buildDataForReport(orders,reportCurrency),
                        columns:reportColumns,
                        fileName: "Product-Sales-Report.pdf",
                        title:"Product Sales Report",
                        metadata:metadata,
                    })}
                    disabled={orders.length === 0}
                >
                    <Download className="h-4 w-4" />
                    Download PDF
                </button>
            </div>

            <div className="mt-6 grid gap-4 bg-white rounded-xl p-4 shadow-md md:grid-cols-5">
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Product</label>
                    <SearchableProductSelect
                        value={selectedProduct}
                        onChange={setSelectedProduct}
                        products={products}
                        placeholder="Select Product"
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">From Date</label>
                    <input
                        type="date"
                        className="rounded-md border border-gray-300 p-2 focus:border-blue-500"
                        value={selectedStartDate}
                        onChange={(e) => setSelectedStartDate(e.target.value)}
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">To Date</label>
                    <input
                        type="date"
                        className="rounded-md border border-gray-300 p-2 focus:border-blue-500"
                        value={selectedEndDate}
                        onChange={(e) => setSelectedEndDate(e.target.value)}
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <CurrencySelector
                        selectedCurrency={selectedCurrency}
                        onCurrencyChange={setSelectedCurrency}
                        disabled={false}
                        className="w-full"
                        selectClassName="w-full"
                    />
                </div>

                <div className="flex flex-col justify-end">
                    <button
                        className="flex h-10 mb-1 w-full items-center justify-center gap-2 rounded-md bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-60"
                        onClick={fetchReport}
                        disabled={isLoading}
                    >
                        <Search className="h-5 w-5" />
                        {isLoading ? "Searching..." : "Search"}
                    </button>
                </div>
            </div>
            {!hasSearched && (
                <div className="relative h-[calc(100vh-200px)] 2xl:h-[calc(100vh-450px)] flex justify-center px-4">
                    <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border-l-4 border-blue-500 bg-white px-8 py-6 shadow-xl">
                        <h1 className="text-xl font-semibold text-gray-800">
                            Select a product and date range to generate a report.
                        </h1>
                        <p className="mt-2 text-gray-500">
                            Reports will be generated once both fields are selected.
                        </p>
                    </div>
                </div>
            )}
            
            {hasSearched && !isLoading && (
                <div className="flex justify-center ">
                    <div className="w-full  rounded-xl border-l-4 border-blue-500 bg-white p-8 shadow-xl">
                        <div className="grid grid-cols-2 gap-10">
                            {/* Left Section */}
                            <div className="pr-8 border-r border-gray-200">
                                <h2 className="mb-5 text-xl font-semibold text-amber-800">
                                    Summary :
                                </h2>
                                <div className="space-y-3">
                                    <p>
                                        <span className="font-medium text-gray-700">Product Name:</span>{" "}
                                        <span className="font-semibold text-gray-500">
                                            {selectedProductName}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-700">Total Quantity:</span>{" "}
                                        <span className="font-semibold text-gray-500">
                                            {stats.totalQuantity}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-700">Total Days:</span>{" "}
                                        <span className="font-semibold text-gray-500">
                                            {stats.totalDays}
                                        </span>
                                    </p>

                                    <p>
                                        <span className="font-medium text-gray-700">Selected Currency:</span>{" "}
                                        <span className="font-semibold text-blue-600">
                                            {reportCurrency}
                                        </span>
                                    </p>
                                </div>  
                            </div>

                            {/* Right Section */}
                            <div className="pl-2">
                                <h2 className="mb-5 text-xl font-semibold text-gray-800">
                                    Currency Frequency
                                </h2>

                                {Object.keys(currencyCounts).length === 0 ? (
                                    <p className="text-gray-500">
                                        No currency data available.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {Object.entries(currencyCounts).map(([currency, count]) => (
                                            <div
                                                key={currency}
                                                className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-4 py-2"
                                            >
                                                <span
                                                    className={`font-medium ${currency === reportCurrency
                                                        ? "text-blue-600"
                                                        : "text-gray-700"
                                                        }`}
                                                >
                                                    {currency}
                                                </span>

                                                <span className="rounded bg-blue-100 px-2 py-1 text-sm font-semibold text-blue-700">
                                                    {count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
            {hasSearched && (
                <div className="mt-6">
                    <DataTable
                        data={orders}
                        columns={reportColumns}
                        loading={isLoading}
                        emptyMessage="No orders found for the selected filters."
                        pagination={true}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={orders.length}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            setCurrentPage(PAGINATION.DEFAULT_PAGE);
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default Report;
