import React, { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationAsRead } from '../services/notificationService';
import LoadingSpinner from './LoadingSpinner';
import '../styles/notification.css';

const NotificationsPanel = ({ userId, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      console.log('NotificationsPanel opened for user:', userId);
      loadNotifications();
    }
  }, [isOpen, userId]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const notifs = await getUserNotifications(userId);
      console.log('Notifications loaded in panel:', notifs);
      

      
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
            <LoadingSpinner size="medium" text="Loading notifications..." />
          ) : notifications.length > 0 ? (
            notifications.map(notif => {
              // Debug each notification as it renders
              const hasAdditionalMessage = notif.additionalMessage && 
                                          notif.additionalMessage !== '' && 
                                          notif.additionalMessage.trim() !== '';
              

              
              return (
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
                    <h4>{notif.title || 'Notification'}</h4>
                    <p className="notif-message">{notif.message || 'You have a new notification'}</p>
                    
                    {/* Show additional message if it exists and is not empty */}
                    {hasAdditionalMessage && (
                      <div className="additional-message">
                        <strong>Message from organization:</strong>
                        <p className="org-message">{notif.additionalMessage}</p>
                      </div>
                    )}
                    
                    <span className="notif-time">
                      {notif.createdAt?.seconds 
                        ? new Date(notif.createdAt.seconds * 1000).toLocaleString()
                        : notif.createdAt 
                        ? new Date(notif.createdAt).toLocaleString()
                        : 'Just now'
                      }
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-notifications">
              <p> No notifications yet</p>
              <p style={{ fontSize: '0.9rem', color: '#999' }}>
                You'll see updates here when organizations respond to your applications
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;