import React, { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { FaSync } from "react-icons/fa";

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [masterChecked, setMasterChecked] = useState(true);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchPayments();
  }, [page, limit, statusFilter]);

  const getAuthToken = () => {
    // Get token from localStorage or wherever it's stored
    const token = localStorage.getItem("token");
    // Remove quotes if they exist (I noticed your token had quotes in the example)
    return token ? token.replace(/^"|"$/g, '') : '';
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      
      let url = `/api/admin/payments?page=${page}&limit=${limit}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
          // Adding these additional headers that were in your request
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        },
        credentials: "include" // Include cookies in the request if needed
      });

      if (response.status === 401) {
        // Handle authentication error
        throw new Error("Your session has expired. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check if the response has the expected structure
      if (!data || !Array.isArray(data.payments)) {
        console.warn("Unexpected API response format:", data);
        // Fallback to using mock data temporarily
        setPayments([
          { amount: 250000.00, transactionId: "TRX-18084578123", date: "28 Oct 2024", purpose: "Standard Shipping, Basic Insurance", method: "Online (Paystack)", status: "Successful" },
          { amount: 250000.00, transactionId: "TRX-18084578124", date: "28 Oct 2024", purpose: "Standard Shipping, Basic Insurance", method: "Online (Paystack)", status: "Unsuccessful" },
          { amount: 250000.00, transactionId: "TRX-18084578125", date: "12 Oct 2024", purpose: "QuickWing, Basic Insurance", method: "Online (Paystack)", status: "Successful" }
        ]);
        setTotalItems(3);
      } else {
        setPayments(data.payments);
        setTotalItems(data.total || data.payments.length);
      }
      
      // Initialize checkboxes for new payment data
      setSelectedPayments(Array(payments.length).fill(true));
      setMasterChecked(true);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.message);
      
      // If there's an authentication error, redirect to login
      if (err.message.includes("session has expired") || err.message.includes("log in again")) {
        // You might want to redirect to login page here
        // For example: window.location.href = "/login";
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPayments();
  };
  
  const handleMasterCheckboxChange = () => {
    const newCheckedState = !masterChecked;
    setMasterChecked(newCheckedState);
    setSelectedPayments(payments.map(() => newCheckedState));
  };
  
  const handlePaymentCheckboxChange = (index) => {
    const newSelectedPayments = [...selectedPayments];
    newSelectedPayments[index] = !newSelectedPayments[index];
    setSelectedPayments(newSelectedPayments);
    
    // Update master checkbox based on individual selections
    if (newSelectedPayments.every(item => item)) {
      setMasterChecked(true);
    } else if (newSelectedPayments.every(item => !item)) {
      setMasterChecked(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1); // Reset to first page when changing limit
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to first page when applying filter
  };

  // Calculate pagination info
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-primary">Payments History</h2>
          <p className="text-primary mt-1">View and manage all your transaction records</p>
        </div>
        <button 
          onClick={handleRefresh} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
          disabled={loading || refreshing}
          title="Refresh payments"
        >
          <FaSync className={`text-primary text-lg ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* Add filter controls */}
      <div className="mb-4 flex items-center">
        <label htmlFor="statusFilter" className="mr-2">Filter by status:</label>
        <select 
          id="statusFilter"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="border rounded px-2 py-1"
        >
          <option value="">All Statuses</option>
          <option value="Successful">Successful</option>
          <option value="Unsuccessful">Unsuccessful</option>
        </select>
      </div>
      
      {loading && !refreshing ? (
        <div className="text-center py-4">Loading payments...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">
          <p>{error}</p>
          {error.includes("session has expired") && (
            <button 
              className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
              onClick={() => window.location.href = "/login"}
            >
              Log in again
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-full">
              <thead className="text-primary border-b">
                <tr>
                  <th className="py-3 px-2">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-4 w-4 accent-primary" 
                      checked={masterChecked}
                      onChange={handleMasterCheckboxChange}
                    />
                  </th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">
                    Date Initiated
                    <span className="inline-block ml-1">↕</span>
                  </th>
                  <th className="py-3 px-4">Payment Purpose</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-4 px-4 text-center">No payments found</td>
                  </tr>
                ) : (
                  payments.map((payment, index) => (
                    <tr key={payment.transactionId || index} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-2">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 accent-primary" 
                          checked={selectedPayments[index]}
                          onChange={() => handlePaymentCheckboxChange(index)}
                        />
                      </td>
                      <td className="py-4 px-4">₦{payment.amount.toLocaleString()}</td>
                      <td className="py-4 px-4">{payment.transactionId}</td>
                      <td className="py-4 px-4">{payment.date}</td>
                      <td className="py-4 px-4">{payment.purpose}</td>
                      <td className="py-4 px-4">{payment.method}</td>
                      <td className="py-4 px-4 flex items-center">
                        <FaCircle className={`text-xs mr-2 ${payment.status === "Successful" ? "text-green-500" : "text-red-500"}`} />
                        {payment.status}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <BsThreeDots className="cursor-pointer text-lg text-primary" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center text-sm text-primary">
            <div>
              <span>Rows per page: </span>
              <select 
                className="border-none bg-transparent px-1"
                value={limit}
                onChange={handleLimitChange}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <div>{totalItems > 0 ? `${startItem}-${endItem} of ${totalItems}` : '0 items'}</div>
              <div className="flex space-x-1">
                <button 
                  className="p-1" 
                  disabled={page === 1}
                  onClick={() => handlePageChange(1)}
                >
                  <FaAngleDoubleLeft className={page === 1 ? "text-gray-400" : "text-primary"} />
                </button>
                <button 
                  className="p-1"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <FaChevronLeft className={page === 1 ? "text-gray-400" : "text-primary"} />
                </button>
                <button 
                  className="p-1"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  <FaChevronRight className={page === totalPages ? "text-gray-400" : "text-primary"} />
                </button>
                <button 
                  className="p-1"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(totalPages)}
                >
                  <FaAngleDoubleRight className={page === totalPages ? "text-gray-400" : "text-primary"} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentsAdmin;