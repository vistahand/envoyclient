import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import socketService from '../services/socketService';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Connect to socket when user is authenticated
    if (user) {
      const socket = socketService.connect();
      socketService.joinUserRoom(user.id);

      // Listen for notifications
      socket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      // Listen for email verification status
      socket.on('email_verification_status', (status) => {
        if (status.verified) {
          addNotification({
            type: 'success',
            title: 'Email Verified',
            message: 'Your email has been successfully verified.'
          });
        }
      });

      // Listen for registration status
      socket.on('registration_status', (status) => {
        if (status.completed) {
          addNotification({
            type: 'success',
            title: 'Registration Complete',
            message: 'Your account has been successfully created.'
          });
        }
      });

      // Listen for payment status
      socket.on('payment_status', (status) => {
        addNotification({
          type: status.success ? 'success' : 'error',
          title: status.success ? 'Payment Successful' : 'Payment Failed',
          message: status.message
        });
      });

      // Listen for shipment status
      socket.on('shipment_status', (status) => {
        addNotification({
          type: 'info',
          title: 'Shipment Update',
          message: status.message
        });
      });

      // Cleanup on unmount
      return () => {
        socket.off('notification');
        socket.off('email_verification_status');
        socket.off('registration_status');
        socket.off('payment_status');
        socket.off('shipment_status');
        socketService.disconnect();
      };
    }
  }, [user]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification => {
        if (notification.id === notificationId && !notification.read) {
          setUnreadCount(count => Math.max(0, count - 1));
          return { ...notification, read: true };
        }
        return notification;
      })
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
