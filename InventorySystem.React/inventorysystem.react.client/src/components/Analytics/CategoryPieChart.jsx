import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";
import { useState, useRef, useEffect } from "react";
const COLORS = [
    "#3B82F6", // Blue
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Violet
    "#06B6D4", // Cyan
    "#EC4899", // Pink
    "#84CC16", // Lime
    "#F97316", // Orange
    "#6366F1"  // Indigo
];

export default function CategoryPieChart({ data }) {
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
    // Sort categories by value (highest first)
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // Keep only top 6 categories
    const topCategories = sortedData.slice(0,10);

    // Combine remaining categories into "Others"
    const othersValue = sortedData
        .slice(10)
        .reduce((sum, item) => sum + item.value, 0);

    const chartData = othersValue > 0
        ? [
            ...topCategories,
            {
                name: "Others",
                value: othersValue
            }
        ]
        : topCategories;

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
            >            <h2 className="text-xl font-semibold mb-6">
                Product Category Distribution
            </h2>

            <ResponsiveContainer width="100%" height={420} className="group-hover:scale-102 transition-transform duration-300">
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={100}
                        outerRadius={200}
                        paddingAngle={1}
                        cornerRadius={8}
                        stroke="#fff"
                        strokeWidth={2}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(value, name, props) => [
                            `${value} Products`,
                            props.payload.name
                        ]}
                    />

                    
                </PieChart>
            </ResponsiveContainer>
        </div>
        </>
    );
}