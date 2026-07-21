import FilterRenderer from "./FilterRenderer";

function TableHeader({
    columns = [],
    filters = {},
    filterConfig = [],
    onFilterChange,
    onInstantFilterChange,
    onFilterApply,
    handleFilterKeyDown,
    stickyHeader = false
}) {

    const getFilter = (key) => {
        return filterConfig.find(f => f.key === key);
    };

    return (
        <thead
            className={`
                bg-blue-50
                text-gray-700
                ${stickyHeader ? "sticky top-0 z-20" : ""}
            `}
        >
            <tr>
                {columns.map(column => (
                    <th
                        key={column.key}
                        style={{ width: column.width }}
                        className={`
                            p-4
                            border-b
                            border-gray-200
                            font-semibold
                            text-center
                            ${column.headerClassName ?? ""}
                        `}
                    >
                        {column.title}
                    </th>
                ))}
            </tr>

            {/* =========================
                    FILTER ROW
            ========================= */}

            {filterConfig.length > 0 && (
                <tr>
                    {columns.map((column) => {
                        const filter = getFilter(column.key);

                        return (
                            <th
                                key={column.key}
                                className="
                                    p-2
                                    border-b
                                    border-gray-200
                                "
                            >
                                {filter ? (
                                    <FilterRenderer
                                        filter={filter}
                                        value={filters[filter.key]}
                                        onChange={
                                            filter.instant
                                                ? onInstantFilterChange
                                                : onFilterChange
                                        }
                                        onApply={onFilterApply}
                                        onKeyDown={handleFilterKeyDown}
                                    />
                                ) : null}
                            </th>
                        );
                    })}
                </tr>
            )}
        </thead>
    );
}

export default TableHeader;