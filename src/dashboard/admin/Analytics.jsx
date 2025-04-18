import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  // LineChart, Line,
} from "recharts";
import { HiOutlineRefresh, HiOutlineDownload } from "react-icons/hi";
import RecentActivities from "../../components/recentActivities";
import SecondaryCharts from "../../components/SecondaryCharts";

// // Customer satisfaction data (last 6 months)
// const satisfactionData = [
//   { month: 'Nov', rating: 4.2 },
//   { month: 'Dec', rating: 4.3 },
//   { month: 'Jan', rating: 4.1 },
//   { month: 'Feb', rating: 4.4 },
//   { month: 'Mar', rating: 4.5 },
//   { month: 'Apr', rating: 4.6 }
// ];

const Analytics = () => {
  const [shipmentFilter, setShipmentFilter] = useState("weekly");
  const [dateRange, setDateRange] = useState("last30");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalShipments: 0,
    activeShipments: 0,
    shipmentsToday: 0,
    deliveredToday: 0,
    pendingShipments: 0,
    revenue: 0,
    totalUsers: 0,
    newUsersToday: 0,
  });
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);

  // API base URL from environment variable
  const API_URL =
    import.meta.env.VITE_API_URL || "https://envoyserver-pyxd.onrender.com";

  // Get auth token safely
  const getAuthToken = () => {
    // Get token from localStorage or wherever it's stored
    const token = localStorage.getItem("token");
    // Remove quotes if they exist
    return token ? token.replace(/^"|"$/g, "") : "";
  };

  useEffect(() => {
    fetchShipmentData();
    fetchDashboardData();
  }, [shipmentFilter, dateRange]);

  // New function to fetch dashboard data
  const fetchDashboardData = async () => {
    setIsDashboardLoading(true);
    setDashboardError(null);

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
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
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setDashboardError(err.message);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  const fetchShipmentData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `${API_URL}/api/admin/dashboard/charts?type=${shipmentFilter}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Transform the data to ensure it has shipments, delivered, and delayed properties
      const transformedData = data.map((item) => ({
        ...item,
        delayed: item.delayed || item.shipments - item.delivered || 0,
      }));

      setChartData(transformedData);
    } catch (err) {
      console.error("Error fetching shipment data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual refresh - update to refresh both data sets
  const handleRefreshData = () => {
    fetchShipmentData();
    fetchDashboardData();
  };

  // Custom responsive legend component for small screens
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center mt-2 px-2">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center mx-2 mb-1">
            <div
              className="h-3 w-3 rounded-sm mr-1"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
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

  // Get the X-axis key based on filter type
  const getXAxisDataKey = () => {
    if (chartData.length === 0) return "name";

    const firstItem = chartData[0] || {};

    if (shipmentFilter === "yearly" && "month" in firstItem) {
      return "month";
    } else if (shipmentFilter === "monthly" && "week" in firstItem) {
      return "week";
    } else if (shipmentFilter === "weekly" && "day" in firstItem) {
      return "day";
    }

    // Fallback to a key that exists in the data
    const possibleKeys = ["day", "week", "month", "date"];
    for (const key of possibleKeys) {
      if (key in firstItem) {
        return key;
      }
    }

    return "name";
  };

  // Function to render stat loading placeholder
  const renderStatLoadingPlaceholder = () => (
    <div className="animate-pulse h-6 w-16 bg-gray-200 rounded"></div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-3 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Comprehensive logistics performance metrics
          </p>
        </div>
        <div className="flex flex-wrap w-full sm:w-auto justify-between sm:justify-start gap-2 sm:space-x-4">
          <button
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-xs sm:text-sm font-medium"
            onClick={handleRefreshData}
            disabled={isLoading || isDashboardLoading}
          >
            <HiOutlineRefresh
              className={`w-4 h-4 ${
                isLoading || isDashboardLoading ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline">
              {isLoading || isDashboardLoading ? "Loading..." : "Refresh Data"}
            </span>
            <span className="sm:hidden">
              {isLoading || isDashboardLoading ? "Loading..." : "Refresh"}
            </span>
          </button>
        </div>
      </div>

      {/* Date Range Selector - COMMENTED OUT BECAUSE ENDPOINT IS NOT READY YET */}
      {/* 
      <div className="mb-6 bg-white p-3 sm:p-4 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h2 className="text-gray-700 font-semibold text-sm sm:text-base">Date Range</h2>
          <div className="flex flex-wrap w-full sm:w-auto justify-start gap-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: "last7", label: "7 Days", fullLabel: "Last 7 Days" },
              { id: "last30", label: "30 Days", fullLabel: "Last 30 Days" },
              { id: "last90", label: "90 Days", fullLabel: "Last 90 Days" },
              { id: "custom", label: "Custom", fullLabel: "Custom" }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setDateRange(range.id)}
                className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md transition whitespace-nowrap ${
                  dateRange === range.id ? "bg-[#1f2d5c] text-white" : "text-gray-700"
                }`}
              >
                <span className="hidden sm:inline">{range.fullLabel}</span>
                <span className="sm:hidden">{range.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      */}

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6">
        {/* Active Shipments Card */}
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Active Shipments
              </p>
              <h3 className="text-xl sm:text-3xl font-bold text-gray-800 mt-1">
                {isDashboardLoading
                  ? renderStatLoadingPlaceholder()
                  : dashboardData.activeShipments}
              </h3>
            </div>
            <div className="bg-blue-100 h-8 w-8 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center">
              <div className="text-blue-600 text-sm sm:text-base">📦</div>
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
            <span className="text-green-500 font-medium flex items-center">
              +12%
              <svg
                className="w-2 h-2 sm:w-3 sm:h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </span>
            <span className="text-gray-500 ml-1 sm:ml-2 text-xs">
              from last week
            </span>
          </div>
        </div>

        {/* Shipments Today Card */}
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Shipments Today
              </p>
              <h3 className="text-xl sm:text-3xl font-bold text-gray-800 mt-1">
                {isDashboardLoading
                  ? renderStatLoadingPlaceholder()
                  : dashboardData.shipmentsToday}
              </h3>
            </div>
            <div className="bg-green-100 h-8 w-8 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center">
              <div className="text-green-600 text-sm sm:text-base">🚚</div>
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
            <span className="text-green-500 font-medium flex items-center">
              +5%
              <svg
                className="w-2 h-2 sm:w-3 sm:h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </span>
            <span className="text-gray-500 ml-1 sm:ml-2 text-xs">
              from yesterday
            </span>
          </div>
        </div>

        {/* Delivered Today Card */}
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Delivered Today
              </p>
              <h3 className="text-xl sm:text-3xl font-bold text-gray-800 mt-1">
                {isDashboardLoading
                  ? renderStatLoadingPlaceholder()
                  : dashboardData.deliveredToday}
              </h3>
            </div>
            <div className="bg-yellow-100 h-8 w-8 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center">
              <div className="text-yellow-600 text-sm sm:text-base">✅</div>
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
            <span className="text-red-500 font-medium flex items-center">
              -3%
              <svg
                className="w-2 h-2 sm:w-3 sm:h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </span>
            <span className="text-gray-500 ml-1 sm:ml-2 text-xs">
              from yesterday
            </span>
          </div>
        </div>

        {/* Pending Shipments Card */}
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Pending Shipments
              </p>
              <h3 className="text-xl sm:text-3xl font-bold text-gray-800 mt-1">
                {isDashboardLoading
                  ? renderStatLoadingPlaceholder()
                  : dashboardData.pendingShipments}
              </h3>
            </div>
            <div className="bg-purple-100 h-8 w-8 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center">
              <div className="text-purple-600 text-sm sm:text-base">⏱️</div>
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
            <span className="text-red-500 font-medium flex items-center">
              +8%
              <svg
                className="w-2 h-2 sm:w-3 sm:h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </span>
            <span className="text-gray-500 ml-1 sm:ml-2 text-xs">
              from last week
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Shipment Insights */}
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="font-semibold text-sm sm:text-base text-gray-700">
              {shipmentFilter.charAt(0).toUpperCase() + shipmentFilter.slice(1)}{" "}
              Shipment Insights
              {isLoading && (
                <span className="text-xs text-gray-500 ml-2">(Loading...)</span>
              )}
              {error && (
                <span className="text-xs text-red-500 ml-2">({error})</span>
              )}
            </h2>
            <div className="flex flex-wrap w-full sm:w-auto justify-start gap-1 bg-gray-100 p-1 rounded-lg">
              {["weekly", "monthly", "yearly"].map((type) => (
                <button
                  key={type}
                  onClick={() => setShipmentFilter(type)}
                  className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md transition ${
                    shipmentFilter === type
                      ? "bg-[#1f2d5c] text-white"
                      : "text-gray-700"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {renderResponsiveChart(
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 15 }}
            >
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis
                dataKey={getXAxisDataKey()}
                tick={{ fontSize: 10, fill: "#333" }}
              />
              <YAxis tick={{ fontSize: 10, fill: "#333" }} width={30} />
              <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
              <Legend
                content={window.innerWidth < 768 ? <CustomLegend /> : undefined}
              />
              <Bar
                dataKey="shipments"
                name="Total Shipments"
                fill="#1f2d5c"
                barSize={20}
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="delivered"
                name="Delivered"
                fill="#4CAF50"
                barSize={20}
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="delayed"
                name="Delayed"
                fill="#FF5722"
                barSize={20}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>,
            "h-64 sm:h-80"
          )}
        </div>

        {/* Customer Satisfaction - COMMENTED OUT */}
        {/* 
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="font-semibold text-sm sm:text-base text-gray-700">Customer Satisfaction Trend</h2>
          </div>
          {renderResponsiveChart(
            <LineChart data={satisfactionData} margin={{ top: 10, right: 10, left: 0, bottom: 15 }}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#333" }} />
              <YAxis
                tick={{ fontSize: 10, fill: "#333" }}
                domain={[3.5, 5]}
                width={30}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rating"
                name="Customer Rating"
                stroke="#1f2d5c"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>,
            "h-64 sm:h-80"
          )}
        </div>
        */}
      </div>

      {/* Import the Secondary Charts instead of inline code */}
      <SecondaryCharts />

      {/* Display dashboard error if exists */}
      {dashboardError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-6">
          <p className="text-sm font-medium">
            Error loading dashboard data: {dashboardError}
          </p>
        </div>
      )}

      <RecentActivities />
    </div>
  );
};

export default Analytics;
