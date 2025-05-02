import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiDotsHorizontal,
  HiRefresh,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
} from "react-icons/hi";
import { admin } from "../../services/api";
import { getFormattedStatus } from "../../utils";
import LoadingScreen from "../../components/LoadingScreen";

const PaymentsAdmin = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPayments();
  }, [page, limit]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await admin.payments.getAll({
        page: page,
        limit: limit,
      });

      if (response && response.items && Array.isArray(response.items)) {
        const transformedPayments = response.items.map((item) => ({
          amount: item.amount || 0,
          currency: item.currency || "USD",
          transactionId: item.transactionId || "Nil",
          date: new Date(item.createdAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          name: item.name,
          purpose: item.trackingNumber
            ? `Shipping (${item.trackingNumber})`
            : "Payment Processing",
          rawMethod: getFormattedStatus(item.method),
          status:
            item.status === "completed"
              ? "Successful"
              : item.status === "awaiting_confirmation"
              ? "Pending"
              : "Unsuccessful",
          _id: item._id,
        }));

        setPayments(transformedPayments);
        setTotalItems(response.total || transformedPayments.length);
        setTotalPages(
          response.pages || Math.ceil(transformedPayments.length / limit)
        );
        setPayments(transformedPayments);
        setTotalItems(response.total || transformedPayments.length);
        setTotalPages(
          response.pages || Math.ceil(transformedPayments.length / limit)
        );
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPayments();
  };

  useEffect(() => {
    applyFilters();
  }, [statusFilter, methodFilter, searchQuery, payments]);

  const applyFilters = () => {
    let result = [...payments];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (payment) =>
          payment.transactionId.toLowerCase().includes(query) ||
          payment.purpose.toLowerCase().includes(query) ||
          payment.rawMethod.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter) {
      const statusMap = {
        completed: "Successful",
        pending: "Pending",
        failed: "Unsuccessful",
      };
      result = result.filter(
        (payment) => payment.status === statusMap[statusFilter]
      );
    }

    // Apply method filter
    if (methodFilter) {
      result = result.filter((payment) => payment.rawMethod === methodFilter);
    }

    setFilteredPayments(result);
    setTotalItems(result.length);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getUniquePaymentMethods = () => {
    if (!payments || payments.length === 0) return [];
    return [...new Set(payments.map((payment) => payment.rawMethod))];
  };

  const formatCurrency = (amount, currency) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
    });

    return formatter.format(amount);
  };

  const formatPaymentMethod = (method) => {
    return method === "cash_on_pickup"
      ? "Cash on Pickup"
      : `${method.charAt(0).toUpperCase() + method.slice(1)}`;
  };

  const handlePaymentClick = (paymentId) => {
    navigate(`/admin/payments/${paymentId}`);
  };

  const handleActionClick = (e, paymentId) => {
    e.stopPropagation();
    navigate(`/admin/payments/${paymentId}`);
  };

  const handleVerifyPayment = async (e, paymentId) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const response = await admin.payments.verifyPayment(paymentId);
      if (response.success) {
        // Refresh the payments list
        await fetchPayments();
      }
    } catch (error) {
      setError(error.message || "Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Successful":
        return "bg-green text-white";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Unsuccessful":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate pagination info
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  // Get the current page of payments
  const getCurrentPagePayments = () => {
    const start = startItem;
    const end = endItem;
    return filteredPayments;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payments History</h2>
          <p className="text-gray-500 mt-1">
            View and manage all transaction records
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-full hover:bg-gray-100 transition-all flex items-center justify-center"
          disabled={loading || refreshing}
          title="Refresh payments"
        >
          <HiRefresh
            className={`text-gray-700 text-xl ${
              refreshing ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>

      {/* Search and filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-1">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="col-span-1 md:col-span-1">
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
          >
            <option value="">All Statuses</option>
            <option value="completed">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Unsuccessful</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-1">
          <select
            id="methodFilter"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
          >
            <option value="">All Payment Methods</option>
            {getUniquePaymentMethods().map((method) => (
              <option key={method} value={method}>
                {formatPaymentMethod(method)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && !refreshing ? (
        <LoadingScreen />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center my-4">
          <p className="font-medium">{error}</p>
          {error.includes("session has expired") && (
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={() => (window.location.href = "/login")}
            >
              Log in again
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-full">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">Sender</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium text-center">
                      Purpose
                    </th>
                    <th className="py-3 px-4 font-medium">Method</th>
                    <th className="py-3 px-4 font-medium text-center">
                      Status
                    </th>
                    <th className="py-3 px-4 font-medium text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentPagePayments().length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="py-8 px-4 text-center text-gray-500"
                      >
                        No payments found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    getCurrentPagePayments().map((payment, index) => (
                      <tr
                        key={payment._id || payment.transactionId || index}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handlePaymentClick(payment._id)}
                      >
                        <td className="py-4 px-4 font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </td>
                        <td className="py-4 px-4 font-mono text-gray-600">
                          {payment.name}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {payment.date}
                        </td>
                        <td className="py-4 px-4 max-w-xs truncate">
                          {payment.purpose}
                        </td>
                        <td className="py-4 px-4">
                          {formatPaymentMethod(payment.rawMethod)}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {payment.status === "Pending" &&
                              payment.rawMethod === "stripe" && (
                                <button
                                  onClick={(e) =>
                                    handleVerifyPayment(e, payment._id)
                                  }
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                                >
                                  Verify Payment
                                </button>
                              )}
                            <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                              <HiDotsHorizontal className="text-gray-600 text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>Show</span>
              <select
                className="mx-1 px-2 py-1 border border-gray-300 rounded bg-white"
                value={limit}
                onChange={handleLimitChange}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="text-gray-500">
              {totalItems > 0
                ? `Showing ${startItem}-${endItem} of ${totalItems} entries`
                : "No entries to show"}
            </div>

            <div className="flex items-center space-x-1">
              <button
                className={`p-1 rounded ${
                  page === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                disabled={page === 1}
                onClick={() => handlePageChange(1)}
              >
                <HiChevronDoubleLeft className="text-lg" />
              </button>
              <button
                className={`p-1 rounded ${
                  page === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <HiChevronLeft className="text-lg" />
              </button>

              <div className="flex items-center px-2">
                <span>{page}</span>
                <span className="mx-1">/</span>
                <span>{totalPages || 1}</span>
              </div>

              <button
                className={`p-1 rounded ${
                  page >= totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                <HiChevronRight className="text-lg" />
              </button>
              <button
                className={`p-1 rounded ${
                  page >= totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                disabled={page >= totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                <HiChevronDoubleRight className="text-lg" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentsAdmin;
