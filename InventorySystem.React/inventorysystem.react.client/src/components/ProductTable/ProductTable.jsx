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

    return (
        <table className="product-table">

            <thead>

                {/* Header Row */}
                <tr>

                    {selectionMode && (
                        <th>Select</th>
                    )}

                    <th>Name</th>

                    <th>Price</th>

                    <th>Category</th>

                    <th>Stock Quantity</th>

                    <th>Actions</th>

                </tr>

                {/* Filter Row */}
                

            </thead>

            <tbody>

                {products.length > 0 ? (

                    products.map((product) => (

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

                            <td>

                                {role === "ADMIN" && (

                                    <>

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

                                    </>

                                )}

                            </td>

                        </tr>

                    ))

                ) : (

                    <tr>

                        <td
                            colSpan={
                                selectionMode ? 6 : 5
                            }
                        >
                            No Products Found
                        </td>

                    </tr>

                )}

            </tbody>

        </table>
    );
}

export default ProductTable;