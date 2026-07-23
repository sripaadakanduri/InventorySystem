import FilterRenderer from "./FilterRenderer";

function TableHeader({
    columns = [],
    filters = {},
    filterConfig = [],
    onFilterChange,
    onInstantFilterChange,
    onFilterApply,
    handleFilterKeyDown
}) {

    const getFilter = (key) => {
        return filterConfig.find(f => f.key === key);
    };

    return (
        <thead
            className={`
                bg-blue-50
                text-gray-700
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
                                        value={
                                            filter.type === "date-range"
                                                ? {
                                                    [filter.startKey]: filters[filter.startKey],
                                                    [filter.endKey]: filters[filter.endKey],
                                                }
                                                : filters[filter.key]
                                        }
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
