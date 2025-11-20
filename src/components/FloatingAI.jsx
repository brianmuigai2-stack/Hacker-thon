import React, { useState } from 'react';
import { chatWithAI } from '../services/aiService';
import LoadingSpinner from './LoadingSpinner';
import '../styles/floating-ai.css';

const FloatingAI = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    const newMessages = [...messages, { type: 'user', message: userMessage }];
    setMessages(newMessages);
    
    setLoading(true);
    try {
      const aiResponse = await chatWithAI(userMessage, user, messages);
      setMessages([...newMessages, { type: 'ai', message: aiResponse }]);
    } catch (error) {
      setMessages([...newMessages, { type: 'ai', message: 'Sorry, I had trouble understanding that. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="floating-ai">
      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="ai-info">
              <span className="ai-avatar">🤖</span>
              <div>
                <h4>AI Career Assistant</h4>
                <span className="ai-status">Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="close-chat">✕</button>
          </div>
          
          <div className="ai-chat-messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <p>👋 Hi {user.name}! I'm your AI career assistant.</p>
                <p>Ask me about jobs, skills, or career advice!</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`chat-msg ${msg.type}`}>
                {msg.type === 'ai' && <span className="msg-avatar">🤖</span>}
                <div className="msg-content">{msg.message}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg ai">
                <span className="msg-avatar">🤖</span>
                <LoadingSpinner size="small" text="" />
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="ai-chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
      
      <button 
        className={`ai-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          '✕'
        ) : (
          <>
            <span className="ai-icon">🤖</span>
            <span className="ai-text">Chat with AI</span>
          </>
        )}
      </button>
    </div>
  );
};

export default FloatingAI;