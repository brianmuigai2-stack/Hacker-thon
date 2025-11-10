import React, { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationAsRead } from '../services/notificationService';
import '../styles/notification.css';

const NotificationsPanel = ({ userId, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      loadNotifications();
    }
  }, [isOpen, userId]);

  const loadNotifications = async () => {
    try {
      const notifs = await getUserNotifications(userId);
      setNotifications(notifs);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notifications-panel">
      <div className="notifications-overlay" onClick={onClose} />
      <div className="notifications-content">
        <div className="notifications-header">
          <h3>Notifications</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="notifications-list">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : notifications.length > 0 ? (
            notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                onClick={() => !notif.read && handleMarkAsRead(notif.id)}
              >
                <div className="notif-icon">
                  {notif.type === 'accepted' ? '' : 
                   notif.type === 'rejected' ? '' : ''}
                </div>
                <div className="notif-content">
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  {notif.additionalMessage && (
                    <p className="additional-message">"{notif.additionalMessage}"</p>
                  )}
                  <span className="notif-time">
                    {notif.createdAt?.seconds 
                      ? new Date(notif.createdAt.seconds * 1000).toLocaleString()
                      : new Date(notif.createdAt).toLocaleString()
                    }
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;