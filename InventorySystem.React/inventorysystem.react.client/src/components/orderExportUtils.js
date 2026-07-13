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

const buildExportData = (orders, products = []) => {
    return orders.map((order) => {
        const items = (order.items || []).map((item) => {
            const product = products.find((p) => p.id === item.productId);
            const total = item.totalPrice ?? item.unitPrice * item.quantity;

            return {
                name: product?.name || `Product #${item.productId}`,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                total
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

    const worksheetData = [[
        "Order Number",
        "User",
        "Product",
        "Price",
        "Qty",
        "Total",
        "Order Total",
        "Status",
        "Created At"
    ]];

    const merges = [];
    const rowHeights = [{ hpt: 24 }];

    let excelRow = 1;

    data.forEach(order => {
        const startRow = excelRow;

        if (order.items.length === 0) {
            worksheetData.push([
                order.orderNumber,
                order.username,
                "No Products",
                "",
                "",
                "",
                order.orderTotal,
                order.status,
                order.createdAt
            ]);

            rowHeights.push({ hpt: 22 });
            excelRow++;
        } else {
            order.items.forEach((item, index) => {
                worksheetData.push([
                    index === 0 ? order.orderNumber : "",
                    index === 0 ? order.username : "",
                    item.name,
                    item.unitPrice,
                    item.quantity,
                    item.total,
                    index === 0 ? order.orderTotal : "",
                    index === 0 ? order.status : "",
                    index === 0 ? order.createdAt : ""
                ]);

                rowHeights.push({ hpt: 22 });
                excelRow++;
            });
        }

        const endRow = excelRow - 1;

        if (endRow > startRow) {
            [0, 1, 6, 7, 8].forEach(col => {
                merges.push({
                    s: { r: startRow, c: col },
                    e: { r: endRow, c: col }
                });
            });
        }
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    worksheet["!merges"] = merges;
    worksheet["!rows"] = rowHeights;

    worksheet["!cols"] = [
        { wch: 24 }, // Order Number
        { wch: 20 }, // User
        { wch: 35 }, // Product
        { wch: 12 }, // Price
        { wch: 8 },  // Qty
        { wch: 12 }, // Total
        { wch: 15 }, // Order Total
        { wch: 15 }, // Status
        { wch: 22 }  // Created At
    ];
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let R = range.s.r; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {

            const cellRef = XLSX.utils.encode_cell(
                r: R,
                c: C
            });

            if (!worksheet[cellRef]) continue;

            // Header row
            if (R === 0) {

                worksheet[cellRef].s = {
                    font: {
                        bold: true,
                        color: { rgb: "FFFFFF" },
                        sz: 12
                    },
                    fill: {
                        fgColor: {
                            rgb: "2980B9"
                        }
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: "center"
                    },
                    border: {
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" }
                    }
                };

            } else {

                // Default alignment
                let horizontal = "left";

                // Quantity
                if (C === 4) {
                    horizontal = "center";
                }

                // Currency columns
                if ([3, 5].includes(C)) {
                    horizontal = "right";
                }

                // Order-level merged columns
                if ([0, 1, 6, 7, 8].includes(C)) {
                    horizontal = "center";
                }

                worksheet[cellRef].s = {
                    font: {
                        sz: 11
                    },
                    alignment: {
                        horizontal,
                        vertical: "center",
                        wrapText: true
                    },
                    border: {
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" }
                    }
                };

                // Currency formatting
                if ([3, 5, 6].includes(C)) {
                    worksheet[cellRef].z = "$#,##0.00";
                }
            }
        }
    }
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Orders"
    );

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true
    });

    const blob = new Blob(
        [excelBuffer],
        {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    );

    saveAs(blob, "Orders.xlsx");
};

export const exportToPDF = (orders, products) => {
    const data = buildExportData(orders, products);

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    const body = data.map(order => ({
        raw: order,
        row: [
            order.orderNumber,
            order.username,
            "",
            `$${order.orderTotal.toFixed(2)}`,
            order.status,
            order.createdAt
        ]
    }));

    autoTable(doc, {
        startY: 8,
        pageBreak: "auto",
        rowPageBreak: "avoid",

        margin: {
            left: 5,
            right: 5,
            top: 8,
            bottom: 15
        },

        tableWidth: "auto",

        head: [[
            "Order Number",
            "User",
            "Products",
            "Order Total",
            "Status",
            "Created At"
        ]],

        body: body.map(r => r.row),

        theme: "grid",

        styles: {
            fontSize: 9,
            cellPadding: 3,
            overflow: "linebreak",
            valign: "middle",
            lineWidth: 0.1,
            lineColor: [215, 215, 215]
        },

        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
            fontSize: 10,
            halign: "center",
            valign: "middle"
        },

        columnStyles: {
            // Fits comfortably on A4 Landscape

            0: {
                cellWidth: 42
            },

            1: {
                cellWidth: 30
            },

            2: {
                cellWidth: 92
            },

            3: {
                cellWidth: 28,
                halign: "right",
                fontStyle: "bold"
            },

            4: {
                cellWidth: 25,
                halign: "center"
            },

            5: {
                cellWidth: 50,
                halign: "center",
                overflow: "linebreak"
            }
        },

        didParseCell: (hookData) => {

            if (hookData.section !== "body")
                return;

            // Order Total
            if (hookData.column.index === 3) {
                hookData.cell.styles.fontStyle = "bold";
                hookData.cell.styles.halign = "right";
            }

            // Created At
            if (hookData.column.index === 5) {
                hookData.cell.styles.fontSize = 9;
                hookData.cell.styles.halign = "center";
            }

            // Products column
            if (hookData.column.index !== 2)
                return;

            const order = body[hookData.row.index];

            if (!order)
                return;

            const itemCount =
                Math.max(order.raw.items.length, 1);

            hookData.cell.styles.minCellHeight =
                14 + (itemCount * 8);

        },

        didDrawCell: (hookData) => {

            if (
                hookData.section !== "body" ||
                hookData.column.index !== 2
            ) {
                return;
            }

            const order = body[hookData.row.index];

            if (!order)
                return;

            const items = order.raw.items;

            const x = hookData.cell.x + 1;
            const y = hookData.cell.y + 1;
            const w = hookData.cell.width - 2;

            const headerHeight = 8;
            const rowHeight = 8;

            const totalHeight =
                headerHeight +
                Math.max(items.length, 1) * rowHeight;

            // Nested table widths
            const productWidth = 38;
            const priceWidth = 22;
            const qtyWidth = 12;
            const totalWidth =
                w - productWidth - priceWidth - qtyWidth;

            doc.setLineWidth(0.15);
            doc.setDrawColor(195);

            // Outer border
            doc.rect(
                x,
                y,
                w,
                totalHeight
            );

            // Header background
            doc.setFillColor(227, 239, 249);

            doc.rect(
                x,
                y,
                w,
                headerHeight,
                "F"
            );

            doc.setFontSize(8);
            doc.setTextColor(55);

            doc.text(
                "Product",
                x + 2,
                y + 5
            );

            doc.text(
                "Price",
                x + productWidth + 2,
                y + 5
            );

            doc.text(
                "Qty",
                x + productWidth + priceWidth + 2,
                y + 5
            );

            doc.text(
                "Total",
                x + productWidth + priceWidth + qtyWidth + 2,
                y + 5
            );

            doc.setTextColor(0);

            doc.line(
                x + productWidth,
                y,
                x + productWidth,
                y + totalHeight
            );

            doc.line(
                x + productWidth + priceWidth,
                y,
                x + productWidth + priceWidth,
                y + totalHeight
            );

            doc.line(
                x + productWidth + priceWidth + qtyWidth,
                y,
                x + productWidth + priceWidth + qtyWidth,
                y + totalHeight
            );

            doc.line(
                x,
                y + headerHeight,
                x + w,
                y + headerHeight
            );

            if (items.length === 0) {

                doc.setFontSize(8);

                doc.text(
                    "No Products",
                    x + 3,
                    y + headerHeight + 5
                );

                return;
            }

            items.forEach((item, index) => {

                const yy =
                    y +
                    headerHeight +
                    index * rowHeight;
                if (index > 0) {
                    doc.line(
                        x,
                        yy,
                        x + w,
                        yy
                    );
                }

                // Product Name
                doc.setFontSize(8);
                doc.text(
                    item.name,
                    x + 2,
                    yy + 5
                );

                // Price
                doc.text(
                    `$${item.unitPrice.toFixed(2)}`,
                    x + productWidth + priceWidth - 2,
                    yy + 5,
                    {
                        align: "right"
                    }
                );

                // Quantity
                doc.text(
                    item.quantity.toString(),
                    x + productWidth + priceWidth + (qtyWidth / 2),
                    yy + 5,
                    {
                        align: "center"
                    }
                );

                // Total
                doc.text(
                    `$${item.total.toFixed(2)}`,
                    x + w - 2,
                    yy + 5,
                    {
                        align: "right"
                    }
                );

            });

        }

    });

    // Footer
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {

        doc.setPage(i);

        doc.setFontSize(8);
        doc.setTextColor(120);

        doc.text(
            `Generated: ${new Date().toLocaleString()}`,
            5,
            doc.internal.pageSize.height - 5
        );

        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.width - 5,
            doc.internal.pageSize.height - 5,
            {
                align: "right"
            }
        );

    }

    doc.save("Orders.pdf");
};