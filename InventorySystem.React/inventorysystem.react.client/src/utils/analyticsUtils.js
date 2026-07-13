export const getCategoryDistribution = (products = []) => {

    const map = {};

    products.forEach(product => {
        const category = product.category || "Unknown";
        map[category] = (map[category] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
        name,
        value
    }));
};

export const getProductsPerCategory = (products = []) => {

    const map = {};

    products.forEach(product => {
        const category = product.category || "Unknown";
        map[category] = (map[category] || 0) + 1;
    });

    return Object.entries(map).map(([category, products]) => ({
        category,
        products
    }));
};

export const getLowStockProducts = (products = []) => {

    return products
        .filter(product => product.stockQuantity <= 5)
        .map(product => ({
            name: product.name,
            quantity: product.stockQuantity
        }))
        .sort((a, b) => a.quantity - b.quantity);
};

export const getInventoryValueByCategory = (products = []) => {

    const map = {};

    products.forEach(product => {

        const category = product.category || "Unknown";

        const value = product.price * product.stockQuantity;

        map[category] = (map[category] || 0) + value;

    });

    return Object.entries(map).map(([category, value]) => ({
        category,
        value
    }));
};


export const getTopSellingProducts = (orders = [], products = []) => {

    const map = {};

    orders.forEach(order => {
        (order.items || []).forEach(item => {
            map[item.productId] = (map[item.productId] || 0) + item.quantity;
            // If you want to count orders instead of quantity, use:
            // map[item.productId] = (map[item.productId] || 0) + 1;
        });
    });

    return Object.entries(map)
        .map(([productId, value]) => {
            const product = products.find(
                p => p.id === Number(productId)
            );

            return {
                name: product ? product.name : `Product #${productId}`,
                value
            };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
};

export const orderByMonth = (orders = []) => {

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthCounts = Array(12).fill(0);

    orders.forEach(order => {

        const date = new Date(order.createdAt);

        if (!isNaN(date)) {
            const monthIndex = date.getMonth(); // 0 = Jan, 1 = Feb, ...
            monthCounts[monthIndex]++;
        }

    });

    return monthNames.map((month, index) => ({
        month,
        orders: monthCounts[index]
    }));
};

export const getDashboardStats = (products = []) => {

    const totalProducts = products.length;

    const totalCategories = new Set(
        products.map(product => product.category)
    ).size;

    const totalStock = products.reduce(
        (sum, product) => sum + product.stockQuantity,
        0
    );

    const inventoryValue = products.reduce(
        (sum, product) => sum + (product.price * product.stockQuantity),
        0
    );

    return {
        totalProducts,
        totalCategories,
        totalStock,
        inventoryValue: Math.round(inventoryValue)
    };
};