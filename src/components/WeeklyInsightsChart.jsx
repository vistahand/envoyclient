import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const InsightsChart = () => {
  const [filter, setFilter] = useState("weekly");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  // Get auth token function
  const getAuthToken = () => {
    // This should return the authentication token from wherever you store it
    // For example, from localStorage:
    return localStorage.getItem('authToken');
  };

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();
        
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }
        
        const response = await fetch(`${API_URL}/api/admin/dashboard/charts?type=${filter}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setChartData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError(err.message || "Failed to load chart data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [filter]);

  // Determine the correct key for X-axis based on filter
  const getXAxisKey = () => {
    switch (filter) {
      case "yearly":
        return "month";
      case "monthly":
        return "week";
      default:
        return "day";
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 2 }}>
              <CartesianGrid stroke="#ccc" />
              <XAxis
                dataKey={getXAxisKey()}
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
        </>
      )}
    </div>
  );
};

export default InsightsChart;