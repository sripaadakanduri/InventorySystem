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
        const productList = order.items
            .map((item) => {
                const product = products.find(
                    (p) => p.id === item.productId
                );

                const productName = product
                    ? product.name
                    : `Product #${item.productId}`;

                return `${productName} (${item.quantity})`;
            })
            .join(", ");

        return {
            username: order.username,
            products: productList,
            orderTotal: order.totalAmount,
            status: getStatusText(order.status),
            createdAt: new Date(order.createdAt).toLocaleString()
        };
    });
};

export const exportToCSV = (orders, products) => {
    const data = buildExportData(orders, products);

    const headers = [
        "User",
        "Products",
        "Order Total",
        "Status",
        "Created At"
    ];

    const rows = data.map((row) => [
        row.username,
        row.products,
        row.orderTotal,
        row.status,
        row.createdAt
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

    const worksheet = XLSX.utils.json_to_sheet(
        data.map((row) => ({
            User: row.username,
            Products: row.products,
            "Order Total": row.orderTotal,
            Status: row.status,
            "Created At": row.createdAt
        }))
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Orders"
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
            "User",
            "Products",
            "Order Total",
            "Status",
            "Created At"
        ]],

        body: data.map((row) => [
            row.username,
            row.products,
            `$${row.orderTotal}`,
            row.status,
            row.createdAt
        ]),

        styles: {
            fontSize: 8
        },

        headStyles: {
            fillColor: [41, 128, 185]
        }
    });

    doc.save("Orders.pdf");
};

export const printOrders = () => {
    window.print();
};