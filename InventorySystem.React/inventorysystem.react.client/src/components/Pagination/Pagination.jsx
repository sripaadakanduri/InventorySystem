import "./Pagination.css";

function Pagination({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
}) {
    const totalPages = Math.ceil(
        totalItems / pageSize
    );

    if (totalPages <= 1) {
        return null;
    }

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination-container">


            <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() =>
                    onPageChange(currentPage - 1)
                }
            >
                Prev
            </button>

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

            {/* Next Button */}
            <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() =>
                    onPageChange(currentPage + 1)
                }
            >
                Next
            </button>

        </div>
    );
}

export default Pagination;