import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const ADMIN_TIMEOUT = 60 * 1000; // 1 minutes in milliseconds

export const useActivityMonitor = () => {
  const { user, logout } = useAuth();
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set timeout for admin users
    if (user?.role === "admin") {
      timeoutRef.current = setTimeout(() => {
        logout();
        alert("Session expired due to inactivity. Please log in again.");
      }, ADMIN_TIMEOUT);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    // Activity events to monitor
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const activityHandler = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, activityHandler);
    });

    // Initial timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, activityHandler);
      });
    };
  }, [user, logout]);
};
