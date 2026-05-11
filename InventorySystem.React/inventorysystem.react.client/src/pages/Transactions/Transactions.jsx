import React, { useState, useEffect } from 'react';
import transactionService from '../../services/transactionService';
import './Transactions.css';
import { toast } from 'react-toastify';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <h2>Audit Trail / Transactions</h2>
                <p>Track every stock change across the system.</p>
            </div>

            <div className="transactions-list">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>Change</th>
                            <th>Remaining Stock</th>
                            <th>Action Type</th>
                            <th>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id}>
                                <td>#{t.id}</td>
                                <td>{t.product?.name || `Product ${t.productId}`}</td>
                                <td className={t.quantityChanged > 0 ? 'text-success' : 'text-danger'}>
                                    {t.quantityChanged > 0 ? `+${t.quantityChanged}` : t.quantityChanged}
                                </td>
                                <td>{t.remainingStock}</td>
                                <td><span className={`badge ${getBadgeClass(t.actionType)}`}>{t.actionType}</span></td>
                                <td>{new Date(t.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="6" className="no-data">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
