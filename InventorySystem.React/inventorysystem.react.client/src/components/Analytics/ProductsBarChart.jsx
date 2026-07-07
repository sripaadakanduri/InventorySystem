import {

    ResponsiveContainer,

    BarChart,

    Bar,

    XAxis,

    YAxis,

    CartesianGrid,

    Tooltip

} from "recharts";
import { useState, useRef, useEffect } from "react";
export default function ProductsBarChart({ data }) {
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

                Products per Category

            </h2>

            <ResponsiveContainer width="100%" height={450} >

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
</>
    );

}