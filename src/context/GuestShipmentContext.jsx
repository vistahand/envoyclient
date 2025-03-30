import { createContext, useContext, useState } from "react";
import axios from "axios";
import { shipments } from "../services/api";
import { handleApiError } from "../utils/errorHandler";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const GuestShipmentContext = createContext(null);

export const GuestShipmentProvider = ({ children }) => {
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
  });

  const initializeShipment = async (initialData) => {
    try {
      setLoading(true);
      setError(null);

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
      }));

      return response.data;
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
      }));

      return response;
    } catch (err) {
      const message =
        err.response?.data?.error || "Failed to update delivery options";
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
      }));

      return response;
    } catch (err) {
      console.log(err);
      const message =
        err.response?.data?.error || "Failed happily to update insurance";
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

      const response = await shipments.finalizeShipment(shipmentId);

      if (!response.success) {
        throw new Error(
          response.data?.error || "Server returned unsuccessful response"
        );
      }

      // Clear shipment data after successful finalization
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
      });

      return response;
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
    });
    setError(null);
  };

  const value = {
    loading,
    error,
    shipmentData,
    initializeShipment,
    updatePackageDetails,
    calculateShippingCost,
    updateDeliveryOptions,
    updateSenderInfo,
    updateRecipientInfo,
    updatePickupLocation,
    updateInsurance,
    finalizeShipment,
    resetShipment,
  };

  return (
    <GuestShipmentContext.Provider value={value}>
      {children}
    </GuestShipmentContext.Provider>
  );
};

export const useGuestShipment = () => {
  const context = useContext(GuestShipmentContext);
  if (!context) {
    throw new Error(
      "useGuestShipment must be used within a GuestShipmentProvider"
    );
  }
  return context;
};
