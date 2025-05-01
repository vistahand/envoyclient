import React, { useState, useEffect } from "react";
import { SectionWrapper } from "../../hoc";
import { 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Truck, 
  Clock, 
  AlertTriangle,
  MessageSquare,
  PenLine,
  Tv,
  Car
} from "lucide-react";

// Mock data for shipments pending approval
const initialShipments = [
  {
    id: "SHP-23409",
    customer: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234-567-8901",
    type: "international",
    status: "pending",
    from: "New York, USA",
    to: "Lagos, Nigeria",
    date: "2025-04-28",
    packages: [
      { id: 1, name: "Ghana must go", quantity: 2, price: 100, currency: "Euro", approved: true },
      { id: 2, name: "Car", quantity: 1, carMake: "Toyota", carModel: "Camry", price: 0, currency: "Euro", approved: false, isQuotable: true },
      { id: 3, name: "Other", customPackageType: "Antique Furniture", quantity: 1, price: 0, currency: "Euro", approved: false, isCustom: true }
    ]
  },
  {
    id: "SHP-23410",
    customer: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+44 7911 123456",
    type: "local",
    status: "pending",
    from: "Manchester, UK",
    to: "London, UK",
    date: "2025-04-29",
    packages: [
      { id: 1, name: "Washing machine", quantity: 1, price: 120, currency: "Euro", approved: true },
      { id: 2, name: "TV", quantity: 1, tvSize: "55", price: 0, currency: "Euro", approved: false, isCustom: true }
    ]
  },
  {
    id: "SHP-23411",
    customer: "Michael Chen",
    email: "mchen@example.com",
    phone: "+1 415-555-7890",
    type: "international",
    status: "pending",
    from: "San Francisco, USA",
    to: "Berlin, Germany",
    date: "2025-04-30",
    packages: [
      { id: 1, name: "Drum", quantity: 3, price: 160, currency: "Euro", approved: true },
      { id: 2, name: "Other", customPackageType: "Musical Instruments", quantity: 1, price: 0, currency: "Euro", approved: false, isCustom: true }
    ]
  }
];

const ShipmentApproval = () => {
  const [shipments, setShipments] = useState(initialShipments);
  const [expandedShipment, setExpandedShipment] = useState(null);
  const [priceInputs, setPriceInputs] = useState({});
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Initialize price inputs for all custom/quotable items
    const initialPriceInputs = {};
    shipments.forEach(shipment => {
      shipment.packages.forEach(pkg => {
        if ((pkg.isCustom || pkg.isQuotable) && !pkg.approved) {
          const key = `${shipment.id}-${pkg.id}`;
          initialPriceInputs[key] = "";
        }
      });
    });
    setPriceInputs(initialPriceInputs);
  }, []);

  const toggleExpand = (id) => {
    setExpandedShipment(expandedShipment === id ? null : id);
  };

  const handlePriceChange = (shipmentId, packageId, value) => {
    setPriceInputs({
      ...priceInputs,
      [`${shipmentId}-${packageId}`]: value
    });
  };

  const handleApproveItem = (shipmentId, packageId) => {
    const price = priceInputs[`${shipmentId}-${packageId}`];
    
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      alert("Please enter a valid price before approving");
      return;
    }
    
    setShipments(shipments.map(shipment => {
      if (shipment.id === shipmentId) {
        return {
          ...shipment,
          packages: shipment.packages.map(pkg => {
            if (pkg.id === packageId) {
              return {
                ...pkg,
                price: parseFloat(price),
                approved: true
              };
            }
            return pkg;
          })
        };
      }
      return shipment;
    }));
  };

  const handleRejectItem = (shipmentId, packageId) => {
    // In a real implementation, you might want to prompt for a reason
    if (confirm("Are you sure you want to reject this item?")) {
      setShipments(shipments.map(shipment => {
        if (shipment.id === shipmentId) {
          return {
            ...shipment,
            packages: shipment.packages.filter(pkg => pkg.id !== packageId)
          };
        }
        return shipment;
      }));
    }
  };

  const handleApproveShipment = (id) => {
    // Check if all custom/quotable items have been approved
    const shipment = shipments.find(s => s.id === id);
    const pendingItems = shipment.packages.filter(pkg => 
      (pkg.isCustom || pkg.isQuotable) && !pkg.approved
    );
    
    if (pendingItems.length > 0) {
      alert("Please approve all custom/quotable items before approving the shipment");
      return;
    }
    
    setShipments(shipments.map(s => 
      s.id === id ? { ...s, status: "approved" } : s
    ));
  };

  // Filter shipments based on selected filter and search term
  const filteredShipments = shipments.filter(shipment => {
    // Filter by status
    if (filter !== "all" && shipment.type !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !shipment.customer.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Get icon based on package type
  const getPackageIcon = (packageItem) => {
    if (packageItem.name === "TV") return <Tv className="w-5 h-5" />;
    if (packageItem.name === "Car") return <Car className="w-5 h-5" />;
    return <Package className="w-5 h-5" />;
  };

  // Check if shipment has pending items that need approval
  const hasUnapprovedItems = (shipment) => {
    return shipment.packages.some(pkg => (pkg.isCustom || pkg.isQuotable) && !pkg.approved);
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
          <div className="md:w-auto w-full">
            <input
              type="text"
              placeholder="Search by ID or customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 px-4 border border-main5 rounded-full w-full md:w-64 text-sm focus:outline-primary"
            />
          </div>
        </div>

        {/* Shipments List */}
        <div className="w-full md:w-[80%] mt-8 flex flex-col gap-4">
          {filteredShipments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-main4">
              <Package className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No shipments found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {filteredShipments.map((shipment) => (
            <div 
              key={shipment.id} 
              className="border border-main6 rounded-xl overflow-hidden bg-white transition-all"
            >
              {/* Shipment Header */}
              <div 
                className="flex md:flex-row flex-col md:items-center items-start justify-between p-5 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(shipment.id)}
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
                  {hasUnapprovedItems(shipment) && (
                    <div className="py-1 px-3 rounded-full bg-amber-100 text-amber-800 text-xs font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Needs Review</span>
                    </div>
                  )}
                  <div className="ml-auto">
                    {expandedShipment === shipment.id ? (
                      <ChevronUp className="w-5 h-5 text-main4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-main4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              {expandedShipment === shipment.id && (
                <div className="p-5 border-t border-main6 bg-gray-50">
                  <h3 className="font-semibold text-main2 mb-3">Package Items</h3>
                  
                  <div className="overflow-hidden rounded-lg border border-main6">
                    <table className="min-w-full divide-y divide-main6">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 px-4 text-left text-xs font-medium text-main4 uppercase tracking-wider">Item</th>
                          <th scope="col" className="py-3.5 px-4 text-left text-xs font-medium text-main4 uppercase tracking-wider">Quantity</th>
                          <th scope="col" className="py-3.5 px-4 text-left text-xs font-medium text-main4 uppercase tracking-wider">Price</th>
                          <th scope="col" className="py-3.5 px-4 text-left text-xs font-medium text-main4 uppercase tracking-wider">Status</th>
                          <th scope="col" className="py-3.5 px-4 text-right text-xs font-medium text-main4 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-main6">
                        {shipment.packages.map((pkg) => (
                          <tr key={pkg.id} className={pkg.isCustom || pkg.isQuotable ? "bg-blue-50" : ""}>
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
                                    value={priceInputs[`${shipment.id}-${pkg.id}`] || ""}
                                    onChange={(e) => handlePriceChange(shipment.id, pkg.id, e.target.value)}
                                    className="py-1 px-2 border border-main6 rounded-md text-sm w-24 focus:outline-primary"
                                    placeholder="Enter price"
                                  />
                                  <span className="ml-2 text-sm text-main4">{pkg.currency}</span>
                                </div>
                              ) : (
                                <div className="text-sm text-main2">
                                  {pkg.price} {pkg.currency}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${pkg.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {pkg.approved ? 'Approved' : 'Pending'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              {(pkg.isCustom || pkg.isQuotable) && !pkg.approved ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleApproveItem(shipment.id, pkg.id)}
                                    className="bg-green-600 text-white p-1.5 rounded-md hover:bg-green-700 transition-colors"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleRejectItem(shipment.id, pkg.id)}
                                    className="bg-red-600 text-white p-1.5 rounded-md hover:bg-red-700 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="text-sm text-main4">
                                  {pkg.approved ? 'Approved Item' : 'Standard Item'}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-end gap-4">
                    <button
                      className="inline-flex items-center px-3 py-2 border border-main6 rounded-md shadow-sm text-sm font-medium text-main2 bg-white hover:bg-gray-50"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Customer
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-2 border border-main6 rounded-md shadow-sm text-sm font-medium text-main2 bg-white hover:bg-gray-50"
                    >
                      <PenLine className="w-4 h-4 mr-2" />
                      Add Note
                    </button>
                    <button
                      className={`inline-flex items-center px-6 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white 
                        ${hasUnapprovedItems(shipment) ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                      onClick={() => !hasUnapprovedItems(shipment) && handleApproveShipment(shipment.id)}
                      disabled={hasUnapprovedItems(shipment)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve Shipment
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(ShipmentApproval, "");