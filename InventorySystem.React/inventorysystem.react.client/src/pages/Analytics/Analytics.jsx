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

        <div className="p-8 bg-slate-50 min-h-screen">

            <div className="mb-8">

                <h1 className="text-3xl font-bold">

                    Inventory Analytics

                </h1>

                <p className="text-gray-500 mt-2">

                    Visual insights about your inventory.

                </p>

            </div>

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