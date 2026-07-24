import { useEffect, useMemo, useState } from "react";
import { Package, Boxes, IndianRupee, Shapes } from "lucide-react";

import { getProducts } from "../../services/ProductService";
import { getAllOrders } from "../../services/ordersService";


import AnalyticsCards from "../../components/Analytics/AnalyticsCards";
import CategoryPieChart from "../../components/Analytics/CategoryPieChart";
import ProductsBarChart from "../../components/Analytics/ProductsBarChart";
import InventoryValueChart from "../../components/Analytics/InventoryValueChart";
import LowStockChart from "../../components/Analytics/LowStockChart";
import MostOrderdProducts from "../../components/Analytics/MostOrderdProducts";
import AreaForMonthlyOrders from "../../components/Analytics/AreaForMonthlyOrders";



import {
    getDashboardStats,
    getCategoryDistribution,
    getProductsPerCategory,
    getInventoryValueByCategory,
    getLowStockProducts,
    getTopSellingProducts,
    orderByMonth
} from "../../utils/analyticsUtils";

export default function Analytics() {

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadData = async () => {

            try {

                const [productsData, ordersData] = await Promise.all([
                    getProducts(),
                    getAllOrders()
                ]);

                setProducts(productsData);
                setOrders(ordersData);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, []);

    const stats = useMemo(
        () => getDashboardStats(products),
        [products]
    );

    const categoryData = useMemo(
        () => getCategoryDistribution(products),
        [products]
    );

    const categoryBar = useMemo(
        () => getProductsPerCategory(products),
        [products]
    );

    const inventoryValue = useMemo(
        () => getInventoryValueByCategory(products),
        [products]
    );

    const lowStock = useMemo(
        () => getLowStockProducts(products),
        [products]
    );
   
    const mostOrdered = useMemo(
        () => getTopSellingProducts(orders, products),
        [orders, products]
    );

    const OrdersByMonth = useMemo(
        () => orderByMonth(orders, products),
        [orders, products]
    );

    if (loading) {
        return (

            <div className="flex justify-center items-center h-[70vh]">

                <div className="text-xl font-semibold">

                    Loading Analytics...

                </div>

            </div>

        );

    }

    return (

        <div className="page-container">

            <div className="border border-gray-300 mb-5"></div>

            <AnalyticsCards

                cards={[

                    {
                        title: "Products",
                        value: stats.totalProducts,
                        icon: Package
                    },

                    {
                        title: "Categories",
                        value: stats.totalCategories,
                        icon: Shapes
                    },

                    {
                        title: "Stock",
                        value: stats.totalStock,
                        icon: Boxes
                    },

                    {
                        title: "Inventory Value",
                        value:
                            "$ " +
                            stats.inventoryValue.toLocaleString(),
                        icon: IndianRupee
                    }

                ]}

            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

                <CategoryPieChart
                    data={categoryData}
                />

                <AreaForMonthlyOrders
                    data={OrdersByMonth}
                />

                <ProductsBarChart
                    data={categoryBar}
                />

                <InventoryValueChart
                    data={inventoryValue}
                />
                <LowStockChart
                    data={lowStock}
                />
                <MostOrderdProducts
                    data={mostOrdered}
                />
                
            </div>

        </div>

    );

}