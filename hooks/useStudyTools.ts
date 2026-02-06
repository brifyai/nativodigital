/**
 * Custom hook para manejar la generación de herramientas de estudio
 * Incluye flashcards, quizzes, resúmenes, planes Pomodoro, etc.
 */

import { getPromptForTool, StudyToolType, STUDY_TOOL_NAMES } from '../data/prompts';
import Swal from 'sweetalert2';

interface UseStudyToolsReturn {
  handleGenerateStudyTool: (
    type: StudyToolType,
    topic: string,
    onSend: (prompt: string) => void,
    onToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  ) => void;
  askForTopic: (toolName: string) => Promise<string | null>;
}

export const useStudyTools = (): UseStudyToolsReturn => {
  /**
   * Pide al usuario un tema usando SweetAlert
   */
  const askForTopic = async (toolName: string): Promise<string | null> => {
    const result = await Swal.fire({
      title: `${toolName}`,
      text: '¿Sobre qué tema?',
      input: 'text',
      inputPlaceholder: 'Ej: Fotosíntesis, Revolución Francesa, etc.',
      showCancelButton: true,
      confirmButtonText: 'Generar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        input: 'swal-input',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button',
      },
      buttonsStyling: false,
      inputValidator: (value) => {
        if (!value) {
          return '¡Necesitas escribir un tema!';
        }
        return null;
      }
    });
    
    return result.isConfirmed ? result.value : null;
  };

  /**
   * Genera una herramienta de estudio basada en el tipo y tema
   */
  const handleGenerateStudyTool = (
    type: StudyToolType,
    topic: string,
    onSend: (prompt: string) => void,
    onToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  ) => {
    // Obtener el prompt desde los módulos
    const prompt = getPromptForTool(type, topic);
    
    // Enviar el prompt
    onSend(prompt);
    
    // Mostrar notificación
    const toolName = STUDY_TOOL_NAMES[type];
    onToast(`✨ Creando tus ${toolName}...`, 'info');
  };

  return {
    handleGenerateStudyTool,
    askForTopic
  };
};
