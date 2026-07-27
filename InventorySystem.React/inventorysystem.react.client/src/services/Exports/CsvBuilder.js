import { saveAs } from "file-saver";

const escapeCSVValue = (value) => {
    const stringValue = String(value ?? "");

    if (
        stringValue.includes(",") ||
        stringValue.includes("\"") ||
        stringValue.includes("\n")
    ) {
        return `"${stringValue.replaceAll("\"", "\"\"")}"`;
    }

    return stringValue;
};

export const exportToCSV = (
    data,
    columns,
    fileName = "Report.csv"
) => {

    const headers = columns.map(column => column.title);

    const rows = data.map(row =>
        columns.map(column => {

            if (typeof column.accessor === "function") {
                return column.accessor(row);
            }

            return row[column.accessor];
        })
    );

    const csvContent = [
        headers.join(","),
        ...rows.map(row =>
            row.map(escapeCSVValue).join(",")
        )
    ].join("\n");

    const blob = new Blob(
        [csvContent],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    saveAs(blob, fileName);
};