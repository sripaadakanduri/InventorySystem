import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
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
    "#6366F1", // Indigo
];

export default function CategoryPieChart({ data }) {
    const [expanded, setExpanded] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                cardRef.current &&
                !cardRef.current.contains(event.target)
            ) {
                setExpanded(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // Sort categories by value
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // Keep top 10
    const topCategories = sortedData.slice(0, 10);

    // Combine remaining into "Others"
    const othersValue = sortedData
        .slice(10)
        .reduce((sum, item) => sum + item.value, 0);

    const chartData =
        othersValue > 0
            ? [
                  ...topCategories,
                  {
                      name: "Others",
                      value: othersValue,
                  },
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
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-300 ${
                    expanded
                        ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[700px] scale-110"
                        : "relative"
                }`}
            >
                <h2 className="text-xl font-semibold mb-4">
                    Product Category Distribution
                </h2>

                <div className="h-[420px] flex flex-col items-center justify-between">
                    {/* Pie Chart */}
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={120}
                                    paddingAngle={1}
                                    cornerRadius={8}
                                    stroke="#fff"
                                    strokeWidth={2}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={
                                                COLORS[
                                                    index % COLORS.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    formatter={(value, name, props) => [
                                        `${value} Products`,
                                        props.payload.name,
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="w-full">
                        <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                            {chartData.map((item, index) => (
                                <div
                                    key={item.name}
                                    className="flex items-center gap-2"
                                    title={`${item.name}: ${item.value} Products`}
                                >
                                    <span
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{
                                            backgroundColor:
                                                COLORS[
                                                    index % COLORS.length
                                                ],
                                        }}
                                    />

                                    <span className="text-sm text-gray-700 truncate">
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}