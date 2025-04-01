import React, { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs"; // Horizontal dots icon
import { GoPlus } from "react-icons/go";
import { FiSearch } from "react-icons/fi";


const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://api.example.com/users"); // Replace with actual API
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center w-full pb-4">
        <div>
          <h2 className="text-[22px] font-semibold text-primary">User Management</h2>
          <p className="text-[15px] text-gray-600">
            View and manage all registered users on the platform.
          </p>
        </div>

        {/* Create New User Button */}
         <button
          type="button"
          onClick={() => setCreating(true)} // Switch to create mode
          className="bg-primary text-white flex items-center justify-center gap-3 rounded-lg md:rounded-xl transition-all cursor-pointer 
                     px-2.5 py-2.5 md:px-6 md:py-3 text-[13px] md:text-[14px] ss:text-[15px] md:w-auto ss:w-[27%] sm:w-10 sm:h-10"
        >
          <span className="hidden md:block">Create New User</span>
          <GoPlus className="text-[20px]" />
        </button>
      </div>

       {/* Search Bar */}
       <div className="mt-4 relative w-full md:w-2/5"> {/* 👈 100% on small screens, 40% (2/5) on large screens */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-md bg-gray-100 outline-none"
        />
        <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      {/* User Table */}
      <table className="w-full mt-4">
        <thead className="text-[14px] font-medium text-gray-600">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-center">Options</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-gray-700 font-bold">
          {users
            .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((user, index) => (
              <tr key={index} className="hover:bg-gray-100 border-b cursor-pointer">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.role}</td>
                <td className="py-3 px-4">{user.status}</td>
                <td className="py-3 px-4 flex justify-center items-center">
                  <BsThreeDots className="cursor-pointer text-xl" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
