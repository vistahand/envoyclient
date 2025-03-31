/**
 * Utility for managing shipment data in localStorage
 */

const SHIPMENT_DATA_PREFIX = "envoy_shipment_";
const CURRENT_SHIPMENT_KEY = "envoy_current_shipment";
const SHIPMENT_LIST_KEY = "envoy_shipment_list";

/**
 * Saves a shipment to localStorage
 * @param {Object} shipmentData - The shipment data to save
 */
export const saveShipment = (shipmentData) => {
  if (!shipmentData || !shipmentData.id) {
    console.error("Invalid shipment data provided");
    return null;
  }

  const shipmentKey = `${SHIPMENT_DATA_PREFIX}${shipmentData.id}`;

  try {
    // Save the individual shipment data
    localStorage.setItem(
      shipmentKey,
      JSON.stringify({
        ...shipmentData,
        lastUpdated: new Date().toISOString(),
      })
    );

    // Set as current shipment
    localStorage.setItem(CURRENT_SHIPMENT_KEY, shipmentData.id);

    // Update shipment list
    updateShipmentsList(shipmentData.id);

    return shipmentData.id;
  } catch (error) {
    console.error("Error saving shipment to localStorage:", error);
    return null;
  }
};

/**
 * Updates the list of shipments
 * @param {string} shipmentId - The shipment ID to add to the list
 */
const updateShipmentsList = (shipmentId) => {
  try {
    const existingListString = localStorage.getItem(SHIPMENT_LIST_KEY);
    const shipmentsList = existingListString
      ? JSON.parse(existingListString)
      : [];

    // Only add if not already in the list
    if (!shipmentsList.includes(shipmentId)) {
      shipmentsList.unshift(shipmentId); // Add to front of array

      // Keep list to a reasonable size (last 20 shipments)
      const trimmedList = shipmentsList.slice(0, 20);
      localStorage.setItem(SHIPMENT_LIST_KEY, JSON.stringify(trimmedList));
    }
  } catch (error) {
    console.error("Error updating shipments list:", error);
  }
};

/**
 * Gets the current shipment data
 * @returns {Object|null} The current shipment data or null
 */
export const getCurrentShipment = () => {
  try {
    const currentShipmentId = localStorage.getItem(CURRENT_SHIPMENT_KEY);
    if (!currentShipmentId) return null;

    return getShipmentById(currentShipmentId);
  } catch (error) {
    console.error("Error getting current shipment:", error);
    return null;
  }
};

/**
 * Gets a shipment by ID
 * @param {string} shipmentId - The shipment ID
 * @returns {Object|null} The shipment data or null
 */
export const getShipmentById = (shipmentId) => {
  if (!shipmentId) return null;

  try {
    const shipmentKey = `${SHIPMENT_DATA_PREFIX}${shipmentId}`;
    const shipmentData = localStorage.getItem(shipmentKey);
    return shipmentData ? JSON.parse(shipmentData) : null;
  } catch (error) {
    console.error(`Error retrieving shipment ${shipmentId}:`, error);
    return null;
  }
};

/**
 * Gets a shipment by tracking number
 * @param {string} trackingNumber - The tracking number
 * @returns {Object|null} The shipment data or null
 */
export const getShipmentByTracking = (trackingNumber) => {
  if (!trackingNumber) return null;

  try {
    const shipmentsList = getShipmentsList();

    for (const shipmentId of shipmentsList) {
      const shipment = getShipmentById(shipmentId);
      if (shipment && shipment.trackingNumber === trackingNumber) {
        return shipment;
      }
    }
    return null;
  } catch (error) {
    console.error("Error retrieving shipment by tracking:", error);
    return null;
  }
};

/**
 * Gets the list of all shipment IDs
 * @returns {Array} List of shipment IDs
 */
export const getShipmentsList = () => {
  try {
    const listString = localStorage.getItem(SHIPMENT_LIST_KEY);
    return listString ? JSON.parse(listString) : [];
  } catch (error) {
    console.error("Error retrieving shipments list:", error);
    return [];
  }
};

/**
 * Updates specific properties of a shipment
 * @param {string} shipmentId - The shipment ID
 * @param {Object} updates - Object with properties to update
 * @returns {Object|null} Updated shipment data or null
 */
export const updateShipment = (shipmentId, updates) => {
  if (!shipmentId || !updates) return null;

  try {
    const existingShipment = getShipmentById(shipmentId);
    if (!existingShipment) return null;

    const updatedShipment = {
      ...existingShipment,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    // Re-save the updated shipment
    const shipmentKey = `${SHIPMENT_DATA_PREFIX}${shipmentId}`;
    localStorage.setItem(shipmentKey, JSON.stringify(updatedShipment));

    return updatedShipment;
  } catch (error) {
    console.error(`Error updating shipment ${shipmentId}:`, error);
    return null;
  }
};

/**
 * Clears the current shipment reference
 */
export const clearCurrentShipment = () => {
  localStorage.removeItem(CURRENT_SHIPMENT_KEY);
};

/**
 * Deletes a shipment from storage
 * @param {string} shipmentId - The shipment ID to delete
 * @returns {boolean} Success status
 */
export const deleteShipment = (shipmentId) => {
  if (!shipmentId) return false;

  try {
    // Remove the shipment data
    const shipmentKey = `${SHIPMENT_DATA_PREFIX}${shipmentId}`;
    localStorage.removeItem(shipmentKey);

    // Remove from list
    const shipmentsList = getShipmentsList();
    const updatedList = shipmentsList.filter((id) => id !== shipmentId);
    localStorage.setItem(SHIPMENT_LIST_KEY, JSON.stringify(updatedList));

    // Clear current if it's the current shipment
    if (localStorage.getItem(CURRENT_SHIPMENT_KEY) === shipmentId) {
      clearCurrentShipment();
    }

    return true;
  } catch (error) {
    console.error(`Error deleting shipment ${shipmentId}:`, error);
    return false;
  }
};
