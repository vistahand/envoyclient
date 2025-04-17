import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { BsThreeDots } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { FaSync } from "react-icons/fa";
import { admin } from "../../services/api";

const PaymentsAdmin = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
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
  const [methodFilter, setMethodFilter] = useState(""); // New filter for payment method

  useEffect(() => {
    fetchPayments();
  }, [page, limit]); // Remove filters from dependency as we'll handle filtering client-side

  useEffect(() => {
    // Apply filters client-side
    applyFilters();
  }, [statusFilter, methodFilter, payments]);

  const applyFilters = () => {
    let result = [...payments];
    
    // Apply status filter
    if (statusFilter) {
      const statusMap = {
        "completed": "Successful",
        "pending": "Pending",
        "failed": "Unsuccessful"
      };
      result = result.filter(payment => payment.status === statusMap[statusFilter]);
    }
    
    // Apply method filter
    if (methodFilter) {
      result = result.filter(payment => payment.rawMethod === methodFilter);
    }
    
    setFilteredPayments(result);
    setTotalItems(result.length);
    setSelectedPayments(Array(result.length).fill(true));
    setMasterChecked(true);
  };

  const getAuthToken = () => {
    // Get token from localStorage or wherever it's stored
    const token = localStorage.getItem("token");
    // Remove quotes if they exist
    return token ? token.replace(/^"|"$/g, '') : '';
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await admin.payments.getAll();
      console.log(response)
      const data = response
      
      // Transform the incoming data to match expected format
      if (data && data.items && Array.isArray(data.items)) {
        const transformedPayments = data.items.map(item => ({
          amount: item.amount || 0,
          currency: item.currency || "USD",
          transactionId: item.transactionId || 'Nil', 
          date: new Date(item.createdAt).toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'}),
          purpose: item.trackingNumber ? `Shipping (${item.trackingNumber})` : "Payment Processing",
          rawMethod: item.method, // Store raw method for filtering
          status: item.status === "completed" ? "Successful" : item.status === 'pending' ? 'Pending' : "Unsuccessful",
          _id: item._id // Keep original ID for reference
        }));
        
        setPayments(transformedPayments);
        // Filtered payments will be set by the useEffect that watches for filter changes
      } else {
        console.warn("Unexpected API response format:", data);
        // Fallback to using mock data temporarily
        const mockData = [
          { _id: "67fe68624cfa00255e46ea7e", amount: 250000.00, currency: "USD", transactionId: "TRX-18084578123", date: "28 Oct 2024", purpose: "Standard Shipping, Basic Insurance", rawMethod: "Paystack", status: "Successful" },
          { _id: "67fe68624cfa00255e46ea7f", amount: 250000.00, currency: "USD", transactionId: "TRX-18084578124", date: "28 Oct 2024", purpose: "Standard Shipping, Basic Insurance", rawMethod: "Paystack", status: "Unsuccessful" },
          { _id: "67fe68624cfa00255e46ea80", amount: 250000.00, currency: "USD", transactionId: "TRX-18084578125", date: "12 Oct 2024", purpose: "QuickWing, Basic Insurance", rawMethod: "Cash on Delivery", status: "Successful" }
        ];
        setPayments(mockData);
      }
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
    setSelectedPayments(filteredPayments.map(() => newCheckedState));
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

  const handleMethodFilterChange = (e) => {
    setMethodFilter(e.target.value);
    setPage(1); // Reset to first page when applying filter
  };

  // Get unique payment methods for filter dropdown
  const getUniquePaymentMethods = () => {
    if (!payments || payments.length === 0) return [];
    const methods = [...new Set(payments.map(payment => payment.rawMethod))];
    return methods;
  };

  // Format currency display
  const formatCurrency = (amount, currency) => {
    if (currency === "eur" || currency === "EUR") {
      return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (currency === "USD") {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `${currency.toUpperCase()} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  // Format payment method for display
  const formatPaymentMethod = (method) => {
    return method === "Cash on Delivery" ? method : `Online (${method})`;
  };

  // Navigate to payment detail page
  const handlePaymentClick = (paymentId) => {
    navigate(`/admin/payments/${paymentId}`);
  }

  // Handle action menu click
  const handleActionClick = (e, paymentId) => {
    e.stopPropagation(); // Prevent row click event
    // Implement action menu functionality here
    navigate(`/admin/payments/${paymentId}`);
  };

  // Calculate pagination info
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);
  const totalPages = Math.ceil(totalItems / limit);

  // Get the current page of payments
  const getCurrentPagePayments = () => {
    const start = (page - 1) * limit;
    const end = page * limit;
    return filteredPayments.slice(start, end);
  };

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
      
      {/* Filter controls */}
      <div className="mb-4 flex items-center flex-wrap gap-4">
        <div className="flex items-center">
          <label htmlFor="statusFilter" className="mr-2">Filter by status:</label>
          <select 
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="border rounded px-2 py-1"
          >
            <option value="">All Statuses</option>
            <option value="completed">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Unsuccessful</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <label htmlFor="methodFilter" className="mr-2">Filter by payment method:</label>
          <select 
            id="methodFilter"
            value={methodFilter}
            onChange={handleMethodFilterChange}
            className="border rounded px-2 py-1"
          >
            <option value="">All Payment Methods</option>
            {getUniquePaymentMethods().map(method => (
              <option key={method} value={method}>
                {formatPaymentMethod(method)}
              </option>
            ))}
          </select>
        </div>
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
                {getCurrentPagePayments().length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-4 px-4 text-center">No payments found</td>
                  </tr>
                ) : (
                  getCurrentPagePayments().map((payment, index) => (
                    <tr 
                      key={payment._id || payment.transactionId || index} 
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePaymentClick(payment._id)}
                    >
                      <td className="py-4 px-2" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 accent-primary" 
                          checked={selectedPayments[index]}
                          onChange={() => handlePaymentCheckboxChange(index)}
                        />
                      </td>
                      <td className="py-4 px-4">{formatCurrency(payment.amount, payment.currency)}</td>
                      <td className="py-4 px-4">{payment.transactionId}</td>
                      <td className="py-4 px-4">{payment.date}</td>
                      <td className="py-4 px-4">{payment.purpose}</td>
                      <td className="py-4 px-4">{formatPaymentMethod(payment.rawMethod)}</td>
                      <td className="py-4 px-4 flex items-center">
                        <FaCircle className={`text-xs mr-2 ${payment.status === "Successful" ? "text-green" : payment.status === "Pending" ? "text-yellow-500" : "text-red-500"}`} />
                        {payment.status}
                      </td>
                      <td className="py-4 px-4 text-center" onClick={(e) => handleActionClick(e, payment._id)}>
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