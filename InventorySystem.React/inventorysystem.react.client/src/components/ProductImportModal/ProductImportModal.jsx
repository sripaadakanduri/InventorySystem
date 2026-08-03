import { useState } from "react";
import { toast } from "react-toastify";
import { Download, Upload } from "lucide-react";
import { importProducts } from "../../services/ProductService";

const parseCsvLine = (line) => {
    const values = [];
    let currentValue = "";
    let isQuoted = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === "\"" && isQuoted && nextChar === "\"") {
            currentValue += "\"";
            i++;
        } else if (char === "\"") {
            isQuoted = !isQuoted;
        } else if (char === "," && !isQuoted) {
            values.push(currentValue);
            currentValue = "";
        } else {
            currentValue += char;
        }
    }

    values.push(currentValue);
    return values;
};

const parseProductsCsv = (csvText) => {
    const lines = csvText
        .split(/\r?\n/)
        .filter((line) => line.trim());

    if (lines.length <= 1) {
        return [];
    }

    const headers = parseCsvLine(lines[0]).map((header) => header.trim());

    return lines.slice(1).map((line) => {
        const values = parseCsvLine(line);
        const row = {};

        headers.forEach((header, index) => {
            row[header] = values[index] ?? "";
        });

        return row;
    });
};

const getProductImportKey = (product) => {
    return [
        product.Name,
        product.Price,
        product.StockQuantity,
        product.Category
    ].map((value) => String(value ?? "").trim().toLowerCase()).join("|");
};

const escapeCsvValue = (value) => {
    const stringValue = String(value ?? "");

    if (stringValue.includes(",") || stringValue.includes("\"") || stringValue.includes("\n")) {
        return `"${stringValue.replaceAll("\"", "\"\"")}"`;
    }

    return stringValue;
};

const buildProductsCsv = (products) => {
    const headers = ["Name", "Price", "StockQuantity", "Category"];
    const rows = products.map((product) => [
        product.Name,
        product.Price,
        product.StockQuantity,
        product.Category
    ]);

    return [
        headers.join(","),
        ...rows.map((row) => row.map(escapeCsvValue).join(","))
    ].join("\n");
};

function ProductRowsTable({ products, editable, onProductChange }) {
    if (products.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
                No products found.
            </div>
        );
    }

    return (
        <div className="max-h-80 overflow-auto rounded-2xl border border-gray-200">
            <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-blue-50 text-gray-700">
                    <tr>
                        <th className="p-3 text-left font-semibold">Name</th>
                        <th className="p-3 text-left font-semibold">Category</th>
                        <th className="p-3 text-right font-semibold">Price</th>
                        <th className="p-3 text-right font-semibold">Stock</th>
                        {editable && (
                            <th className="p-3 text-left font-semibold">Error</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index} className="border-t border-gray-200">
                            <td className="p-3 text-gray-900">
                                {editable ? (
                                    <input
                                        className="w-full rounded-lg border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={product.Name}
                                        onChange={(e) => onProductChange(index, "Name", e.target.value)}
                                    />
                                ) : product.Name}
                            </td>
                            <td className="p-3 text-gray-700">
                                {editable ? (
                                    <input
                                        className="w-full rounded-lg border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={product.Category}
                                        onChange={(e) => onProductChange(index, "Category", e.target.value)}
                                    />
                                ) : product.Category}
                            </td>
                            <td className="p-3 text-right text-gray-700">
                                {editable ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-28 rounded-lg border border-gray-300 px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={product.Price}
                                        onChange={(e) => onProductChange(index, "Price", e.target.value)}
                                    />
                                ) : product.Price}
                            </td>
                            <td className="p-3 text-right text-gray-700">
                                {editable ? (
                                    <input
                                        type="number"
                                        className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={product.StockQuantity}
                                        onChange={(e) => onProductChange(index, "StockQuantity", e.target.value)}
                                    />
                                ) : product.StockQuantity}
                            </td>
                            {editable && (
                                <td className="p-3 text-red-600">{product.ErrorMessage}</td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ProductImportModal({ onClose, onImported }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState("successful");

    const processImportResponse = async (file, response) => {
        const originalText = await file.text();
        const uploadedProducts = parseProductsCsv(originalText);
        const responseText = await response.data.text();
        const contentType = response.headers["content-type"] || "";
        const hasFailedCsv =
            responseText.trim() &&
            contentType.toLowerCase().includes("text/csv");

        const failedProducts = hasFailedCsv
            ? parseProductsCsv(responseText)
            : [];

        const failedCounts = failedProducts.reduce((counts, product) => {
            const key = getProductImportKey(product);
            counts.set(key, (counts.get(key) || 0) + 1);
            return counts;
        }, new Map());

        const successfulProducts = uploadedProducts.filter((product) => {
            const key = getProductImportKey(product);
            const count = failedCounts.get(key) || 0;

            if (count > 0) {
                failedCounts.set(key, count - 1);
                return false;
            }

            return true;
        });

        setResult((currentResult) => ({
            successfulProducts: [
                ...(currentResult?.successfulProducts || []),
                ...successfulProducts
            ],
            failedProducts,
            failedCsvText: hasFailedCsv ? responseText : ""
        }));
        setActiveTab(successfulProducts.length > 0 ? "successful" : "unsuccessful");

        if (successfulProducts.length > 0) {
            toast.success(`${successfulProducts.length} product${successfulProducts.length !== 1 ? "s" : ""} imported successfully`);
        }

        if (failedProducts.length > 0) {
            toast.error(`${failedProducts.length} product${failedProducts.length !== 1 ? "s" : ""} failed to import`);
        }
    };

    const handleFileSelect = (file) => {
        if (!file) return;

        if (file.name.endsWith(".csv")) {
            setSelectedFile(file);
        } else {
            toast.error("Only CSV files are allowed.");
        }
    };

    const downloadFailedProductsCsv = () => {
        if (!result?.failedCsvText) return;

        const url = window.URL.createObjectURL(
            new Blob([result.failedCsvText], {
                type: "text/csv;charset=utf-8;"
            })
        );

        const link = document.createElement("a");
        link.href = url;
        link.download = "FailedProducts.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleImport = async () => {
        if (!selectedFile) {
            toast.error("Please select a CSV file.");
            return;
        }

        try {
            setIsImporting(true);

            const fileText = await selectedFile.text();
            const lines = fileText.split(/\r?\n/).filter(line => line.trim());
            
            if (lines.length === 0) {
                toast.error("The selected file is empty.");
                setIsImporting(false);
                return;
            }
            
            if (lines.length === 1) {
                toast.error("The selected file contains only headers with no products.");
                setIsImporting(false);
                return;
            }

            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await importProducts(formData);
            await processImportResponse(selectedFile, response);
            setSelectedFile(null);

            await onImported();
        } catch (error) {
            console.error(error);
            toast.error("Unable to import products.");
        } finally {
            setIsImporting(false);
        }
    };

    const handleFailedProductChange = (index, field, value) => {
        setResult((currentResult) => ({
            ...currentResult,
            failedProducts: currentResult.failedProducts.map((product, productIndex) => (
                productIndex === index
                    ? { ...product, [field]: value }
                    : product
            ))
        }));
    };

    const handleImportAgain = async () => {
        if (!result?.failedProducts.length) {
            toast.error("No failed products to import.");
            return;
        }

        try {
            setIsImporting(true);

            const csvText = buildProductsCsv(result.failedProducts);
            const retryFile = new File([csvText], "CorrectedProducts.csv", {
                type: "text/csv"
            });
            const formData = new FormData();
            formData.append("file", retryFile);

            const response = await importProducts(formData);
            await processImportResponse(retryFile, response);
            await onImported();
        } catch (error) {
            console.error(error);
            toast.error("Unable to import corrected products.");
        } finally {
            setIsImporting(false);
        }
    };

    const successfulCount = result?.successfulProducts.length || 0;
    const failedCount = result?.failedProducts.length || 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Import Products
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Upload a CSV file and review the import result.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-2xl text-gray-400 hover:text-gray-700"
                    >
                        x
                    </button>
                </div>

                {!result ? (
                    <>
                        <label
                            htmlFor="csv-file"
                            className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:bg-gray-100"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleFileSelect(e.dataTransfer.files[0]);
                            }}
                        >
                            <Upload className="mb-4 h-10 w-10 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-700">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">CSV only (Max. 30 MB)</p>

                            {selectedFile && (
                                <p className="mt-4 text-sm font-medium text-green-600">
                                    {selectedFile.name}
                                </p>
                            )}

                            <input
                                id="csv-file"
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                            />
                        </label>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="rounded-xl border border-gray-300 px-5 py-2 text-gray-700 transition hover:bg-red-500 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!selectedFile || isImporting}
                                className="rounded-xl bg-green-500 px-5 py-2 text-white duration-300 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                                onClick={handleImport}
                            >
                                {isImporting ? "Importing..." : "Import"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
                                <button
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === "successful" ? "bg-green-500 text-white shadow" : "text-gray-700 hover:bg-white"}`}
                                    onClick={() => setActiveTab("successful")}
                                >
                                    Successful ({successfulCount})
                                </button>
                                <button
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === "unsuccessful" ? "bg-red-500 text-white shadow" : "text-gray-700 hover:bg-white"}`}
                                    onClick={() => setActiveTab("unsuccessful")}
                                >
                                    Unsuccessful ({failedCount})
                                </button>
                            </div>

                            {failedCount > 0 && (
                                <button
                                    onClick={downloadFailedProductsCsv}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    <Download size={16} />
                                    Download Failed CSV
                                </button>
                            )}
                        </div>

                        <ProductRowsTable
                            products={activeTab === "successful" ? result.successfulProducts : result.failedProducts}
                            editable={activeTab === "unsuccessful"}
                            onProductChange={handleFailedProductChange}
                        />

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="rounded-xl border border-gray-300 px-5 py-2 text-gray-700 transition hover:bg-gray-100"
                                onClick={() => {
                                    setResult(null);
                                    setSelectedFile(null);
                                }}
                            >
                                Choose New File
                            </button>
                            {failedCount > 0 && (
                                <button
                                    className="rounded-xl bg-green-500 px-5 py-2 text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                                    onClick={handleImportAgain}
                                    disabled={isImporting}
                                >
                                    {isImporting ? "Importing..." : "Import Again"}
                                </button>
                            )}
                            <button
                                className="rounded-xl bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700"
                                onClick={onClose}
                            >
                                Done
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductImportModal;
