import { useState, useEffect } from "react";
import api from "../../services/api";
import Pagination from "../Pagination/Pagination";
import TableSkeleton from "../TableSkeleton/TableSkeleton";
// import "./OrderList.css";

function OrderList({
    orders,
    onCancelOrder,
    onSelectForEdit,
    filters,
    onFilterChange,
    onKeyDown,
    onInstantFilterChange,
    isLoading
}) {

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [products, setProducts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [pageSize, setPageSize] =
        useState(10);
    
    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const response =
                    await api.get("/products");

                setProducts(response.data);

            }
            catch (err) {

                console.error(err);

            }

        }
        fetchProducts();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [orders]);

    const indexOfLastOrder =
        currentPage * pageSize;

    const indexOfFirstOrder =
        indexOfLastOrder - pageSize;

    const currentOrders =
        orders.slice(
            indexOfFirstOrder,
            indexOfLastOrder
        );



    const getStatusText = (status) => {

        switch (status) {

            case 1:
                return "Pending";

            case 2:
                return "Confirmed";

            case 3:
                return "Failed";

            case 4:
                return "Cancelled";
            case 5:
                return "Updated..";

            default:
                return "Unknown";

        }

    };



    const openViewModal = (order) => {

        setSelectedOrder(order);

    };



    return (

        <div className="w-full overflow-x-auto rounded-3xl border border-gray-200 shadow-lg bg-white">

            <table className="w-full border-separate border-spacing-0 rounded-3xl">

                {/* Table Header */}
                <thead className="bg-blue-50 text-gray-700">
                    <tr className="border-b border-gray-200">
                        <th className="p-4 text-center font-semibold border-b border-gray-200">User</th>
                        <th className="p-4 text-center font-semibold border-b border-gray-200">Total</th>
                        <th className="p-4 text-center font-semibold border-b border-gray-200">Quantity</th>
                        <th className="p-4 text-center font-semibold border-b border-gray-200">Status</th>
                        <th className="p-4 text-center font-semibold border-b border-gray-200">Created</th>
                    </tr>
                    <tr>
                        <th className="p-2 px-4">
                            <div className="flex justify-center">
                                <input
                                    type="text"
                                    name="user"
                                    placeholder="Filter User..."
                                    value={filters.user}
                                    onChange={onFilterChange}
                                    onKeyDown={onKeyDown}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                />
                            </div>
                        </th>
                        <th className="p-2 px-4"></th>
                        <th className="p-2 px-4"></th>
                        <th className="p-2 px-4">
                            <div className="flex justify-center">
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={onInstantFilterChange}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="1">Pending</option>
                                    <option value="2">Confirmed</option>
                                    <option value="3">Failed</option>
                                    <option value="4">Cancelled</option>
                                    <option value="5">Updated</option>
                                </select>
                            </div>
                        </th>
                        <th className="p-2 px-4">
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <input
                                    type="date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={onInstantFilterChange}                                    
                                    onKeyDown={onKeyDown}
                                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-[140px]"
                                />
                                <input
                                    type="date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={onInstantFilterChange}
                                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-[140px]"
                                />
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {isLoading ? (
                        <TableSkeleton columns={5} />
                    ) : currentOrders.length > 0 ? (

                        currentOrders.map((order) => (

                            <tr
                                key={order.id}
                                onClick={() =>
                                    openViewModal(order)
                                }
                                className="hover:bg-gray-50 hover:translate-0.5 cursor-pointer transition transform duration-150 border border-gray-200 items-center  justify-center"
                            >

                                <td className="p-4 text-center">
                                    {order.username.charAt(0).toUpperCase() + order.username.slice(1)}
                                </td>

                                <td className="p-4 font-medium text-black-600 text-center">
                                    ${order.totalAmount}
                                </td>

                                <td className="p-4 text-center">
                                    {order.totalQuantity}
                                </td>

                                <td className="p-4 text-center">

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium
                ${order.status === 1
                                                ? "bg-yellow-100 text-yellow-700"
                                                : order.status === 2
                                                    ? "bg-green-50 text-green-700"
                                                    : order.status === 3
                                                        ? "bg-red-100 text-red-700"
                                                        : order.status === 4
                                                            ? "bg-gray-200 text-gray-700"
                                                            : "bg-blue-50 text-blue-700"
                                            }`}
                                    >
                                        {getStatusText(order.status)}
                                    </span>

                                </td>

                                <td className="p-4 text-gray-600 text-center">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleString()}
                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan="5"
                                className="text-center py-8 text-gray-500"
                            >
                                No Orders Found
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

            <div className="p-4">

                <Pagination
                    currentPage={currentPage}
                    totalItems={orders.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                />

            </div>


            {selectedOrder && (

                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setSelectedOrder(null)}
                >

                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* Header */}
                        <div className="flex items-center justify-between border-b pb-4 mb-6">

                            <h3 className="text-2xl font-bold text-gray-800">

                                Order #{selectedOrder.id}

                            </h3>

                            <button
                                className="text-gray-500 hover:text-red-500 text-2xl font-bold"
                                onClick={() =>
                                    setSelectedOrder(null)
                                }
                            >
                                ✕
                            </button>

                        </div>

                        {/* Product Table */}
                        <div className="overflow-x-auto">

                            <table className="w-full border border-gray-200 rounded-xl overflow-hidden">

                                <thead className="bg-blue-50">

                                    <tr>

                                        <th className="text-left p-4 border-gray-200">
                                            Product
                                        </th>

                                        <th className="text-left p-4 border-gray-200">
                                            Quantity
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {selectedOrder.items.map((item, idx) => {

                                        const prod =
                                            products.find(
                                                (p) =>
                                                    p.id === item.productId
                                            );

                                        return (

                                            <tr
                                                key={idx}
                                                className="border-b border-gray-200 hover:bg-gray-100 transition transform duration-300"
                                            >

                                                <td className="p-4">

                                                    {prod
                                                        ? prod.name
                                                        : `Product #${item.productId}`}

                                                </td>

                                                <td className="p-4">
                                                    {item.quantity}
                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                        <div className="flex justify-end gap-4 mt-6">

                            {selectedOrder.status !== 4 && (

                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-600 text-white shadow-xl px-6 py-3 rounded-xl transition"
                                    onClick={() => {

                                        onSelectForEdit(
                                            selectedOrder
                                        );

                                        setSelectedOrder(null);

                                    }}
                                >
                                    Update Order
                                </button>

                            )}

                            {selectedOrder.status !== 4 && (

                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-600 text-white shadow-xl px-6 py-3 rounded-xl transition"
                                    onClick={() => {

                                        onCancelOrder(
                                            selectedOrder.id
                                        );

                                        setSelectedOrder(null);

                                    }}
                                >
                                    Cancel Order
                                </button>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>


    );

}

export default OrderList;
