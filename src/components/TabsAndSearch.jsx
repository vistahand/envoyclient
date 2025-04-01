import React from "react";
import { FiSearch } from "react-icons/fi";

const TabsAndSearch = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mt-6">
      {/* Tabs Section */}
      <div className="flex space-x-6 border-b border-gray-300 pb-2">
        <button
          className={`text-lg font-medium ${
            activeTab === "active" ? "text-primary border-b-2 border-primary" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active
        </button>
        <button
          className={`text-lg font-medium ${
            activeTab === "unavailable" ? "text-primary border-b-2 border-primary" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("unavailable")}
        >
          Unavailable
        </button>
      </div>

      {/* Search Bar */}
      <div className="mt-4 relative w-full md:w-2/5"> {/* 👈 100% on small screens, 40% (2/5) on large screens */}
        <input
          type="text"
          placeholder="Search by name, state or province"
          className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-md bg-gray-100 outline-none"
        />
        <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
};

export default TabsAndSearch;
