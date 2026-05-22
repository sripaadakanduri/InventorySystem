function Pagination({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange
}) {

    const totalPages = Math.ceil(
        totalItems / pageSize
    );

    if (totalPages <= 1 && totalItems <= pageSize) {
        return null;
    }

    const pagesPerGroup = 5;
    const currentGroup = Math.ceil(currentPage / pagesPerGroup);
    const startPage = (currentGroup - 1) * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 py-2 gap-4 w-full">
            <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-600">
                    Rows per page:
                </label>
                <select
                    value={pageSize}
                    onChange={(e) => {
                        onPageSizeChange(Number(e.target.value));
                        onPageChange(1);
                    }}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors cursor-pointer shadow-sm appearance-none outline-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto', paddingRight: '2rem' }}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <button
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Prev
                </button>

                {startPage > 1 && (
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all shadow-sm"
                        onClick={() => onPageChange(startPage - 1)}
                    >
                        ...
                    </button>
                )}

                {pages.map((page) => (
                    <button
                        key={page}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 shadow-sm ${currentPage === page
                                ? "bg-blue-600 text-white border border-blue-600 shadow-blue-500/40 ring-2 ring-blue-600/20"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all shadow-sm"
                        onClick={() => onPageChange(endPage + 1)}
                    >
                        ...
                    </button>
                )}

                <button
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Pagination;