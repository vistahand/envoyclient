import React, { useState } from "react";
import { auth } from "../services/api"; // Adjust path as needed for your project structure

const LogoutComponent = ({
  children,
  onLogoutSuccess,
  onLogoutError,
  className = "",
  redirectUrl = "/login",
  component: Component = "div",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Use existing logout function from your API service
      const result = await auth.logout();

      // Handle successful logout
      if (result.success) {
        // Call the success callback if provided
        if (onLogoutSuccess) {
          onLogoutSuccess();
        } else {
          // Default behavior - redirect to login page
          window.location.href = redirectUrl;
        }
      }
    } catch (error) {
      console.error("Logout error:", error);

      // Call the error callback if provided
      if (onLogoutError) {
        onLogoutError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If children prop is provided, use it as content
  if (children) {
    return (
      <Component
        className={className}
        onClick={handleLogout}
        disabled={isLoading}
      >
        {isLoading
          ? typeof children === "function"
            ? children(true)
            : children
          : typeof children === "function"
          ? children(false)
          : children}
      </Component>
    );
  }

  // Default rendering if no children provided
  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
      type="button"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutComponent;
