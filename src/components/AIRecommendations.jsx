import React, { useState } from 'react';
import { generateJobRecommendations, generateProfileSuggestions, chatWithAI } from '../services/aiService';
import LoadingSpinner from './LoadingSpinner';
import '../styles/ai-recommendations.css';

const AIRecommendations = ({ user }) => {
  const [recommendations, setRecommendations] = useState('');
  const [profileSuggestions, setProfileSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleGetJobRecommendations = async () => {
    setLoading(true);
    try {
      const result = await generateJobRecommendations(user);
      setRecommendations(result);
    } catch (error) {
      alert('Error getting recommendations: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetProfileSuggestions = async () => {
    setLoading(true);
    try {
      const result = await generateProfileSuggestions(user);
      setProfileSuggestions(result);
    } catch (error) {
      alert('Error getting suggestions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    
    // Add user message
    const newMessages = [...chatMessages, { type: 'user', message: userMessage }];
    setChatMessages(newMessages);
    
    setChatLoading(true);
    try {
      const aiResponse = await chatWithAI(userMessage, user, chatMessages);
      setChatMessages([...newMessages, { type: 'ai', message: aiResponse }]);
    } catch (error) {
      setChatMessages([...newMessages, { type: 'ai', message: 'Sorry, I had trouble understanding that. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="ai-recommendations">
      <div className="ai-header">
        <h2>🤖 AI Assistant</h2>
        <p>Get personalized recommendations powered by AI</p>
      </div>

      <div className="ai-tabs">
        <button 
          className={activeTab === 'jobs' ? 'active' : ''}
          onClick={() => setActiveTab('jobs')}
        >
          Job Recommendations
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile Tips
        </button>
        <button 
          className={activeTab === 'chat' ? 'active' : ''}
          onClick={() => setActiveTab('chat')}
        >
          Chat with AI
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div className="ai-section">
          <button 
            onClick={handleGetJobRecommendations}
            disabled={loading}
            className="ai-btn"
          >
            {loading ? 'Generating...' : '✨ Get Job Recommendations'}
          </button>
          
          {loading && <LoadingSpinner size="medium" text="AI is thinking..." />}
          
          {recommendations && (
            <div className="ai-result">
              <h3>Recommended Jobs for You:</h3>
              <pre>{recommendations}</pre>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="ai-section">
          <button 
            onClick={handleGetProfileSuggestions}
            disabled={loading}
            className="ai-btn"
          >
            {loading ? 'Analyzing...' : '💡 Get Profile Suggestions'}
          </button>
          
          {loading && <LoadingSpinner size="medium" text="Analyzing your profile..." />}
          
          {profileSuggestions && (
            <div className="ai-result">
              <h3>Profile Improvement Tips:</h3>
              <pre>{profileSuggestions}</pre>
            </div>
          )}
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="ai-chat-section">
          <div className="chat-messages">
            {chatMessages.length === 0 && (
              <div className="chat-welcome">
                <p>👋 Hi {user.name}! I'm your AI career assistant.</p>
                <p>Ask me about jobs, skills, interviews, or career advice!</p>
              </div>
            )}
            {chatMessages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}`}>
                <div className="message-content">
                  {msg.type === 'ai' && <span className="ai-icon">🤖</span>}
                  <span>{msg.message}</span>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="chat-message ai">
                <div className="message-content">
                  <span className="ai-icon">🤖</span>
                  <LoadingSpinner size="small" text="" />
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me anything about jobs or careers..."
              className="chat-input"
              disabled={chatLoading}
            />
            <button type="submit" disabled={chatLoading || !chatInput.trim()} className="chat-send-btn">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;