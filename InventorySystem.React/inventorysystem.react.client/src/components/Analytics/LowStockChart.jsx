import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

export default function LowStockChart({ data }) {

    console.log("Chart Data:", data);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

            <h2 className="text-xl font-semibold mb-6">
                Low Stock Products
            </h2>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 10,
                        right: 30,
                        left: 30,
                        bottom: 10
                    }}
                >
                    <XAxis
                        type="number"
                        allowDecimals={false}
                    />

                    <YAxis
                        type="category"
                        dataKey="name"
                        width={140}
                    />

                    <Tooltip />

                    <Bar
                        dataKey="quantity"
                        fill="#ef4444"
                        barSize={22}
                        radius={[0, 6, 6, 0]}

                    />
                </BarChart>
            </ResponsiveContainer>

        </div>
    );
}