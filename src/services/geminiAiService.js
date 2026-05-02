import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Usage tracking to prevent quota exhaustion
const DAILY_QUOTA_LIMIT = 15; // Leave some buffer from the 20 limit
const usageStorageKey = 'gemini-api-usage';

const getUsageData = () => {
  const stored = localStorage.getItem(usageStorageKey);
  if (!stored) return { count: 0, date: new Date().toDateString() };
  
  const data = JSON.parse(stored);
  const today = new Date().toDateString();
  
  // Reset if it's a new day
  if (data.date !== today) {
    return { count: 0, date: today };
  }
  
  return data;
};

const incrementUsage = () => {
  const data = getUsageData();
  data.count += 1;
  localStorage.setItem(usageStorageKey, JSON.stringify(data));
  return data.count;
};

const canUseAI = () => {
  const usage = getUsageData();
  return usage.count < DAILY_QUOTA_LIMIT;
};

export const getUsageStatus = () => {
  const usage = getUsageData();
  return {
    used: usage.count,
    limit: DAILY_QUOTA_LIMIT,
    remaining: DAILY_QUOTA_LIMIT - usage.count,
    canUse: canUseAI(),
    date: usage.date
  };
};

// Test the API key and list available models
export const testGeminiAPI = async () => {
  try {
    // Try to list models first
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${import.meta.env.VITE_GEMINI_API_KEY}`);
    const data = await response.json();
    console.log('Available models:', data);
    return data;
  } catch (error) {
    console.error('API test failed:', error);
    return null;
  }
};

// Make it available globally for browser console testing
window.testGeminiAPI = async () => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('Testing API key with SDK:', apiKey.substring(0, 10) + '...');
    
    // First, try to list available models
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const modelsData = await modelsResponse.json();
    
    if (!modelsResponse.ok) {
      console.error('Failed to list models:', modelsData);
      return { error: 'Failed to list models', details: modelsData };
    }
    
    console.log('Available models:', modelsData);
    
    // Find a valid model for text generation
    const textModels = modelsData.models?.filter(model => 
      model.name.includes('generateContent') || 
      model.supportedGenerationMethods?.includes('generateContent')
    );
    
    if (textModels.length > 0) {
      console.log('Text generation models available:', textModels);
      const modelName = textModels[0].name.split('/').pop();
      
      // Test with the first available model
      const testGenAI = new GoogleGenerativeAI(apiKey);
      const testModel = testGenAI.getGenerativeModel({ model: modelName });
      
      const result = await testModel.generateContent("Hello, test message");
      const response = await result.response;
      const text = response.text();
      
      console.log('API Test Success! Response:', text);
      return { success: true, response: text, model: modelName };
    } else {
      console.error('No text generation models found');
      return { error: 'No suitable models found', availableModels: modelsData };
    }
    
  } catch (error) {
    console.error('API test failed:', error);
    return { error: error.message, success: false };
  }
};

// Use the working model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generate intelligent response using Gemini AI
 * @param {string} message - User's message
 * @param {Object} userProfile - User's profile data
 * @param {Array} chatHistory - Previous conversation messages
 * @returns {Promise<Object>} AI-generated response and any profile updates
 */
export const generateGeminiResponse = async (message, userProfile, chatHistory = []) => {
  // Check if we've hit the quota limit for today
  if (!canUseAI()) {
    const usage = getUsageData();
    return {
      response: `⚠️ Daily AI limit reached (${usage.count}/${DAILY_QUOTA_LIMIT}). To ensure fair access for all users, please try again tomorrow. I can still help with bio templates and basic advice!`,
      profileUpdate: null,
      isRateLimited: true
    };
  }
  
  try {
    // Check if user wants to update profile
    const profileUpdate = await checkForProfileUpdate(message, userProfile);
    
    // Build context from user profile and chat history
    const context = buildContext(userProfile, chatHistory);
    
    // Create prompt for Gemini
    const prompt = createPrompt(message, context);
    
    // Generate response using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Increment usage counter
    const newCount = incrementUsage();
    console.log(`AI usage: ${newCount}/${DAILY_QUOTA_LIMIT}`);
    
    return {
      response: response.text(),
      profileUpdate: profileUpdate,
      remainingQuota: DAILY_QUOTA_LIMIT - newCount
    };
  } catch (error) {
    console.error('Gemini AI error:', error);
    
    // Handle specific rate limit error
    if (error.message.includes('429') || error.message.includes('quota exceeded') || error.message.includes('Too Many Requests')) {
      return {
        response: "⚠️ I've reached my daily limit for AI responses. Please try again later tomorrow, or use the fallback responses for basic help. For bio updates, I can still help with simple templates!",
        profileUpdate: null,
        isRateLimited: true
      };
    }
    
    // Fallback to enhanced rule-based response if Gemini fails
    return {
      response: await fallbackResponse(message, userProfile, chatHistory),
      profileUpdate: null
    };
  }
};

/**
 * Generate fallback bio options when AI is rate limited
 */
const generateFallbackBioOptions = (userProfile) => {
  const name = userProfile.name || 'Professional';
  const skills = userProfile.skills || 'dedicated professional';
  const location = userProfile.location || 'Kenya';
  
  return `**Option 1 (Focus: Drive):**
${name} is a driven professional in ${location}, ready to apply dedication and fresh perspective. With strong commitment to continuous learning, eager to make tangible impact in a dynamic organization.

**Option 2 (Focus: Potential):**
${name} is an ambitious professional based in ${location}, actively seeking new challenges. Brings strong work ethic and commitment to growth, eager to contribute potential and make significant impact.

**Option 3 (Focus: Skills):**
${name} is a proactive professional in ${location} with expertise in ${skills}. Committed to learning and ready to make valuable contribution to a forward-thinking team.`;
};

/**
 * Check if user wants to update profile and prepare the update for confirmation
 */
const checkForProfileUpdate = async (message, userProfile) => {
  const lowerMessage = message.toLowerCase();
  
  // Check for profile update requests
  if (lowerMessage.includes('update my bio') || lowerMessage.includes('write my bio') || lowerMessage.includes('change my bio')) {
    const bioPrompt = `Generate 3 different professional bio options under 50 words each for a job seeker with these details:
Name: ${userProfile.name || 'Not specified'}
Skills: ${userProfile.skills || 'Not specified'}
Experience: ${userProfile.experience || 'Not specified'}
Location: ${userProfile.location || 'Not specified'}

Format the response exactly like this:
**Option 1 (Focus: Drive):**
[Bio text here]

**Option 2 (Focus: Potential):**
[Bio text here]

**Option 3 (Focus: Skills):**
[Bio text here]

Each bio should be punchy, professional, and under 50 words.`;
    
    try {
      const result = await model.generateContent(bioPrompt);
      const response = await result.response;
      const bioOptions = response.text();
      
      // Return the options for selection (don't apply yet)
      return { 
        field: 'bio', 
        value: bioOptions, 
        isOptions: true,
        message: 'Choose your preferred bio option' 
      };
    } catch (error) {
      console.error('AI bio generation failed, using fallback:', error);
      // Use fallback bio options when AI is rate limited
      const fallbackOptions = generateFallbackBioOptions(userProfile);
      return { 
        field: 'bio', 
        value: fallbackOptions, 
        isOptions: true,
        message: 'Choose your preferred bio option (using templates due to AI limit)',
        isFallback: true
      };
    }
  }
  
  if (lowerMessage.includes('update my skills') || lowerMessage.includes('change my skills')) {
    // Extract skills from message or ask for clarification
    const skillsMatch = message.match(/skills[:\s]+(.+)/i);
    if (skillsMatch) {
      const newSkills = skillsMatch[1].trim();
      // Return the update for confirmation (don't apply yet)
      return { field: 'skills', value: newSkills, message: 'Skills updated successfully!' };
    }
  }
  
  return null;
};

/**
 * Build context from user profile and chat history
 */
const buildContext = (userProfile, chatHistory) => {
  return {
    userProfile: {
      name: userProfile.name || '',
      skills: userProfile.skills || '',
      experience: userProfile.experience || '',
      location: userProfile.location || '',
      bio: userProfile.bio || '',
      type: userProfile.type || 'seeker'
    },
    chatHistory: chatHistory.slice(-10).map(msg => ({
      type: msg.type,
      message: msg.message
    }))
  };
};

/**
 * Create prompt for Gemini AI
 */
const createPrompt = (message, context) => {
  const { userProfile, chatHistory } = context;
  
  return `
You are an intelligent AI career assistant for KaziConnect, a platform connecting Kenyan youth with job opportunities. 
Your role is to provide helpful, personalized career advice, job search guidance, and professional development support.

USER PROFILE:
- Name: ${userProfile.name}
- Skills: ${userProfile.skills}
- Experience: ${userProfile.experience}
- Location: ${userProfile.location}
- Bio: ${userProfile.bio}
- User Type: ${userProfile.type}

CONVERSATION HISTORY:
${chatHistory.map(msg => `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.message}`).join('\n')}

CURRENT USER MESSAGE: "${message}"

INSTRUCTIONS:
1. Provide thoughtful, personalized responses based on the user's profile and conversation history
2. Focus on career advice, job search strategies, skill development, and professional growth
3. Be encouraging, supportive, and professional
4. When appropriate, ask clarifying questions to better understand the user's needs
5. Provide actionable, specific advice tailored to the Kenyan job market
6. Keep responses SHORT and concise (aim for 2-3 sentences max, brief paragraphs)
7. If the user asks for a bio, keep it under 50 words and make it punchy
8. If the user asks about specific jobs, provide realistic suggestions based on their profile
9. Always maintain a helpful, positive tone
10. Avoid long paragraphs and get straight to the point
11. Users can ask you to "update my bio", "write my bio", or "change my skills" to update their profile

RESPONSE:`;
};

/**
 * Fallback response if Gemini is unavailable
 */
const fallbackResponse = async (message, userProfile, chatHistory = []) => {
  // Enhanced fallback that's less keyword-dependent than the original
  return `Hello ${userProfile.name}! I'm your AI career assistant. 

I understand you're asking about: "${message}"

While I'm currently operating in a limited mode, I can still offer some general guidance based on your profile:
- Skills: ${userProfile.skills || 'Not specified'}
- Experience: ${userProfile.experience || 'Not specified'}  
- Location: ${userProfile.location || 'Not specified'}

For more personalized and intelligent career advice, please ensure the AI service is properly configured. In the meantime, consider:
1. Updating your complete profile on KaziConnect
2. Exploring job listings that match your skills
3. Networking with professionals in your field
4. Considering skill development opportunities

Is there a specific aspect of your career journey you'd like help with?`;
};