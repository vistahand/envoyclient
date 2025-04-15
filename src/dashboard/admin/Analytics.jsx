import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import {  HiOutlineRefresh, HiOutlineDownload } from "react-icons/hi";
import RecentActivities from "../../components/recentActivities";

// Sample data (taken from your provided code)
const weeklyData = [
  { day: "Sun", shipments: 500, delivered: 420, delayed: 80 },
  { day: "Mon", shipments: 200, delivered: 150, delayed: 50 },
  { day: "Tue", shipments: 600, delivered: 520, delayed: 80 },
  { day: "Wed", shipments: 150, delivered: 100, delayed: 50 },
  { day: "Thu", shipments: 620, delivered: 580, delayed: 40 },
  { day: "Fri", shipments: 250, delivered: 200, delayed: 50 },
  { day: "Sat", shipments: 200, delivered: 180, delayed: 20 },
];

const monthlyData = [
  { week: "W1", shipments: 1500, delivered: 1320, delayed: 180 },
  { week: "W2", shipments: 2100, delivered: 1850, delayed: 250 },
  { week: "W3", shipments: 1800, delivered: 1600, delayed: 200 },
  { week: "W4", shipments: 2200, delivered: 1950, delayed: 250 },
];

const yearlyData = [
  { month: "Jan", shipments: 8000, delivered: 7200, delayed: 800 },
  { month: "Feb", shipments: 7500, delivered: 6750, delayed: 750 },
  { month: "Mar", shipments: 9000, delivered: 8100, delayed: 900 },
  { month: "Apr", shipments: 8500, delivered: 7650, delayed: 850 },
  { month: "May", shipments: 9200, delivered: 8280, delayed: 920 },
  { month: "Jun", shipments: 8800, delivered: 7920, delayed: 880 },
  { month: "Jul", shipments: 9700, delivered: 8730, delayed: 970 },
  { month: "Aug", shipments: 9100, delivered: 8190, delayed: 910 },
  { month: "Sep", shipments: 9400, delivered: 8460, delayed: 940 },
  { month: "Oct", shipments: 9900, delivered: 8910, delayed: 990 },
  { month: "Nov", shipments: 8600, delivered: 7740, delayed: 860 },
  { month: "Dec", shipments: 9300, delivered: 8370, delayed: 930 },
];

// Delivery times data
const deliveryTimeData = [
  { name: 'Same Day', value: 35 },
  { name: 'Next Day', value: 45 },
  { name: '2-3 Days', value: 15 },
  { name: '4+ Days', value: 5 }
];

// Top destinations data
const topDestinationsData = [
  { name: 'New York', value: 25 },
  { name: 'Los Angeles', value: 18 },
  { name: 'Chicago', value: 15 },
  { name: 'Houston', value: 12 },
  { name: 'Other', value: 30 }
];

// Carrier performance data
const carrierData = [
  { name: 'FedEx', onTime: 92, delayed: 8 },
  { name: 'UPS', onTime: 89, delayed: 11 },
  { name: 'USPS', onTime: 85, delayed: 15 },
  { name: 'DHL', onTime: 94, delayed: 6 }
];

// Customer satisfaction data (last 6 months)
const satisfactionData = [
  { month: 'Nov', rating: 4.2 },
  { month: 'Dec', rating: 4.3 },
  { month: 'Jan', rating: 4.1 },
  { month: 'Feb', rating: 4.4 },
  { month: 'Mar', rating: 4.5 },
  { month: 'Apr', rating: 4.6 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const [shipmentFilter, setShipmentFilter] = useState("weekly");
  const [dateRange, setDateRange] = useState("last30");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getShipmentData = () => {
    switch (shipmentFilter) {
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  // Custom responsive legend component for small screens
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center mt-2 px-2">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center mx-2 mb-1">
            <div className="h-3 w-3 rounded-sm mr-1" style={{ backgroundColor: entry.color }} />
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

  return (
    <div className="bg-gray-50 min-h-screen p-3 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-sm text-gray-600">Comprehensive logistics performance metrics</p>
        </div>
        <div className="flex flex-wrap w-full sm:w-auto justify-between sm:justify-start gap-2 sm:space-x-4">
          <button className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-xs sm:text-sm font-medium">
            <HiOutlineRefresh className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh Data</span>
            <span className="sm:hidden">Refresh</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-xs sm:text-sm font-medium">
            <HiOutlineDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
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

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6">
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Active Shipments</p>
              <h3 className="text-xl sm:text-3xl font-bold text-gray-800 mt-1">58</h3>
            </div>
            <div className="bg-blue-100 h-8 w-8 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center">
              <div className="text-blue-600 text-sm sm:text-base">📦</div>
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
            <span className="text-green-500 font-medium flex items-center">
              +12%
              <svg className="w-2 h-2 sm:w-3 sm:h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </span>
            <span className="text-gray-500 ml-1 sm:ml-2 text-xs">from last week</span>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Shipments Today</p>
              <h3 className="text-xl sm:text-3xl font-bold text-gray-800 mt-1">25</h3>
            </div>
            <div className="bg-green-100 h-8 w-8 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center">
              <div className="text-green-600 text-sm sm:text-base">🚚</div>
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
            <span className="text-green-500 font-medium flex items-center">
              +5%
              <svg className="w-2 h-2 sm:w-3 sm:h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </span>
            <span className="text-gray-500 ml-1 sm:ml-2 text-xs">from yesterday</span>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Delivered Today</p>
              <h3 className="text-xl sm:text-3xl font-bold text-gray-800 mt-1">18</h3>
            </div>
            <div className="bg-yellow-100 h-8 w-8 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center">
              <div className="text-yellow-600 text-sm sm:text-base">✅</div>
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
            <span className="text-red-500 font-medium flex items-center">
              -3%
              <svg className="w-2 h-2 sm:w-3 sm:h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
            <span className="text-gray-500 ml-1 sm:ml-2 text-xs">from yesterday</span>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Pending Shipments</p>
              <h3 className="text-xl sm:text-3xl font-bold text-gray-800 mt-1">15</h3>
            </div>
            <div className="bg-purple-100 h-8 w-8 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center">
              <div className="text-purple-600 text-sm sm:text-base">⏱️</div>
            </div>
          </div>
          <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
            <span className="text-red-500 font-medium flex items-center">
              +8%
              <svg className="w-2 h-2 sm:w-3 sm:h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </span>
            <span className="text-gray-500 ml-1 sm:ml-2 text-xs">from last week</span>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Shipment Insights */}
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="font-semibold text-sm sm:text-base text-gray-700">
              {shipmentFilter.charAt(0).toUpperCase() + shipmentFilter.slice(1)} Shipment Insights
            </h2>
            <div className="flex flex-wrap w-full sm:w-auto justify-start gap-1 bg-gray-100 p-1 rounded-lg">
              {["weekly", "monthly", "yearly"].map((type) => (
                <button
                  key={type}
                  onClick={() => setShipmentFilter(type)}
                  className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md transition ${
                    shipmentFilter === type ? "bg-[#1f2d5c] text-white" : "text-gray-700"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {renderResponsiveChart(
            <BarChart data={getShipmentData()} margin={{ top: 10, right: 10, left: 0, bottom: 15 }}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis
                dataKey={shipmentFilter === "yearly" ? "month" : shipmentFilter === "monthly" ? "week" : "day"}
                tick={{ fontSize: 10, fill: "#333" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#333" }}
                width={30}
              />
              <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
              <Legend content={window.innerWidth < 768 ? <CustomLegend /> : undefined} />
              <Bar dataKey="shipments" name="Total Shipments" fill="#1f2d5c" barSize={20} radius={[3, 3, 0, 0]} />
              <Bar dataKey="delivered" name="Delivered" fill="#4CAF50" barSize={20} radius={[3, 3, 0, 0]} />
              <Bar dataKey="delayed" name="Delayed" fill="#FF5722" barSize={20} radius={[3, 3, 0, 0]} />
            </BarChart>,
            "h-64 sm:h-80"
          )}
        </div>

        {/* Customer Satisfaction */}
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
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Delivery Time Distribution */}
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">Delivery Time Distribution</h2>
          {renderResponsiveChart(
            <PieChart>
              <Pie
                data={deliveryTimeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={window.innerWidth < 768 ? 60 : 80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => window.innerWidth < 768 ? 
                  `${(percent * 100).toFixed(0)}%` :
                  `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {deliveryTimeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend 
                layout={window.innerWidth < 768 ? "horizontal" : "vertical"} 
                verticalAlign={window.innerWidth < 768 ? "bottom" : "middle"} 
                align={window.innerWidth < 768 ? "center" : "right"}
                wrapperStyle={window.innerWidth < 768 ? { fontSize: "10px" } : {}}
              />
            </PieChart>,
            "h-56 sm:h-64"
          )}
        </div>

        {/* Top Destinations */}
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">Top Shipment Destinations</h2>
          {renderResponsiveChart(
            <PieChart>
              <Pie
                data={topDestinationsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={window.innerWidth < 768 ? 60 : 80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => window.innerWidth < 768 ? 
                  `${(percent * 100).toFixed(0)}%` :
                  `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {topDestinationsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend 
                layout={window.innerWidth < 768 ? "horizontal" : "vertical"} 
                verticalAlign={window.innerWidth < 768 ? "bottom" : "middle"} 
                align={window.innerWidth < 768 ? "center" : "right"}
                wrapperStyle={window.innerWidth < 768 ? { fontSize: "10px" } : {}}
              />
            </PieChart>,
            "h-56 sm:h-64"
          )}
        </div>

        {/* Carrier Performance */}
        <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">Carrier Performance</h2>
          {renderResponsiveChart(
            <BarChart
              data={carrierData}
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
              <Bar dataKey="delayed" name="Delayed %" stackId="a" fill="#FF5722" />
            </BarChart>,
            "h-56 sm:h-64"
          )}
        </div>
      </div>

      <RecentActivities />
    </div>
  );
};

export default Analytics
;