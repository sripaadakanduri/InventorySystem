import {

    ResponsiveContainer,

    BarChart,

    Bar,

    XAxis,

    YAxis,

    CartesianGrid,

    Tooltip

} from "recharts";

export default function ProductsBarChart({ data }) {

    return (

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

            <h2 className="text-xl font-semibold mb-6">

                Products per Category

            </h2>

            <ResponsiveContainer width="100%" height={450}>

                <BarChart data={data}>
                    <XAxis dataKey="category" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="products"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}