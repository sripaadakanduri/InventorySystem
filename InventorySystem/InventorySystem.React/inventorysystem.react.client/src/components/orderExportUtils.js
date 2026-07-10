import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getStatusText = (status) => {
    switch (status) {
        case 1:
            return "Pending";
        case 2:
            return "Confirmed";
        case 3:
            return "Failed";
        case 4:
            return "Cancelled";
        case 5:
            return "Updated";
        default:
            return "Unknown";
    }
};

const buildExportData = (orders, products) => {
    return orders.map((order) => {
        const items = order.items.map((item) => {
            const product = products.find(
                (p) => p.id === item.productId
            );

            return {
                name: product?.name || `Product #${item.productId}`,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                total: item.unitPrice * item.quantity
            };
        });

        return {
            orderNumber: order.orderNumber,
            username: order.username,
            items,
            orderTotal: order.totalAmount,
            status: getStatusText(order.status),
            createdAt: new Date(order.createdAt).toLocaleString()
        };
    });
};


const formatProducts = (items) => {
    if (items.length === 1) {
        const item = items[0];

        return `${item.name}
Unit Price : $${item.unitPrice}
Quantity   : ${item.quantity}
Total      : $${item.total}`;
    }

    const lines = [
        "Product\t\tPrice\tQty\tTotal"
    ];

    items.forEach((item) => {
        lines.push(
            `${item.name}\t$${item.unitPrice}\t${item.quantity}\t$${item.total}`
        );
    });

    return lines.join("\n");
};

const formatProductsForCSV = (items) => {
    return items
        .map((item) =>
            `${item.name} (Price: $${item.unitPrice.toFixed(2)}, Qty: ${item.quantity}, Total: $${item.total.toFixed(2)})`
        )
        .join(" | ");
};

export const exportToCSV = (orders, products) => {
    const data = buildExportData(orders, products);

    const headers = [
    "Order Number",
    "User",
    "Products",
    "Order Total",
    "Status",
    "Created At"
    ];

    const rows = data.map((row) => [
        row.orderNumber,
        row.username,
        `"${formatProductsForCSV(row.items)}"`,
        row.orderTotal.toFixed(2),
        row.status,
        `"${row.createdAt}"`
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map((r) => r.join(","))
    ].join("\n");

    const blob = new Blob(
        [csvContent],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    saveAs(blob, "Orders.csv");
};

export const exportToExcel = (orders, products) => {
    const data = buildExportData(orders, products);

    const worksheetData = data.map((row) => ({
        "Order Number": row.orderNumber,
        User: row.username,

        Products: [
            "ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ",
            "Γöé Product                 Price      Qty        Total         Γöé",
            "Γö£ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöñ",

            ...row.items.map((item) => {
                const name = item.name.padEnd(22).substring(0, 22);
                const price = `$${item.unitPrice.toFixed(2)}`
                    .padStart(10);
                const qty = String(item.quantity).padStart(6);
                const total = `$${item.total.toFixed(2)}`
                    .padStart(12);

                return `Γöé ${name}${price}${qty}${total} Γöé`;
            }),

            "ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ"
        ].join("\n"),

        "Order Total": row.orderTotal,
        Status: row.status,
        "Created At": row.createdAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    worksheet["!cols"] = [
        { wch: 22 }, // Order Number
        { wch: 20 }, // User
        { wch: 70 }, // Products
        { wch: 18 }, // Order Total
        { wch: 15 }, // Status
        { wch: 25 }  // Created At
    ];

    worksheet["!rows"] = [
        { hpt: 22 }, // header
        ...data.map((row) => ({
            hpt: Math.max(40, 22 + row.items.length * 18)
        }))
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Orders"
    );

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
    });

    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(blob, "Orders.xlsx");
};

export const exportToPDF = (orders, products) => {
    const data = buildExportData(orders, products);

    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text("Orders Report", 14, 15);

    autoTable(doc, {
        startY: 25,

        head: [[
            "Order Number",
            "User",
            "Products",
            "Order Total",
            "Status",
            "Created At"
        ]],

        body: data.map((row) => [
            row.orderNumber,
            row.username,
            "", // Products cell will be drawn manually
            `$${row.orderTotal.toFixed(2)}`,
            row.status,
            row.createdAt
        ]),

        styles: {
            fontSize: 8,
            valign: "top",
            cellPadding: 2
        },

        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold"
        },

        columnStyles: {
            2: {
                cellWidth: 95
            }
        },

        didParseCell: function (hookData) {

            if (
                hookData.section === "body" &&
                hookData.column.index === 2
            ) {

                const items = data[hookData.row.index].items;

                // Header + one row per product
                const rowHeight = 6;
                hookData.cell.styles.minCellHeight =
                    (items.length + 1) * rowHeight + 4;
            }
        },

        didDrawCell: function (hookData) {

            if (
                hookData.section !== "body" ||
                hookData.column.index !== 2
            ) {
                return;
            }

            const items = data[hookData.row.index].items;

            const x = hookData.cell.x + 1;
            const y = hookData.cell.y + 1;
            const w = hookData.cell.width - 2;

            const h = 6;

            const col1 = w * 0.48;
            const col2 = w * 0.18;
            const col3 = w * 0.12;
            const col4 = w * 0.22;

            doc.setFontSize(6);

            // Header background
            doc.setFillColor(230, 230, 230);
            doc.rect(x, y, w, h, "F");

            // Outer border
            doc.rect(x, y, w, h * (items.length + 1));

            // Vertical lines
            doc.line(x + col1, y, x + col1, y + h * (items.length + 1));
            doc.line(x + col1 + col2, y, x + col1 + col2, y + h * (items.length + 1));
            doc.line(x + col1 + col2 + col3, y, x + col1 + col2 + col3, y + h * (items.length + 1));

            // Header text
            doc.setFont(undefined, "bold");

            doc.text("Product", x + 2, y + 4);
            doc.text("Price", x + col1 + 2, y + 4);
            doc.text("Qty", x + col1 + col2 + 2, y + 4);
            doc.text("Total", x + col1 + col2 + col3 + 2, y + 4);

            doc.setFont(undefined, "normal");

            items.forEach((item, index) => {

                const rowY = y + h * (index + 1);

                // Horizontal line
                doc.line(x, rowY, x + w, rowY);

                doc.text(
                    doc.splitTextToSize(item.name, col1 - 4),
                    x + 2,
                    rowY + 4
                );

                doc.text(
                    `$${item.unitPrice.toFixed(2)}`,
                    x + col1 + 2,
                    rowY + 4
                );

                doc.text(
                    String(item.quantity),
                    x + col1 + col2 + 2,
                    rowY + 4
                );

                doc.text(
                    `$${item.total.toFixed(2)}`,
                    x + col1 + col2 + col3 + 2,
                    rowY + 4
                );
            });
        }
    });

    doc.save("Orders.pdf");
};

export const printOrders = () => {
    window.print();
};
