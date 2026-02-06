// Exportar todos los prompts desde un solo lugar
export { FLASHCARDS_PROMPT } from './flashcards';
export { QUIZ_PROMPT } from './quiz';
export { SUMMARY_PROMPT } from './summary';
export { POMODORO_PROMPT } from './pomodoro';
export { FEYNMAN_PROMPT } from './feynman';
export { CORNELL_PROMPT } from './cornell';
export { MINDMAP_PROMPT } from './mindmap';
export { SPACED_PROMPT } from './spaced';
export { ACTIVE_RECALL_PROMPT } from './activeRecall';

export type StudyToolType = 
  | 'flashcards' 
  | 'quiz' 
  | 'summary' 
  | 'pomodoro' 
  | 'feynman' 
  | 'cornell' 
  | 'mindmap' 
  | 'spaced' 
  | 'active-recall';

export const STUDY_TOOL_NAMES: Record<StudyToolType, string> = {
  flashcards: 'tarjetas',
  quiz: 'preguntas',
  summary: 'resumen',
  pomodoro: 'plan de estudio',
  feynman: 'guía para explicar',
  cornell: 'apuntes',
  mindmap: 'dibujo de ideas',
  spaced: 'calendario',
  'active-recall': 'preguntas de práctica'
};

export const getPromptForTool = (type: StudyToolType, topic: string): string => {
  switch (type) {
    case 'flashcards':
      return FLASHCARDS_PROMPT(topic);
    case 'quiz':
      return QUIZ_PROMPT(topic);
    case 'summary':
      return SUMMARY_PROMPT(topic);
    case 'pomodoro':
      return POMODORO_PROMPT(topic);
    case 'feynman':
      return FEYNMAN_PROMPT(topic);
    case 'cornell':
      return CORNELL_PROMPT(topic);
    case 'mindmap':
      return MINDMAP_PROMPT(topic);
    case 'spaced':
      return SPACED_PROMPT(topic);
    case 'active-recall':
      return ACTIVE_RECALL_PROMPT(topic);
    default:
      return '';
  }
};
