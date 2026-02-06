/**
 * Custom hook para manejar el reconocimiento de voz
 * Soporta Web Speech API para entrada de voz
 */

import { useState, useRef } from 'react';
import { showError } from '../utils/sweetAlert';

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  toggleListening: (
    language: string,
    onTranscript: (text: string) => void
  ) => void;
  stopListening: () => void;
}

export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = (
    language: string,
    onTranscript: (text: string) => void
  ) => {
    // Si ya está escuchando, detener
    if (isListening) {
      stopListening();
      return;
    }

    // Verificar soporte del navegador
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Configuración
      recognition.lang = language === 'es' ? 'es-ES' : 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;

      // Evento: inicio
      recognition.onstart = () => setIsListening(true);
      
      let finalTranscript = '';

      // Evento: resultado
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript || interimTranscript) {
          if (finalTranscript) {
            onTranscript(' ' + finalTranscript);
            finalTranscript = '';
          }
        }
      };

      // Evento: error
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      // Evento: fin
      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } else {
      showError(
        'Función no disponible',
        'Tu navegador no soporta la entrada de voz. Intenta usar Chrome o Edge.'
      );
    }
  };

  return {
    isListening,
    toggleListening,
    stopListening
  };
};
