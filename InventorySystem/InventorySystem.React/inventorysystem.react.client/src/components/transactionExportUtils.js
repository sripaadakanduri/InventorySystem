import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getUsername = (transaction) => {
    const username = transaction.user?.username;

    if (!username) {
        return `User ${transaction.userId}`;
    }

    return username.charAt(0).toUpperCase() + username.slice(1);
};

const buildExportData = (transactions) => {
    return transactions.map((transaction) => ({
        username: getUsername(transaction),
        productName: transaction.product?.name || `Product ${transaction.productId}`,
        quantityChanged: transaction.quantityChanged,
        remainingStock: transaction.remainingStock,
        actionType: transaction.actionType,
        createdAt: new Date(transaction.createdAt).toLocaleString()
    }));
};

const escapeCSVValue = (value) => {
    const stringValue = String(value ?? "");

    if (stringValue.includes(",") || stringValue.includes("\"") || stringValue.includes("\n")) {
        return `"${stringValue.replaceAll("\"", "\"\"")}"`;
    }

    return stringValue;
};

export const exportTransactionsToCSV = (transactions) => {
    const data = buildExportData(transactions);

    const headers = [
        "Username",
        "Product Name",
        "Change",
        "Stock",
        "Action Type",
        "Date & Time"
    ];

    const rows = data.map((row) => [
        row.username,
        row.productName,
        row.quantityChanged,
        row.remainingStock,
        row.actionType,
        row.createdAt
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map(escapeCSVValue).join(","))
    ].join("\n");

    const blob = new Blob(
        [csvContent],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    saveAs(blob, "AuditLogs.csv");
};

export const exportTransactionsToExcel = (transactions) => {
    const data = buildExportData(transactions);

    const worksheet = XLSX.utils.json_to_sheet(
        data.map((row) => ({
            Username: row.username,
            "Product Name": row.productName,
            Change: row.quantityChanged,
            Stock: row.remainingStock,
            "Action Type": row.actionType,
            "Date & Time": row.createdAt
        }))
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Audit Logs"
    );

    const excelBuffer = XLSX.write(
        workbook,
        {
            bookType: "xlsx",
            type: "array"
        }
    );

    const blob = new Blob(
        [excelBuffer],
        {
            type: "application/octet-stream"
        }
    );

    saveAs(blob, "AuditLogs.xlsx");
};

export const exportTransactionsToPDF = (transactions) => {
    const data = buildExportData(transactions);
    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text("Audit Logs Report", 14, 15);

    autoTable(doc, {
        startY: 25,

        head: [[
            "Username",
            "Product Name",
            "Change",
            "Stock",
            "Action Type",
            "Date & Time"
        ]],

        body: data.map((row) => [
            row.username,
            row.productName,
            row.quantityChanged,
            row.remainingStock,
            row.actionType,
            row.createdAt
        ]),

        styles: {
            fontSize: 8
        },

        headStyles: {
            fillColor: [41, 128, 185]
        }
    });

    doc.save("AuditLogs.pdf");
};

export const printTransactions = () => {
    window.print();
};
