function LoadingState({
    colSpan,
    message = "Loading..."
}) {

    return (
        <tbody>
            <tr>
                <td
                    colSpan={colSpan}
                    className="p-8 text-center"
                >
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-600">
                            {message}
                        </span>
                    </div>
                </td>
            </tr>
        </tbody>
    );

}

export default LoadingState;