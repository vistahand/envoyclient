import React, { useState } from 'react';
import { HiOutlineDotsHorizontal, HiOutlineSearch } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const TabButton = ({ active, children, onClick }) => (
  <button
    className={`pb-2 ${active ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500'}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const ShipmentTrackMgt = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  
  // Enhanced shipment data with status categories
  const allShipments = [
    { id: '001F5TG8XR4U', shipDate: '28 Oct 2024', estDelivery: '02 Nov 2024', shipType: 'QuickWing', destination: 'Lagos, Nigeria', recipient: 'Annabella Isiagu Johnbosco', status: 'Shipped - In Transit', category: 'active' },
    { id: '001FG68YSJ92', shipDate: '31 Oct 2024', estDelivery: '12 Nov 2024', shipType: 'Standard', destination: 'Ibadan, Nigeria', recipient: 'Annabella Isiagu Johnbosco', status: 'Shipped - In Transit', category: 'active' },
    { id: '0027GTJ9SD4U', shipDate: '28 Oct 2024', estDelivery: '02 Nov 2024', shipType: 'QuickWing', destination: 'Dublin, Ireland', recipient: 'Michael Scofield', status: 'At Sorting Station', category: 'active' },
    { id: '002U90FG457S', shipDate: '01 Nov 2024', estDelivery: '17 Nov 2024', shipType: 'Standard', destination: 'Belfast, Ireland', recipient: 'Blossom Gerfieldway', status: 'Shipped - In Transit', category: 'active' },
    // Added delivered shipments
    { id: '001D5TG8XR5T', shipDate: '15 Oct 2024', estDelivery: '25 Oct 2024', shipType: 'QuickWing', destination: 'Dublin, Ireland', recipient: 'John Murphy', status: 'Delivered', category: 'delivered' },
    { id: '001D6TG9XR6U', shipDate: '10 Oct 2024', estDelivery: '22 Oct 2024', shipType: 'Standard', destination: 'London, UK', recipient: 'Sarah Johnson', status: 'Delivered', category: 'delivered' },
    // Added pending shipments
    { id: '001P5TH8YR4V', shipDate: 'Pending', estDelivery: 'TBD', shipType: 'Standard', destination: 'New York, USA', recipient: 'David Wilson', status: 'Awaiting Processing', category: 'pending' },
    { id: '001P6TJ9ZS5W', shipDate: 'Pending', estDelivery: 'TBD', shipType: 'QuickWing', destination: 'Paris, France', recipient: 'Marie Dubois', status: 'Payment Verification', category: 'pending' },
  ];

  // Filter shipments based on the active tab
  const filteredShipments = allShipments.filter(shipment => shipment.category === activeTab);

  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Reset selections when changing tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedAll(false);
    setSelectedShipments([]);
    setActiveDropdown(null);
  };

  const handleSelectAll = () => {
    setSelectedAll(!selectedAll);
    if (!selectedAll) {
      setSelectedShipments(filteredShipments.map((shipment) => shipment.id));
    } else {
      setSelectedShipments([]);
    }
  };

  const handleSelectShipment = (id) => {
    if (selectedShipments.includes(id)) {
      setSelectedShipments(selectedShipments.filter((shipmentId) => shipmentId !== id));
      
      if (selectedAll) {
        setSelectedAll(false);
      }
    } else {
      setSelectedShipments([...selectedShipments, id]);
      
      if (selectedShipments.length + 1 === filteredShipments.length) {
        setSelectedAll(true);
      }
    }
  };

  const toggleDropdown = (id) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  const handleViewDetails = (shipmentId) => {
    navigate(`/admin/shipmentmanagement/details/${shipmentId}`);
    setActiveDropdown(null);
  };

  return (
    <div className="w-full bg-white">
      <div className="flex flex-col space-y-4">
        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200">
          <TabButton 
            active={activeTab === 'active'} 
            onClick={() => handleTabChange('active')}
          >
            Active
          </TabButton>
          <TabButton 
            active={activeTab === 'delivered'} 
            onClick={() => handleTabChange('delivered')}
          >
            Delivered
          </TabButton>
          <TabButton 
            active={activeTab === 'pending'} 
            onClick={() => handleTabChange('pending')}
          >
            Pending
          </TabButton>
        </div>

        {/* Search */}
        <div className="relative mt-4 w-full sm:w-[50%]">
          <input
            type="text"
            placeholder="Search by origin, destination, recipient details, etc."
            className="w-full p-3 pl-4 border border-gray-200 rounded-lg text-gray-500 bg-gray-50 text-xs sm:text-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <HiOutlineSearch size={20} />
          </div>
        </div>

        {/* Shipments Table */}
        <div className="border border-gray-200 rounded-lg mt-4 overflow-hidden">
          <div className="md:overflow-visible overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 h-4 w-4 accent-primary"
                      checked={selectedAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left text-gray-500 font-medium">Tracking ID</th>
                  <th className="p-4 text-left text-gray-500 font-medium">
                    Shipping Date
                    <span className="inline-block ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th className="p-4 text-left text-gray-500 font-medium">
                    Estimated Delivery
                    <span className="inline-block ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th className="p-4 text-left text-gray-500 font-medium">Shipping Type</th>
                  <th className="p-4 text-left text-gray-500 font-medium">Destination</th>
                  <th className="p-4 text-left text-gray-500 font-medium">Recipient</th>
                  <th className="p-4 text-left text-gray-500 font-medium">Shipment Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 h-4 w-4 accent-primary"
                          checked={selectedShipments.includes(shipment.id)}
                          onChange={() => handleSelectShipment(shipment.id)}
                        />
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-800">{shipment.id}</td>
<td className="p-4 text-sm font-semibold text-black">{shipment.shipDate}</td>
<td className="p-4 text-sm font-semibold text-black">{shipment.estDelivery}</td>
<td className="p-4 text-sm font-semibold text-black">{shipment.shipType}</td>
<td className="p-4 text-sm font-semibold text-black">{shipment.destination}</td>
<td className="p-4 text-sm font-semibold text-black">{shipment.recipient}</td>
<td className="p-4 text-sm font-semibold text-black">{shipment.status}</td>
<td className="p-4 text-sm font-semibold text-gray-400 relative">
                        <button 
                          onClick={() => toggleDropdown(shipment.id)}
                          className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100"
                        >
                          <HiOutlineDotsHorizontal className="h-5 w-5" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeDropdown === shipment.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button 
                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                onClick={() => handleViewDetails(shipment.id)}
                              >
                                See Full Detail
                              </button>
                              <button 
                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  console.log("Track shipment", shipment.id);
                                  setActiveDropdown(null);
                                }}
                              >
                                Track Shipment
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No shipments found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end p-4 space-x-2">
            <div className="text-sm text-gray-600">Rows per page:</div>
            <div className="flex items-center text-sm text-gray-600">
              10
              <span className="ml-1 text-xs">▼</span>
            </div>
            <div className="ml-4 px-4 text-sm text-gray-600">
              {filteredShipments.length > 0 
                ? `1-${filteredShipments.length} of ${filteredShipments.length}` 
                : '0 of 0'}
            </div>
            <div className="flex space-x-1">
              <button className="px-1 text-gray-400">⟪</button>
              <button className="px-1 text-gray-400">⟨</button>
              <button className="px-1 text-gray-400">⟩</button>
              <button className="px-1 text-gray-400">⟫</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTrackMgt;