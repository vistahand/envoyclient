import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';
import { TbWorldShare } from "react-icons/tb";
import { format } from 'date-fns';

// Helper function to get authentication token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "EEEE do MMMM, yyyy");
  } catch (error) {
    return "Invalid Date";
  }
};

// Helper function to format time
const formatTime = (dateString) => {
  if (!dateString) return "";
  try {
    return format(new Date(dateString), "hh:mma");
  } catch (error) {
    return "";
  }
};

// Get country code for flag
const getCountryCode = (countryCode) => {
  // If already a 2-letter code, use it
  if (countryCode && countryCode.length === 2) {
    return countryCode.toLowerCase();
  }
  
  // Map country names to codes
  const countryCodes = {
    "Ireland": "ie",
    "Nigeria": "ng",
    "IE": "ie",
    "NG": "ng"
  };
  
  return countryCodes[countryCode] || "xx"; // fallback to avoid broken images
};

// Get formatted status name
const getFormattedStatus = (status) => {
  if (!status) return "Unknown";
  
  // Convert snake_case to Title Case
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get status description based on timeline and current status
const getStatusDescription = (timeline, status) => {
  if (!timeline || timeline.length === 0) {
    return `Shipment status: ${getFormattedStatus(status)}`;
  }
  
  // Get the latest timeline entry
  const latestEntry = timeline[timeline.length - 1];
  return latestEntry.description || `Shipment status: ${getFormattedStatus(status)}`;
};

const ShipmentDetailMgt = () => {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGoBack = () => {
    navigate('/admin/shipmentmanagement');
  };

  // Fetch shipment data from API
  useEffect(() => {
    const fetchShipmentDetails = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();
        
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }
        
        // Direct API call to your endpoint with the shipmentId
        const response = await fetch(`https://envoyserver-pyxd.onrender.com/api/admin/shipments/${shipmentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Shipment Details:", data);
        setShipment(data);
      } catch (err) {
        console.error("Error fetching shipment details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (shipmentId) {
      fetchShipmentDetails();
    }
  }, [shipmentId]);

  if (loading) {
    return <div className="w-full text-center py-8">Loading shipment details...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!shipment) {
    return <div className="w-full text-center py-8">Shipment not found</div>;
  }

  // Get the latest timeline entry for the most current status
  const latestTimeline = shipment.timeline && shipment.timeline.length > 0 
    ? shipment.timeline[shipment.timeline.length - 1] 
    : null;

  return (
    <div className="w-full bg-white p-4 sm:p-6">
      <div className="flex flex-col">
        {/* Header with back button and cancel button */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary break-words">
              Shipment Details - {shipment.trackingNumber || shipment._id}
            </h1>
            <p className="text-gray-600">Full details of your shipment</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <button 
              onClick={handleGoBack} 
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 rounded-lg text-gray-700 font-medium w-full sm:w-auto"
            >
              <HiOutlineArrowLeft className="h-5 w-5" />
              Go back
            </button>
            {/* <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg font-medium w-full sm:w-auto">
              <HiOutlineTrash className="h-5 w-5" />
              Cancel Shipment
            </button> */}
          </div>
        </div>

        {/* Shipment Status Section */}
        <div className="mb-8">
          <h2 className="text-gray-500 uppercase font-medium mb-4">SHIPMENT STATUS</h2>
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 rounded-full p-3 sm:p-4 flex-shrink-0">
              <div className="bg-primary rounded-full p-2">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                {getFormattedStatus(shipment.status)}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm sm:text-base text-gray-600">
                  {latestTimeline ? formatDate(latestTimeline.timestamp) : formatDate(shipment.updatedAt)}
                </span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-sm sm:text-base text-gray-600">
                  {latestTimeline ? formatTime(latestTimeline.timestamp) : formatTime(shipment.updatedAt)}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
                {getStatusDescription(shipment.timeline, shipment.status)}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
            {/* <button className="text-primary underline font-medium text-sm sm:text-base">Update shipment status</button> */}
            {/* <button 
              onClick={() => navigate(`/tracking/${shipment.trackingNumber}`)}
              className="text-primary underline font-medium text-sm sm:text-base"
            >
              See full tracking details
            </button> */}
          </div>
        </div>

        {/* Shipping Details Section */}
        <div className="mb-8">
          <h2 className="text-gray-500 uppercase font-medium mb-4">SHIPPING DETAILS</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <TbWorldShare className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <span className="text-primary text-base sm:text-lg font-medium">
              {shipment.type === 'international' ? 'International Shipping' : 'Domestic Shipping'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
              <div className="flex flex-col items-center px-6">
                <img 
                  src={`https://flagcdn.com/w40/${getCountryCode(shipment.origin?.country)}.png`} 
                  alt={`${shipment.origin?.country} Flag`}
                  className="w-10 h-6 sm:w-12 sm:h-8 object-cover rounded-sm"
                />
                <span className="mt-1 text-sm sm:text-base text-gray-700">{shipment.origin?.country}</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-500">to</div>
            
            <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
              <div className="flex flex-col items-center px-6">
                <img 
                  src={`https://flagcdn.com/w40/${getCountryCode(shipment.destination?.country)}.png`} 
                  alt={`${shipment.destination?.country} Flag`}
                  className="w-10 h-6 sm:w-12 sm:h-8 object-cover rounded-sm"
                />
                <span className="mt-1 text-sm sm:text-base text-gray-700">{shipment.destination?.country}</span>
              </div>
            </div>
          </div>
          
          {/* Shipping Date */}
          <div className="mb-6">
            <h3 className="text-gray-600 text-sm sm:text-base mb-1">Shipping Date</h3>
            <p className="text-lg sm:text-xl font-medium text-gray-800">{formatDate(shipment.pickup?.date)}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Shipments may not always be shipped on the date of payment. 
              <a href="#" className="text-primary ml-1">Read our terms for more details.</a>
            </p>
          </div>
          
          {/* Estimated Delivery Date */}
          <div className="mb-6">
            <h3 className="text-gray-600 text-sm sm:text-base mb-1">Estimated Delivery Date</h3>
            <p className="text-lg sm:text-xl font-medium text-gray-800">{formatDate(shipment.delivery?.estimatedDate)}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Estimated delivery date only valid if payment is confirmed and shipment is processed on time.
            </p>
          </div>

          {/* Payment Information */}
          {shipment.payment && (
            <div className="mb-6">
              <h3 className="text-gray-600 text-sm sm:text-base mb-1">Payment Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <span className="text-gray-500 text-sm">Status:</span>
                  <p className="font-medium">{getFormattedStatus(shipment.payment.status)}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Method:</span>
                  <p className="font-medium">{getFormattedStatus(shipment.payment.method)}</p>
                </div>
                {shipment.payment.paidAt && (
                  <div>
                    <span className="text-gray-500 text-sm">Paid on:</span>
                    <p className="font-medium">{formatDate(shipment.payment.paidAt)}</p>
                  </div>
                )}
                {shipment.cost && (
                  <div>
                    <span className="text-gray-500 text-sm">Total Cost:</span>
                    <p className="font-medium">
                      {shipment.cost.total} {(shipment.cost.currency || "EUR").toUpperCase()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Package Information */}
        <div className="mb-8">
          <h2 className="text-gray-500 uppercase font-medium mb-4">PACKAGE INFORMATION</h2>
          {shipment.packages && shipment.packages.map((pkg, index) => (
            <div key={pkg._id || index} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Package Type:</span>
                  <p className="font-medium capitalize">{pkg.packageType}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Weight:</span>
                  <p className="font-medium">{pkg.weight} kg</p>
                </div>
                {pkg.dimensions && (
                  <div>
                    <span className="text-gray-500 text-sm">Dimensions:</span>
                    <p className="font-medium">
                      {pkg.dimensions.length} × {pkg.dimensions.width} × {pkg.dimensions.height} cm
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500 text-sm">Fragile:</span>
                  <p className="font-medium">{pkg.isFragile ? "Yes" : "No"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Perishable:</span>
                  <p className="font-medium">{pkg.isPerishable ? "Yes" : "No"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Hazardous:</span>
                  <p className="font-medium">{pkg.isHazardous ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sender & Recipient Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sender Information */}
          <div>
            <h2 className="text-gray-500 uppercase font-medium mb-4">SENDER INFORMATION</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              {shipment.sender && (
                <>
                  <h3 className="font-medium text-lg">{shipment.sender.name}</h3>
                  <p className="text-gray-600 mt-1">{shipment.sender.email}</p>
                  <p className="text-gray-600">{shipment.sender.phone}</p>
                  
                  {shipment.sender.address && (
                    <div className="mt-3">
                      <h4 className="text-gray-500 text-sm mb-1">Address:</h4>
                      <p className="text-gray-700">{shipment.sender.address.line1}</p>
                      {shipment.sender.address.line2 && <p className="text-gray-700">{shipment.sender.address.line2}</p>}
                      <p className="text-gray-700">
                        {shipment.sender.address.city}, {shipment.sender.address.state}
                      </p>
                      <p className="text-gray-700">
                        {shipment.sender.address.country} {shipment.sender.address.postalCode}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Recipient Information */}
          <div>
            <h2 className="text-gray-500 uppercase font-medium mb-4">RECIPIENT INFORMATION</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              {shipment.recipient && (
                <>
                  <h3 className="font-medium text-lg">{shipment.recipient.name}</h3>
                  <p className="text-gray-600 mt-1">{shipment.recipient.email}</p>
                  <p className="text-gray-600">{shipment.recipient.phone}</p>
                  
                  {shipment.recipient.address && (
                    <div className="mt-3">
                      <h4 className="text-gray-500 text-sm mb-1">Address:</h4>
                      <p className="text-gray-700">{shipment.recipient.address.line1}</p>
                      {shipment.recipient.address.line2 && <p className="text-gray-700">{shipment.recipient.address.line2}</p>}
                      <p className="text-gray-700">
                        {shipment.recipient.address.city}, {shipment.recipient.address.state}
                      </p>
                      <p className="text-gray-700">
                        {shipment.recipient.address.country} {shipment.recipient.address.postalCode}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Shipment Timeline */}
        <div className="mb-8">
          <h2 className="text-gray-500 uppercase font-medium mb-4">SHIPMENT TIMELINE</h2>
          
          {shipment.timeline && shipment.timeline.length > 0 ? (
            <div className="relative">
              {shipment.timeline.map((event, index) => (
                <div key={event._id || index} className="flex mb-6 relative">
                  {/* Timeline connector */}
                  {index < shipment.timeline.length - 1 && (
                    <div className="absolute left-[18px] top-[28px] w-0.5 bg-gray-200 h-full"></div>
                  )}
                  
                  {/* Timeline point */}
                  <div className="mt-1 mr-4 w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 z-10">
                    <span className="text-white font-bold text-sm">{shipment.timeline.length - index}</span>
                  </div>
                  
                  {/* Event details */}
                  <div className="flex-1">
                    <h3 className="font-medium">{getFormattedStatus(event.status)}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{formatDate(event.timestamp)}</span>
                      <span>•</span>
                      <span>{formatTime(event.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No timeline events available for this shipment.</p>
          )}
        </div>
        
        {/* Horizontal line separator */}
        <hr className="border-gray-200 my-6" />

        {/* Additional Actions */}
        <div className="flex flex-wrap gap-4">
          {/* <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium">
            Update Shipment
          </button>
          <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium">
            Download Details
          </button>
          <button className="text-primary underline font-medium">
            Print Label
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailMgt;