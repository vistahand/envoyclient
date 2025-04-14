import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShipment } from "../context/ShipmentContext";
import { shipments } from "../services/api";

const RecentDrafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loadShipmentDraft } = useShipment();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentDrafts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Get draft shipments API call
        const response = await shipments.getAllDrafts();

        if (response.success) {
          setDrafts(response.data.shipments || []);
        } else {
          setError("Failed to fetch recent drafts");
        }
      } catch (err) {
        console.error("Error loading draft shipments:", err);
        setError(err.message || "Error loading draft shipments");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDrafts();
  }, []);

  const handleContinueDraft = async (draftId) => {
    try {
      // Validate the draft ID format before making the API call
      if (!draftId || typeof draftId !== "string" || draftId.length !== 24) {
        throw new Error("Invalid draft ID format");
      }

      setLoading(true);
      const shipmentData = await loadShipmentDraft(draftId);

      // Navigate to the shipment creation page with shipment ID to continue from where it stopped
      if (window.location.pathname.includes("/user")) {
        // If in user dashboard, use dashboard route
        navigate(`/user/shipments/createshipment?id=${draftId}`);
      } else {
        // Otherwise use main route
        navigate(`/createshipment?id=${draftId}`);
      }
    } catch (err) {
      console.error("Error continuing draft:", err);
      setError(err.message || "Failed to load draft");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && drafts.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Recent Draft Shipments
        </h2>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error && drafts.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Recent Draft Shipments
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-primary mb-4">
        Recent Draft Shipments
      </h2>

      {drafts.length === 0 ? (
        <p className="text-gray-500 py-4">
          You don't have any recent draft shipments.
        </p>
      ) : (
        <div className="divide-y">
          {drafts.map((draft) => (
            <div
              key={draft._id}
              className="py-3 flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {draft.origin?.country} to {draft.destination?.country}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                    Step {draft.lastSavedStep || 1}/7
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Last updated: {formatDate(draft.updatedAt || draft.createdAt)}
                </div>
              </div>
              <button
                onClick={() => handleContinueDraft(draft._id)}
                className="px-3 py-1.5 bg-primary text-white text-sm rounded hover:bg-opacity-90 transition-all"
                disabled={loading}
              >
                Continue
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentDrafts;
