import { useEffect, useMemo, useState } from "react";
import { getAllCurrencySymbols } from "../services/CurrencySymbolService";

const getCurrencyDisplay = (currency, code) => {
    if (!currency) {
        return { code, name: code, symbol: code };
    }

    if (typeof currency === "string") {
        return { code, name: currency, symbol: currency };
    }

    return {
        code: currency.code || code,
        name: currency.name || code,
        symbol: currency.symbol || currency.code || code,
    };
};

const CurrencySelector = ({
    selectedCurrency,
    onCurrencyChange,
    disabled = false,
    className = "",
    selectClassName = "",
    placeholder = "Select Currency",
    onCurrencyDetailsChange,
}) => {
    const [currencies, setCurrencies] = useState({});

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const data = await getAllCurrencySymbols();
                setCurrencies(data);
            } catch (error) {
                console.error("Error fetching currencies:", error);
            }
        };

        fetchCurrencies();
    }, []);

    const selectedCurrencyDetails = useMemo(() => {
        if (!selectedCurrency) {
            return null;
        }

        return getCurrencyDisplay(currencies[selectedCurrency], selectedCurrency);
    }, [currencies, selectedCurrency]);

    useEffect(() => {
        onCurrencyDetailsChange?.(selectedCurrencyDetails);
    }, [onCurrencyDetailsChange, selectedCurrencyDetails]);

    return (
        <div className={`flex items-center gap-4 ${className}`}>
            <select
                id="currency"
                value={selectedCurrency ?? ""}
                onChange={(e) => onCurrencyChange(e.target.value)}
                disabled={disabled}
                className={`font-medium rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    disabled
                        ? "cursor-not-allowed bg-gray-100 text-gray-500"
                        : "bg-white text-gray-700"
                } ${selectClassName}`}
            >
                <option value="">{placeholder}</option>
                {Object.entries(currencies).map(([code, currency]) => {
                    const display = getCurrencyDisplay(currency, code);

                    return (
                        <option key={code} value={code}>
                            {display.code} - {display.name}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default CurrencySelector;
