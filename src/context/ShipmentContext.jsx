import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { shipments } from '../services/api';
import { handleApiError } from '../utils/errorHandler';

const ShipmentContext = createContext(null);

export const ShipmentProvider = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentShipmentId, setCurrentShipmentId] = useState(null);

  // Initialize shipment with origin/destination
  const initializeShipment = async (initialData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shipments.initializeShipment(initialData);
      setCurrentShipmentId(response.data.shipmentId);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'initialize_shipment' },
        defaultMessage: 'Failed to initialize shipment'
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update package details
  const updatePackageDetails = async (packageData) => {
    try {
      setLoading(true);
      setError(null);
      if (!currentShipmentId) throw new Error('No active shipment');
      const response = await shipments.updatePackageDetails(currentShipmentId, packageData);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'update_package_details' },
        defaultMessage: 'Failed to update package details'
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calculate shipping cost
  const calculateShippingCost = async (shipmentDetails) => {
    try {
      setLoading(true);
      setError(null);
      const response = await shipments.calculateCost(shipmentDetails);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'calculate_shipping_cost' },
        defaultMessage: 'Failed to calculate shipping cost'
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update delivery options
  const updateDeliveryOptions = async (deliveryData) => {
    try {
      setLoading(true);
      setError(null);
      if (!currentShipmentId) throw new Error('No active shipment');
      const response = await shipments.updateDeliveryOptions(currentShipmentId, deliveryData);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'update_delivery_options' },
        defaultMessage: 'Failed to update delivery options'
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update sender information
  const updateSenderInfo = async (senderData) => {
    try {
      setLoading(true);
      setError(null);
      if (!currentShipmentId) throw new Error('No active shipment');
      const response = await shipments.updateSenderInfo(currentShipmentId, senderData);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'update_sender_info' },
        defaultMessage: 'Failed to update sender information'
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update recipient information
  const updateRecipientInfo = async (recipientData) => {
    try {
      setLoading(true);
      setError(null);
      if (!currentShipmentId) throw new Error('No active shipment');
      const response = await shipments.updateRecipientInfo(currentShipmentId, recipientData);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'update_recipient_info' },
        defaultMessage: 'Failed to update recipient information'
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update pickup location
  const updatePickupLocation = async (pickupData) => {
    try {
      setLoading(true);
      setError(null);
      if (!currentShipmentId) throw new Error('No active shipment');
      const response = await shipments.updatePickupLocation(currentShipmentId, pickupData);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'update_pickup_location' },
        defaultMessage: 'Failed to update pickup location'
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Finalize shipment
  const finalizeShipment = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!currentShipmentId) throw new Error('No active shipment');
      const response = await shipments.finalizeShipment(currentShipmentId);
      
      addNotification({
        type: 'success',
        title: 'Shipment Created',
        message: `Tracking number: ${response.data.trackingNumber}`
      });

      // Clear current shipment after successful finalization
      setCurrentShipmentId(null);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'finalize_shipment' },
        defaultMessage: 'Failed to finalize shipment'
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset current shipment
  const resetShipment = () => {
    setCurrentShipmentId(null);
    setError(null);
  };

  const value = {
    loading,
    error,
    currentShipmentId,
    initializeShipment,
    updatePackageDetails,
    calculateShippingCost,
    updateDeliveryOptions,
    updateSenderInfo,
    updateRecipientInfo,
    updatePickupLocation,
    finalizeShipment,
    resetShipment,
    isAuthenticated: !!user
  };

  return (
    <ShipmentContext.Provider value={value}>
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipment = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipment must be used within a ShipmentProvider');
  }
  return context;
};
