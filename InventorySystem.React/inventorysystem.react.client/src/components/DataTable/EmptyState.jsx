function EmptyState({ message, colSpan }) {
    return (
        <tbody>
            <tr>
                <td
                    colSpan={colSpan}
                    className="h-64 text-center align-middle"
                >
                    <p className="text-3xl font-bold text-gray-800">
                        {message}
                    </p>
                </td>
            </tr>
        </tbody>
    );
}

export default EmptyState;