import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCircle, FaSyncAlt, FaPrint, FaFileDownload } from "react-icons/fa";
import { admin } from "../services/api";

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Payment ID from params:", id);
    fetchPaymentDetail();
  }, [id]);

  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    console.log("Raw token from storage:", token);
    
    // Handle different token formats
    if (!token) return '';
    if (token.startsWith('"') && token.endsWith('"')) return token.slice(1, -1);
    return token;
  };

  const fetchPaymentDetail = async () => {
    try {
      const response = await admin.payments.getById(String(id));
      console.log(response);
      const data = response;
      // Transform the payment data
      if (data) {
        try {
          const transformedPayment = {
            _id: data._id,
            amount: parseFloat(data.amount) || 0,
            currency: data.currency || "USD",
            transactionId: data.transactionId || 'Nil',
            shipmentId: data.shipmentId || 'N/A',
            trackingNumber: data.trackingNumber || 'N/A',
            createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', {
              day: '2-digit', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A',
            updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('en-US', {
              day: '2-digit', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'N/A',
            purpose: data.trackingNumber ? `Shipping (${data.trackingNumber})` : "Payment Processing",
            rawMethod: data.method || 'N/A',
            paymentMethod: data.method ? (data.method === "Cash on Delivery" ? data.method : `Online (${data.method})`) : 'N/A',
            status: data.status ? (data.status === "completed" ? "Successful" : data.status === 'pending' ? 'Pending' : "Unsuccessful") : 'N/A',
            senderName: data.shipmentDetails?.sender?.name || 'N/A',
            senderEmail: data.shipmentDetails?.sender?.email || 'N/A',
            senderPhone: data.shipmentDetails?.sender?.phone || 'N/A',
            senderAddress: formatAddress(data.shipmentDetails?.sender?.address),
            recipientName: data.shipmentDetails?.recipient?.name || 'N/A',
            recipientEmail: data.shipmentDetails?.recipient?.email || 'N/A',
            recipientPhone: data.shipmentDetails?.recipient?.phone || 'N/A',
            recipientAddress: formatAddress(data.shipmentDetails?.recipient?.address),
            shipmentType: data.shipmentDetails?.type || 'N/A'
          };
          
          console.log("Transformed payment data:", transformedPayment);
          setPayment(transformedPayment);
        } catch (transformError) {
          console.error("Data transformation error:", transformError);
          setError("Error processing payment data: " + transformError.message);
        }
      } else {
        throw new Error("No payment data received");
      }
    } catch (err) {
      console.error("Error fetching payment details:", err);
      setError(err.message);
      
      // If there's an authentication error, redirect to login
      if (err.message.includes("session has expired") || err.message.includes("log in again")) {
        // window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    
    const parts = [
      address.line1,
      address.line2,
      address.area,
      address.city,
      address.state,
      address.country,
      address.postalCode
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  // Format currency display
  const formatCurrency = (amount, currency) => {
    // Convert amount to number if it's a string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) return 'N/A'; // Handle invalid amount
    
    try {
      if (currency === "eur" || currency === "EUR") {
        return `€${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else if (currency === "USD") {
        return `$${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        return `${currency.toUpperCase()} ${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    } catch (e) {
      console.error("Error formatting currency:", e);
      return `${currency} ${numAmount}`;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // This would be implemented to generate a PDF or other receipt format
    alert("Receipt download functionality would be implemented here");
  };
  
  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const getStatusColor = (status) => {
    if (status === "Successful") return "text-green";
    if (status === "Pending") return "text-yellow-500";
    return "text-red-500";
  };
  
  const handleRefresh = () => {
    fetchPaymentDetail();
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-6 flex items-center justify-center min-h-64">
        <div className="text-center py-8">
          <FaSyncAlt className="animate-spin text-primary text-3xl mx-auto mb-4" />
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBackClick}
            className="flex items-center text-primary hover:text-primary-dark"
          >
            <FaArrowLeft className="mr-2" /> Back to Payments
          </button>
        </div>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 mr-2"
          >
            Retry
          </button>
          {error.includes("session has expired") && (
            <button 
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
              onClick={() => window.location.href = "/login"}
            >
              Log in again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBackClick}
            className="flex items-center text-primary hover:text-primary-dark"
          >
            <FaArrowLeft className="mr-2" /> Back to Payments
          </button>
        </div>
        <div className="text-center py-8">
          <p>Payment not found</p>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handleBackClick}
          className="flex items-center text-primary hover:text-primary-dark"
        >
          <FaArrowLeft className="mr-2" /> Back to Payments
        </button>
        <div className="flex space-x-3">
          <button 
            onClick={handlePrint}
            className="flex items-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
            title="Print payment details"
          >
            <FaPrint className="mr-2" /> Print
          </button>
          <button 
            onClick={handleDownloadReceipt}
            className="flex items-center px-3 py-2 bg-primary text-white rounded hover:bg-opacity-90 text-sm"
            title="Download receipt"
          >
            <FaFileDownload className="mr-2" /> Download Receipt
          </button>
        </div>
      </div>

      {/* Payment Detail Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary">Payment Details</h2>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <FaCircle className={`text-xs mr-2 ${getStatusColor(payment.status)}`} />
            <span className="font-medium">{payment.status}</span>
          </div>
          <span className="mx-3">•</span>
          <span>{payment.createdAt}</span>
        </div>
      </div>

      {/* Payment Overview */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Payment Amount</h3>
            <p className="text-2xl font-bold text-primary">{formatCurrency(payment.amount, payment.currency)}</p>
          </div>
          <div>
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">Transaction ID</h3>
            <p className="font-medium">{payment.transactionId}</p>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-primary">Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div>
            <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Payment Method</h4>
            <p>{payment.paymentMethod}</p>
          </div>
          <div>
            <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Payment Purpose</h4>
            <p>{payment.purpose}</p>
          </div>
          <div>
            <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Shipment ID</h4>
            <p>{payment.shipmentId}</p>
          </div>
          <div>
            <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Tracking Number</h4>
            <p>{payment.trackingNumber}</p>
          </div>
          <div>
            <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Shipment Type</h4>
            <p className="capitalize">{payment.shipmentType}</p>
          </div>
          <div>
            <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Last Updated</h4>
            <p>{payment.updatedAt}</p>
          </div>
        </div>
      </div>

      {/* Sender Information */}
      {payment.senderName !== 'N/A' && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-primary">Sender Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Sender Name</h4>
              <p>{payment.senderName}</p>
            </div>
            <div>
              <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Email Address</h4>
              <p>{payment.senderEmail}</p>
            </div>
            <div>
              <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Phone Number</h4>
              <p>{payment.senderPhone}</p>
            </div>
            <div>
              <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Address</h4>
              <p className="whitespace-pre-wrap">{payment.senderAddress}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recipient Information */}
      {payment.recipientName !== 'N/A' && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-primary">Recipient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Recipient Name</h4>
              <p>{payment.recipientName}</p>
            </div>
            <div>
              <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Email Address</h4>
              <p>{payment.recipientEmail}</p>
            </div>
            <div>
              <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Phone Number</h4>
              <p>{payment.recipientPhone}</p>
            </div>
            <div>
              <h4 className="text-sm uppercase text-gray-500 font-medium mb-1">Address</h4>
              <p className="whitespace-pre-wrap">{payment.recipientAddress}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetail;