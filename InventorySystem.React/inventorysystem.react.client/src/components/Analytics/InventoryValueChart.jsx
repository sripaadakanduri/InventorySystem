import {

    ResponsiveContainer,

    BarChart,

    Bar,

    CartesianGrid,

    Tooltip,

    XAxis,

    YAxis

} from "recharts";

export default function InventoryValueChart({ data }) {

    return (

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

            <h2 className="text-xl font-semibold mb-6">

                Inventory Value by Category

            </h2>

            <ResponsiveContainer width="100%" height={400}>

                <BarChart data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 30,
                        bottom: 10
                    }}>

                    <XAxis dataKey="category" />

                    <YAxis />

                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />

                    <Bar
                        dataKey="value"
                        fill="#22c55e"
                        radius={[6, 6, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}