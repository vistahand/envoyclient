import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ADMIN_TIMEOUT = 60 * 60 * 1000; // 5 seconds

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
        toast.error("Session expired due to inactivity. Please log in again.");
        setTimeout(() => {
          logout();
        }, 4000);
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
