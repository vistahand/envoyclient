import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

const NotificationToast = () => {
  const { notifications, markAsRead } = useNotifications();

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    const timers = notifications
      .filter(notification => !notification.read)
      .map(notification => {
        return setTimeout(() => {
          markAsRead(notification.id);
        }, 5000);
      });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [notifications, markAsRead]);

  if (!notifications.length) return null;

  return (
    <div className="fixed md:bottom-10 ss:bottom-8 bottom-6 md:right-20 ss:right-16 right-5 z-50 space-y-2 max-w-sm">
      {notifications
        .filter(notification => !notification.read)
        .map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
              ${notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
                notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
                notification.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                'bg-blue-50 border-l-4 border-blue-500'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`text-sm font-medium
                  ${notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'error' ? 'text-red-800' :
                    notification.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'}`}
                >
                  {notification.title}
                </h3>
                <p className={`mt-1 text-sm
                  ${notification.type === 'success' ? 'text-green-700' :
                    notification.type === 'error' ? 'text-red-700' :
                    notification.type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700'}`}
                >
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => markAsRead(notification.id)}
                className={`ml-4 text-sm font-medium
                  ${notification.type === 'success' ? 'text-green-600 hover:text-green-800' :
                    notification.type === 'error' ? 'text-red-600 hover:text-red-800' :
                    notification.type === 'warning' ? 'text-yellow-600 hover:text-yellow-800' :
                    'text-blue-600 hover:text-blue-800'}`}
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default NotificationToast;
