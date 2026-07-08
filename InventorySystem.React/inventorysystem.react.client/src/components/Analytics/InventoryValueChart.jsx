import {

    ResponsiveContainer,

    BarChart,

    Bar,
    Tooltip,

    XAxis,

    YAxis

} from "recharts";
import { useState, useRef, useEffect } from "react";
export default function InventoryValueChart({ data }) {
    const [expanded, setExpanded] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setExpanded(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
<>
            {expanded && (
                <div className="fixed inset-0 bg-black/60 z-40" />
            )}

            <div
                ref={cardRef}
                onClick={() => setExpanded(true)}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-300
                ${
                    expanded
                        ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-130 z-50 w-[700px] duration-500"
                        : "relative scale-100 duration-500"
                }`}
            >
            <h2 className="text-xl font-semibold mb-6">

                Inventory Value by Category

            </h2>

            <ResponsiveContainer width="100%" height={450} className="group-hover:scale-102 transition-transform duration-300">

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
</>
    );

}