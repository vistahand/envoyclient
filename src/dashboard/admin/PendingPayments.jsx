import { useState, useEffect } from "react";
import { shipments } from "../../services/api";
import { format } from "date-fns";
import { MdCheck, MdClose } from "react-icons/md";

const PendingPayments = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      // This endpoint would need to be created to fetch shipments with pending cash payments
      const response = await shipments.getPendingPayments();
      if (response.success) {
        setPendingPayments(response.data.shipments || []);
      } else {
        setError(response.message || "Failed to fetch pending payments");
      }
    } catch (error) {
      setError(error.message || "Failed to fetch pending payments");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (shipment) => {
    setSelectedShipment(shipment);
    setIsApproving(true);
  };

  const submitApproval = async (approved) => {
    try {
      if (!selectedShipment || !adminPassword) {
        return;
      }

      setLoading(true);
      const response = await shipments.approvePayment(selectedShipment._id, {
        approved,
        adminPassword,
      });

      if (response.success) {
        // Refresh the list of pending payments
        await fetchPendingPayments();
        setSelectedShipment(null);
        setAdminPassword("");
        setIsApproving(false);
      } else {
        setError(response.message || "Failed to approve payment");
      }
    } catch (error) {
      setError(error.message || "Failed to approve payment");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency) => {
    if (!amount) return "0.00";

    switch (currency?.toLowerCase()) {
      case "eur":
        return `€${parseFloat(amount).toFixed(2)}`;
      case "ngn":
        return `₦${parseFloat(amount).toFixed(2)}`;
      default:
        return `${parseFloat(amount).toFixed(2)}`;
    }
  };

  if (loading && pendingPayments.length === 0) {
    return <div className="p-6">Loading pending payments...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Pending Cash Payments
      </h1>

      {pendingPayments.length === 0 ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-500">No pending cash payments to approve</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingPayments.map((shipment) => (
                  <tr key={shipment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {shipment.trackingNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {shipment.sender?.name ||
                        shipment.sender?.businessName ||
                        "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {shipment.payment?.method === "cash_on_pickup" &&
                        "Cash on Pickup"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(
                        shipment.cost?.total,
                        shipment.cost?.currency
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {format(new Date(shipment.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleApprove(shipment)}
                        className="text-primary hover:text-primary-dark mr-3"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {isApproving && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
            <p className="mb-4">
              Are you sure you want to confirm payment for shipment{" "}
              <span className="font-semibold">
                {selectedShipment.trackingNumber}
              </span>
              ?
            </p>
            <p className="mb-6">
              Amount:{" "}
              {formatCurrency(
                selectedShipment.cost?.total,
                selectedShipment.cost?.currency
              )}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter your admin password"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedShipment(null);
                  setAdminPassword("");
                  setIsApproving(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => submitApproval(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center"
                disabled={!adminPassword}
              >
                <MdCheck className="mr-1" /> Approve
              </button>
              <button
                onClick={() => submitApproval(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center"
                disabled={!adminPassword}
              >
                <MdClose className="mr-1" /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingPayments;
