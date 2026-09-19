'use client';

import * as React from 'react';
import { toast } from 'sonner';
import i18n from '@/shared/i18n';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ShowNotificationOptions {
  type?: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

export interface NotificationContextValue {
  showNotification: (options: ShowNotificationOptions) => string;
  closeNotification: (id: string) => void;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
}

const NotificationContext = React.createContext<NotificationContextValue | undefined>(undefined);

const defaultTitleKeys: Record<NotificationType, string> = {
  success: 'admin.notification.success',
  error: 'admin.notification.error',
  warning: 'admin.notification.warning',
  info: 'admin.notification.info',
};

const closeNotification = (id: string) => {
  toast.dismiss(id);
};

const showNotification = ({
  type = 'info',
  title,
  message,
  duration = 4500,
}: ShowNotificationOptions) => {
  const id = Math.random().toString(36).slice(2, 9);
  toast[type](title ?? i18n.t(defaultTitleKeys[type], { ns: 'common' }), {
    id,
    description: message,
    duration: duration > 0 ? duration : Infinity,
  });
  return id;
};

const notificationContextValue: NotificationContextValue = {
  showNotification,
  closeNotification,
  success: (message, title) => showNotification({ type: 'success', message, title }),
  error: (message, title) => showNotification({ type: 'error', message, title }),
  warning: (message, title) => showNotification({ type: 'warning', message, title }),
  info: (message, title) => showNotification({ type: 'info', message, title }),
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotificationContext.Provider value={notificationContextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
