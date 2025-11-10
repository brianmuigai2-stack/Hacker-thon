import React, { useState, useEffect } from 'react';
import { getUnreadNotifications } from '../services/notificationService';
import '../styles/notification.css';

const NotificationBadge = ({ userId }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const loadUnreadCount = async () => {
      try {
        const notifications = await getUnreadNotifications(userId);
        setUnreadCount(notifications.length);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  if (unreadCount === 0) return null;

  return (
    <span className="notification-badge">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
};

export default NotificationBadge;