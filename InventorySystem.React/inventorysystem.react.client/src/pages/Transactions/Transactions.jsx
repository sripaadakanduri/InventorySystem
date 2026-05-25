import React, { useState, useEffect } from 'react';
import transactionService from '../../services/transactionService';
import Pagination from '../../components/Pagination/Pagination';
import { toast } from 'react-toastify';
import { Activity } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterUsername, setFilterUsername] = useState("");
    const [filterProduct, setFilterProduct] = useState("");
    const [filterActionType, setFilterActionType] = useState("");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    let filteredTransactions = [...transactions];

    if (filterUsername) {
        filteredTransactions = filteredTransactions.filter(t =>
            (t.user?.username || `User ${t.userId}`).toLowerCase().includes(filterUsername.toLowerCase())
        );
    }
    if (filterProduct) {
        filteredTransactions = filteredTransactions.filter(t =>
            (t.product?.name || `Product ${t.productId}`).toLowerCase().includes(filterProduct.toLowerCase())
        );
    }
    if (filterActionType) {
        filteredTransactions = filteredTransactions.filter(t =>
            t.actionType.toLowerCase().includes(filterActionType.toLowerCase())
        );
    }
    if (filterStartDate) {
        filteredTransactions = filteredTransactions.filter(t => {
            const tDate = new Date(t.createdAt);
            const sDate = new Date(filterStartDate);
            return tDate >= sDate;
        });
    }
    if (filterEndDate) {
        filteredTransactions = filteredTransactions.filter(t => {
            const tDate = new Date(t.createdAt);
            const eDate = new Date(filterEndDate);
            eDate.setHours(23, 59, 59, 999);
            return tDate <= eDate;
        });
    }

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await transactionService.getTransactions();
                setTransactions(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                toast.error("Failed to load transactions.");
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const getBadgeStyle = (actionType) => {
        if (actionType === "StockIn" || actionType === "ManualAdd") return "bg-green-50 text-green-700 border-green-200";
        if (actionType === "StockOut" || actionType === "ManualRemove") return "bg-red-50 text-red-700 border-red-200";
        if (actionType === "OrderPlaced") return "bg-amber-50 text-amber-700 border-amber-200";
        if (actionType === "OrderCancelled") return "bg-gray-100 text-gray-700 border-gray-200";
        return "bg-blue-50 text-blue-700 border-blue-200";
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6 mt-8 ">
            <div className="inline-flex items-center gap-3 mb-8 group">
                <Activity className="w-8 h-8 text-indigo-600 group-hover:scale-x-150 group-hover:translate-x-0.5 transition transform duration-300" />
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 group-hover:translate-x-2 transition transform duration-300">Audit Trail</h2>
                    <p className="text-gray-500 mt-1 group-hover:translate-x-2 transition transform duration-300">Track every stock change across the system.</p>
                </div>
            </div>

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
                                        placeholder="Filter user..."
                                        value={filterUsername}
                                        onChange={(e) => { setFilterUsername(e.target.value); setCurrentPage(1); }}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                    />
                                </div>
                            </th>
                            <th className="p-2 px-4">
                                <div className="flex justify-center">
                                    <input
                                        type="text"
                                        placeholder="Filter product..."
                                        value={filterProduct}
                                        onChange={(e) => { setFilterProduct(e.target.value); setCurrentPage(1); }}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                    />
                                </div>
                            </th>
                            <th className="p-2 px-4">--</th>
                            <th className="p-2 px-4">--</th>
                            <th className="p-2 px-4">
                                <div className="flex justify-center">
                                    <select
                                        value={filterActionType}
                                        onChange={(e) => { setFilterActionType(e.target.value); setCurrentPage(1); }}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                    >
                                        <option value="">All</option>
                                        <option value="ManualAdd">ManualAdd</option>
                                        <option value="ManualRemove">ManualRemove</option>
                                        <option value="OrderPlaced">OrderPlaced</option>
                                        <option value="OrderCancelled">OrderCancelled</option>
                                    </select>
                                </div>
                            </th>
                            <th className="p-2 px-4">
                                <div className="flex flex-col gap-2 justify-center items-center">
                                    <input
                                        type="date"
                                        value={filterStartDate}
                                        onChange={(e) => { setFilterStartDate(e.target.value); setCurrentPage(1); }}
                                        className="border border-gray-300 rounded-lg px-2 py-1 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-[140px]"
                                        title="Start Date"
                                    />
                                    <input
                                        type="date"
                                        value={filterEndDate}
                                        onChange={(e) => { setFilterEndDate(e.target.value); setCurrentPage(1); }}
                                        className="border border-gray-300 rounded-lg px-2 py-1 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-[140px]"
                                        title="End Date"
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.length > 0 ? (
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
                        totalItems={filteredTransactions.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Transactions;
