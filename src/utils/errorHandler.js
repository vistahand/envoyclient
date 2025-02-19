/**
 * Extract error message from API error response
 * @param {Error} error - Error object from API call
 * @param {string} defaultMessage - Default message to show if error can't be parsed
 * @returns {string} Error message to display to user
 */
export const getErrorMessage = (error, defaultMessage = 'An error occurred. Please try again.') => {
  if (error.message) {
    // Error from our API with specific message
    return error.message;
  } else if (error.response?.status === 401) {
    // Unauthorized
    return 'Please login to continue';
  } else if (error.response?.status === 403) {
    // Forbidden
    return 'You do not have permission to perform this action';
  } else if (error.response?.status === 404) {
    // Not found
    return 'The requested resource was not found';
  } else if (error.response?.status === 422) {
    // Validation error
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      return errors[0]; // Return first validation error
    }
    return 'Invalid data provided';
  } else if (error.response?.status >= 500) {
    // Server error
    return 'Server error. Please try again later.';
  } else if (error.message === 'Network Error') {
    // Network error
    return 'Unable to connect to server. Please check your internet connection.';
  }

  // Default error message
  return defaultMessage;
};

/**
 * Format validation errors from API response
 * @param {Object} errors - Validation errors object from API
 * @returns {Object} Formatted errors object for formik
 */
export const formatValidationErrors = (errors) => {
  const formattedErrors = {};
  
  if (typeof errors === 'string') {
    // Single error message
    return { _error: errors };
  }

  if (Array.isArray(errors)) {
    // Array of error messages
    return { _error: errors[0] };
  }

  // Object of field-specific errors
  Object.keys(errors).forEach(key => {
    if (Array.isArray(errors[key])) {
      formattedErrors[key] = errors[key][0];
    } else {
      formattedErrors[key] = errors[key];
    }
  });

  return formattedErrors;
};

/**
 * Log error to monitoring service
 * @param {Error} error - Error object
 * @param {Object} context - Additional context about the error
 */
export const logError = (error, context = {}) => {
  // TODO: Integrate with error monitoring service (e.g., Sentry)
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    response: error.response?.data,
    status: error.response?.status,
    context
  });
};

/**
 * Handle API error with consistent logging and message extraction
 * @param {Error} error - Error object from API call
 * @param {Object} options - Options for error handling
 * @returns {string} Error message to display to user
 */
export const handleApiError = (error, options = {}) => {
  const {
    context = {},
    defaultMessage,
    shouldLog = true
  } = options;

  // Log error if enabled
  if (shouldLog) {
    logError(error, context);
  }

  // Get user-friendly error message
  return getErrorMessage(error, defaultMessage);
};
