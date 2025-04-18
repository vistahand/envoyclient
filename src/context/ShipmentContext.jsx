import { createContext, useContext, useState } from "react";
import { shipments } from "../services/api";
import { handleApiError } from "../utils/errorHandler";

// Create ShipmentContext
const ShipmentContext = createContext(null);

export const ShipmentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shipmentData, setShipmentData] = useState({
    id: null,
    shipmentType: null,
    origin: null,
    destination: null,
    package: null,
    delivery: null,
    sender: null,
    recipient: null,
    pickup: null,
    insurance: null,
    lastSavedStep: 1,
  });

  const initializeShipment = async (initialData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate international/local shipment type against countries
      if (initialData.shipmentType === "international") {
        if (!initialData.origin?.country || !initialData.destination?.country) {
          throw new Error(
            "Origin and destination countries must be specified for international shipments."
          );
        }

        if (initialData.origin.country === initialData.destination.country) {
          throw new Error(
            "International shipments must be between different countries. For shipments within the same country, please use local shipping."
          );
        }
      }

      if (initialData.shipmentType === "local") {
        if (!initialData.origin?.country || !initialData.destination?.country) {
          throw new Error(
            "Origin and destination countries must be specified for local shipments."
          );
        }

        if (initialData.origin.country !== initialData.destination.country) {
          throw new Error(
            "Local shipments must be within the same country. For shipments between different countries, please use international shipping."
          );
        }
      }

      const response = await shipments.initializeShipment(initialData);

      if (!response.success) {
        throw new Error(
          response.data?.error || "Server returned unsuccessful response"
        );
      }

      const shipment = response.data?.shipment;
      if (!shipment?._id) {
        throw new Error("Invalid shipment data in server response");
      }

      const updatedData = {
        ...shipmentData,
        id: shipment._id,
        shipmentType: initialData.shipmentType,
        origin: initialData.origin,
        destination: initialData.destination,
        lastSavedStep: shipment.lastSavedStep || 1,
      };

      setShipmentData(updatedData);

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to initialize shipment";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updatePackageDetails = async (packageData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await shipments.updatePackageDetails(
        shipmentData.id,
        packageData
      );

      if (!response.success) {
        throw new Error(
          response.data?.error || "Server returned unsuccessful response"
        );
      }

      const shipment = response.data?.shipment;
      if (!shipment?._id) {
        throw new Error("Invalid shipment data in server response");
      }

      setShipmentData((prev) => ({
        ...prev,
        package: packageData,
        lastSavedStep: Math.max(
          prev.lastSavedStep,
          shipment.lastSavedStep || 2
        ),
      }));

      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: "update_package_details" },
        defaultMessage: "Failed to update package details",
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateShippingCost = async (shipmentDetails) => {
    try {
      setLoading(true);
      setError(null);

      const response = await shipments.calculateCost(shipmentDetails);

      if (!response.success) {
        throw new Error(
          response.data?.error || "Server returned unsuccessful response"
        );
      }

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to calculate shipping cost";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryOptions = async (deliveryData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate shipment ID before making API call
      if (
        !shipmentData.id ||
        shipmentData.id === "drafts" ||
        typeof shipmentData.id !== "string" ||
        shipmentData.id.length !== 24
      ) {
        throw new Error("Invalid shipment ID. Please restart from step 1.");
      }

      const response = await shipments.updateDeliveryOptions(
        shipmentData.id,
        deliveryData
      );

      if (!response?.success) {
        throw new Error(
          response.data?.error || "Server returned unsuccessful response"
        );
      }

      const shipment = response.data?.shipment;
      if (!shipment?._id) {
        throw new Error("Invalid shipment data in server response");
      }

      setShipmentData((prev) => ({
        ...prev,
        delivery: deliveryData,
        lastSavedStep: Math.max(
          prev.lastSavedStep,
          shipment.lastSavedStep || 3
        ),
      }));

      return response;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to update delivery options";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateSenderInfo = async (senderData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await shipments.updateSenderInfo(
        shipmentData.id,
        senderData
      );

      if (!response.success) {
        throw new Error(
          response.data?.error || "Server returned unsuccessful response"
        );
      }

      const shipment = response.data?.shipment;
      if (!shipment?._id) {
        throw new Error("Invalid shipment data in server response");
      }

      setShipmentData((prev) => ({
        ...prev,
        sender: senderData,
        lastSavedStep: Math.max(
          prev.lastSavedStep,
          shipment.lastSavedStep || 4
        ),
      }));

      return response;
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to update sender information";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const selectPickupLocation = async (shipmentId, pickupData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await shipments.selectPickupLocation(
        shipmentId,
        pickupData
      );

      if (!response.success) {
        throw new Error(
          response.data?.error || "Server returned unsuccessful response"
        );
      }

      const shipment = response.data?.shipment;
      if (!shipment?._id) {
        throw new Error("Invalid shipment data in server response");
      }

      setShipmentData((prev) => ({
        ...prev,
        pickup: pickupData,
        lastSavedStep: Math.max(
          prev.lastSavedStep,
          shipment.lastSavedStep || 6
        ),
      }));

      return response;
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to update pickup location";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateRecipientInfo = async (recipientData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await shipments.updateRecipientInfo(
        shipmentData.id,
        recipientData
      );

      if (!response.success) {
        throw new Error(
          response.data?.error || "Server returned unsuccessful response"
        );
      }

      const shipment = response.data?.shipment;
      if (!shipment?._id) {
        throw new Error("Invalid shipment data in server response");
      }

      setShipmentData((prev) => ({
        ...prev,
        recipient: recipientData,
        lastSavedStep: Math.max(
          prev.lastSavedStep,
          shipment.lastSavedStep || 5
        ),
      }));

      return response;
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to update recipient information";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updatePickupLocation = async (pickupData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await shipments.updatePickupLocation(
        shipmentData.id,
        pickupData
      );

      if (!response.success) {
        throw new Error(
          response.data?.error || "Server returned unsuccessful response"
        );
      }

      const shipment = response.data?.shipment;
      if (!shipment?._id) {
        throw new Error("Invalid shipment data in server response");
      }

      setShipmentData((prev) => ({
        ...prev,
        pickup: pickupData,
        lastSavedStep: Math.max(
          prev.lastSavedStep,
          shipment.lastSavedStep || 6
        ),
      }));

      return response;
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to update pickup location";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateInsurance = async (insuranceData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await shipments.updateInsurance(
        shipmentData.id,
        insuranceData
      );

      if (!response.success) {
        throw new Error(
          response.data?.error || "Server returned unsuccessful response"
        );
      }

      const shipment = response.data?.shipment;
      if (!shipment?._id) {
        throw new Error("Invalid shipment data in server response");
      }

      setShipmentData((prev) => ({
        ...prev,
        insurance: insuranceData,
        lastSavedStep: Math.max(
          prev.lastSavedStep,
          shipment.lastSavedStep || 7
        ),
      }));

      return response;
    } catch (err) {
      const message = err.response?.data?.error || "Failed to update insurance";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const finalizeShipment = async (shipmentId) => {
    try {
      setLoading(true);
      setError(null);

      if (!shipmentId && !shipmentData.id) {
        throw new Error("No shipment ID provided");
      }

      const id = shipmentId || shipmentData.id;
      const response = await shipments.finalizeShipment(id);

      if (!response.success) {
        throw new Error(
          response.data?.error || "Server returned unsuccessful response"
        );
      }

      const shipment = response.data?.shipment;
      if (!shipment) {
        throw new Error("No shipment returned from server");
      }

      // Reset current shipment after finalization
      resetShipment();

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to finalize shipment";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetShipment = () => {
    setShipmentData({
      id: null,
      shipmentType: null,
      origin: null,
      destination: null,
      package: null,
      delivery: null,
      sender: null,
      recipient: null,
      pickup: null,
      insurance: null,
      lastSavedStep: 1,
    });
  };

  // Method to load a draft shipment by ID
  const loadShipmentDraft = async (shipmentId) => {
    try {
      setLoading(true);
      setError(null);

      // Validate shipment ID format
      if (
        !shipmentId ||
        typeof shipmentId !== "string" ||
        shipmentId === "drafts" ||
        shipmentId.length !== 24
      ) {
        throw new Error("Invalid shipment ID format. Please try again.");
      }

      const response = await shipments.getDraftById(shipmentId);

      if (!response.success) {
        throw new Error(
          response.data?.error || "Failed to fetch shipment draft"
        );
      }

      const shipment = response.data.shipment;

      if (!shipment) {
        throw new Error("No shipment data returned from server");
      }

      // Check if we have a saved step in sessionStorage
      let lastStep = shipment.lastSavedStep || 1;
      const savedStep = sessionStorage.getItem(`shipment_step_${shipmentId}`);
      if (savedStep) {
        const stepNumber = parseInt(savedStep, 10);
        if (stepNumber >= 1 && stepNumber <= 7) {
          // Use the greater of server lastSavedStep or sessionStorage
          lastStep = Math.max(lastStep, stepNumber);
        }
      }

      // Map the server response to our local state format
      const mappedData = {
        id: shipment._id,
        shipmentType: shipment.type,
        origin: shipment.origin,
        destination: shipment.destination,
        package: shipment.packages ? { packages: shipment.packages } : null,
        delivery: shipment.deliveryOptions || null,
        sender: shipment.sender || null,
        recipient: shipment.recipient || null,
        pickup: shipment.pickup || null,
        insurance: shipment.insurance || null,
        lastSavedStep: lastStep,
        // Include other fields like cost if needed
        cost: shipment.cost || null,
      };

      setShipmentData(mappedData);

      // Store the current step in sessionStorage
      sessionStorage.setItem(
        `shipment_step_${shipmentId}`,
        lastStep.toString()
      );

      return mappedData;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to load shipment draft";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const contextValue = {
    shipmentData,
    loading,
    error,
    initializeShipment,
    updatePackageDetails,
    selectPickupLocation,
    calculateShippingCost,
    updateDeliveryOptions,
    updateSenderInfo,
    updateRecipientInfo,
    updatePickupLocation,
    updateInsurance,
    finalizeShipment,
    resetShipment,
    loadShipmentDraft,
  };

  return (
    <ShipmentContext.Provider value={contextValue}>
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipment = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error("useShipment must be used within a ShipmentProvider");
  }
  return context;
};
