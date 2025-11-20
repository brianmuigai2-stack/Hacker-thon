// Advanced AI service with sophisticated intelligence
export const generateJobRecommendations = async (userProfile) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const analysis = analyzeUserProfile(userProfile);
  return generateIntelligentJobRecommendations(userProfile, analysis);
};

export const generateProfileSuggestions = async (currentProfile) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const analysis = analyzeUserProfile(currentProfile);
  return generateIntelligentProfileSuggestions(currentProfile, analysis);
};

export const chatWithAI = async (message, userProfile, chatHistory = []) => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  
  // Advanced message processing
  const correctedMessage = correctTypos(message);
  const analysis = deepAnalyzeMessage(correctedMessage, userProfile, chatHistory);
  const context = buildConversationContext(chatHistory, userProfile);
  
  // Generate sophisticated response
  return generateAdvancedResponse(correctedMessage, userProfile, analysis, context, chatHistory);
};

// Advanced user profile analysis
const analyzeUserProfile = (userProfile) => {
  const skills = (userProfile.skills || '').toLowerCase();
  const experience = (userProfile.experience || '').toLowerCase();
  const location = (userProfile.location || '').toLowerCase();
  const bio = (userProfile.bio || '').toLowerCase();
  
  // Skill categorization
  const skillCategories = {
    technical: ['computer', 'software', 'programming', 'it', 'tech', 'digital', 'data'],
    manual: ['construction', 'carpentry', 'plumbing', 'electrical', 'mechanic', 'repair'],
    service: ['customer service', 'hospitality', 'cleaning', 'security', 'retail', 'sales'],
    creative: ['design', 'art', 'writing', 'photography', 'marketing', 'content'],
    business: ['management', 'accounting', 'finance', 'administration', 'office'],
    healthcare: ['nursing', 'medical', 'pharmacy', 'therapy', 'care'],
    education: ['teaching', 'training', 'tutoring', 'education', 'instruction'],
    transport: ['driving', 'delivery', 'logistics', 'transport', 'courier']
  };
  
  let primaryCategory = 'general';
  let skillLevel = 'entry';
  
  Object.entries(skillCategories).forEach(([category, keywords]) => {
    if (keywords.some(keyword => skills.includes(keyword))) {
      primaryCategory = category;
    }
  });
  
  // Experience level analysis
  if (experience.includes('year') || experience.includes('experienced') || experience.includes('senior')) {
    skillLevel = 'experienced';
  } else if (experience.includes('intermediate') || experience.includes('some')) {
    skillLevel = 'intermediate';
  }
  
  // Location analysis for market insights
  const majorCities = ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret'];
  const isUrban = majorCities.some(city => location.includes(city));
  
  return {
    primaryCategory,
    skillLevel,
    isUrban,
    hasExperience: experience.length > 0,
    hasBio: bio.length > 0,
    profileCompleteness: calculateProfileCompleteness(userProfile)
  };
};

const calculateProfileCompleteness = (profile) => {
  let score = 0;
  if (profile.name) score += 20;
  if (profile.location) score += 20;
  if (profile.skills) score += 25;
  if (profile.experience) score += 20;
  if (profile.bio) score += 15;
  return score;
};

const generateIntelligentJobRecommendations = (userProfile, analysis) => {
  const { primaryCategory, skillLevel, isUrban } = analysis;
  
  const jobDatabase = {
    technical: {
      entry: ['IT Support Assistant', 'Data Entry Clerk', 'Computer Operator'],
      intermediate: ['Software Developer', 'System Administrator', 'Database Analyst'],
      experienced: ['IT Manager', 'Senior Developer', 'Technical Consultant']
    },
    manual: {
      entry: ['Construction Helper', 'Maintenance Assistant', 'Workshop Apprentice'],
      intermediate: ['Skilled Craftsman', 'Site Supervisor', 'Technical Installer'],
      experienced: ['Project Manager', 'Master Craftsman', 'Construction Foreman']
    },
    service: {
      entry: ['Customer Service Rep', 'Shop Assistant', 'Security Guard'],
      intermediate: ['Team Leader', 'Supervisor', 'Account Manager'],
      experienced: ['Operations Manager', 'Regional Manager', 'Business Development']
    },
    transport: {
      entry: ['Delivery Driver', 'Courier', 'Transport Assistant'],
      intermediate: ['Fleet Coordinator', 'Logistics Officer', 'Route Manager'],
      experienced: ['Transport Manager', 'Logistics Director', 'Fleet Manager']
    }
  };
  
  const jobs = jobDatabase[primaryCategory]?.[skillLevel] || jobDatabase.service.entry;
  const salaryRanges = getSalaryRanges(skillLevel, isUrban);
  
  return `Based on your ${primaryCategory} skills and ${skillLevel} experience level in ${userProfile.location}, here are 3 strategic job recommendations:

🎯 **Personalized Opportunities:**

1. **${jobs[0]}** - ${salaryRanges.low}
   • Perfect match for your ${userProfile.skills} background
   • Growing demand in ${isUrban ? 'urban' : 'regional'} markets
   • Entry path: Apply directly to companies, emphasize reliability

2. **${jobs[1] || jobs[0]}** - ${salaryRanges.mid}
   • Builds on your existing experience
   • Career progression opportunity
   • Entry path: Network through industry contacts, showcase skills

3. **${jobs[2] || jobs[1] || jobs[0]}** - ${salaryRanges.high}
   • Strategic career advancement
   • Higher earning potential
   • Entry path: Gain additional certifications, build portfolio

💡 **Market Intelligence:**
The ${primaryCategory} sector in Kenya is ${getMarketTrend(primaryCategory)}. Your profile strength: ${analysis.profileCompleteness}% complete.

🚀 **Next Steps:**
${getPersonalizedAdvice(userProfile, analysis)}`;
};

const getSalaryRanges = (skillLevel, isUrban) => {
  const multiplier = isUrban ? 1.3 : 1.0;
  
  const ranges = {
    entry: { low: 'KSh 15,000-25,000', mid: 'KSh 20,000-30,000', high: 'KSh 25,000-35,000' },
    intermediate: { low: 'KSh 25,000-40,000', mid: 'KSh 35,000-50,000', high: 'KSh 45,000-65,000' },
    experienced: { low: 'KSh 50,000-80,000', mid: 'KSh 70,000-120,000', high: 'KSh 100,000-200,000' }
  };
  
  return ranges[skillLevel] || ranges.entry;
};

const getMarketTrend = (category) => {
  const trends = {
    technical: 'experiencing rapid growth with digital transformation',
    service: 'stable with consistent demand across all regions',
    manual: 'growing due to infrastructure development projects',
    transport: 'expanding with e-commerce and delivery services',
    business: 'evolving with new opportunities in SME sector',
    healthcare: 'high demand especially in rural areas',
    education: 'transforming with digital learning needs'
  };
  
  return trends[category] || 'showing steady growth opportunities';
};

const getPersonalizedAdvice = (userProfile, analysis) => {
  if (analysis.profileCompleteness < 60) {
    return 'Complete your profile first - add specific skills and experience details.';
  }
  
  if (!analysis.hasExperience) {
    return 'Consider internships or volunteer work to build experience in your field.';
  }
  
  return 'Focus on networking and building industry connections for better opportunities.';
};

// Comprehensive typo correction
const correctTypos = (message) => {
  const typoMap = {
    // Job-related typos
    'jobb': 'job', 'joob': 'job', 'jop': 'job', 'wrk': 'work', 'wurk': 'work',
    'salery': 'salary', 'salry': 'salary', 'sallary': 'salary', 'slary': 'salary',
    'skils': 'skills', 'skiils': 'skills', 'skilles': 'skills', 'skil': 'skill',
    'intervew': 'interview', 'intevew': 'interview', 'intrview': 'interview',
    'experiance': 'experience', 'experence': 'experience', 'expirience': 'experience',
    'carrer': 'career', 'carier': 'career', 'carreer': 'career',
    'trainig': 'training', 'traning': 'training', 'trainin': 'training',
    'educaton': 'education', 'eduction': 'education', 'educaion': 'education',
    'bussiness': 'business', 'busines': 'business', 'buisness': 'business',
    'compny': 'company', 'comany': 'company', 'companie': 'company',
    'postion': 'position', 'possition': 'position', 'positon': 'position',
    'profesional': 'professional', 'proffesional': 'professional',
    'recomend': 'recommend', 'recomends': 'recommends',
    'sugestion': 'suggestion', 'sugestions': 'suggestions',
    'advise': 'advice', 'advices': 'advice',
    'recieve': 'receive', 'recieved': 'received',
    'definately': 'definitely', 'definetly': 'definitely',
    'necesary': 'necessary', 'neccessary': 'necessary',
    'importnt': 'important', 'importand': 'important',
    'diferent': 'different', 'diffrent': 'different',
    'intrested': 'interested', 'intersted': 'interested',
    'sucessful': 'successful', 'succesful': 'successful',
    'achive': 'achieve', 'acheive': 'achieve',
    'beleive': 'believe', 'belive': 'believe',
    'becuase': 'because', 'becase': 'because',
    'thier': 'their', 'ther': 'their',
    'teh': 'the', 'adn': 'and', 'nad': 'and',
    'fo': 'for', 'fro': 'for', 'ofr': 'for',
    'wiht': 'with', 'whit': 'with', 'wih': 'with',
    'form': 'from', 'fomr': 'from', 'frm': 'from',
    'taht': 'that', 'htat': 'that', 'tath': 'that',
    'jsut': 'just', 'juts': 'just', 'jst': 'just',
    'waht': 'what', 'hwat': 'what', 'wht': 'what',
    'whne': 'when', 'wehn': 'when', 'whn': 'when',
    'whre': 'where', 'wher': 'where', 'whr': 'where',
    'hwo': 'how', 'hwow': 'how', 'ho': 'how',
    'youre': 'you are', 'ur': 'your', 'u': 'you',
    'dont': 'don\'t', 'cant': 'can\'t', 'wont': 'won\'t',
    'im': 'I am', 'ive': 'I have', 'id': 'I would'
  };
  
  let corrected = message;
  Object.entries(typoMap).forEach(([typo, correct]) => {
    const regex = new RegExp(`\\b${typo}\\b`, 'gi');
    corrected = corrected.replace(regex, correct);
  });
  
  return corrected;
};

// Advanced message analysis
const deepAnalyzeMessage = (message, userProfile, chatHistory) => {
  const msg = message.toLowerCase();
  
  // Sophisticated intent detection
  const intents = {
    jobSearch: ['job', 'work', 'employment', 'hiring', 'vacancy', 'opportunity', 'career'],
    skillDevelopment: ['skill', 'learn', 'training', 'course', 'education', 'improve', 'develop'],
    salaryNegotiation: ['salary', 'pay', 'wage', 'money', 'negotiate', 'increase', 'raise'],
    interviewPrep: ['interview', 'prepare', 'questions', 'tips', 'practice', 'ready'],
    careerPlanning: ['career', 'future', 'plan', 'goal', 'direction', 'path', 'growth'],
    networking: ['network', 'connect', 'contact', 'reference', 'recommendation', 'introduction'],
    entrepreneurship: ['business', 'startup', 'entrepreneur', 'self-employed', 'freelance'],
    workLifeBalance: ['balance', 'stress', 'time', 'family', 'personal', 'health'],
    industryInsights: ['industry', 'market', 'trend', 'future', 'demand', 'growth'],
    problemSolving: ['problem', 'challenge', 'difficulty', 'stuck', 'help', 'solution']
  };
  
  let detectedIntents = [];
  Object.entries(intents).forEach(([intent, keywords]) => {
    if (keywords.some(keyword => msg.includes(keyword))) {
      detectedIntents.push(intent);
    }
  });
  
  // Emotion and urgency detection
  const emotions = {
    frustrated: ['frustrated', 'angry', 'upset', 'annoyed', 'tired', 'stressed'],
    excited: ['excited', 'happy', 'thrilled', 'amazing', 'great', 'awesome'],
    worried: ['worried', 'concerned', 'anxious', 'nervous', 'scared', 'afraid'],
    confused: ['confused', 'lost', 'unclear', 'don\'t understand', 'puzzled'],
    determined: ['determined', 'motivated', 'ready', 'committed', 'focused']
  };
  
  let emotion = 'neutral';
  Object.entries(emotions).forEach(([emo, keywords]) => {
    if (keywords.some(keyword => msg.includes(keyword))) {
      emotion = emo;
    }
  });
  
  // Question complexity analysis
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'which', 'who'];
  const isQuestion = questionWords.some(word => msg.includes(word)) || msg.includes('?');
  const questionCount = (message.match(/\?/g) || []).length;
  const isComplexQuestion = questionCount > 1 || (msg.includes('and') && isQuestion);
  
  return {
    intents: detectedIntents,
    primaryIntent: detectedIntents[0] || 'general',
    emotion,
    isQuestion,
    isComplexQuestion,
    messageLength: message.length,
    hasNumbers: /\d/.test(message),
    hasLocation: /nairobi|mombasa|kisumu|nakuru|eldoret|kenya/i.test(message)
  };
};

// Build conversation context
const buildConversationContext = (chatHistory, userProfile) => {
  const recentMessages = chatHistory.slice(-5);
  const topics = [];
  const userConcerns = [];
  const mentionedCompanies = [];
  
  recentMessages.forEach(msg => {
    if (msg.type === 'user') {
      const msgLower = msg.message.toLowerCase();
      
      // Extract topics
      if (msgLower.includes('job')) topics.push('jobs');
      if (msgLower.includes('salary')) topics.push('salary');
      if (msgLower.includes('skill')) topics.push('skills');
      
      // Extract concerns
      if (msgLower.includes('worried') || msgLower.includes('problem')) {
        userConcerns.push(msg.message);
      }
      
      // Extract company mentions
      const companies = msgLower.match(/\b(safaricom|equity|kcb|co-op|nation|standard|unga|bamburi)\b/g);
      if (companies) mentionedCompanies.push(...companies);
    }
  });
  
  return {
    recentTopics: [...new Set(topics)],
    userConcerns,
    mentionedCompanies: [...new Set(mentionedCompanies)],
    conversationLength: chatHistory.length,
    isNewConversation: chatHistory.length < 3
  };
};

// Generate sophisticated responses
const generateAdvancedResponse = (message, userProfile, analysis, context, chatHistory) => {
  const { primaryIntent, emotion, isComplexQuestion } = analysis;
  
  // Handle emotional states first
  if (emotion === 'frustrated') {
    return handleFrustratedUser(message, userProfile, analysis, context);
  }
  
  if (emotion === 'worried') {
    return handleWorriedUser(message, userProfile, analysis, context);
  }
  
  // Handle complex questions
  if (isComplexQuestion) {
    return handleComplexQuestion(message, userProfile, analysis, context);
  }
  
  // Handle specific intents with sophisticated responses
  switch (primaryIntent) {
    case 'jobSearch':
      return handleJobSearchIntent(message, userProfile, analysis, context);
    case 'skillDevelopment':
      return handleSkillDevelopmentIntent(message, userProfile, analysis, context);
    case 'salaryNegotiation':
      return handleSalaryNegotiationIntent(message, userProfile, analysis, context);
    case 'interviewPrep':
      return handleInterviewPrepIntent(message, userProfile, analysis, context);
    case 'careerPlanning':
      return handleCareerPlanningIntent(message, userProfile, analysis, context);
    case 'entrepreneurship':
      return handleEntrepreneurshipIntent(message, userProfile, analysis, context);
    case 'problemSolving':
      return handleProblemSolvingIntent(message, userProfile, analysis, context);
    default:
      return handleGeneralIntent(message, userProfile, analysis, context);
  }
};

// Specialized intent handlers
const handleJobSearchIntent = (message, userProfile, analysis, context) => {
  const profileAnalysis = analyzeUserProfile(userProfile);
  
  return `I'll help you with your job search, ${userProfile.name}! Based on your ${profileAnalysis.primaryCategory} background and ${profileAnalysis.skillLevel} experience level:

🎯 **Strategic Approach:**
1. **Target Companies**: Focus on ${getRelevantCompanies(profileAnalysis.primaryCategory)} in ${userProfile.location}
2. **Application Strategy**: ${getApplicationStrategy(profileAnalysis)}
3. **Timeline**: Expect 2-4 weeks for responses, 4-8 weeks for full process

📊 **Market Intelligence:**
• Your skill set has ${getMarketDemand(profileAnalysis.primaryCategory)} demand
• Salary range: ${getSalaryRanges(profileAnalysis.skillLevel, profileAnalysis.isUrban).mid}
• Best application days: Tuesday-Thursday, 9-11 AM

🚀 **Immediate Actions:**
${getImmediateJobSearchActions(userProfile, profileAnalysis)}

What specific aspect of job searching would you like me to elaborate on?`;
};

const handleSkillDevelopmentIntent = (message, userProfile, analysis, context) => {
  return `Excellent focus on skill development, ${userProfile.name}! Here's a strategic learning path:

🎯 **Personalized Learning Strategy:**

**High-Impact Skills for Your Field:**
${getHighImpactSkills(userProfile)}

**Learning Pathway:**
1. **Foundation (1-2 months)**: Core competencies
2. **Intermediate (2-4 months)**: Specialized skills
3. **Advanced (4-6 months)**: Leadership/expert level

**Local Resources:**
• Kenya Institute of Management (KIM)
• Technical University of Kenya
• Online: Coursera, Udemy (with certificates)
• Industry associations in ${userProfile.location}

**ROI Projection:**
Skill development typically increases earning potential by 15-30% within 6-12 months.

Which specific skill area interests you most?`;
};

const handleSalaryNegotiationIntent = (message, userProfile, analysis, context) => {
  const profileAnalysis = analyzeUserProfile(userProfile);
  
  return `Let's strategize your salary negotiation, ${userProfile.name}! Here's a data-driven approach:

💰 **Market Analysis:**
• Your current market value: ${getSalaryRanges(profileAnalysis.skillLevel, profileAnalysis.isUrban).mid}
• Industry average growth: 8-12% annually
• Performance-based increases: 15-25%

🎯 **Negotiation Strategy:**
1. **Research Phase**: Document market rates, your achievements
2. **Timing**: Best during performance reviews or job offers
3. **Approach**: Focus on value delivered, not personal needs

**Negotiation Script:**
"Based on my research and contributions, including [specific achievements], I believe my compensation should reflect the market rate of [amount]. Here's why..."

**Beyond Salary:**
Consider negotiating: flexible hours, training budget, health benefits, transport allowance

**Success Probability:**
With proper preparation: 70-80% success rate for 10-20% increases

What's your current situation - existing job or new offer?`;
};

const handleCareerPlanningIntent = (message, userProfile, analysis, context) => {
  return `Let's build your strategic career plan, ${userProfile.name}! Here's a comprehensive roadmap:

🎯 **5-Year Career Vision:**

**Year 1-2: Foundation Building**
• Master current role requirements
• Build industry network (50+ contacts)
• Gain 2-3 key certifications

**Year 3-4: Growth & Specialization**
• Leadership responsibilities
• Mentor junior colleagues
• Industry recognition/awards

**Year 5+: Strategic Positioning**
• Senior management roles
• Industry thought leadership
• Entrepreneurial opportunities

**Career Tracks Available:**
${getCareerTracks(userProfile)}

**Success Metrics:**
• Salary progression: 15-25% annually
• Network growth: 20+ new contacts yearly
• Skill acquisition: 2-3 new competencies annually

**Immediate Next Steps:**
1. Define your 2-year specific goal
2. Identify 3 key mentors in your field
3. Create a learning schedule

What's your biggest career aspiration?`;
};

const handleProblemSolvingIntent = (message, userProfile, analysis, context) => {
  return `I'm here to help solve your challenge, ${userProfile.name}! Let me break this down systematically:

🔍 **Problem Analysis Framework:**

**Step 1: Define the Core Issue**
• What exactly is the problem?
• When did it start?
• What's the impact?

**Step 2: Root Cause Analysis**
• Why is this happening?
• What factors contribute?
• What's within your control?

**Step 3: Solution Generation**
• Immediate fixes (1-7 days)
• Short-term solutions (1-4 weeks)
• Long-term strategies (1-6 months)

**Step 4: Implementation Plan**
• Priority actions
• Resource requirements
• Success metrics

**Based on your background in ${userProfile.skills}, here are some targeted approaches:**
${getProblemSolvingStrategies(userProfile)}

Can you share more specific details about the challenge you're facing? The more context you provide, the more targeted my advice can be.`;
};

const handleGeneralIntent = (message, userProfile, analysis, context) => {
  const greeting = getTimeBasedGreeting();
  
  return `${greeting}, ${userProfile.name}! I'm analyzing your question about "${message}".

Based on your profile and our conversation, I can help you with:

🎯 **Career Guidance:**
• Job search strategies for ${userProfile.location}
• Skill development in ${userProfile.skills || 'your field'}
• Salary negotiation and career planning

📊 **Market Intelligence:**
• Industry trends and opportunities
• Company insights and networking
• Professional development pathways

🚀 **Actionable Solutions:**
• Step-by-step implementation plans
• Resource recommendations
• Timeline and success metrics

What specific aspect would you like me to dive deeper into? I can provide detailed, actionable advice tailored to your situation.`;
};

// Helper functions
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const getRelevantCompanies = (category) => {
  const companies = {
    technical: 'Safaricom, Equity Bank, KCB, Microsoft Kenya, IBM',
    service: 'Nakumatt, Tuskys, Java House, Serena Hotels',
    manual: 'Bamburi Cement, Kenya Power, construction firms',
    transport: 'Kenya Airways, Uber, Bolt, logistics companies',
    business: 'banks, insurance companies, consulting firms'
  };
  
  return companies[category] || 'various companies across industries';
};

const getApplicationStrategy = (analysis) => {
  if (analysis.skillLevel === 'entry') {
    return 'Apply broadly, emphasize willingness to learn, highlight transferable skills';
  }
  
  return 'Target specific roles, showcase achievements, leverage network connections';
};

const getMarketDemand = (category) => {
  const demand = {
    technical: 'high',
    service: 'steady',
    manual: 'growing',
    transport: 'increasing',
    business: 'moderate'
  };
  
  return demand[category] || 'moderate';
};

const getImmediateJobSearchActions = (userProfile, analysis) => {
  return `• Update LinkedIn profile with ${userProfile.skills} keywords
• Apply to 5-10 relevant positions this week
• Reach out to 3 industry contacts
• Prepare your elevator pitch`;
};

const getHighImpactSkills = (userProfile) => {
  return `• Digital literacy (Microsoft Office, Google Workspace)
• Communication skills (English, Swahili)
• Industry-specific: ${userProfile.skills || 'your field'} advanced techniques
• Leadership and project management`;
};

const getCareerTracks = (userProfile) => {
  return `**Specialist Track**: Deep expertise in ${userProfile.skills || 'your field'}
**Management Track**: Team leadership and operations
**Entrepreneurial Track**: Start your own business
**Consulting Track**: Independent advisory services`;
};

const getProblemSolvingStrategies = (userProfile) => {
  return `• Leverage your ${userProfile.skills || 'existing'} skills for creative solutions
• Network with peers in ${userProfile.location} for insights
• Consider both traditional and innovative approaches
• Break large problems into manageable steps`;
};

const handleFrustratedUser = (message, userProfile, analysis, context) => {
  return `I can hear the frustration in your message, ${userProfile.name}, and I completely understand. Job searching and career challenges can be incredibly stressful.

Let's take a step back and approach this systematically:

🤝 **First, you're not alone** - 70% of professionals face similar challenges

🎯 **Let's refocus on what you can control:**
• Your skills and how you present them
• Your application strategy and timing
• Your network and connections
• Your mindset and persistence

💪 **Immediate stress-relief actions:**
1. Take a 15-minute break from job searching
2. List 3 things you've accomplished recently
3. Reach out to a supportive friend or family member

🚀 **Then, let's create a manageable action plan:**
Instead of trying to solve everything at once, let's focus on ONE specific area where I can help you make progress today.

What's the single biggest frustration you're facing right now? Let's tackle that together.`;
};

const handleWorriedUser = (message, userProfile, analysis, context) => {
  return `I understand your concerns, ${userProfile.name}. Worry often comes from uncertainty, so let's bring some clarity to your situation.

🔍 **Let's address your worries systematically:**

**Common career worries and reality checks:**
• "I'm not qualified enough" → 80% of job requirements are "nice to have"
• "The market is too competitive" → There are always opportunities for prepared candidates
• "I'm too old/young" → Experience and fresh perspectives are both valued

📊 **Your situation analysis:**
• Skills: ${userProfile.skills || 'You have valuable abilities'}
• Location: ${userProfile.location} has diverse opportunities
• Market: Kenya's economy continues to create new jobs

🛡️ **Risk mitigation strategies:**
1. **Diversify your approach** - multiple job search channels
2. **Build a safety net** - emergency fund, skill development
3. **Create backup plans** - alternative career paths

💡 **Confidence builders:**
• You've overcome challenges before
• Your unique combination of skills has value
• Every "no" brings you closer to the right "yes"

What specific worry is keeping you up at night? Let's address it directly with facts and actionable solutions.`;
};

const handleComplexQuestion = (message, userProfile, analysis, context) => {
  const parts = message.split(/\?|and|but/).filter(part => part.trim().length > 0);
  
  let response = `Excellent question, ${userProfile.name}! You've raised several important points. Let me address each systematically:\n\n`;
  
  parts.forEach((part, index) => {
    const partTrimmed = part.trim();
    if (partTrimmed.length > 5) {
      response += `**${index + 1}. Regarding "${partTrimmed}":**\n`;
      
      if (partTrimmed.toLowerCase().includes('job')) {
        response += `The job market in ${userProfile.location} offers opportunities across multiple sectors. Focus on roles that match your ${userProfile.skills} background.\n\n`;
      } else if (partTrimmed.toLowerCase().includes('salary')) {
        response += `Salary expectations should be based on market research, your experience level, and the value you bring. I can help you determine competitive ranges.\n\n`;
      } else if (partTrimmed.toLowerCase().includes('skill')) {
        response += `Skill development should align with market demand and your career goals. Prioritize high-impact skills that employers actively seek.\n\n`;
      } else {
        response += `This is an important consideration that affects your overall career strategy. Let's explore the implications and options.\n\n`;
      }
    }
  });
  
  response += `🎯 **Integrated Approach:**\nAll these elements work together in your career strategy. Success comes from aligning your skills, market opportunities, and personal goals.\n\nWhich of these areas would you like me to dive deeper into first? I can provide specific, actionable guidance for each.`;
  
  return response;
};

const generateIntelligentProfileSuggestions = (currentProfile, analysis) => {
  const { profileCompleteness, primaryCategory, skillLevel } = analysis;
  
  return `## Profile Optimization Strategy (Current Score: ${profileCompleteness}%)

### 🎯 **Priority Improvements:**

**1. Skills Section Enhancement**
${currentProfile.skills ? 
  `• Expand "${currentProfile.skills}" with specific tools/technologies
  • Add measurable achievements (e.g., "Managed team of 5", "Increased sales by 20%")
  • Include both hard and soft skills` :
  `• Add specific, job-relevant skills
  • Use industry keywords that recruiters search for
  • Include both technical and interpersonal abilities`}

**2. Professional Bio Optimization**
${currentProfile.bio ? 
  `• Strengthen your current bio with quantifiable results
  • Add your career objective and unique value proposition
  • Include years of experience and key specializations` :
  `• Write a compelling 2-3 sentence professional summary
  • Highlight your strongest skills and career goals
  • Mention your availability and work preferences`}

**3. Experience Documentation**
${currentProfile.experience ? 
  `• Structure your experience with specific roles, companies, and dates
  • Use action verbs and quantify achievements
  • Highlight progression and increasing responsibilities` :
  `• Document any work experience, internships, or volunteer work
  • Include relevant projects, even personal ones
  • Mention any leadership or teamwork experiences`}

### 📊 **Market Positioning:**
Your ${primaryCategory} background positions you for ${getMarketDemand(primaryCategory)} demand roles. With these improvements, you could increase interview callbacks by 40-60%.

### 🚀 **Implementation Timeline:**
• **Week 1**: Update skills and bio sections
• **Week 2**: Document experience and achievements  
• **Week 3**: Optimize for keywords and readability

Which section would you like to work on first? I can provide specific examples and templates.`;
};

