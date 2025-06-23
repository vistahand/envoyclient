import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiCreditCard,
  FiTag,
  FiUser,
  FiFileText,
} from "react-icons/fi";
import api, { admin } from "../services/api";
import { useNotifications } from "../context/NotificationContext";

const AdminPaymentDetail = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [processingRefund, setProcessingRefund] = useState(false);
  const { addNotification } = useNotifications();

  const apiUrl = import.meta.env.VITE_API_URL;

  // Function to get auth token
  const getAuthToken = () => {
    let token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication token not found. Please log in again.");
    }

    // Remove quotes if present
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    return token;
  };

  // Fetch payment details
  const fetchPaymentDetails = async () => {
    setLoading(true);
    try {
      const response = await admin.payments.getById(String(paymentId));
     
      const data = response;
      setPayment(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching payment details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails();
    }
  }, [paymentId]);

  // Format date string to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency display
  const formatCurrency = (amount, currency) => {
    if (!amount) return "N/A";

    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    if (currency === "eur" || currency === "EUR") {
      return `€${numericAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } else if (currency === "USD") {
      return `$${numericAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } else if (currency === "NGN") {
      return `₦${numericAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } else {
      return `${currency || "USD"} ${numericAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };

    return statusMap[status] || "bg-gray-100 text-gray-800";
  };

  // Format payment method for display
  const getPaymentMethodDisplay = (method) => {
    return method === "Cash on Delivery" ? method : `Online (${method})`;
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate("/admin/payments");
  };

  const handleRefund = async (e) => {
    e.preventDefault();

    if (!refundAmount || !refundReason) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Please provide both refund amount and reason",
      });
      return;
    }

    try {
      setProcessingRefund(true);
      const response = await admin.payments.processRefund(payment._id, {
        amount: parseFloat(refundAmount),
        reason: refundReason,
      });

      if (response.success) {
        addNotification({
          type: "success",
          title: "Refund Processed",
          message: "Payment has been successfully refunded",
        });
        setShowRefundModal(false);
        // Refresh payment details
        await fetchPaymentDetails();
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Refund Failed",
        message: error.message || "Failed to process refund",
      });
    } finally {
      setProcessingRefund(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-8">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <FiArrowLeft /> Back to Payments
        </button>
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-lg font-medium text-gray-800">{error}</p>
          <button
            onClick={fetchPaymentDetails}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-8">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <FiArrowLeft /> Back to Payments
        </button>
        <div className="text-center py-12">
          <p className="text-lg font-medium text-gray-800">Payment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow">
      {/* Header with back button */}
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <FiArrowLeft /> Back to Payments
        </button>
        <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Payment Details
          </h2>
          <div className="mt-2 md:mt-0">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadgeClass(
                payment.status
              )}`}
            >
              {payment.status === "completed"
                ? "Successful"
                : payment.status === "pending"
                ? "Pending"
                : "Unsuccessful"}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <FiDollarSign className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(payment.amount, payment.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <FiCreditCard className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-semibold">
                  {payment.transactionId || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <FiCalendar className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">{formatDate(payment.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Transaction Details
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiTag className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Purpose</p>
                  <p className="font-medium">
                    {payment.trackingNumber
                      ? `Shipping (${payment.trackingNumber})`
                      : payment.purpose || "Payment Processing"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiCreditCard className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">
                    {getPaymentMethodDisplay(payment.method)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiDollarSign className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">
                    {formatCurrency(payment.amount, payment.currency)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiFileText className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p
                    className={`font-medium capitalize ${
                      payment.status === "completed"
                        ? "text-green-600"
                        : payment.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {payment.status === "completed"
                      ? "Successful"
                      : payment.status === "pending"
                      ? "Pending"
                      : "Unsuccessful"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Customer Information
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiUser className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Sender Name</p>
                  <p className="font-medium">
                    {payment.shipmentDetails?.sender?.name || "Not available"}
                  </p>
                </div>
              </div>

              {payment.user?.email && (
                <div className="flex items-start gap-3">
                  <FiUser className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Customer Email</p>
                    <p className="font-medium">{payment.user.email}</p>
                  </div>
                </div>
              )}

              {payment.paymentDetails && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Payment Provider Details:
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <pre className="whitespace-pre-wrap break-words">
                      {JSON.stringify(payment.paymentDetails, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        {payment.paymentEvents && payment.paymentEvents.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Payment Timeline
            </h4>

            <div className="relative border-l-2 border-gray-200 ml-4 pl-6">
              {payment.paymentEvents.map((event, index) => (
                <div key={index} className="mb-6 relative">
                  <div className="absolute -left-10 mt-1.5">
                    <div
                      className={`h-4 w-4 rounded-full border-2 ${
                        event.type === "success"
                          ? "bg-green-500 border-green-500"
                          : event.type === "pending"
                          ? "bg-yellow-500 border-yellow-500"
                          : "bg-gray-500 border-gray-500"
                      }`}
                    ></div>
                  </div>
                  <div>
                    <p className="font-medium">
                      {event.description || "Payment status updated"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(event.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Refund Section */}
        {payment?.status === "completed" && !payment?.refunded && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Refund Options
            </h4>
            <p className="text-gray-600 mb-4">
              Issue a refund for this payment if necessary. Please note that
              refunds cannot be undone.
            </p>
            <button
              onClick={() => setShowRefundModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Process Refund
            </button>
          </div>
        )}

        {/* Refund Modal */}
        {showRefundModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Process Refund</h3>
              <form onSubmit={handleRefund}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Refund Amount ({payment?.currency?.toUpperCase() || "EUR"})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={payment?.amount || 0}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum amount:{" "}
                    {formatCurrency(payment?.amount, payment?.currency)}
                  </p>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Reason for Refund
                  </label>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                    maxLength="500"
                    placeholder="Please provide a reason for the refund..."
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRefundModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={processingRefund}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    disabled={processingRefund}
                  >
                    {processingRefund ? "Processing..." : "Confirm Refund"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentDetail;
