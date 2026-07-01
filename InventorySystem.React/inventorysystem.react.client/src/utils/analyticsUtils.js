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

export const getInventoryValue = (products = []) => {

    return products.map(product => ({
        name: product.name,
        value: product.price * product.stockQuantity
    }));
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