import React, { useEffect } from "react";
import { FiX, FiCheck, FiAlertTriangle, FiInfo } from "react-icons/fi";

/**
 * Reusable Modal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {string} props.type - 'success', 'error', 'warning', 'info'
 * @param {string} props.title - Modal title
 * @param {string|React.ReactNode} props.message - Modal message content (can be string or ReactNode)
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
  size = "md",
}) => {
  // Lock scroll when modal is open
  useEffect(() => {
    const originalStyle = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
      height: document.body.style.height,
      position: document.body.style.position,
    };

    if (isOpen) {
      // Calculate scrollbar width to prevent content shift
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Lock scrolling when modal opens
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.body.style.height = "100%";
    }

    // Cleanup function to restore scrolling
    return () => {
      // Use setTimeout to ensure this happens after React updates
      setTimeout(() => {
        document.body.style.overflow = originalStyle.overflow;
        document.body.style.paddingRight = originalStyle.paddingRight;
        document.body.style.height = originalStyle.height;
        document.body.style.position = originalStyle.position;
      }, 10);
    };
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Don't render if modal is closed
  if (!isOpen) return null;

  // Determine icon and colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: <FiCheck className="h-6 w-6 text-green-600" />,
          bgColor: "bg-green-100",
          borderColor: "border-green-200",
        };
      case "error":
        return {
          icon: <FiX className="h-6 w-6 text-red-600" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "warning":
        return {
          icon: <FiAlertTriangle className="h-6 w-6 text-amber-600" />,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
        };
      default:
        return {
          icon: <FiInfo className="h-6 w-6 text-blue-600" />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
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
    const baseStyle =
      "px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 flex-1 sm:flex-none";

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
        disabled={button.disabled}
      >
        {button.label}
      </button>
    );
  };

  // Determine if the message is a string or a ReactNode
  const isMessageString = typeof message === "string";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop with animation */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Modal container - adjusted for mobile */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Modal Panel with animation */}
        <div
          className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full ${getSizeClass()} 
          border ${borderColor} max-h-[90vh] sm:max-h-[80vh] animate-modalSlideIn flex flex-col`}
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
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex-shrink-0">
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${bgColor} sm:mx-0 sm:h-10 sm:w-10`}
              >
                {icon}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  className="text-lg font-semibold leading-6 text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
              </div>
            </div>
          </div>

          {/* Modal Content - Now scrollable when content is large */}
          <div className="overflow-y-auto px-4 sm:px-6 flex-grow">
            <div className="space-y-4">
              {/* Message content - styled differently based on type */}
              {isMessageString ? (
                <p className="text-sm text-gray-600">{message}</p>
              ) : (
                <div className="text-sm text-gray-600">{message}</div>
              )}

              {/* Children rendered after message */}
              {children && (
                <div className="custom-scrollbar w-full">{children}</div>
              )}
            </div>
          </div>

          {/* Modal Footer with Buttons - Improved for mobile */}
          {buttons.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 flex-shrink-0 sm:px-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                {buttons.map((button, index) => renderButton(button, index))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
