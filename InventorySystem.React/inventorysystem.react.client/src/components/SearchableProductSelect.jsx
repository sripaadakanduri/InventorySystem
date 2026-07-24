import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

function SearchableProductSelect({
    value,
    onChange,
    products,
    placeholder = "Select Product",
    className = "",
    disabled = false,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setIsOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedProduct = products.find(
        (p) => String(p.id) === String(value)
    );

    return (
        <div
            className={`relative w-full ${className}`}
            ref={dropdownRef}
        >
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full border-1 border-gray-300 rounded-lg px-3 py-2 bg-white flex justify-between items-center cursor-pointer text-gray-900
                    }`}
                disabled={disabled}
            >
                <span className="truncate">
                    {selectedProduct?.name || placeholder}
                </span>

                <ChevronDown className="w-4 h-4" />
            </div>

            {isOpen && (
                <div className="absolute z-20 w-full bg-white border-1 border-gray-200 rounded-md shadow-lg">
                    <div className="p-2 border-b border-gray-200">
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            placeholder="Search..."
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full border rounded-md px-2 py-1"
                        />
                    </div>

                    <ul className="max-h-52 overflow-auto">
                        {filteredProducts.length ? (
                            filteredProducts.map((product) => (
                                <li
                                    key={product.id}
                                    onClick={() => {
                                        onChange(product.id);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                >
                                    {product.name}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-center text-gray-500">
                                No products found
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchableProductSelect;