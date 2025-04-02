import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weeklyData = [
  { day: "0", shipments: 500, delivered: 400 },
  { day: "1", shipments: 200, delivered: 150 },
  { day: "2", shipments: 600, delivered: 500 },
  { day: "3", shipments: 150, delivered: 100 },
  { day: "4", shipments: 620, delivered: 500 },
  { day: "5", shipments: 250, delivered: 200 },
  { day: "6", shipments: 200, delivered: 150 },
];

const monthlyData = [
  { week: "W1", shipments: 1500, delivered: 1300 },
  { week: "W2", shipments: 2100, delivered: 1800 },
  { week: "W3", shipments: 1800, delivered: 1600 },
  { week: "W4", shipments: 2200, delivered: 1900 },
];

const yearlyData = [
  { month: "Jan", shipments: 8000, delivered: 7200 },
  { month: "Feb", shipments: 7500, delivered: 6800 },
  { month: "Mar", shipments: 9000, delivered: 8300 },
  { month: "Apr", shipments: 8500, delivered: 7800 },
  { month: "May", shipments: 9200, delivered: 8500 },
  { month: "Jun", shipments: 8800, delivered: 8100 },
  { month: "Jul", shipments: 9700, delivered: 8900 },
  { month: "Aug", shipments: 9100, delivered: 8400 },
  { month: "Sep", shipments: 9400, delivered: 8700 },
  { month: "Oct", shipments: 9900, delivered: 9100 },
  { month: "Nov", shipments: 8600, delivered: 7800 },
  { month: "Dec", shipments: 9300, delivered: 8600 },
];

const InsightsChart = () => {
  const [filter, setFilter] = useState("weekly");

  const getData = () => {
    switch (filter) {
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  return (
    <div className="bg-white p-3 sm:p-0 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h2 className="font-semibold text-sm sm:text-base text-gray-700">
          {filter.charAt(0).toUpperCase() + filter.slice(1)} Shipment Insights
        </h2>
        <div className="flex flex-wrap w-full sm:w-auto justify-start gap-1 bg-gray-100 p-1 rounded-lg">
          {["weekly", "monthly", "yearly"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md transition ${
                filter === type ? "bg-[#1f2d5c] text-white" : "text-gray-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
      <BarChart data={getData()} margin={{ top: 0, right: 0, left: 0, bottom: 2 }}>
      <CartesianGrid stroke="#ccc" />
          <XAxis
            dataKey={filter === "yearly" ? "month" : filter === "monthly" ? "week" : "day"}
            tick={{ fontSize: 10, fill: "#333" }}
          />
          <YAxis tick={{ fontSize: 12, fill: "#333" }} />
          <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
          <Bar dataKey="shipments" name="Total Shipments" fill="#1f2d5c" barSize={20} radius={[3, 3, 0, 0]} />
          <Bar dataKey="delivered" name="Delivered" fill="#4CAF50" barSize={20} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center mt-4 space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#4CAF50] rounded-full mr-2"></div>
          <span>Delivered</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#1f2d5c] rounded-full mr-2"></div>
          <span>Total shipments</span>
        </div>
      </div>
    </div>
  );
};

export default InsightsChart;
