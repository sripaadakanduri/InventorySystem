import React, { useState, useEffect } from 'react';
import transactionService from '../../services/transactionService';
import Pagination from '../../components/Pagination/Pagination';
import './Transactions.css';
import { toast } from 'react-toastify';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterUsername, setFilterUsername] = useState("");
    const [filterProduct, setFilterProduct] = useState("");
    const [filterActionType, setFilterActionType] = useState("");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [products, setProducts] = useState([]);

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

    const getBadgeClass = (actionType) => {
        if (actionType === "StockIn" || actionType === "ManualAdd") return "badge-success";
        if (actionType === "StockOut" || actionType === "ManualRemove") return "badge-danger";
        if (actionType === "OrderPlaced") return "badge-warning";
        return "badge-primary";
    };

    if (loading) return <div className="loading">Loading transaction history...</div>;

    return (
        <div className="transactions-container">
            <div className="transactions-header">
                <h2>Audit Trail </h2>
                <p>Track every stock change across the system.</p>
            </div>

            <div className="transactions-list">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>
                                UserName
                                <br />
                                <input
                                    type="text"
                                    placeholder="Filter user..."
                                    value={filterUsername}
                                    onChange={(e) => { setFilterUsername(e.target.value); setCurrentPage(1); }}
                                    className="table-filter-input"
                                />
                            </th>
                            <th>
                                Product Name
                                <br />
                                <input
                                    type="text"
                                    placeholder="Filter product..."
                                    value={filterProduct}
                                    onChange={(e) => { setFilterProduct(e.target.value); setCurrentPage(1); }}
                                    className="table-filter-input"
                                />
                            </th>
                            <th>Change</th>
                            <th>Remaining Stock</th>
                            <th>
                                Action Type
                                <br />
                                <select
                                    value={filterActionType}
                                    onChange={(e) => { setFilterActionType(e.target.value); setCurrentPage(1); }}
                                    className="table-filter-select"
                                >
                                    <option value="">All</option>
                                    <option value="ManualAdd">ManualAdd</option>
                                    <option value="ManualRemove">ManualRemove</option>
                                    <option value="OrderPlaced">OrderPlaced</option>
                                    <option value="OrderCancelled">OrderCancelled</option>
                                </select>
                            </th>
                            <th>
                                Date & Time
                                <div className="date-filters-container">
                                    <input
                                        type="date"
                                        value={filterStartDate}
                                        onChange={(e) => { setFilterStartDate(e.target.value); setCurrentPage(1); }}
                                        className="date-filter-input"
                                        title="Start Date"
                                    />
                                    <input
                                        type="date"
                                        value={filterEndDate}
                                        onChange={(e) => { setFilterEndDate(e.target.value); setCurrentPage(1); }}
                                        className="date-filter-input"
                                        title="End Date"
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.map(t => (
                            <tr key={t.id}>
                                <td>{t.user?.username || `User ${t.userId}`}</td>
                                <td>{t.product?.name || `Product ${t.productId}`}</td>
                                <td className={t.quantityChanged > 0 ? 'text-success' : 'text-danger'}>
                                    {t.quantityChanged > 0 ? `+${t.quantityChanged}` : t.quantityChanged}
                                </td>
                                <td>{t.remainingStock}</td>
                                <td><span className={`badge ${getBadgeClass(t.actionType)}`}>{t.actionType}</span></td>
                                <td>{new Date(t.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {currentTransactions.length === 0 && (
                            <tr>
                                <td colSpan="6" className="no-data">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={filteredTransactions.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Transactions;
