// Input sanitization utilities

// Sanitize text input to prevent XSS
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  // Remove potentially dangerous characters
  return text
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .slice(0, 4000); // Limit length
};

// Validate and sanitize file uploads
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size (10MB max)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Archivo demasiado grande (máx. 10MB)' };
  }
  
  // Check file type
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/markdown'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de archivo no permitido' };
  }
  
  // Check file name
  if (file.name.length > 255) {
    return { valid: false, error: 'Nombre de archivo demasiado largo' };
  }
  
  return { valid: true };
};

// Rate limiting for messages
const MESSAGE_RATE_LIMIT = 10; // messages per minute
const messageTimestamps: number[] = [];

export const checkRateLimit = (): { allowed: boolean; error?: string } => {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Remove old timestamps
  while (messageTimestamps.length > 0 && messageTimestamps[0] < oneMinuteAgo) {
    messageTimestamps.shift();
  }
  
  // Check limit
  if (messageTimestamps.length >= MESSAGE_RATE_LIMIT) {
    return { 
      allowed: false, 
      error: `Límite de ${MESSAGE_RATE_LIMIT} mensajes por minuto alcanzado. Espera un momento.` 
    };
  }
  
  // Add current timestamp
  messageTimestamps.push(now);
  
  return { allowed: true };
};

// Validate session data
export const validateSession = (session: any): boolean => {
  if (!session || typeof session !== 'object') return false;
  if (!session.id || typeof session.id !== 'string') return false;
  if (!session.title || typeof session.title !== 'string') return false;
  if (!Array.isArray(session.messages)) return false;
  if (typeof session.updatedAt !== 'number') return false;
  
  return true;
};

// Sanitize URL for sharing
export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
};

// Validate API key format (basic check)
export const validateApiKey = (key: string): boolean => {
  if (!key || typeof key !== 'string') return false;
  if (key.length < 20) return false; // Gemini keys are longer
  if (key === 'PLACEHOLDER_API_KEY') return false;
  return true;
};

// Sanitize user profile data
export const sanitizeUserProfile = (profile: any): any => {
  if (!profile || typeof profile !== 'object') return null;
  
  return {
    name: sanitizeText(profile.name || '').slice(0, 50),
    grade: ['primaria', 'secundaria', 'universidad', 'autodidacta'].includes(profile.grade) 
      ? profile.grade 
      : 'secundaria',
    avatarId: String(profile.avatarId || '🤖').slice(0, 2)
  };
};

// Check for suspicious patterns
export const detectSuspiciousContent = (text: string): boolean => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // event handlers
    /eval\(/i,
    /expression\(/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(text));
};
