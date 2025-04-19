import React from "react";
import { FiX, FiCheck, FiAlertTriangle } from "react-icons/fi";

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
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  type = "info", 
  title, 
  message, 
  buttons = [],
  children
}) => {
  if (!isOpen) return null;

  // Determine icon and colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: <FiCheck className="h-6 w-6 text-green-600" />,
          bgColor: "bg-green-100",
          iconBg: "bg-green-100"
        };
      case "error":
        return {
          icon: <FiX className="h-6 w-6 text-red-600" />,
          bgColor: "bg-red-100",
          iconBg: "bg-red-100"
        };
      case "warning":
        return {
          icon: <FiAlertTriangle className="h-6 w-6 text-amber-600" />,
          bgColor: "bg-amber-100",
          iconBg: "bg-amber-100"
        };
      default:
        return {
          icon: <FiCheck className="h-6 w-6 text-blue-600" />,
          bgColor: "bg-blue-100",
          iconBg: "bg-blue-100"
        };
    }
  };

  const { icon, bgColor, iconBg } = getTypeStyles();

  // Render button with appropriate styling
  const renderButton = (button, index) => {
    const baseStyle = "px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const getVariantStyle = () => {
      switch (button.variant) {
        case "primary":
          return "bg-primary text-white hover:bg-primary-dark focus:ring-primary-dark";
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
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

      {/* Modal Panel */}
      <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Modal Header */}
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                {icon}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                  {children && <div className="mt-4">{children}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer with Buttons - Added spacing between buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:gap-3 sm:px-6">
            {buttons.map((button, index) => renderButton(button, index))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;