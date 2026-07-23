function TableBody({
    rows = [],
    columns = [],
    getRowKey = (row) => row.id,
    onRowClick,
    rowClassName
}) {

    return (
        <tbody>
            {
                rows.map((row, rowIndex) => {
                    const className = typeof rowClassName === "function"
                        ? rowClassName(row, rowIndex)
                        : rowClassName;

                    return (
                        <tr
                            key={getRowKey(row, rowIndex)}
                            className={`
                                border-b border-gray-100 transition
                                ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                                ${className || ""}
                            `}
                            onClick={() => onRowClick?.(row, rowIndex)}
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className="text-center px-4 py-3 text-sm text-gray-700"
                                >
                                    {column.render
                                        ? column.render(row[column.key], row)
                                        : row[column.key]}
                                                                </td>
                            ))}
                        </tr>
                    );
                })
            }
        </tbody>
    );

}

export default TableBody;
