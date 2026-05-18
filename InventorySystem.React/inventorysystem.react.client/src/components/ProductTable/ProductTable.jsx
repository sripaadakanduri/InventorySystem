import { useState } from "react";
import Pagination from "../Pagination/Pagination";
import "./ProductTable.css";

function ProductTable({
    products,
    role,
    filters,
    onFilterChange,
    onEdit,
    onDelete
}) {

    const [currentPage, setCurrentPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const indexOfLastProduct =
        currentPage * pageSize;

    const indexOfFirstProduct =
        indexOfLastProduct - pageSize;

    const currentProducts =
        products.slice(
            indexOfFirstProduct,
            indexOfLastProduct
        );

    return (

        <div>

            <table className="product-table">

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Price</th>

                        <th>Category</th>

                        <th>Stock Quantity</th>

                        {role === "ADMIN" && (
                            <th>Actions</th>
                        )}

                    </tr>

                    <tr className="filter-row">

                        <th>

                            <input
                                type="text"
                                name="name"
                                placeholder="Filter Name"
                                value={filters.name}
                                onChange={onFilterChange}
                            />

                        </th>

                        <th>

                            <select
                                name="priceSort"
                                value={filters.priceSort}
                                onChange={onFilterChange}
                            >

                                <option value="">
                                    Sort Price
                                </option>

                                <option value="lowToHigh">
                                    Low to High
                                </option>

                                <option value="highToLow">
                                    High to Low
                                </option>

                            </select>

                        </th>

                        <th>

                            <input
                                type="text"
                                name="category"
                                placeholder="Filter Category"
                                value={filters.category}
                                onChange={onFilterChange}
                            />

                        </th>

                        <th>-</th>

                        {role === "ADMIN" && <th></th>}

                    </tr>

                </thead>

                <tbody>

                    {currentProducts.length > 0 ? (

                        currentProducts.map((product) => (

                            <tr key={product.id}>

                                <td>{product.name}</td>

                                <td>${product.price}</td>

                                <td>{product.category}</td>

                                <td>
                                    {product.stockQuantity}
                                </td>

                                {role === "ADMIN" && (

                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                onEdit(product)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                onDelete(product.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                )}

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan={
                                    role === "ADMIN"
                                        ? 5
                                        : 4
                                }
                            >

                                No Products Found

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>


            <Pagination
                currentPage={currentPage}
                totalItems={products.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
            />

        </div>

    );
}

export default ProductTable;