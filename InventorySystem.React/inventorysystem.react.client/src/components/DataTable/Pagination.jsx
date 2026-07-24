import { PAGINATION } from "./paginationConfig";
function Pagination({
    currentPage,
    totalItems = 0,
    pageSize,
    onPageChange,
    onPageSizeChange
}) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const changePage = (page) => {
        const nextPage = Math.min(Math.max(page, 1), totalPages);
        onPageChange?.(nextPage);
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {totalItems}
            </p>

            <div className="flex items-center gap-3">
                <select
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                >
                    {PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>

                <div className="flex items-center gap-2">
                    <button
                        className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        Previous
                    </button>
                    <p className="inline-flex items-center gap-1 whitespace-nowrap text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </p>
                    <button
                        className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Pagination;
