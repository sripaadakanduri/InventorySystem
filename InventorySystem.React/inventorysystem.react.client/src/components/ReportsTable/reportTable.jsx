function reportTable({ 
selectedProduct,
selectedStartDate,
selectedEndDate,
selectedCurrency,
}
) {
    return(
        <div>
        <h2 className="text-xl font-semibold mb-4">Report Table</h2>
        <p>Selected Product: {selectedProduct}</p>
        <p>Selected Start Date: {selectedStartDate}</p>
        <p>Selected End Date: {selectedEndDate}</p>
        <p>Selected Currency: {selectedCurrency}</p>
        </div>
    )
}

export default reportTable;