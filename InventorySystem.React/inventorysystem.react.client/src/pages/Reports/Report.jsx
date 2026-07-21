import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, RotateCcw, Search } from "lucide-react";

import DataTable from "../../components/DataTable";
import { getAllCurrencySymbols } from "../../services/CurrencySymbolService";
import { getProducts } from "../../services/ProductService";
import * as reportService from "../../services/reportService";

function Report() {
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedProductName, setSelectedProductName] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [stats, setStats] = useState({ totalQuantity: 0, totalDays: 0 });
    const [currencyCounts, setCurrencyCounts] = useState({});
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [currencies, setCurrencies] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const formatAmount = (value) => Number(value ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const getCurrencyDisplay = (currency, code) => {
        if (!currency) return { code, name: code, symbol: code };
        if (typeof currency === "string") return { code, name: currency, symbol: currency };

        return {
            code: currency.code || code,
            name: currency.name || code,
            symbol: currency.symbol || currency.code || code
        };
    };

    const normalizeReportRow = (row) => ({
        productName: row.productName ?? row.ProductName ?? "",
        orderNumber: row.orderNumber ?? row.OrderNumber ?? "",
        orderDate: row.orderDate ?? row.OrderDate ?? "",
        quantity: row.quantity ?? row.Quantity ?? 0,
        originalAmount: row.originalAmount ?? row.OriginalAmount ?? 0,
        originalCurrency: row.originalCurrency ?? row.OriginalCurrency ?? "",
        convertedAmount: row.convertedAmount ?? row.ConvertedAmount ?? 0
    });

    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [productsData, currenciesData] = await Promise.all([
                    getProducts({}),
                    getAllCurrencySymbols()
                ]);

                setProducts(productsData ?? []);
                setCurrencies(currenciesData ?? {});
            } catch (error) {
                console.error("Error loading report filters:", error);
            }
        };

        loadFilters();
    }, []);

    const fetchReport = async () => {
        if (!selectedProduct || !selectedStartDate || !selectedEndDate) {
            alert("Please select product, from date, and to date.");
            return;
        }

        if (new Date(selectedStartDate) > new Date(selectedEndDate)) {
            alert("From date cannot be after to date.");
            return;
        }

        try {
            setIsLoading(true);
            setHasSearched(true);
            const name =products.find((product) => String(product.id) === String(selectedProduct))?.name || selectedProduct;
            setSelectedProductName(name);
            const data = await reportService.getOrdersByFilters(selectedProduct, selectedStartDate, selectedEndDate);
            const values = await reportService.getTotalQuantityAndRange(selectedProduct, selectedStartDate, selectedEndDate);
            const currencyFrequency = await reportService.getFrequencyOfCurrency(selectedProduct, selectedStartDate, selectedEndDate);
            setCurrencyCounts(currencyFrequency ?? {});
            const normalizedOrders = (data ?? []).map(normalizeReportRow);

            setOrders(normalizedOrders);

            setStats({
                totalQuantity: values.totalQuantity ?? values.TotalQuantity ?? values.item1 ?? 0,
                totalDays: values.totalDays ?? values.TotalDays ?? values.item2 ?? 0,
            });
            setCurrentPage(1);
        } catch (error) {
            console.error("Error fetching report orders:", error);
            setOrders([]);
            alert("Unable to load report data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedProduct("");
        setSelectedCurrency("");
        setSelectedStartDate("");
        setSelectedEndDate("");
        setOrders([]);
        setHasSearched(false);
        setCurrentPage(1);
    };

    const handleDownloadPDF = () => {
        if (orders.length === 0) {
            alert("Search and load report data before downloading.");
            return;
        }

        const productName = selectedProductName || selectedProduct || "N/A";
        const currencyPrefix = selectedCurrency || "Converted";
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

        doc.setFontSize(16);
        doc.text("Product Sales Report", 14, 16);
        doc.setFontSize(10);
        doc.text(`Product: ${productName}`, 14, 24);
        doc.text(`Period: ${selectedStartDate} to ${selectedEndDate}`, 14, 30);
        doc.text(`Currency Frequency: ${Object.entries(currencyCounts).map(([currency, count]) => `${currency}: ${count}`).join(", ")}`, 14, 36);

        autoTable(doc, {
            startY: 38,
            head: [["Product", "Order Number", "Order Date", "Quantity", "Original Amount", "Selected Currency Amount"]],
            body: orders.map((order) => [
                order.productName,
                order.orderNumber,
                order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-",
                order.quantity,
                `${order.originalCurrency} ${formatAmount(order.originalAmount)}`,
                `${currencyPrefix} ${formatAmount(order.convertedAmount)}`
            ]),
            theme: "grid"
        });

        doc.save("Product-Sales-Report.pdf");
    };

    const reportColumns = [
        { key: "productName", title: "Product Name" },
        { key: "orderNumber", title: "Order Number" },
        {
            key: "orderDate",
            title: "Order Date",
            render: (value) => value ? new Date(value).toLocaleDateString() : "-"
        },
        { key: "quantity", title: "Quantity" },
        {
            key: "originalAmount",
            title: "Original Amount",
            render: (value, row) => `${row.originalCurrency} ${formatAmount(value)}`
        },
        {
            key: "convertedAmount",
            title: "Selected Currency Amount",
            render: (value) => `${selectedCurrency || ""} ${formatAmount(value)}`.trim()
        }
    ];

    return (
        <div className="max-w-screen mx-auto my-6 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Product Sales Report</h1>
                    <p className="text-sm text-gray-600">
                        View product wise sales details and summary for the selected period and currency
                    </p>
                </div>

                <button
                    className="flex items-center justify-center gap-x-2 rounded-md bg-blue-500 px-5 py-3 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleDownloadPDF}
                    disabled={orders.length === 0}
                >
                    <Download className="h-4 w-4" />
                    Download PDF
                </button>
            </div>

            <div className="mt-6 grid gap-4 rounded-md p-4 shadow-md md:grid-cols-5">
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Product</label>
                    <select
                        className="rounded-md border border-gray-300 p-2 focus:border-blue-500"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
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
                    <select
                        className="rounded-md border border-gray-300 p-2 focus:border-blue-500"
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                    >
                        <option value="">Select Currency</option>
                        {Object.entries(currencies).map(([code, currency]) => {
                            const display = getCurrencyDisplay(currency, code);

                            return (
                                <option key={code} value={code}>
                                    {display.code} - {display.name}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="flex flex-col justify-end gap-2">
                    <button
                        className="group flex items-center justify-center gap-x-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={fetchReport}
                        disabled={isLoading}
                    >
                        <Search className="h-5 w-5 transition-transform group-hover:scale-105" />
                        {isLoading ? "Searching..." : "Search"}
                    </button>
                    <button
                        className="group flex items-center justify-center gap-x-2 rounded-md border border-gray-300 px-5 py-2 hover:bg-gray-200"
                        onClick={handleReset}
                    >
                        <RotateCcw className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-180" />
                        Reset
                    </button>
                </div>
            </div>
            {!hasSearched && (
                <div className="relative h-[calc(100vh-280px)] flex justify-center px-4">
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
                            setCurrentPage(1);
                        }}
                        getRowKey={(row, index) => `${row.orderNumber}-${row.productName}-${index}`}
                    />
                </div>
            )}
            {hasSearched && (
                <div className="m-10 flex justify-center ">
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
                                            {selectedCurrency}
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
                                                    className={`font-medium ${
                                                        currency === selectedCurrency
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
            
        </div>
    );
}

export default Report;
