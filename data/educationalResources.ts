export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'interactive';
  platform: string;
  topics: string[];
  level: 'primaria' | 'secundaria' | 'universidad' | 'all';
  language: 'es' | 'en' | 'both';
  free: boolean;
}

export const educationalResources: EducationalResource[] = [
  // Khan Academy
  {
    id: 'khan-math',
    title: 'Khan Academy - Matemáticas',
    description: 'Cursos completos de matemáticas desde aritmética hasta cálculo',
    url: 'https://es.khanacademy.org/math',
    type: 'course',
    platform: 'Khan Academy',
    topics: ['matemáticas', 'álgebra', 'geometría', 'cálculo'],
    level: 'all',
    language: 'both',
    free: true,
  },
  {
    id: 'khan-science',
    title: 'Khan Academy - Ciencias',
    description: 'Física, química, biología y más',
    url: 'https://es.khanacademy.org/science',
    type: 'course',
    platform: 'Khan Academy',
    topics: ['física', 'química', 'biología', 'ciencias'],
    level: 'all',
    language: 'both',
    free: true,
  },
  
  // Coursera
  {
    id: 'coursera-learning',
    title: 'Coursera - Aprender a Aprender',
    description: 'Técnicas de estudio respaldadas por la ciencia',
    url: 'https://www.coursera.org/learn/learning-how-to-learn',
    type: 'course',
    platform: 'Coursera',
    topics: ['estudio', 'aprendizaje', 'técnicas'],
    level: 'all',
    language: 'both',
    free: true,
  },
  
  // YouTube Channels
  {
    id: 'youtube-crashcourse',
    title: 'CrashCourse - Canal Educativo',
    description: 'Videos educativos sobre historia, ciencia y más',
    url: 'https://www.youtube.com/@crashcourse',
    type: 'video',
    platform: 'YouTube',
    topics: ['historia', 'ciencias', 'filosofía'],
    level: 'secundaria',
    language: 'en',
    free: true,
  },
  {
    id: 'youtube-dateunvlog',
    title: 'Date un Vlog - Ciencia',
    description: 'Divulgación científica en español',
    url: 'https://www.youtube.com/@dateunvlog',
    type: 'video',
    platform: 'YouTube',
    topics: ['ciencia', 'física', 'astronomía'],
    level: 'all',
    language: 'es',
    free: true,
  },
  
  // Interactive
  {
    id: 'phet-simulations',
    title: 'PhET - Simulaciones Interactivas',
    description: 'Simulaciones de física, química, matemáticas y más',
    url: 'https://phet.colorado.edu/es/',
    type: 'interactive',
    platform: 'PhET',
    topics: ['física', 'química', 'matemáticas', 'biología'],
    level: 'all',
    language: 'both',
    free: true,
  },
  
  // Articles & Reading
  {
    id: 'wikipedia',
    title: 'Wikipedia',
    description: 'Enciclopedia libre con millones de artículos',
    url: 'https://es.wikipedia.org',
    type: 'article',
    platform: 'Wikipedia',
    topics: ['general', 'historia', 'ciencia', 'cultura'],
    level: 'all',
    language: 'both',
    free: true,
  },
];

export const getResourcesByTopic = (topic: string, language?: 'es' | 'en'): EducationalResource[] => {
  const topicLower = topic.toLowerCase();
  return educationalResources.filter(resource => {
    const matchesTopic = resource.topics.some(t => 
      t.toLowerCase().includes(topicLower) || 
      topicLower.includes(t.toLowerCase())
    );
    const matchesLanguage = !language || 
      resource.language === language || 
      resource.language === 'both';
    
    return matchesTopic && matchesLanguage;
  });
};

export const getResourcesByLevel = (level: 'primaria' | 'secundaria' | 'universidad'): EducationalResource[] => {
  return educationalResources.filter(resource => 
    resource.level === level || resource.level === 'all'
  );
};

export const suggestResources = (message: string, userLevel: string, language: 'es' | 'en'): EducationalResource[] => {
  const messageLower = message.toLowerCase();
  
  // Extract potential topics from message
  const keywords = [
    'matemáticas', 'math', 'álgebra', 'algebra', 'geometría', 'geometry',
    'física', 'physics', 'química', 'chemistry', 'biología', 'biology',
    'historia', 'history', 'ciencia', 'science', 'literatura', 'literature'
  ];
  
  const foundTopics = keywords.filter(keyword => messageLower.includes(keyword));
  
  if (foundTopics.length === 0) return [];
  
  // Get resources for found topics
  const resources = foundTopics.flatMap(topic => getResourcesByTopic(topic, language));
  
  // Remove duplicates and limit to 3
  const unique = Array.from(new Map(resources.map(r => [r.id, r])).values());
  return unique.slice(0, 3);
};
