import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async ({
    data,
    columns,
    fileName = "Report.xlsx",
    sheetName = "Report",
    headerName="header",
    childrenAccessor = null
}) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns.map(column => ({
        header: column[headerName],
        key: column.key,
        width: column.width || 20
    }));

    const headerRow = worksheet.getRow(1);

    headerRow.eachCell(cell => {
        cell.font = {
            bold: true,
            size: 12,
            color: { argb: "FFFFFFFF" }
        };

        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF2980B9" }
        };

        cell.alignment = {
            horizontal: "center",
            vertical: "middle"
        };

        cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
        };
    });

    headerRow.height = 30;

    let currentRow = 2;

    if (!childrenAccessor) {

        data.forEach(item => {

            const rowData = {};

            columns.forEach(column => {

                rowData[column.key] =
                    typeof column.accessor === "function"
                        ? column.accessor(item)
                        : item[column.accessor];

            });

            worksheet.addRow(rowData);

        });

    }

    // GROUPED TABLE
    else {

        data.forEach(parent => {

            const children = childrenAccessor(parent) || [];

            const startRow = currentRow;

            if (children.length === 0) {

                const rowData = {};

                columns.forEach(column => {

                    if (column.parent) {

                        rowData[column.key] = column.parent(parent);

                    }

                });

                worksheet.addRow(rowData);

                currentRow++;

            }

            else {

                children.forEach((child, index) => {

                    const rowData = {};

                    columns.forEach(column => {

                        if (column.parent) {

                            rowData[column.key] =
                                index === 0
                                    ? column.parent(parent)
                                    : "";

                        }

                        if (column.child) {

                            rowData[column.key] =
                                column.child(child, parent);

                        }

                    });

                    worksheet.addRow(rowData);

                    currentRow++;

                });

            }

            const endRow = currentRow - 1;

            if (endRow > startRow) {

                columns.forEach((column, index) => {

                    if (column.merge) {

                        worksheet.mergeCells(
                            startRow,
                            index + 1,
                            endRow,
                            index + 1
                        );

                    }

                });

            }

        });

    }

    // STYLE DATA CELLS

    worksheet.eachRow((row, rowNumber) => {

        if (rowNumber === 1) return;

        row.height = 24;

        row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {

            const column = columns[columnNumber - 1];

            cell.font = {
                size: 11
            };

            cell.alignment = {
                horizontal: column.align || "left",
                vertical: "middle",
                wrapText: true
            };

            cell.border = {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" }
            };

        });

    });

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
        new Blob(
            [buffer],
            {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        ),
        fileName
    );
};