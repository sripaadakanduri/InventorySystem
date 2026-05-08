import "./ProductTable.css";

function ProductTable({ products, onEdit, onDelete }) {

    return (
        <table className="product-table">

            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>

                {products.map((product) => (

                    <tr key={product.id}>

                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.stockQuantity}</td>
                        <td>{product.category}</td>

                        <td>

                            <button
                                className="edit-btn"
                                onClick={() => onEdit(product)}
                            >
                                Edit
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() => onDelete(product.id)}
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>
    );
}

export default ProductTable;