import { useState } from "react";
import Pagination from "../Pagination/Pagination";
import "./ProductTable.css";

function ProductTable({
    products,
    role,
    filters,
    onFilterChange,
    onEdit,
    onDelete,
    selectedRowId,
    selectionMode,
    handleRowSelection
}) {

    // ============================================
    // PAGINATION
    // ============================================

    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 10;

    // ============================================
    // FILTERING
    // ============================================

    let filteredProducts = [...products];

    // Filter Name
    if (filters.name) {

        filteredProducts = filteredProducts.filter(product =>
            product.name
                .toLowerCase()
                .includes(filters.name.toLowerCase())
        );

    }

    // Filter Category
    if (filters.category) {

        filteredProducts = filteredProducts.filter(product =>
            product.category
                .toLowerCase()
                .includes(filters.category.toLowerCase())
        );

    }

    // ============================================
    // SORTING
    // ============================================

    if (filters.priceSort === "lowToHigh") {

        filteredProducts.sort(
            (a, b) => a.price - b.price
        );

    }

    if (filters.priceSort === "highToLow") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    }

    // ============================================
    // PAGINATION LOGIC
    // ============================================

    const indexOfLastProduct =
        currentPage * pageSize;

    const indexOfFirstProduct =
        indexOfLastProduct - pageSize;

    const currentProducts =
        filteredProducts.slice(
            indexOfFirstProduct,
            indexOfLastProduct
        );

    return (

        <div>

            <table className="product-table">

                <thead>

                    {/* Header Row */}
                    <tr>

                        {selectionMode && <th>Select</th>}

                        <th>Name</th>

                        <th>Price</th>

                        <th>Category</th>

                        <th>Stock Quantity</th>

                        {role === "ADMIN" && <th>Actions</th>}

                    </tr>

                    {/* Filter Row */}
                    <tr className="filter-row">

                        {selectionMode && <th></th>}

                        {/* Name Filter */}
                        <th>

                            <input
                                type="text"
                                name="name"
                                placeholder="Filter Name"
                                value={filters.name}
                                onChange={onFilterChange}
                            />

                        </th>

                        {/* Price Sort */}
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

                        {/* Category Filter */}
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

                            <tr
                                key={product.id}
                                className={
                                    selectedRowId === product.id
                                        ? "selected-row"
                                        : ""
                                }
                            >

                                {selectionMode && (

                                    <td>

                                        <input
                                            type="radio"
                                            name="selectedProduct"
                                            checked={
                                                selectedRowId === product.id
                                            }
                                            onChange={() =>
                                                handleRowSelection(product)
                                            }
                                        />

                                    </td>

                                )}

                                <td>{product.name}</td>

                                <td>${product.price}</td>

                                <td>{product.category}</td>

                                <td>{product.stockQuantity}</td>

                                {role === "ADMIN" && (

                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() => onEdit(product)}
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
                                    selectionMode
                                        ? role === "ADMIN"
                                            ? 7
                                            : 6
                                        : role === "ADMIN"
                                            ? 6
                                            : 5
                                }
                            >

                                No Products Found

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

            {/* ============================================
                PAGINATION
            ============================================ */}

            <Pagination
                currentPage={currentPage}
                totalItems={filteredProducts.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
            />

        </div>

    );

}

export default ProductTable;