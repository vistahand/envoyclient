import React, { useState, useEffect } from "react";
import { SectionWrapper } from "../../hoc";
import axios from "axios";
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Truck, 
  AlertTriangle,
  Tv,
  Car,
  Loader,
  RefreshCw
} from "lucide-react";
import Modal from "../../components/Modal"; // Update with correct path to Modal

// Create axios instance with default config
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL) + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        config.headers.Authorization = `Bearer ${parsedToken}`;
      } catch (e) {
        // If token is not in JSON format, use it directly
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const ShipmentApproval = () => {
  const [shipments, setShipments] = useState([]);
  const [expandedShipment, setExpandedShipment] = useState(null);
  const [priceInputs, setPriceInputs] = useState({});
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState({});
  const [adminNotes, setAdminNotes] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: "info",
    title: "",
    message: "",
    buttons: []
  });

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    // Initialize price inputs for all custom/quotable items
    if (Array.isArray(shipments) && shipments.length > 0) {
      const initialPriceInputs = {};
      const initialAdminNotes = {};
      shipments.forEach(shipment => {
        if (shipment && Array.isArray(shipment.packages)) {
          shipment.packages.forEach(pkg => {
            if (pkg && (pkg.isCustom || pkg.isQuotable) && !pkg.approved) {
              const key = `${shipment._id}-${pkg._id}`;
              initialPriceInputs[key] = "";
              initialAdminNotes[key] = "";
            }
          });
          // Also initialize note for whole shipment
          initialAdminNotes[shipment._id] = "Shipment approved by admin";
        }
      });
      setPriceInputs(initialPriceInputs);
      setAdminNotes(initialAdminNotes);
    }
  }, [shipments]);

  const fetchShipments = async () => {
    setLoading(true);
    setRefreshing(true);
    setError(null);
    try {
      const response = await api.get("/admin/shipment-review");
      
      // Extract shipments from the response
      let shipmentsData = [];
      
      if (response.data.data && response.data.data.shipments) {
        shipmentsData = response.data.data.shipments;
      } else if (Array.isArray(response.data.data)) {
        shipmentsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        shipmentsData = response.data;
      }
      
      // Transform API data to match component's expected format
      const formattedShipments = shipmentsData.map(shipment => {
        return {
          _id: shipment._id || "",
          id: shipment.trackingNumber || shipment._id || "",
          customer: shipment.sender?.name || "Unknown Customer",
          email: shipment.sender?.email || "No email",
          phone: shipment.sender?.phone || "No phone",
          type: shipment.type || "local",
          status: shipment.status || "pending",
          from: `${shipment.origin?.city || ""}, ${shipment.origin?.country || ""}`,
          to: `${shipment.destination?.city || ""}, ${shipment.destination?.country || ""}`,
          date: shipment.createdAt || new Date().toISOString(),
          packages: Array.isArray(shipment.packages) ? shipment.packages.map((pkg, index) => {
            return {
              _id: pkg._id || `pkg-${index}`,
              id: pkg._id || `pkg-${index}`,
              name: pkg.packageType || "Other",
              quantity: 1,
              price: pkg.price || 0,
              currency: (shipment.cost && shipment.cost.currency) ? shipment.cost.currency : "eur",
              approved: false,
              isCustom: pkg.isCustom || false,
              isQuotable: pkg.isCustom || false,
              carMake: pkg.otherFields?.car?.make || "",
              carModel: pkg.otherFields?.car?.model || "",
              tvSize: pkg.otherFields?.tv?.size || "",
              customPackageType: pkg.packageType || "Custom Item"
            };
          }) : []
        };
      });
      
      console.log("Processed shipments data:", formattedShipments);
      setShipments(formattedShipments);
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setError(err.response?.data?.message || "Failed to fetch shipments. Please try again.");
    } finally {
      setLoading(false);
      // Add a small delay before turning off the refreshing state to make the animation more noticeable
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }
  };

  const toggleExpand = (id) => {
    setExpandedShipment(expandedShipment === id ? null : id);
  };

  const handlePriceChange = (shipmentId, packageId, value) => {
    setPriceInputs({
      ...priceInputs,
      [`${shipmentId}-${packageId}`]: value
    });
  };

  const handleNoteChange = (key, value) => {
    setAdminNotes({
      ...adminNotes,
      [key]: value
    });
  };

  const handleApproveShipment = async (shipmentId) => {
    const shipment = shipments.find(s => s._id === shipmentId);
    const customPackages = shipment.packages.filter(pkg => (pkg.isCustom || pkg.isQuotable));
    
    // Check if all custom/quotable items have prices set
    const missingPrices = customPackages.filter(pkg => {
      const priceKey = `${shipmentId}-${pkg._id}`;
      const price = priceInputs[priceKey];
      return !price || isNaN(parseFloat(price)) || parseFloat(price) <= 0;
    });
    
    if (missingPrices.length > 0) {
      // Show modal instead of alert
      setModalConfig({
        type: "warning",
        title: "Incomplete Pricing",
        message: "Please enter valid prices for all custom/quotable items before approving the shipment",
        buttons: [
          {
            label: "OK",
            onClick: () => setModalOpen(false),
            variant: "primary"
          }
        ]
      });
      setModalOpen(true);
      return;
    }
    
    setApproving({ ...approving, [shipmentId]: true });
    
    try {
      // First approve all custom/quotable packages
      for (const pkg of customPackages) {
        const priceKey = `${shipmentId}-${pkg._id}`;
        const price = parseFloat(priceInputs[priceKey]);
        const noteKey = `${shipmentId}-${pkg._id}`;
        const comment = adminNotes[noteKey] || "Package price approved by admin";
        
        const packagePayload = {
          amount: price,
          subject: "Package Price Approval",
          comment: comment
        };
        
        console.log(`Approving package in shipment ${shipmentId}:`, packagePayload);
        
        // API call to approve each package and set its price
        await api.post(`/admin/shipments/${shipmentId}/approve`, packagePayload);
      }
      
      // Then approve the whole shipment
      console.log(`Approving shipment ${shipmentId}`);
      
      // Get admin review comment from state or use default
      const comment = adminNotes[shipmentId] || "Shipment approved by admin";
      
      const shipmentPayload = {
        amount: 0, // Use 0 as this is just status approval
        subject: "Shipment Approval",
        comment: comment
      };
      
      // API call to approve the shipment
      const response = await api.post(`/api/admin/shipments/${shipmentId}/approve`, shipmentPayload);
      
      console.log("Shipment approval response:", response.data);
      
      // Update local state
      setShipments(shipments.map(s => {
        if (s._id === shipmentId) {
          // Mark all packages as approved and update prices
          const updatedPackages = s.packages.map(pkg => {
            const priceKey = `${shipmentId}-${pkg._id}`;
            return {
              ...pkg,
              approved: true,
              price: (pkg.isCustom || pkg.isQuotable) ? parseFloat(priceInputs[priceKey]) : pkg.price
            };
          });
          
          return { 
            ...s, 
            status: "approved",
            packages: updatedPackages
          };
        }
        return s;
      }));
      
      // Show success modal instead of alert
      setModalConfig({
        type: "success",
        title: "Approval Successful",
        message: "Shipment has been successfully approved!",
        buttons: [
          {
            label: "Great!",
            onClick: () => setModalOpen(false),
            variant: "success"
          }
        ]
      });
      setModalOpen(true);
      
    } catch (err) {
      console.error("Error approving shipment:", err);
      // Show error modal instead of alert
      setModalConfig({
        type: "error",
        title: "Approval Failed",
        message: err.response?.data?.message || "Failed to approve shipment. Please try again.",
        buttons: [
          {
            label: "Close",
            onClick: () => setModalOpen(false),
            variant: "secondary"
          },
          {
            label: "Try Again",
            onClick: () => {
              setModalOpen(false);
              handleApproveShipment(shipmentId);
            },
            variant: "primary"
          }
        ]
      });
      setModalOpen(true);
    } finally {
      setApproving({ ...approving, [shipmentId]: false });
    }
  };

  // Filter shipments based on selected filter and search term
  const filteredShipments = Array.isArray(shipments) ? shipments.filter(shipment => {
    // First ensure the shipment has all required properties
    if (!shipment || typeof shipment !== 'object') {
      return false;
    }
    
    // Filter by status
    if (filter !== "all" && shipment.type !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && 
        (!shipment.id || !shipment.id.toLowerCase().includes(searchTerm.toLowerCase())) && 
        (!shipment.customer || !shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    return true;
  }) : [];

  // Get icon based on package type
  const getPackageIcon = (packageItem) => {
    if (packageItem.name === "TV") return <Tv className="w-5 h-5" />;
    if (packageItem.name === "Car") return <Car className="w-5 h-5" />;
    return <Package className="w-5 h-5" />;
  };

  // Check if shipment has custom items that need pricing
  const hasCustomItems = (shipment) => {
    if (!shipment || !Array.isArray(shipment.packages)) {
      return false;
    }
    return shipment.packages.some(pkg => (pkg.isCustom || pkg.isQuotable));
  };

  // Get package name with details
  const getPackageName = (pkg) => {
    if (pkg.name === "TV" && pkg.tvSize) {
      return `${pkg.name} (${pkg.tvSize}")`;
    } else if (pkg.name === "Car" && pkg.carMake && pkg.carModel) {
      return `${pkg.name} (${pkg.carMake} ${pkg.carModel})`;
    } else if (pkg.name === "Other" && pkg.customPackageType) {
      return pkg.customPackageType;
    }
    return pkg.name;
  };

  // Check if all required prices are set for approval
  const areAllPricesSet = (shipment) => {
    if (!shipment || !Array.isArray(shipment.packages)) {
      return true;
    }
    
    const customPackages = shipment.packages.filter(pkg => (pkg.isCustom || pkg.isQuotable));
    if (customPackages.length === 0) return true;
    
    return customPackages.every(pkg => {
      const priceKey = `${shipment._id}-${pkg._id}`;
      const price = priceInputs[priceKey];
      return price && !isNaN(parseFloat(price)) && parseFloat(price) > 0;
    });
  };

  if (loading && !refreshing) {
    return (
      <section className="w-full flex md:min-h-[850px] ss:min-h-[820px] min-h-[1080px] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-primary animate-spin" />
          <p className="mt-4 text-main4">Loading shipments...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full flex md:min-h-[850px] ss:min-h-[820px] min-h-[1080px] items-center justify-center">
        <div className="flex flex-col items-center">
          <AlertTriangle className="w-16 h-16 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-main2">Error Loading Data</h2>
          <p className="mt-2 text-main4">{error}</p>
          <button 
            onClick={fetchShipments}
            className="mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex md:min-h-[850px] ss:min-h-[820px] min-h-[1080px]">
      <div className="flex items-center w-full flex-col">
        {/* Header */}
        <div className="w-full flex flex-col gap-1.5 items-center">
          <h1 className="text-primary font-bold md:text-[40px] ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem] ss:leading-[3.5rem] leading-[2.5rem] text-center">
            Shipment Approval
          </h1>
          <p className="text-main4 md:text-[17px] ss:text-[16px] text-[15px] md:leading-[1.4rem] ss:leading-[1.4rem] leading-[1.3rem] tracking-tight text-center">
            Review and approve custom shipment items and quotes
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex md:flex-row flex-col justify-between items-center w-full md:w-[80%] md:mt-10 mt-6 gap-4">
          <div className="flex items-center md:gap-4 gap-3 md:w-auto w-full">
            <button 
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${filter === 'all' ? 'bg-primary text-white' : 'bg-white text-main4 border border-main5'}`}
              onClick={() => setFilter('all')}
            >
              All Shipments
            </button>
            <button 
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${filter === 'international' ? 'bg-primary text-white' : 'bg-white text-main4 border border-main5'}`}
              onClick={() => setFilter('international')}
            >
              International
            </button>
            <button 
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${filter === 'local' ? 'bg-primary text-white' : 'bg-white text-main4 border border-main5'}`}
              onClick={() => setFilter('local')}
            >
              Local
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="md:w-auto w-full">
              <input
                type="text"
                placeholder="Search by ID or customer name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 px-4 border border-main5 rounded-full w-full md:w-64 text-sm focus:outline-primary"
              />
            </div>
            <button
              onClick={fetchShipments}
              disabled={refreshing}
              className="py-2 px-4 bg-primary text-white rounded-full text-sm hover:bg-primary flex items-center justify-center transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Shipments List */}
        <div className="w-full md:w-[80%] mt-8 flex flex-col gap-4 overflow-auto">
          {filteredShipments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-main4">
              <Package className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No shipments found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {filteredShipments.map((shipment) => (
            <div 
              key={shipment._id} 
              className="border border-main6 rounded-xl overflow-hidden bg-white transition-all"
            >
              {/* Shipment Header */}
              <div 
                className="flex md:flex-row flex-col md:items-center items-start justify-between p-5 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(shipment._id)}
              >
                <div className="flex md:flex-row flex-col md:items-center items-start gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${shipment.type === 'international' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      <Truck className={`w-5 h-5 ${shipment.type === 'international' ? 'text-blue-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <p className="text-main2 font-bold md:text-lg text-base">{shipment.id}</p>
                      <p className="text-main4 text-sm">{new Date(shipment.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="md:ml-6 md:mt-0 mt-2">
                    <p className="text-main2 font-medium">{shipment.customer}</p>
                    <p className="text-main4 text-sm">{shipment.email} • {shipment.phone}</p>
                  </div>

                  <div className="md:ml-auto flex items-center md:mt-0 mt-3 gap-3">
                    <div className="border border-main6 rounded-lg py-1.5 px-3 text-sm">
                      <span className="text-main4">From:</span> <span className="font-medium">{shipment.from}</span>
                    </div>
                    <div className="border border-main6 rounded-lg py-1.5 px-3 text-sm">
                      <span className="text-main4">To:</span> <span className="font-medium">{shipment.to}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:mt-0 mt-4 w-full md:w-auto">
                  <div className={`py-1 px-3 rounded-full text-xs font-medium 
                    ${shipment.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                    {shipment.status === 'approved' ? 'Approved' : 'Pending'}
                  </div>
                  {hasCustomItems(shipment) && (
                    <div className="py-1 px-3 rounded-full bg-amber-100 text-amber-800 text-xs font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Needs Pricing</span>
                    </div>
                  )}
                  <div className="ml-auto">
                    {expandedShipment === shipment._id ? (
                      <ChevronUp className="w-5 h-5 text-main4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-main4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              {expandedShipment === shipment._id && (
                <div className="p-5 border-t border-main6 bg-gray-50">
                  <h3 className="font-semibold text-main2 mb-3">Package Items</h3>
                  
                  <div className="overflow-x-auto">
                    <div className="overflow-hidden rounded-lg border border-main6 min-w-full">
                      <table className="min-w-full divide-y divide-main6">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 px-4 text-left text-xs font-medium text-main4 uppercase tracking-wider">Item</th>
                            <th scope="col" className="py-3.5 px-4 text-left text-xs font-medium text-main4 uppercase tracking-wider">Quantity</th>
                            <th scope="col" className="py-3.5 px-4 text-left text-xs font-medium text-main4 uppercase tracking-wider">Price</th>
                            <th scope="col" className="py-3.5 px-4 text-left text-xs font-medium text-main4 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-main6">
                          {shipment.packages.map((pkg) => (
                            <tr key={pkg._id} className={pkg.isCustom || pkg.isQuotable ? "bg-blue-50" : ""}>
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    {getPackageIcon(pkg)}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-main2">{getPackageName(pkg)}</div>
                                    <div className="text-xs text-main4">
                                      {pkg.isQuotable && "Quote Required"}
                                      {pkg.isCustom && !pkg.isQuotable && "Custom Item"}
                                      {!pkg.isCustom && !pkg.isQuotable && "Standard Item"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-sm text-main2">{pkg.quantity}</td>
                              <td className="py-4 px-4">
                                {(pkg.isCustom || pkg.isQuotable) && !pkg.approved ? (
                                  <div className="flex items-center">
                                    <input 
                                      type="number"
                                      min="0"
                                      value={priceInputs[`${shipment._id}-${pkg._id}`] || ""}
                                      onChange={(e) => handlePriceChange(shipment._id, pkg._id, e.target.value)}
                                      className="py-1 px-2 border border-main6 rounded-md text-sm w-24 focus:outline-primary"
                                      placeholder="Enter price"
                                    />
                                    <span className="ml-2 text-sm text-main4">{pkg.currency.toUpperCase()}</span>
                                  </div>
                                ) : (
                                  <div className="text-sm text-main2">
                                    {pkg.price} {pkg.currency.toUpperCase()}
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${pkg.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {pkg.approved ? 'Approved' : 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Admin Comment Field for Shipment */}
                  <div className="mt-6">
                    <label htmlFor={`note-${shipment._id}`} className="block text-sm font-medium text-main2 mb-1">
                      Admin Comment:
                    </label>
                    <textarea
                      id={`note-${shipment._id}`}
                      value={adminNotes[shipment._id] || ""}
                      onChange={(e) => handleNoteChange(shipment._id, e.target.value)}
                      className="w-full p-2 border border-main6 rounded-md text-sm focus:outline-primary"
                      placeholder="Add notes or comments for this shipment approval"
                      rows="2"
                    />
                  </div>

                  {/* Package Notes - Only if there are custom/quotable packages */}
                  {hasCustomItems(shipment) && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-main2 mb-2">Package Notes:</h4>
                      <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar p-2">
                        {shipment.packages.filter(pkg => pkg.isCustom || pkg.isQuotable).map(pkg => (
                          <div key={`note-${pkg._id}`} className="border border-main6 rounded-md p-3 bg-white">
                            <p className="text-sm font-medium mb-1">{getPackageName(pkg)}:</p>
                            <textarea
                              value={adminNotes[`${shipment._id}-${pkg._id}`] || ""}
                              onChange={(e) => handleNoteChange(`${shipment._id}-${pkg._id}`, e.target.value)}
                              className="w-full p-2 border border-main6 rounded-md text-sm focus:outline-primary"
                              placeholder={`Add notes for ${pkg.name} approval`}
                              rows="1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-end gap-4">
                    <button
                      className={`px-6 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white 
                        ${!areAllPricesSet(shipment) || approving[shipment._id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                      onClick={() => areAllPricesSet(shipment) && !approving[shipment._id] && handleApproveShipment(shipment._id)}
                      disabled={!areAllPricesSet(shipment) || approving[shipment._id]}
                    >
                      {approving[shipment._id] ? (
                        <span className="flex items-center">
                          <Loader className="w-4 h-4 animate-spin mr-2" />
                          Approving...
                        </span>
                      ) : (
                        hasCustomItems(shipment) ? "Set Prices & Approve Shipment" : "Approve Shipment"
                      )}
                    </button>
                  </div>
                  </div>

)}

            </div>
            
))}

</div>

</div>

{/* Modal Component */}

<Modal

isOpen={modalOpen}

onClose={() => setModalOpen(false)}

type={modalConfig.type}

title={modalConfig.title}

message={modalConfig.message}

buttons={modalConfig.buttons}

size="md"

/>

</section>

);

};

export default SectionWrapper(ShipmentApproval, "shipment-approval");