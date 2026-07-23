import DataTable from "../DataTable";

function ReportTable({
    orders = [],
    columns = [],
    loading = false,
    currentPage,
    pageSize,
    onPageChange,
    onPageSizeChange
}) {
    return (
        <DataTable
            data={orders}
            columns={columns}
            loading={loading}
            emptyMessage="No orders found for the selected filters."
            pagination={true}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={orders.length}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            getRowKey={(row, index) => `${row.orderNumber}-${row.productName}-${index}`}
        />
    );
}

export default ReportTable;
