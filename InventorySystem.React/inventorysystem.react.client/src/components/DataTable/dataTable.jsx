import { useMemo } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

function dataTable({ 
    data = [],
    columns = [],
    loading = false,
    emptyMessage ,
    /* FILTERS*/ 
    filters = {},
    filterConfig = [],
    onFilterChange,
    onFilterApply,
    onInstantFilterChange,
    /*PAGINATIOn*/
    pagination = true,
    currentPage = 1,
    pageSize = 10,
    totalItems,
    onPageChange,
    onPageSizeChange,
    /*ROW EVENTS*/
    onRowClick,
    rowClassName,
    getRowKey = (row) => row.id,
    /*CUSTOM COMPONENT*/
    toolbar,
    footer,
    className = "",
    tableClassName = "",
    stickyHeader = false
}) {

    const total = totalItems ?? data.length;

    const paginatedData = useMemo(() => {

        if (!pagination)
            return data;

        const start = (currentPage - 1) * pageSize;

        return data.slice(start, start + pageSize);

    }, [
        data,   
        pagination,
        currentPage,
        pageSize
    ]);

    const handleFilterKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            onFilterApply
        ) {
            onFilterApply();
        }

    };

    const handleRowClick = (row) => {

        if (!onRowClick)
            return;

        onRowClick(row);

    };

    return (

        <div
            className={`
                w-full
                rounded-3xl
                border
                border-gray-200
                bg-white
                shadow-lg
                overflow-hidden
                ${className}
            `}
        >

            {/* =====================
                    TOOLBAR
            ====================== */}

            {toolbar &&

                <div className="border-b border-gray-200 p-4">

                    {toolbar}

                </div>

            }

            {/* =====================
                    TABLE
            ====================== */}

            <div className="overflow-x-auto">

                <table
                    className={`
                        w-full
                        border-collapse
                        ${tableClassName}
                    `}
                >

                    <TableHeader
                        columns={columns}
                        filters={filters}
                        filterConfig={filterConfig}
                        onFilterChange={onFilterChange}
                        onInstantFilterChange={onInstantFilterChange}
                        onFilterApply={onFilterApply}
                        handleFilterKeyDown={handleFilterKeyDown}
                        stickyHeader={stickyHeader}
                    />

                    {
                        loading ?

                            <LoadingState
                                colSpan={columns.length}
                            />
                            :
                            paginatedData.length === 0 ?

                                <EmptyState
                                    colSpan={columns.length}
                                    message={emptyMessage}
                                />
                                :
                                <TableBody
                                    rows={paginatedData}
                                    columns={columns}
                                    getRowKey={getRowKey}
                                    onRowClick={handleRowClick}
                                    rowClassName={rowClassName}
                                />

                    }

                </table>

            </div>
            {/* =====================
                    PAGINATION
            ====================== */}

            {
                pagination &&
                !loading &&
                total > 0 &&

                <div
                    className="
                        border-t
                        border-gray-200
                        bg-white
                        p-4
                    "
                >
                    <Pagination
                        currentPage={currentPage}
                        totalItems={total}
                        pageSize={pageSize}
                        onPageChange={onPageChange}
                        onPageSizeChange={onPageSizeChange}
                    />

                </div>
            }

            {/* =====================
                    FOOTER
            ====================== */}
            {
                footer &&
                <div
                    className="
                        border-t
                        border-gray-200
                        bg-gray-50
                        px-6
                        py-4
                    "
                >
                    {footer}
                </div>
            }
        </div>
    );
}

export default dataTable;