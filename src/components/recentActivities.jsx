import React, { useState, useEffect } from "react";
import {
  HiOutlineClock,
  HiOutlineRefresh,
  HiOutlineUserCircle,
  HiOutlineTruck,
  HiOutlineCash,
} from "react-icons/hi";
import { format, formatDistanceToNow } from "date-fns";

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      // Get token from local storage or context
      let token = localStorage.getItem("authToken"); // Adjust based on how you store tokens

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Fix: Remove quotes if they exist around the token
      if (token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }

      // Log token info (first few characters) for debugging
      const tokenStart = token.substring(0, 15) + "...";
      console.log(`Using token beginning with: ${tokenStart}`);

      // Use environment variable for API URL
      const apiUrl = import.meta.env.VITE_API_URL;
      const endpoint = `${apiUrl}/api/admin/recent-activity`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`, // Fixed: No quotes around token
        },
      });

      const responseText = await response.text();

      try {
        // Try to parse as JSON
        const responseData = responseText ? JSON.parse(responseText) : [];

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              `Unauthorized: ${responseData.message || "Please log in again"}`
            );
          }
          throw new Error(
            `Error ${response.status}: ${
              responseData.message || response.statusText
            }`
          );
        }

        setActivities(responseData);
        setError(null);
      } catch (jsonError) {
        // Handle non-JSON responses

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Please log in again");
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
    } catch (err) {
      console.error("Failed to fetch recent activities:", err);
      setError(
        err.message ||
          "Failed to load recent activities. Please try again later."
      );

      // Fallback: Display dummy data if in development mode
      if (import.meta.env.DEV) {
        console.log("Using fallback data in development mode");
        setActivities(getDummyActivities());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Function to get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "user":
        return <HiOutlineUserCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "shipment":
        return <HiOutlineTruck className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "payment":
        return <HiOutlineCash className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <HiOutlineClock className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  // Function to format date
  const formatActivityDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return {
        relative: formatDistanceToNow(date, { addSuffix: true }),
        full: format(date, "MMM d, yyyy 'at' h:mm a"),
      };
    } catch (err) {
      return { relative: "Unknown date", full: "Unknown date" };
    }
  };

  // Function to get background color based on activity type
  const getActivityBgColor = (type) => {
    switch (type) {
      case "user":
        return "bg-blue-100";
      case "shipment":
        return "bg-green-100";
      case "payment":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  };

  // Function to get text color based on activity type
  const getActivityTextColor = (type) => {
    switch (type) {
      case "user":
        return "text-blue-600";
      case "shipment":
        return "text-green-600";
      case "payment":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="font-semibold text-sm sm:text-base text-gray-700">
          Recent Activities
        </h2>
        <button
          onClick={fetchActivities}
          className="text-xs sm:text-sm text-blue-600 font-medium flex items-center gap-1"
        >
          <HiOutlineRefresh
            className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-xs sm:text-sm">
          {error}
          {import.meta.env.DEV && activities.length > 0 && (
            <div className="mt-1 text-xs">
              Using fallback data for development
            </div>
          )}
        </div>
      )}

      <div className="overflow-y-auto max-h-80 pr-1">
        {loading && activities.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse text-gray-400 text-sm">
              Loading activities...
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No recent activities found
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {activities.map((activity) => {
              const dateInfo = formatActivityDate(activity.timestamp);
              return (
                <li
                  key={`${activity.type}-${activity.id}`}
                  className="py-3 sm:py-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 rounded-full p-2 ${getActivityBgColor(
                        activity.type
                      )} ${getActivityTextColor(activity.type)}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        by <span className="font-medium">{activity.user}</span>
                      </p>
                      <p
                        className="text-xs text-gray-400 mt-1"
                        title={dateInfo.full}
                      >
                        {dateInfo.relative}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xxs sm:text-xs font-medium rounded-full ${getActivityBgColor(
                          activity.type
                        )} ${getActivityTextColor(activity.type)} capitalize`}
                      >
                        {activity.type}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
