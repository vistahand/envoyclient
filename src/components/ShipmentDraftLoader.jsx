import React, { useState } from "react";
import { useShipment } from "../context/ShipmentContext";
import { useNavigate } from "react-router-dom";

const ShipmentDraftLoader = () => {
  const [draftId, setDraftId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { loadShipmentDraft } = useShipment();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!draftId.trim()) {
      setError("Please enter a draft ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const shipmentData = await loadShipmentDraft(draftId.trim());

      // Navigate to create shipment page with the shipment ID to continue from where it stopped
      const navigatePath = "/createshipment";
      navigate(
        navigatePath + (shipmentData.id ? `?id=${shipmentData.id}` : "")
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load draft. Please check the ID and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-primary mb-4">
        Continue a Shipment
      </h2>
      <p className="text-gray-600 mb-4">
        Enter your shipment draft ID to continue from where you left off.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="draftId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Draft ID
          </label>
          <input
            type="text"
            id="draftId"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter your shipment draft ID"
            value={draftId}
            onChange={(e) => setDraftId(e.target.value)}
          />
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Continue Shipment"}
        </button>
      </form>
    </div>
  );
};

export default ShipmentDraftLoader;
