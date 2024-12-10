import React, { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const NOTIFICATION_TIMEOUT = 5000;

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
};

const colors = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  error: 'bg-red-50 text-red-800 border-red-200',
};

export const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, NOTIFICATION_TIMEOUT);

      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map((notification) => {
        const Icon = icons[notification.type];
        return (
          <div
            key={notification.id}
            className={`flex items-center p-4 rounded-lg border ${
              colors[notification.type]
            } shadow-lg max-w-md`}
          >
            <Icon className="w-5 h-5 mr-3" />
            <p className="flex-1">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-3 opacity-70 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};