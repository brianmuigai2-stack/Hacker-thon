import React, { useState, useRef, useEffect } from 'react';
import { generateGeminiResponse, getUsageStatus } from '../services/geminiAiService';
import { updateUserProfile } from '../services/userService';
import LoadingSpinner from './LoadingSpinner';
import '../styles/floating-ai.css';

const FloatingAI = ({ user, updateUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [bioOptions, setBioOptions] = useState(null);
  const [usageStatus, setUsageStatus] = useState(getUsageStatus());
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    const newMessages = [...messages, { type: 'user', message: userMessage }];
    setMessages(newMessages);
    
    setLoading(true);
    try {
      const aiResult = await generateGeminiResponse(userMessage, user, messages);
      
      // Add the AI response
      const updatedMessages = [...newMessages, { type: 'ai', message: aiResult.response }];
      
      // If there was a profile update, handle it appropriately
      if (aiResult.profileUpdate) {
        if (aiResult.profileUpdate.isOptions) {
          // Show bio options for selection
          setBioOptions(aiResult.profileUpdate.value);
          updatedMessages.push({ 
            type: 'ai', 
            message: aiResult.profileUpdate.value,
            isBioOptions: true,
            field: aiResult.profileUpdate.field
          });
        } else {
          // Show confirmation for regular updates
          setPendingUpdate(aiResult.profileUpdate);
          updatedMessages.push({ 
            type: 'ai', 
            message: `I've prepared an update for your ${aiResult.profileUpdate.field}. Would you like me to apply this change?`,
            isConfirmation: true,
            pendingUpdate: aiResult.profileUpdate
          });
        }
      }
      
      setMessages(updatedMessages);
    
    // Update usage status after each interaction
    setUsageStatus(getUsageStatus());
    } catch (error) {
      setMessages([...newMessages, { type: 'ai', message: 'Sorry, I had trouble understanding that. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const confirmProfileUpdate = async () => {
    if (!pendingUpdate) return;
    
    try {
      // Apply the update to database
      await updateUserProfile(user.uid, { [pendingUpdate.field]: pendingUpdate.value });
      
      // Update the local user state to reflect changes immediately
      updateUser({ [pendingUpdate.field]: pendingUpdate.value });
      
      // Update messages to show success
      setMessages(prev => prev.map(msg => 
        msg.isConfirmation 
          ? { ...msg, message: `✅ ${pendingUpdate.field} updated successfully!`, isProfileUpdate: true, isConfirmation: false }
          : msg
      ));
      
      setPendingUpdate(null);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        message: '❌ Error updating profile. Please try again.' 
      }]);
    }
  };

  const cancelProfileUpdate = () => {
    setPendingUpdate(null);
    // Remove the confirmation message
    setMessages(prev => prev.filter(msg => !msg.isConfirmation));
  };

  const selectBioOption = async (optionNumber) => {
    console.log('Selecting bio option:', optionNumber);
    console.log('Bio options available:', bioOptions);
    
    if (!bioOptions) {
      console.log('No bio options available');
      return;
    }
    
    // Try multiple regex patterns to extract the selected bio text
    let selectedBio = null;
    
    // Pattern 1: Match the exact format from the prompt
    let pattern = new RegExp(`\\*\\*Option ${optionNumber} \\([^)]+\\):\\*\\*\\s*([^*]+?)(?=\\*\\*Option|$)`, 's');
    let match = bioOptions.match(pattern);
    
    if (match) {
      selectedBio = match[1].trim();
    } else {
      // Pattern 2: More flexible matching
      pattern = new RegExp(`Option ${optionNumber}[^:]*:\\s*([^\\n]+)`, 'i');
      match = bioOptions.match(pattern);
      if (match) {
        selectedBio = match[1].trim();
      }
    }
    
    console.log('Selected bio:', selectedBio);
    
    if (!selectedBio) {
      console.log('Could not extract bio text for option', optionNumber);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        message: `❌ Could not extract bio text for Option ${optionNumber}. Please try again.` 
      }]);
      return;
    }
    
    try {
      // Apply the selected bio to database
      await updateUserProfile(user.uid, { bio: selectedBio });
      
      // Update the local user state to reflect changes immediately
      updateUser({ bio: selectedBio });
      
      // Update usage status
      setUsageStatus(getUsageStatus());
      
      // Update messages to show success
      setMessages(prev => [...prev, { 
        type: 'ai', 
        message: `✅ Bio updated successfully with Option ${optionNumber}!`,
        isProfileUpdate: true
      }]);
      
      // Clear bio options
      setBioOptions(null);
    } catch (error) {
      console.error('Error updating bio:', error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        message: '❌ Error updating bio. Please try again.' 
      }]);
    }
  };

  const cancelBioSelection = () => {
    setBioOptions(null);
    // Remove the bio options message
    setMessages(prev => prev.filter(msg => !msg.isBioOptions));
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
                <span className="ai-status">
                  {usageStatus.canUse ? `Online (${usageStatus.remaining}/${usageStatus.limit} left)` : 'Daily limit reached'}
                </span>
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
              <div key={index} className={`chat-msg ${msg.type} ${msg.isProfileUpdate ? 'profile-update' : ''} ${msg.isConfirmation ? 'confirmation' : ''} ${msg.isBioOptions ? 'bio-options' : ''}`}>
                {msg.type === 'ai' && <span className="msg-avatar">🤖</span>}
                <div className="msg-content">
                  <div className="bio-text">{msg.message}</div>
                  {msg.isConfirmation && (
                    <div className="confirmation-buttons">
                      <button onClick={confirmProfileUpdate} className="btn-confirm">
                        ✅ Yes, update
                      </button>
                      <button onClick={cancelProfileUpdate} className="btn-cancel">
                        ❌ Cancel
                      </button>
                    </div>
                  )}
                  {msg.isBioOptions && (
                    <div className="bio-option-buttons">
                      <div className="bio-options-label">Choose your preferred bio:</div>
                      <div className="bio-buttons-row">
                        <button onClick={() => {
                          console.log('Button 1 clicked');
                          selectBioOption(1);
                        }} className="btn-bio-option">
                          📝 Option 1
                        </button>
                        <button onClick={() => {
                          console.log('Button 2 clicked');
                          selectBioOption(2);
                        }} className="btn-bio-option">
                          📝 Option 2
                        </button>
                        <button onClick={() => {
                          console.log('Button 3 clicked');
                          selectBioOption(3);
                        }} className="btn-bio-option">
                          📝 Option 3
                        </button>
                      </div>
                      <button onClick={() => {
                        console.log('Cancel button clicked');
                        cancelBioSelection();
                      }} className="btn-cancel-small">
                        ❌ Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg ai">
                <span className="msg-avatar">🤖</span>
                <LoadingSpinner size="small" text="" />
              </div>
            )}
            <div ref={messagesEndRef} />
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