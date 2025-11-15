import React, { useState, useEffect } from 'react';
import { sendMessage, getUserConversations, getConversation } from '../services/messageService';

const MessageCenter = ({ user, isOpen, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      loadConversations();
    }
  }, [isOpen, user]);

  const loadConversations = async () => {
    try {
      const convs = await getUserConversations(user.uid);
      setConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const openChat = async (otherUserId) => {
    try {
      const chatMessages = await getConversation(user.uid, otherUserId);
      setMessages(chatMessages);
      setActiveChat(otherUserId);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    
    try {
      await sendMessage(user.uid, activeChat, newMessage.trim());
      setNewMessage('');
      openChat(activeChat); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="message-center-overlay">
      <div className="message-center">
        <div className="message-header">
          <h3>Messages</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="message-content">
          <div className="conversations-list">
            <h4>Conversations</h4>
            {conversations.length > 0 ? (
              conversations.map(conv => (
                <div 
                  key={conv.id} 
                  className="conversation-item"
                  onClick={() => openChat(conv.senderId === user.uid ? conv.receiverId : conv.senderId)}
                >
                  <div className="conv-info">
                    <strong>User {conv.senderId === user.uid ? conv.receiverId : conv.senderId}</strong>
                    <p>{conv.message.substring(0, 50)}...</p>
                  </div>
                  <div className="conv-time">
                    {new Date(conv.timestamp.seconds * 1000).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p>No conversations yet</p>
            )}
          </div>
          
          <div className="chat-area">
            {activeChat ? (
              <>
                <div className="messages-list">
                  {messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`message ${msg.senderId === user.uid ? 'sent' : 'received'}`}
                    >
                      <p>{msg.message}</p>
                      <span className="message-time">
                        {new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="message-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </>
            ) : (
              <div className="no-chat">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;