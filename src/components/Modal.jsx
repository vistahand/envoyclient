import React, { useEffect } from "react";
import { FiX, FiCheck, FiAlertTriangle, FiInfo } from "react-icons/fi";

/**
 * Reusable Modal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {string} props.type - 'success', 'error', 'warning', 'info'
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {Array} props.buttons - Array of button objects {label, onClick, variant}
 * @param {React.ReactNode} props.children - Optional children content
 * @param {string} props.size - 'sm', 'md', 'lg', 'full' (for mobile) - default 'md'
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  type = "info", 
  title, 
  message, 
  buttons = [],
  children,
  size = "md"
}) => {
  // Don't render if modal is closed
  if (!isOpen) return null;
  
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Determine icon and colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: <FiCheck className="h-6 w-6 text-green-600" />,
          bgColor: "bg-green-100",
          borderColor: "border-green-200"
        };
      case "error":
        return {
          icon: <FiX className="h-6 w-6 text-red-600" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        };
      case "warning":
        return {
          icon: <FiAlertTriangle className="h-6 w-6 text-amber-600" />,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200"
        };
      default:
        return {
          icon: <FiInfo className="h-6 w-6 text-blue-600" />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200"
        };
    }
  };

  const { icon, bgColor, borderColor } = getTypeStyles();

  // Get size class for the modal
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "sm:max-w-sm";
      case "lg":
        return "sm:max-w-xl";
      case "full":
        return "sm:max-w-lg";
      default:
        return "sm:max-w-lg";
    }
  };

  // Render button with appropriate styling
  const renderButton = (button, index) => {
    const baseStyle = "px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 flex-1 sm:flex-none";
    
    const getVariantStyle = () => {
      switch (button.variant) {
        case "primary":
          return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
        case "secondary":
          return "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500";
        case "danger":
          return "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
        case "success":
          return "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500";
        default:
          return "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500";
      }
    };

    return (
      <button
        key={index}
        onClick={button.onClick}
        className={`${baseStyle} ${getVariantStyle()}`}
      >
        {button.label}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal container - adjusted for mobile */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Modal Panel */}
        <div 
          className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full ${getSizeClass()} 
          border ${borderColor} max-h-[90vh] sm:max-h-[80vh]`}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Close modal"
          >
            <FiX className="h-5 w-5 text-gray-500" />
          </button>

          {/* Modal Header */}
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${bgColor} sm:mx-0 sm:h-10 sm:w-10`}>
                {icon}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {message}
                  </p>
                  {children && (
                    <div className="mt-4 max-h-[40vh] overflow-y-auto custom-scrollbar">
                      {children}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer with Buttons - Improved for mobile */}
          <div className="bg-gray-50 px-4 py-3 flex flex-col-reverse sm:flex-row-reverse sm:gap-3 sm:px-6">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 w-full sm:justify-end">
              {buttons.map((button, index) => renderButton(button, index))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;