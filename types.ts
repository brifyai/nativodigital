
export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export enum ModelProvider {
  GEMINI = 'gemini',
  OPENAI = 'openai',
  CHUTES = 'chutes'
}

export enum GeminiModelId {
  FLASH_LITE = 'gemini-flash-lite-latest',
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview'
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64 string
  name?: string; // Original filename for UI
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  attachments?: Attachment[];
  timestamp: number;
  isError?: boolean;
  groundingSources?: GroundingSource[]; // Sources from Google Search
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  modelId: string;
  provider: ModelProvider;
}

export interface UserSettings {
  isSidebarOpen: boolean;
  selectedProvider: ModelProvider;
  selectedModelId: string;
}

export interface UserProfile {
  name: string;
  grade: 'primaria' | 'secundaria' | 'universidad' | 'autodidacta';
  specificGrade?: string; // Curso específico (ej: "1° Básico", "3° Medio")
  avatarId: string;
  email?: string;
  rut?: string;
  password?: string; // Stored locally (in production would be hashed)
}

// Sistema de Guardados/Favoritos
export interface SavedContent {
  id: string;
  type: 'flashcards' | 'quiz' | 'summary' | 'notes' | 'plan' | 'other';
  title: string;
  content: string;
  topic: string;
  subject?: string; // matemáticas, historia, etc.
  createdAt: number;
  lastReviewed?: number;
  reviewCount: number;
  isFavorite: boolean;
  tags: string[];
}

// Tracking de temas débiles
export interface TopicPerformance {
  topic: string;
  subject: string;
  attempts: number;
  successes: number;
  failures: number;
  lastAttempt: number;
  averageScore: number; // 0-100
  needsReview: boolean;
}

// Quiz interactivo
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuizSession {
  id: string;
  title: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: (number | null)[];
  score: number;
  startedAt: number;
  completedAt?: number;
  timePerQuestion: number[]; // segundos por pregunta
}
