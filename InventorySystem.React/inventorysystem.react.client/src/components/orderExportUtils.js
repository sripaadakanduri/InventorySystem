import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
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

const formatMoney = (value, currency) => {
    const formattedNumber = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    return `${formattedNumber} ${currency}`;
};

const buildExportData = (orders, products = []) => {
    return orders.map((order) => {
        const currency = order.currency || 'USD';
        const items = (order.items || []).map((item) => {
            const product = products.find((p) => p.id === item.productId);
            const totalBase = item.totalPrice ?? (item.unitPrice * item.quantity);
            const unitPriceBase = item.unitPrice;

            return {
                name: product?.name || `Product #${item.productId}`,
                unitPrice: unitPriceBase,
                quantity: item.quantity,
                total: totalBase,
                currency: currency
            };
        });

        return {
            orderNumber: order.orderNumber,
            username: order.username,
            items,
            orderTotal: order.totalAmount,
            currency: currency,
            status: getStatusText(order.status),
            createdAt: new Date(order.createdAt).toLocaleString()
        };
    });
};

const formatProductsForCSV = (items) => {
    return items
        .map((item) =>
            `${item.name} (Price: ${formatMoney(item.unitPrice, item.currency)}, Qty: ${item.quantity}, Total: ${formatMoney(item.total, item.currency)})`
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
        `"${formatMoney(row.orderTotal, row.currency)}"`,
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
export const exportToExcel = async (orders, products) => {
    const data = buildExportData(orders, products);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    worksheet.columns = [
        { header: "Order Number", key: "orderNumber", width: 24 },
        { header: "User", key: "username", width: 20 },
        { header: "Product", key: "product", width: 35 },
        { header: "Price", key: "price", width: 18 },
        { header: "Qty", key: "quantity", width: 10 },
        { header: "Total", key: "total", width: 18 },
        { header: "Order Total", key: "orderTotal", width: 20 },
        { header: "Status", key: "status", width: 15 },
        { header: "Created At", key: "createdAt", width: 22 }
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2980B9" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin" }, bottom: { style: "thin" },
            left: { style: "thin" }, right: { style: "thin" }
        };
    });
    headerRow.height = 30;

    let currentRowNumber = 2;

    data.forEach(order => {
        const startRow = currentRowNumber;

        if (order.items.length === 0) {
            const row = worksheet.addRow({
                orderNumber: order.orderNumber,
                username: order.username,
                product: "No Products",
                orderTotal: formatMoney(order.orderTotal, order.currency),
                status: order.status,
                createdAt: order.createdAt
            });
            row.height = 24;
            currentRowNumber++;
        } else {
            order.items.forEach((item, index) => {
                const row = worksheet.addRow({
                    orderNumber: index === 0 ? order.orderNumber : "",
                    username: index === 0 ? order.username : "",
                    product: item.name,
                    price: formatMoney(item.unitPrice, item.currency),
                    quantity: item.quantity,
                    total: formatMoney(item.total, item.currency),
                    orderTotal: index === 0 ? formatMoney(order.orderTotal, order.currency) : "",
                    status: index === 0 ? order.status : "",
                    createdAt: index === 0 ? order.createdAt : ""
                });
                row.height = 24;
                currentRowNumber++;
            });
        }

        const endRow = currentRowNumber - 1;

        if (endRow > startRow) {
            [1, 2, 7, 8, 9].forEach(col => {
                worksheet.mergeCells(startRow, col, endRow, col);
            });
        }

        for (let i = startRow; i <= endRow; i++) {
            const row = worksheet.getRow(i);
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                let horizontal = "left";
                if (colNumber === 5) horizontal = "center"; 
                if (colNumber === 4 || colNumber === 6) horizontal = "right"; 
                if ([1, 2, 7, 8, 9].includes(colNumber)) horizontal = "center";

                cell.alignment = { horizontal, vertical: "middle", wrapText: true };
                cell.border = {
                    top: { style: "thin" }, bottom: { style: "thin" },
                    left: { style: "thin" }, right: { style: "thin" }
                };
                cell.font = { size: 11 };
            });
        }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "Orders.xlsx");
};

export const exportToPDF = async (orders, products) => {
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
            formatMoney(order.orderTotal, order.currency),
            order.status,
            order.createdAt
        ]
    }));

    try {
        const logoRes = await fetch("/inventory_logo.png");
        const blob = await logoRes.blob();
        const reader = new FileReader();
        await new Promise(resolve => {
            reader.onloadend = resolve;
            reader.readAsDataURL(blob);
        });
        doc.addImage(reader.result, 'PNG', 5, 5, 20, 20);
    } catch (e) {
        console.error("Failed to load logo", e);
    }

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Orders Report", 30, 18);

    autoTable(doc, {
        startY: 30,
        pageBreak: "auto",
        rowPageBreak: "avoid",

        margin: {
            left: 5,
            right: 5,
            top: 16,
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
                cellWidth: 110
            },
            3: {
                cellWidth: 32,
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
                14 + (itemCount * 9);

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

            const x = hookData.cell.x;
            const y = hookData.cell.y ;
            const w = hookData.cell.width ;

            const headerHeight = 8;
            const rowHeight = 8;

            const totalHeight =
                headerHeight +
                Math.max(items.length, 1) * rowHeight;

            // Nested table widths
            const productWidth = 38;
            const priceWidth = 26;
            const qtyWidth = 16;
            const totalWidth =
                w - productWidth - priceWidth - qtyWidth;

            doc.setLineWidth(0.15);
            doc.setDrawColor(195);

            // Outer border
            doc.rect(x,y,w,totalHeight);

            // Header background
            doc.setFillColor(227, 239, 249);

            doc.rect(x,y,w,headerHeight,"F");

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
                const productLines = doc.splitTextToSize(
                    item.name,
                    productWidth -2
                );
                doc.text(
                    productLines,
                    x + 2,
                    yy + 5
                );

                // Price
                doc.text(
                    formatMoney(item.unitPrice, item.currency),
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
                    formatMoney(item.total, item.currency),
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