import { useState, useEffect } from 'react';
import transactionService from '../../services/transactionService';
import Pagination from '../../components/Pagination/Pagination';
import { toast } from 'react-toastify';
import { formatApiDate } from '../../utils/dateUtils';
import DataTable from '../../components/DataTable';
import {
    Activity,
    ChevronDown,
    FileSpreadsheet,
    FileText,   
    File,
} from 'lucide-react';
import {
    exportTransactionsToCSV,
    exportTransactionsToExcel,
    exportTransactionsToPDF,
} from '../../components/transactionExportUtils';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState({
        username: "",
        product: "",
        actionType: "",
        startDate: "",
        endDate: ""
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchTransactions = async (activeFilters = filters) => {
        try {
            setLoading(true);
            const data = await transactionService.getTransactions(activeFilters);
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error("Failed to load transactions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });

        setCurrentPage(1);
    };

    const handleFilterApply = () => {
        fetchTransactions(filters);
        setCurrentPage(1);
    };

    const handleInstantFilterChange = (e) => {
        const updatedFilters = {
            ...filters,
            [e.target.name]: e.target.value
        };

        setFilters(updatedFilters);
        setCurrentPage(1);
        fetchTransactions(updatedFilters);
    };

    const getFilteredTransactionsForExport = async () => {
        const data = await transactionService.getTransactions(filters);
        setTransactions(data);
        setCurrentPage(1);
        return data;
    };

    const handleExportTransactions = async (exportAction) => {
        try {
            const filteredTransactions = await getFilteredTransactionsForExport();
            await exportAction(filteredTransactions);
        } catch (error) {
            console.error("Error exporting transactions:", error);
            toast.error("Failed to export filtered audit logs.");
        }
    };

    const getBadgeStyle = (actionType) => {
        if (actionType === "StockIn" || actionType === "ManualAdd") return "bg-green-50 text-green-700 border-green-200";
        if (actionType === "StockOut" || actionType === "ManualRemove") return "bg-red-50 text-red-700 border-red-200";
        if (actionType === "ProductDeleted") return "bg-rose-50 text-rose-700 border-rose-200";
        if (actionType === "OrderPlaced") return "bg-amber-50 text-amber-700 border-amber-200";
        if (actionType === "OrderCancelled") return "bg-gray-100 text-gray-700 border-gray-200";
        return "bg-blue-50 text-blue-700 border-blue-200";
    };

    // if (loading) return (
    //     <div className="flex justify-center items-center min-h-[50vh]">
    //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    //     </div>
    // );
    const columns =[
        {
            key: "username",
            title: "Username",
            render: (_, row) => (row.user?.username.charAt(0).toUpperCase() + row.user?.username.slice(1)) || `User ${row.userId}`,
        },
        {
            key: "product",
            title: "Product",
            render: (_, row) => row.product?.name || `Product ${row.productId}`,
        },
        {
            key: "quantityChanged",
            title: "Change",
            render: (value) => (
                <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
                    {value > 0 ? `+${value}` : value}
                </span>
            )
        },
        {
            key: "remainingStock",
            title: "Stock",
            render: (value) => (
                <span className="text-gray-600 font-medium">{value}</span>
            )
        },
        {
            key: "actionType",
            title: "Action Type",
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeStyle(value)}`}>
                    {value}
                </span>
            )
        },
        {
            key: "createdAt",
            title: "Date & Time",
            render: (value) => (
                <span className="text-gray-500 text-sm">{formatApiDate(value)}</span>
            )
        }
    ];

    const filterConfig = [
        {
            key: "username",
            type: "text",
            placeholder: "Filter user..."
        },
        {
            key: "product",
            type: "text",
            placeholder: "Filter product..."
        },
        {
            key: "actionType",
            type: "select",
            instant: true,
            options: [
                {
                    value: "",
                    label: "All"
                },
                {
                    value: "ManualAdd",
                    label: "ManualAdd"
                },
                {
                    value: "ManualRemove",
                    label: "ManualRemove"
                },
                {
                    value: "OrderPlaced",
                    label: "OrderPlaced"
                },
                {
                    value: "OrderCancelled",
                    label: "OrderCancelled"
                },
                {
                    value: "ProductDeleted",
                    label: "ProductDeleted"
                },
                {
                    value: "StockIn",
                    label: "Stock In",
                },
                {
                    value: "StockOut",
                    label: "Stock Out",
                },
            ]

        },
        {
            key: "startDate",
            type: "date",
            placeholder: "Start Date"
        },
        {
            key: "endDate",
            type: "date",
            placeholder: "End Date"
        }
    ]
    return (
        <div className="max-w-7xl mx-auto p-6 mt-8 ">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 ml-3">
                <div className="inline-flex items-center gap-3 group">
                    <Activity className="w-8 h-8 text-indigo-600 group-hover:scale-x-150 group-hover:translate-x-0.5 transition transform duration-300" />
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 group-hover:translate-x-2 transition transform duration-300">Audit Trail</h2>
                        <p className="text-gray-500 mt-1 group-hover:translate-x-2 transition transform duration-300">Track every stock change across the system.</p>
                    </div>
                </div>

                <div
                    className="relative inline-block group self-start sm:self-auto"
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                >
                    <button
                        className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-10 py-3 shadow-md transition-all duration-300 ${open ? "rounded-t-xl rounded-b-none" : "rounded-xl"}`}
                    >
                        Export Logs
                        <ChevronDown
                            size={18}
                            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                        />
                    </button>

                    <div className="absolute left-0 top-full w-full z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                        <button
                            onClick={() => handleExportTransactions(exportTransactionsToExcel)}
                            className={`flex items-center gap-4 w-full bg-white px-4 py-3 text-left border-x hover:bg-gray-100 border-gray-200 transition-all duration-300  ${open
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-3 pointer-events-none"
                                } `}
                        >
                            <FileSpreadsheet className="text-green-600" size={20} />
                            <div className="text-left">
                                <p className="font-medium text-md text-gray-800">Export to Excel</p>
                                <p className="text-xs text-gray-500">
                                    Download sheets
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleExportTransactions(exportTransactionsToCSV)}
                            className={`flex items-center gap-4 w-full bg-white px-4 py-3 text-left border-x hover:bg-gray-100 border-gray-200 transition-all duration-300 delay-75 ${open
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-3 pointer-events-none"
                                }`}
                        >
                            <FileText className="text-blue-600" size={20} />
                            <div className="text-left">
                                <p className="font-medium text-gray-800">Export to CSV</p>
                                <p className="text-xs text-gray-500">
                                    Universal data format
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleExportTransactions(exportTransactionsToPDF)}
                            className={`flex items-center gap-4 w-full bg-white px-4 py-3 text-left border-x border-gray-200 hover:bg-gray-100 transition-all duration-300 delay-150 ${open
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-3 pointer-events-none"
                                }`}
                        >
                            <File className="text-red-600" size={20} />
                            <div className="text-left">
                                <p className="font-medium text-gray-800">Export to PDF</p>
                                <p className="text-xs text-gray-500">
                                    Shareable document
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <DataTable
                data={transactions}
                columns={columns}
                filters={filters}
                filterConfig={filterConfig}
                onFilterChange={handleFilterChange}
                onInstantFilterChange={handleInstantFilterChange}
                onFilterApply={handleFilterApply}
                onPageSizeChange={setPageSize}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                pageSize={pageSize}
                loading={loading}
                emptyMessage="No transactions found."
            />

        </div>
    );
};

export default Transactions;
