function FilterRenderer({
    filter,
    value,
    onChange,
    onApply,
    onKeyDown
}) {

    const handleChange = (e) => {
        onChange?.(e);
    };

    switch (filter.type) {

        case "text":

            return (
                <div className="flex justify-center">
                    <input
                        type="text"
                        name={filter.key}
                        value={value ?? ""}
                        placeholder={filter.placeholder ?? ""}
                        onChange={handleChange}
                        onKeyDown={onKeyDown}
                        className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter.className ?? "w-32"}`}
                    />
                </div>
            );

        case "number":

            return (
                <div className="flex justify-center">
                    <input
                        type="number"
                        name={filter.key}
                        value={value ?? ""}
                        placeholder={filter.placeholder ?? ""}
                        onChange={handleChange}
                        onKeyDown={onKeyDown}
                        className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter.className ?? "w-32"}`}
                    />
                </div>
            );

        case "select":

            return (
                <div className="flex justify-center">
                    <select
                        name={filter.key}
                        value={value ?? ""}
                        onChange={handleChange}
                        className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter.className ?? "w-32"}`}
                    >
                        {(filter.options ?? []).map(option => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            );

        case "date":

            return (
                <div className="flex justify-center">
                    <input
                        type="date"
                        name={filter.key}
                        value={value ?? ""}
                        onChange={handleChange}
                        className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter.className ?? "w-36"}`}
                    />
                </div>
            );
        case "date-range":

            return (
                <div className="flex flex-col items-center gap-2">
                    <input
                        type="date"
                        name={filter.startKey}
                        value={value?.start ?? ""}
                        onChange={(e) =>
                            onChange?.({
                                target: {
                                    name: filter.startKey,
                                    value: e.target.value
                                }
                            })
                        }
                        className={`border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter.className ?? "w-36"}`}
                    />

                    <input
                        type="date"
                        name={filter.endKey}
                        value={value?.end ?? ""}
                        onChange={(e) =>
                            onChange?.({
                                target: {
                                    name: filter.endKey,
                                    value: e.target.value
                                }
                            })
                        }
                        className={`border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter.className ?? "w-36"}`}
                    />
                </div>
            );

        case "checkbox":

            return (
                <div className="flex justify-center items-center">
                    <input
                        type="checkbox"
                        name={filter.key}
                        checked={Boolean(value)}
                        onChange={(e) =>
                            onChange?.({
                                target: {
                                    name: filter.key,
                                    value: e.target.checked
                                }
                            })
                        }
                        className="h-4 w-4 rounded border-gray-300"
                    />
                </div>
            );

        case "currency":

            return (
                <div className="flex justify-center">
                    <select
                        name={filter.key}
                        value={value ?? ""}
                        onChange={handleChange}
                        className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter.className ?? "w-36"}`}
                    >
                        {(filter.currencies ?? []).map(currency => (
                            <option
                                key={currency.code}
                                value={currency.code}
                            >
                                {currency.code} - {currency.name}
                            </option>
                        ))}
                    </select>
                </div>
            );

        case "custom":

            return filter.render({
                filter,
                value,
                onChange,
                onApply
            });

        default:

            return null;

    }

}

export default FilterRenderer;