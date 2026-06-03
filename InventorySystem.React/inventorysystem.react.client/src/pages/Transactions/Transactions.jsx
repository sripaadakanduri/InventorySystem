import React, { useState, useEffect } from 'react';
import transactionService from '../../services/transactionService';
import Pagination from '../../components/Pagination/Pagination';
import InlineNotification from '../../components/InlineNotification/InlineNotification';
import TableSkeleton from '../../components/TableSkeleton/TableSkeleton';
import useDebouncedEffect from '../../hooks/useDebouncedEffect';
import { Activity } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        username: "",
        product: "",
        actionType: "",
        startDate: "",
        endDate: ""
    });
    const [notification, setNotification] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

    const fetchTransactions = async (activeFilters = filters) => {
        try {
            setLoading(true);

            const data =
                await transactionService.getTransactions(activeFilters);

            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setNotification({
                type: "error",
                message: "Failed to load transactions."
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    useDebouncedEffect(() => {
        fetchTransactions(filters);
    }, [filters.username, filters.product], 400);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });

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

    const getBadgeStyle = (actionType) => {
        if (actionType === "StockIn" || actionType === "ManualAdd") return "bg-green-50 text-green-700 border-green-200";
        if (actionType === "StockOut" || actionType === "ManualRemove") return "bg-red-50 text-red-700 border-red-200";
        if (actionType === "ProductDeleted") return "bg-rose-50 text-rose-700 border-rose-200";
        if (actionType === "OrderPlaced") return "bg-amber-50 text-amber-700 border-amber-200";
        if (actionType === "OrderCancelled") return "bg-gray-100 text-gray-700 border-gray-200";
        return "bg-blue-50 text-blue-700 border-blue-200";
    };

    return (
        <div className="max-w-7xl mx-auto p-6 mt-8 ">
            <div className="inline-flex items-center gap-3 mb-8 group">
                <Activity className="w-8 h-8 text-indigo-600 group-hover:scale-x-150 group-hover:translate-x-0.5 transition transform duration-300" />
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 group-hover:translate-x-2 transition transform duration-300">Audit Trail</h2>
                    <p className="text-gray-500 mt-1 group-hover:translate-x-2 transition transform duration-300">Track every stock change across the system.</p>
                </div>
            </div>

            <InlineNotification
                notification={notification}
                onClose={() => setNotification(null)}
            />

            <div className="w-full overflow-x-auto rounded-3xl shadow-lg bg-white mt-6">
                <table className="w-full border-collapse">
                    <thead className="bg-blue-50 text-gray-700 ">
                        <tr>
                            <th className="p-4 text-center font-semibold border-b border-gray-200">Username</th>
                            <th className="p-4 text-center font-semibold border-b border-gray-200">Product Name</th>
                            <th className="p-4 text-center font-semibold border-b border-gray-200">Change</th>
                            <th className="p-4 text-center font-semibold border-b border-gray-200">Stock</th>
                            <th className="p-4 text-center font-semibold border-b border-gray-200">Action Type</th>
                            <th className="p-4 text-center font-semibold border-b border-gray-200">Date & Time</th>
                        </tr>
                        <tr>
                            <th className="p-2 px-4">
                                <div className="flex justify-center">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Filter user..."
                                        value={filters.username}
                                        onChange={handleFilterChange}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                    />
                                </div>
                            </th>
                            <th className="p-2 px-4">
                                <div className="flex justify-center">
                                    <input
                                        type="text"
                                        name="product"
                                        placeholder="Filter product..."
                                        value={filters.product}
                                        onChange={handleFilterChange}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                    />
                                </div>
                            </th>
                            <th className="p-2 px-4"></th>
                            <th className="p-2 px-4"></th>
                            <th className="p-2 px-4">
                                <div className="flex justify-center">
                                    <select
                                        name="actionType"
                                        value={filters.actionType}
                                        onChange={handleInstantFilterChange}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                    >
                                        <option value="">All</option>
                                        <option value="ManualAdd">ManualAdd</option>
                                        <option value="ManualRemove">ManualRemove</option>
                                        <option value="OrderPlaced">OrderPlaced</option>
                                        <option value="OrderCancelled">OrderCancelled</option>
                                        <option value="ProductDeleted">ProductDeleted</option>
                                    </select>
                                </div>
                            </th>
                            <th className="p-2 px-4">
                                <div className="flex flex-col gap-2 justify-center items-center">
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleInstantFilterChange}
                                        className="border border-gray-300 rounded-lg px-2 py-1 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-[140px]"
                                        title="Start Date"
                                    />
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={filters.endDate}
                                        onChange={handleInstantFilterChange}
                                        className="border border-gray-300 rounded-lg px-2 py-1 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-[140px]"
                                        title="End Date"
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <TableSkeleton columns={6} />
                        ) : currentTransactions.length > 0 ? (
                            currentTransactions.map(t => (
                                <tr key={t.id} className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer hover:translate-0.5 transform transition duration-150">
                                    <td className="p-4 text-center font-medium text-gray-900">{(t.user?.username.charAt(0).toUpperCase() + t.user?.username.slice(1)) || `User ${t.userId}`}</td>
                                    <td className="p-4 text-center text-gray-700">{t.product?.name || `Product ${t.productId}`}</td>
                                    <td className="p-4 text-center font-bold">
                                        <span className={t.quantityChanged > 0 ? 'text-green-600' : 'text-red-600'}>
                                            {t.quantityChanged > 0 ? `+${t.quantityChanged}` : t.quantityChanged}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-gray-600 font-medium">{t.remainingStock}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getBadgeStyle(t.actionType)}`}>
                                            {t.actionType}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-gray-500 text-sm">{new Date(t.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500 text-lg">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="p-4 bg-white rounded-b-3xl">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={transactions.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                    />
                </div>
            </div>
        </div>
    );
};

export default Transactions;
