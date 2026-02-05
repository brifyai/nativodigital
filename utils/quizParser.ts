import { QuizQuestion } from '../types';

/**
 * Parse quiz questions from AI response
 * Supports multiple formats:
 * Format 1: **Pregunta 1:** [question]
 * Format 2: **PREGUNTA #1 - Nivel: Fácil**
 * A) [option]
 * B) [option]
 * C) [option]
 * D) [option]
 * **Respuesta correcta:** [letter]
 * **Explicación:** [explanation]
 */
export const parseQuizFromText = (text: string, topic: string = 'General'): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  
  // Split by question markers - support multiple formats
  const questionBlocks = text.split(/\*\*PREGUNTA\s*#?\d+[^*]*\*\*/i).filter(block => block.trim());
  
  for (const block of questionBlocks) {
    try {
      const lines = block.trim().split('\n').filter(line => line.trim());
      
      // Find the line with **PREGUNTA:** marker
      let questionText = '';
      let startIndex = 0;
      
      for (let i = 0; i < lines.length; i++) {
        if (/\*\*PREGUNTA:?\*\*/i.test(lines[i])) {
          // Question text is on the next line or after the colon
          const afterMarker = lines[i].replace(/\*\*PREGUNTA:?\*\*/i, '').trim();
          if (afterMarker) {
            questionText = afterMarker;
          } else if (i + 1 < lines.length) {
            questionText = lines[i + 1].trim();
            startIndex = i + 2;
          }
          break;
        }
      }
      
      // If no **PREGUNTA:** marker found, try first non-empty line after separator
      if (!questionText) {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line && !line.startsWith('━') && !line.startsWith('**OPCIONES')) {
            questionText = line;
            startIndex = i + 1;
            break;
          }
        }
      }
      
      if (!questionText) continue;
      
      // Extract options (lines starting with A), B), C), D))
      const options: string[] = [];
      const optionRegex = /^([A-D])\)\s*(.+)/i;
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(optionRegex);
        if (match) {
          options.push(match[2].trim());
        }
      }
      
      if (options.length < 2) continue; // Need at least 2 options
      
      // Extract correct answer
      const correctAnswerMatch = block.match(/\*\*RESPUESTA\s+CORRECTA:?\*\*\s*([A-D])/i);
      if (!correctAnswerMatch) continue;
      
      const correctLetter = correctAnswerMatch[1].toUpperCase();
      const correctAnswer = correctLetter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
      
      // Extract explanation
      const explanationMatch = block.match(/\*\*EXPLICACI[OÓ]N:?\*\*\s*(.+?)(?=\n\n|━|$)/is);
      const explanation = explanationMatch ? explanationMatch[1].trim() : 'Sin explicación disponible';
      
      questions.push({
        id: crypto.randomUUID(),
        question: questionText,
        options,
        correctAnswer,
        explanation,
        topic,
      });
    } catch (error) {
      console.error('Error parsing question block:', error);
      continue;
    }
  }
  
  return questions;
};

/**
 * Detect if a message contains a quiz
 */
export const isQuizContent = (text: string): boolean => {
  const quizIndicators = [
    /\*\*PREGUNTA\s*#?\d+/i,
    /\*\*RESPUESTA\s+CORRECTA:?\*\*/i,
    /^[A-D]\)\s*.+/m,
  ];
  
  return quizIndicators.some(regex => regex.test(text));
};

/**
 * Extract quiz title from context
 */
export const extractQuizTitle = (text: string, defaultTitle: string = 'Quiz'): string => {
  // Try to find a title in the first few lines
  const lines = text.split('\n').slice(0, 5);
  
  for (const line of lines) {
    const cleaned = line.replace(/[#*]/g, '').trim();
    if (cleaned.length > 5 && cleaned.length < 100 && !cleaned.includes('Pregunta')) {
      return cleaned;
    }
  }
  
  return defaultTitle;
};

/**
 * Validate parsed quiz questions
 */
export const validateQuiz = (questions: QuizQuestion[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (questions.length === 0) {
    errors.push('No se encontraron preguntas válidas');
    return { valid: false, errors };
  }
  
  questions.forEach((q, idx) => {
    if (!q.question || q.question.length < 5) {
      errors.push(`Pregunta ${idx + 1}: Texto de pregunta inválido`);
    }
    
    if (q.options.length < 2) {
      errors.push(`Pregunta ${idx + 1}: Necesita al menos 2 opciones`);
    }
    
    if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
      errors.push(`Pregunta ${idx + 1}: Respuesta correcta inválida`);
    }
    
    if (!q.explanation || q.explanation.length < 5) {
      errors.push(`Pregunta ${idx + 1}: Explicación inválida`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
};
