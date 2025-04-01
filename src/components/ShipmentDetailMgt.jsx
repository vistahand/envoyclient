import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineTrash } from 'react-icons/hi';
import { TbWorldShare } from "react-icons/tb";

const ShipmentDetailMgt = () => {
  const { shipmentId } = useParams(); // Get the shipmentId from URL params
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/admin/shipmentmanagement');
  };

  // This would normally fetch data based on the shipmentId
  // For demo purposes, we'll hardcode the data to match the image
  const shipmentData = {
    id: shipmentId || '001F5TG8XR4U', // Use the ID from URL params or fallback
    status: 'Shipped - In Transit',
    packageStatus: 'Package Shipped',
    statusDate: 'Wednesday 30th October, 2024',
    statusTime: '04:48PM',
    statusLocation: 'Shipment leaves Dublin Dispatch Station, Ireland for Lagos, Nigeria',
    shipping: {
      type: 'International Shipping',
      origin: 'Ireland',
      destination: 'Nigeria',
    },
    shippingDate: 'Monday 28th October, 2024',
    estimatedDelivery: 'Friday 1st November, 2024',
    paymentDeadline: '29th October, 2024',
    paymentTime: '5PM',
    recipient: 'Annabella Isiagu Johnbosco'
  };

  return (
    <div className="w-full bg-white p-4 sm:p-6">
      <div className="flex flex-col">
        {/* Header with back button and cancel button */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary break-words">Shipment Details - {shipmentData.id}</h1>
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
            <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg font-medium w-full sm:w-auto">
              <HiOutlineTrash className="h-5 w-5" />
              Cancel Shipment
            </button>
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
              <h3 className="text-lg sm:text-xl font-medium text-gray-800">{shipmentData.packageStatus}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm sm:text-base text-gray-600">{shipmentData.statusDate}</span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-sm sm:text-base text-gray-600">{shipmentData.statusTime}</span>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">{shipmentData.statusLocation}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
            <button className="text-primary underline font-medium text-sm sm:text-base">Update shipment status</button>
            <button className="text-primary underline font-medium text-sm sm:text-base">See full tracking details</button>
          </div>
        </div>

        {/* Shipping Details Section */}
        <div className="mb-8">
          <h2 className="text-gray-500 uppercase font-medium mb-4">SHIPPING DETAILS</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <TbWorldShare className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <span className="text-primary text-base sm:text-lg font-medium">{shipmentData.shipping.type}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="bg-gray-100 p-3 sm:p-4  rounded-lg">
              <div className="flex flex-col items-center px-6">
                <img 
                  src={`https://flagcdn.com/w40/ie.png`} 
                  alt="Ireland Flag"
                  className="w-10 h-6 sm:w-12 sm:h-8 object-cover rounded-sm"
                />
                <span className="mt-1 text-sm sm:text-base text-gray-700">Ireland</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-500">to</div>
            
            <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
              <div className="flex flex-col items-center px-6">
                <img 
                  src={`https://flagcdn.com/w40/ng.png`} 
                  alt="Nigeria Flag"
                  className="w-10 h-6 sm:w-12 sm:h-8 object-cover rounded-sm"
                />
                <span className="mt-1 text-sm sm:text-base text-gray-700">Nigeria</span>
              </div>
            </div>
          </div>
          
          {/* Shipping Date */}
          <div className="mb-6">
            <h3 className="text-gray-600 text-sm sm:text-base mb-1">Shipping Date</h3>
            <p className="text-lg sm:text-xl font-medium text-gray-800">{shipmentData.shippingDate}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Shipments may not always be shipped on the date of payment. 
              <a href="#" className="text-primary ml-1">Read our terms for more details.</a>
            </p>
          </div>
          
          {/* Estimated Delivery Date */}
          <div>
            <h3 className="text-gray-600 text-sm sm:text-base mb-1">Estimated Delivery Date</h3>
            <p className="text-lg sm:text-xl font-medium text-gray-800">{shipmentData.estimatedDelivery}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Estimated delivery date only valid if you make payment before {shipmentData.paymentTime} on {shipmentData.paymentDeadline}
            </p>
          </div>
        </div>
        
        {/* Horizontal line separator */}
        <hr className="border-gray-200 my-6" />
      </div>
    </div>
  );
};

export default ShipmentDetailMgt;