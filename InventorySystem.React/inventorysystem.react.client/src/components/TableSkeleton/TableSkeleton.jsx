function TableSkeleton({ columns = 4, rows = 6 }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-200">
                    {Array.from({ length: columns }).map((__, columnIndex) => (
                        <td key={columnIndex} className="p-4">
                            <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

export default TableSkeleton;
