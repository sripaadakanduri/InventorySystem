import { useEffect, useMemo, useState } from "react";
import { Package, Boxes, IndianRupee, Shapes } from "lucide-react";

import { getProducts } from "../../services/ProductService";

import AnalyticsCards from "../../components/Analytics/AnalyticsCards";
import CategoryPieChart from "../../components/Analytics/CategoryPieChart";
import ProductsBarChart from "../../components/Analytics/ProductsBarChart";
import InventoryValueChart from "../../components/Analytics/InventoryValueChart";
import LowStockChart from "../../components/Analytics/LowStockChart";

import {
    getDashboardStats,
    getCategoryDistribution,
    getProductsPerCategory,
    getInventoryValueByCategory,
    getLowStockProducts
} from "../../utils/analyticsUtils";

export default function Analytics() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadProducts = async () => {

            try {

                const data = await getProducts();
                console.log("First Product:", data[0]);
                setProducts(data);

            }

            catch (err) {

                console.error(err);

            }

            finally {

                setLoading(false);

            }

        };

        loadProducts();

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

        <div className="bg-slate-50 max-w-7xl mb-5">

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
                            "₹" +
                            stats.inventoryValue.toLocaleString(),
                        icon: IndianRupee
                    }

                ]}

            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

                <CategoryPieChart
                    data={categoryData}
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

            </div>

        </div>

    );

}