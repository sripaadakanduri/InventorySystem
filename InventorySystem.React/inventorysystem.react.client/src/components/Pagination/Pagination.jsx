import "./Pagination.css";

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

    const currentGroup =
        Math.ceil(currentPage / pagesPerGroup);

    const startPage =
        (currentGroup - 1) * pagesPerGroup + 1;

    const endPage = Math.min(
        startPage + pagesPerGroup - 1,
        totalPages
    );

    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (

        <div className="pagination-wrapper">

           

    
            <div className="pagination-container">

                {/* Prev */}
                <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() =>
                        onPageChange(currentPage - 1)
                    }
                >
                    Prev
                </button>

                {/* Previous Group */}
                {startPage > 1 && (

                    <button
                        className="pagination-btn"
                        onClick={() =>
                            onPageChange(startPage - 1)
                        }
                    >
                        ...
                    </button>

                )}

                {/* Page Numbers */}
                {pages.map((page) => (

                    <button
                        key={page}
                        className={
                            currentPage === page
                                ? "pagination-btn active"
                                : "pagination-btn"
                        }
                        onClick={() =>
                            onPageChange(page)
                        }
                    >
                        {page}
                    </button>

                ))}

                {/* Next Group */}
                {endPage < totalPages && (

                    <button
                        className="pagination-btn"
                        onClick={() =>
                            onPageChange(endPage + 1)
                        }
                    >
                        ...
                    </button>

                )}

                {/* Next */}
                <button
                    className="pagination-btn"
                    disabled={
                        currentPage === totalPages
                    }
                    onClick={() =>
                        onPageChange(currentPage + 1)
                    }
                >
                    Next
                </button>

            </div>

            <div className="page-size-selector">

                <label>
                    Rows per page:
                </label>

                <select
                    value={pageSize}
                    onChange={(e) => {
                        onPageSizeChange(
                            Number(e.target.value)
                        );

                        onPageChange(1);
                    }}
                >

                    <option value={5}>
                        5
                    </option>

                    <option value={10}>
                        10
                    </option>

                    <option value={25}>
                        25
                    </option>

                    <option value={50}>
                        50
                    </option>

                </select>

            </div>

        </div>

    );
}

export default Pagination;