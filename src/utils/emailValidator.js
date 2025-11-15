// Email validation utility
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidEmailDomain = (email) => {
  const validDomains = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
    'icloud.com', 'protonmail.com', 'aol.com', 'live.com',
    'msn.com', 'ymail.com', 'mail.com'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  return validDomains.includes(domain);
};

export const validateEmailStrength = (email) => {
  if (!validateEmail(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  
  if (!isValidEmailDomain(email)) {
    return { valid: false, message: 'Please use a valid email provider (Gmail, Yahoo, Outlook, etc.)' };
  }
  
  return { valid: true, message: '' };
};