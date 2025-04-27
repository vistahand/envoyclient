import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { HiOutlineRefresh } from "react-icons/hi";

// Fallback data in case API returns empty data
const FALLBACK_DATA = {
  deliveryTimeData: [
    { name: "Same Day", value: 35 },
    { name: "Next Day", value: 45 },
    { name: "2-3 Days", value: 15 },
    { name: "4+ Days", value: 5 },
  ],
  topDestinationsData: [
    { name: "New York", value: 25 },
    { name: "Los Angeles", value: 18 },
    { name: "Chicago", value: 15 },
    { name: "Houston", value: 12 },
    { name: "Other", value: 30 },
  ],
  carrierData: [
    { name: "FedEx", onTime: 92, delayed: 8 },
    { name: "UPS", onTime: 89, delayed: 11 },
    { name: "USPS", onTime: 85, delayed: 15 },
    { name: "DHL", onTime: 94, delayed: 6 },
  ],
  satisfactionData: [
    { month: "Nov", rating: 4.2 },
    { month: "Dec", rating: 4.3 },
    { month: "Jan", rating: 4.1 },
    { month: "Feb", rating: 4.4 },
    { month: "Mar", rating: 4.5 },
    { month: "Apr", rating: 4.6 },
  ],
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const SecondaryCharts = () => {
  const [analyticsData, setAnalyticsData] = useState({
    deliveryTimeData: [],
    topDestinationsData: [],
    carrierData: [],
    satisfactionData: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token safely
  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    return token ? token.replace(/^"|"$/g, "") : "";
  };

  // API base URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchAnalyticsChartsData();
  }, []);

  const fetchAnalyticsChartsData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${API_URL}/api/admin/analytics/charts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Process and set the data with fallbacks for empty arrays
      setAnalyticsData({
        deliveryTimeData: isEmptyDataArray(data.deliveryTimeData)
          ? FALLBACK_DATA.deliveryTimeData
          : data.deliveryTimeData,
        topDestinationsData: isEmptyDataArray(data.topDestinationsData)
          ? FALLBACK_DATA.topDestinationsData
          : data.topDestinationsData,
        carrierData: isEmptyDataArray(data.carrierData)
          ? FALLBACK_DATA.carrierData
          : data.carrierData,
        satisfactionData: isEmptyDataArray(data.satisfactionData)
          ? FALLBACK_DATA.satisfactionData
          : data.satisfactionData,
      });
    } catch (err) {
      console.error("Error fetching analytics charts data:", err);
      setError(err.message);
      // Use fallback data on error
      setAnalyticsData(FALLBACK_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if data array is empty or contains only empty values
  const isEmptyDataArray = (dataArray) => {
    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0)
      return true;

    // Check if all values are zero or empty
    return dataArray.every(
      (item) =>
        item.value === 0 ||
        item.value === undefined ||
        (item.onTime === 0 && item.delayed === 0)
    );
  };

  // Function to render responsive chart with conditional height
  const renderResponsiveChart = (chart, heightClass = "h-80") => {
    return (
      <div className={heightClass}>
        <ResponsiveContainer width="100%" height="100%">
          {chart}
        </ResponsiveContainer>
      </div>
    );
  };

  // Component to show when data is being loaded
  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
      <div className="flex flex-col items-center">
        <HiOutlineRefresh className="w-8 h-8 text-blue-600 animate-spin mb-2" />
        <p className="text-sm text-gray-600">Loading chart data...</p>
      </div>
    </div>
  );

  // Component to show when there's an error
  const ErrorDisplay = ({ message }) => (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
      <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-xs">
        <p className="text-sm text-red-700">Error: {message}</p>
        <button
          onClick={fetchAnalyticsChartsData}
          className="mt-2 text-xs bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Component to show when a chart has no data
  const NoDataDisplay = () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 text-sm">No data available</p>
        <p className="text-gray-400 text-xs mt-1">
          Using sample data for demonstration
        </p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
      {/* Delivery Time Distribution */}
      <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm relative">
        {isLoading && <LoadingOverlay />}
        {!isLoading && error && <ErrorDisplay message={error} />}

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-sm sm:text-base text-gray-700">
            Delivery Time Distribution
          </h2>
          {isEmptyDataArray(analyticsData.deliveryTimeData) && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
              Sample Data
            </span>
          )}
        </div>

        {renderResponsiveChart(
          <PieChart>
            <Pie
              data={analyticsData.deliveryTimeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {analyticsData.deliveryTimeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>,
          "h-56 sm:h-64"
        )}
      </div>

      {/* Top Destinations */}
      <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm relative">
        {isLoading && <LoadingOverlay />}
        {!isLoading && error && <ErrorDisplay message={error} />}

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-sm sm:text-base text-gray-700">
            Top Shipment Destinations
          </h2>
          {isEmptyDataArray(analyticsData.topDestinationsData) && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
              Sample Data
            </span>
          )}
        </div>

        {renderResponsiveChart(
          <PieChart>
            <Pie
              data={analyticsData.topDestinationsData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {analyticsData.topDestinationsData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>,
          "h-56 sm:h-64"
        )}
      </div>

      {/* Carrier Performance */}
      <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm relative">
        {isLoading && <LoadingOverlay />}
        {!isLoading && error && <ErrorDisplay message={error} />}

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-sm sm:text-base text-gray-700">
            Carrier Performance
          </h2>
          {isEmptyDataArray(analyticsData.carrierData) && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
              Sample Data
            </span>
          )}
        </div>

        {renderResponsiveChart(
          <BarChart
            data={analyticsData.carrierData}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 10 }}
              width={45}
            />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend wrapperStyle={{ fontSize: "10px" }} />
            <Bar dataKey="onTime" name="On Time %" stackId="a" fill="#4CAF50" />
            <Bar
              dataKey="delayed"
              name="Delayed %"
              stackId="a"
              fill="#FF5722"
            />
          </BarChart>,
          "h-56 sm:h-64"
        )}
      </div>
    </div>
  );
};

export default SecondaryCharts;
