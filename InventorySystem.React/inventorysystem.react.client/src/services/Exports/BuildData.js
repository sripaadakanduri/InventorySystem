const getUsername = (transaction) => {
    const username = transaction.user?.username;

    if (!username) {
        return `User ${transaction.userId}`;
    }

    return username.charAt(0).toUpperCase() + username.slice(1);
};
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
export const buildDataForTransactions = (transactions) => {
    return transactions.map((transaction) => ({
        username: getUsername(transaction),
        productName: transaction.product?.name || `Product ${transaction.productId}`,
        quantityChanged: transaction.quantityChanged,
        remainingStock: transaction.remainingStock,
        actionType: transaction.actionType,
        createdAt: new Date(transaction.createdAt).toLocaleString()
    }));
};

export const buildDataForOrders = (orders, products = []) => {
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


export const buildDataForReport = (orders, reportCurrency) => {
    return orders.map((order) => ({
        productName: order.productName,
        orderNumber: order.orderNumber,
        orderDate: order.orderDate
            ? new Date(order.orderDate).toLocaleDateString()
            : "-",
        quantity: order.quantity,
        originalAmount: `${order.originalCurrency} ${Number(order.originalAmount ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`,
        convertedAmount: `${reportCurrency || "USD"} ${Number(order.convertedAmount ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`
    }));
};