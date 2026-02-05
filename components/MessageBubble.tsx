
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Role, Attachment, GroundingSource } from '../types';
import {
  Person as PersonIcon,
  ContentCopy as CopyIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Refresh as RefreshIcon,
  InsertDriveFile as FileIcon,
  Language as LanguageIcon,
  AutoAwesome as SparklesIcon,
  Check as CheckIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  PlayArrow as PlayArrowIcon,
  VolumeUp as VolumeUpIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { usePreview } from '../contexts/PreviewContext';
import {
  parseSummary,
  parseFeynman,
  parseCornell,
  parseMindMap,
  parseSpacedRepetition,
  parseActiveRecall
} from '../utils/studyMethodParsers';

interface MessageBubbleProps {
  role: Role;
  content: string;
  attachments?: Attachment[];
  groundingSources?: GroundingSource[];
  isThinking?: boolean;
  isError?: boolean;
  messageId?: string;
  onRegenerate?: () => void;
  onFeedback?: (type: 'like' | 'dislike') => void;
  onSave?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  role, 
  content, 
  attachments, 
  groundingSources, 
  isThinking,
  isError = false,
  messageId = '',
  onRegenerate, 
  onFeedback,
  onSave
}) => {
  const isUser = role === Role.USER;
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [isReading, setIsReading] = useState(false);
  const { addPreviewItem, openPanel } = usePreview();

  // Helper function to remove emojis from text
  const removeEmojis = (text: string): string => {
    return text
      // Remove all emojis with their variation selectors
      .replace(/[\u{1F300}-\u{1F9FF}][\u{FE00}-\u{FE0F}]?|[\u{2600}-\u{26FF}][\u{FE00}-\u{FE0F}]?|[\u{2700}-\u{27BF}][\u{FE00}-\u{FE0F}]?|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2300}-\u{23FF}][\u{FE00}-\u{FE0F}]?|[\u{2B50}][\u{FE00}-\u{FE0F}]?|[\u{2B55}][\u{FE00}-\u{FE0F}]?|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23EC}]|[\u{23F0}]|[\u{23F3}]|[\u{25FD}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}][\u{FE00}-\u{FE0F}]?|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}-\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}-\u{2B1C}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]/gu, '')
      // Remove keycap emojis (0️⃣-9️⃣, #️⃣, *️⃣)
      .replace(/[0-9#*][\u{FE0F}]?[\u{20E3}]/gu, '')
      // Remove any remaining variation selectors
      .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
      // Remove combining enclosing keycap
      .replace(/[\u{20E3}]/gu, '')
      .trim();
  };

  // Helper function to detect and enhance video suggestions
  const enhanceVideoSuggestions = (text: string): string => {
    // Detect patterns like "Lee o mira un video corto sobre X"
    // or "Mira un video sobre X" or "Ve un video de X"
    const videoPatterns = [
      /(?:lee o )?mira un video (?:corto )?sobre ([^.!?\n]+)/gi,
      /ve un video (?:de|sobre) ([^.!?\n]+)/gi,
      /busca un video (?:de|sobre) ([^.!?\n]+)/gi,
      /(?:puedes )?ver un video (?:de|sobre) ([^.!?\n]+)/gi
    ];

    let enhancedText = text;
    
    for (const pattern of videoPatterns) {
      enhancedText = enhancedText.replace(pattern, (match, topic) => {
        // Clean the topic
        const cleanTopic = topic.trim().replace(/\([^)]*\)/g, '').trim();
        // Create a YouTube search link
        const searchQuery = encodeURIComponent(cleanTopic + ' educativo para niños');
        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
        
        // Return enhanced text with clickable link
        return `${match} [🎥 Buscar video aquí](${youtubeSearchUrl})`;
      });
    }
    
    return enhancedText;
  };

  // Parse flashcards from content
  const flashcards = useMemo(() => {
    console.log('🔍 Parseando flashcards del contenido...');
    console.log('📝 Primeras 500 caracteres:', content.substring(0, 500));
    
    const cards: Array<{ question: string; answer: string; tip?: string }> = [];
    const lines = content.split('\n');
    
    console.log(`📄 Total líneas: ${lines.length}`);
    
    let currentCard: any = null;
    let currentSection: 'none' | 'question' | 'answer' | 'tip' = 'none';
    let inFlashcardSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and separators (including ---)
      if (!line || line.match(/^[━─═\-]{3,}$/)) continue;
      
      // Detect flashcard section
      if (line.match(/TARJETAS? DE MEMORIA/i) || line.match(/FLASHCARDS?/i)) {
        console.log(`✅ Detectada sección de flashcards en línea ${i}: ${line}`);
        inFlashcardSection = true;
        continue;
      }
      
      // Only parse if we're in flashcard section
      if (!inFlashcardSection && i > 5) continue;
      
      // Detect new card marker - VERY flexible pattern
      // Matches: **TARJETA #1**, TARJETA #1, **Tarjeta 1**, TARJETA 1:, etc.
      const cardMatch = line.match(/^\*{0,2}TARJETA\s*[#:]?\s*(\d+)\*{0,2}:?/i);
      if (cardMatch) {
        console.log(`🎴 Detectada nueva tarjeta ${cardMatch[1]} en línea ${i}: ${line}`);
        // Save previous card
        if (currentCard && currentCard.question && currentCard.answer) {
          cards.push(currentCard);
          console.log(`✅ Tarjeta ${cards.length} guardada:`, { 
            q: currentCard.question.substring(0, 50), 
            a: currentCard.answer.substring(0, 50) 
          });
        }
        currentCard = { question: '', answer: '', tip: '' };
        currentSection = 'none';
        inFlashcardSection = true;
        continue;
      }
      
      // Detect question section - more flexible
      const questionMatch = line.match(/^\*{0,2}PREGUNTA:?\*{0,2}\s*(.*)$/i);
      if (questionMatch) {
        console.log(`📝 Sección PREGUNTA detectada en línea ${i}`);
        currentSection = 'question';
        const questionText = questionMatch[1].trim();
        if (questionText && currentCard) {
          currentCard.question = questionText;
          console.log(`📝 Pregunta en misma línea: ${questionText.substring(0, 50)}...`);
        }
        continue;
      }
      
      // Detect answer section - more flexible
      const answerMatch = line.match(/^\*{0,2}RESPUESTA:?\*{0,2}\s*(.*)$/i);
      if (answerMatch) {
        console.log(`✓ Sección RESPUESTA detectada en línea ${i}`);
        currentSection = 'answer';
        const answerText = answerMatch[1].trim();
        if (answerText && currentCard) {
          currentCard.answer = answerText;
          console.log(`✓ Respuesta en misma línea: ${answerText.substring(0, 50)}...`);
        }
        continue;
      }
      
      // Detect tip section - more flexible
      const tipMatch = line.match(/^\*{0,2}TIP\s+(PARA\s+)?RECORDAR:?\*{0,2}\s*(.*)$/i);
      if (tipMatch) {
        console.log(`💡 Sección TIP detectada en línea ${i}`);
        currentSection = 'tip';
        const tipText = tipMatch[2].trim();
        if (tipText && currentCard) {
          currentCard.tip = tipText;
          console.log(`💡 Tip en misma línea: ${tipText.substring(0, 50)}...`);
        }
        continue;
      }
      
      // Add content to current section
      if (currentCard && currentSection !== 'none' && line) {
        // Skip lines that are just markdown bold markers
        if (line === '**' || line === '****') continue;
        
        // Clean the line
        let cleanLine = line;
        // Remove leading/trailing markdown bold but keep content
        if (cleanLine.startsWith('**') && !cleanLine.endsWith('**')) {
          cleanLine = cleanLine.substring(2);
        }
        if (cleanLine.endsWith('**') && !cleanLine.startsWith('**')) {
          cleanLine = cleanLine.substring(0, cleanLine.length - 2);
        }
        
        if (currentSection === 'question') {
          currentCard.question += (currentCard.question ? ' ' : '') + cleanLine;
        } else if (currentSection === 'answer') {
          currentCard.answer += (currentCard.answer ? ' ' : '') + cleanLine;
        } else if (currentSection === 'tip') {
          currentCard.tip += (currentCard.tip ? ' ' : '') + cleanLine;
        }
      }
    }
    
    // Add last card
    if (currentCard && currentCard.question && currentCard.answer) {
      cards.push(currentCard);
      console.log(`✅ Última tarjeta ${cards.length} guardada:`, { 
        q: currentCard.question.substring(0, 50), 
        a: currentCard.answer.substring(0, 50) 
      });
    }
    
    // Clean emojis from all cards
    const cleanedCards = cards.map(card => ({
      question: removeEmojis(card.question.trim()),
      answer: removeEmojis(card.answer.trim()),
      tip: card.tip ? removeEmojis(card.tip.trim()) : undefined
    }));
    
    console.log(`📊 Total tarjetas parseadas: ${cleanedCards.length}`);
    if (cleanedCards.length === 0) {
      console.warn('⚠️ No se parsearon tarjetas. Revisa el formato del contenido.');
      console.log('📋 Primeras 1000 caracteres para debug:', content.substring(0, 1000));
    } else {
      console.log('🎉 Tarjetas parseadas exitosamente');
      cleanedCards.forEach((card, i) => {
        console.log(`  Tarjeta ${i + 1}: Q="${card.question.substring(0, 40)}..." A="${card.answer.substring(0, 40)}..."`);
      });
    }
    
    return cleanedCards.length > 0 ? cleanedCards : null;
  }, [content]);

  // Parse quiz questions from content
  const quizQuestions = useMemo(() => {
    console.log('🔍 Parseando quiz del contenido...');
    console.log('📝 Primeras 500 caracteres:', content.substring(0, 500));
    
    const questions: Array<{ question: string; options: string[]; correctAnswer: string; explanation: string; difficulty?: string }> = [];
    const lines = content.split('\n');
    
    console.log(`📄 Total líneas: ${lines.length}`);
    
    let currentQuestion: any = null;
    let currentSection: 'none' | 'question' | 'options' | 'answer' | 'explanation' = 'none';
    let correctAnswerLetter: string = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and separators
      if (!line || line.match(/^[━─═]+$/)) continue;
      
      // Detect new question
      if (line.match(/\*\*PREGUNTA\s*#\d+/i)) {
        console.log(`✅ Detectada nueva pregunta en línea ${i}: ${line}`);
        // Save previous question - set correct answer from letter if we have it
        if (currentQuestion && currentQuestion.question && currentQuestion.options.length > 0) {
          if (correctAnswerLetter && !currentQuestion.correctAnswer) {
            const index = correctAnswerLetter.toUpperCase().charCodeAt(0) - 65;
            if (currentQuestion.options[index]) {
              currentQuestion.correctAnswer = currentQuestion.options[index];
              console.log(`✓ Asignando respuesta correcta: ${correctAnswerLetter} = ${currentQuestion.correctAnswer}`);
            }
          }
          if (currentQuestion.correctAnswer) {
            questions.push(currentQuestion);
            console.log('✅ Pregunta guardada:', currentQuestion);
          } else {
            console.warn('⚠️ Pregunta descartada - falta respuesta correcta');
          }
        }
        
        // Start new question
        currentQuestion = { question: '', options: [], correctAnswer: '', explanation: '', difficulty: 'Medio' };
        correctAnswerLetter = '';
        
        // Extract difficulty
        const diffMatch = line.match(/Nivel:\s*(Fácil|Medio|Difícil)/i);
        if (diffMatch) {
          currentQuestion.difficulty = diffMatch[1];
          console.log(`📊 Dificultad: ${diffMatch[1]}`);
        }
        
        currentSection = 'none';
        continue;
      }
      
      // Detect question section
      if (line.match(/^\*\*PREGUNTA:?\*\*/i)) {
        console.log(`📝 Sección PREGUNTA detectada en línea ${i}`);
        currentSection = 'question';
        // Check if question text is on the same line
        const questionText = line.replace(/^\*\*PREGUNTA:?\*\*/i, '').trim();
        if (questionText && currentQuestion) {
          currentQuestion.question = questionText;
          console.log(`📝 Pregunta en misma línea: ${questionText}`);
        }
        continue;
      }
      
      // Detect options section
      if (line.match(/^\*\*OPCIONES:?\*\*/i)) {
        console.log(`📋 Sección OPCIONES detectada en línea ${i}`);
        currentSection = 'options';
        continue;
      }
      
      // Detect answer section
      if (line.match(/^\*\*RESPUESTA\s+CORRECTA:?\*\*/i)) {
        console.log(`✓ Sección RESPUESTA detectada en línea ${i}`);
        currentSection = 'answer';
        const answerText = line.replace(/^\*\*RESPUESTA\s+CORRECTA:?\*\*/i, '').trim();
        if (answerText && currentQuestion) {
          // Extract letter (A, B, C, D) and store it
          const letterMatch = answerText.match(/^([ABCD])/i);
          if (letterMatch) {
            correctAnswerLetter = letterMatch[1].toUpperCase();
            console.log(`✓ Letra de respuesta correcta guardada: ${correctAnswerLetter}`);
            // Try to set it immediately if options are already parsed
            const index = correctAnswerLetter.charCodeAt(0) - 65;
            if (currentQuestion.options[index]) {
              currentQuestion.correctAnswer = currentQuestion.options[index];
              console.log(`✓ Respuesta correcta asignada: ${correctAnswerLetter} = ${currentQuestion.correctAnswer}`);
            }
          }
        }
        continue;
      }
      
      // Detect explanation section
      if (line.match(/^\*\*EXPLICACI[OÓ]N:?\*\*/i)) {
        console.log(`💡 Sección EXPLICACIÓN detectada en línea ${i}`);
        currentSection = 'explanation';
        const explText = line.replace(/^\*\*EXPLICACI[OÓ]N:?\*\*/i, '').trim();
        if (explText && currentQuestion) {
          currentQuestion.explanation = explText;
          console.log(`💡 Explicación en misma línea: ${explText.substring(0, 50)}...`);
        }
        continue;
      }
      
      // Detect concept key (end of question)
      if (line.match(/^\*\*CONCEPTO\s+CLAVE:?\*\*/i)) {
        currentSection = 'none';
        continue;
      }
      
      // Parse content based on current section
      if (currentQuestion) {
        if (currentSection === 'question' && line && !line.startsWith('**')) {
          currentQuestion.question += (currentQuestion.question ? ' ' : '') + line;
          console.log(`📝 Agregando a pregunta: ${line.substring(0, 50)}...`);
        } else if (currentSection === 'options') {
          // Parse option line: A) texto, B) texto, etc.
          const optionMatch = line.match(/^([ABCD])\)\s*(.+)/i);
          if (optionMatch) {
            currentQuestion.options.push(optionMatch[2].trim());
            console.log(`📌 Opción ${optionMatch[1]}: ${optionMatch[2].trim()}`);
            // If we already have the correct answer letter, try to set it now
            if (correctAnswerLetter && !currentQuestion.correctAnswer) {
              const index = correctAnswerLetter.charCodeAt(0) - 65;
              if (index === currentQuestion.options.length - 1) {
                currentQuestion.correctAnswer = currentQuestion.options[index];
                console.log(`✓ Respuesta correcta asignada al parsear opción: ${correctAnswerLetter} = ${currentQuestion.correctAnswer}`);
              }
            }
          }
        } else if (currentSection === 'explanation' && line && !line.startsWith('**')) {
          currentQuestion.explanation += (currentQuestion.explanation ? ' ' : '') + line;
        }
      }
    }
    
    // Add last question - set correct answer from letter if we have it
    if (currentQuestion && currentQuestion.question && currentQuestion.options.length > 0) {
      if (correctAnswerLetter && !currentQuestion.correctAnswer) {
        const index = correctAnswerLetter.toUpperCase().charCodeAt(0) - 65;
        if (currentQuestion.options[index]) {
          currentQuestion.correctAnswer = currentQuestion.options[index];
          console.log(`✓ Asignando respuesta correcta final: ${correctAnswerLetter} = ${currentQuestion.correctAnswer}`);
        }
      }
      if (currentQuestion.correctAnswer) {
        questions.push(currentQuestion);
        console.log('✅ Última pregunta guardada:', currentQuestion);
      } else {
        console.warn('⚠️ Última pregunta descartada - falta respuesta correcta');
      }
    }
    
    console.log(`📊 Total preguntas parseadas: ${questions.length}`);
    if (questions.length === 0) {
      console.warn('⚠️ No se parsearon preguntas. Revisa el formato del contenido.');
      console.log('📋 Contenido completo para debug:', content);
    }
    return questions.length > 0 ? questions : null;
  }, [content]);

  // Parse Pomodoro sessions from content
  const pomodoroSessions = useMemo(() => {
    console.log('🔍 Parseando Pomodoro...');
    const sessions: Array<{ number: number; focus: string; activities: string[]; break: string }> = [];
    const lines = content.split('\n');
    
    let currentSession: any = null;
    let inActivities = false;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Detect session start
      const sessionMatch = trimmedLine.match(/^\*{0,2}\s*SESI[OÓ]N\s+(\d+)\*{0,2}/i);
      if (sessionMatch) {
        console.log(`✅ Detectada sesión en línea ${i}: ${trimmedLine}`);
        // Save previous session
        if (currentSession && currentSession.focus && currentSession.activities.length > 0) {
          sessions.push(currentSession);
          console.log('💾 Sesión guardada:', currentSession);
        }
        const sessionNum = parseInt(sessionMatch[1]);
        currentSession = { number: sessionNum, focus: '', activities: [], break: '' };
        inActivities = false;
        
        // Check if "Enfoque:" is on the same line (after the session number and time)
        const restOfLine = trimmedLine.substring(sessionMatch[0].length).trim();
        // Remove the time part like "(25 minutos)"
        const withoutTime = restOfLine.replace(/\([^)]+\)/g, '').trim();
        
        if (withoutTime) {
          const enfoqueMatch = withoutTime.match(/^Enfoque:\s*(.+)/i);
          if (enfoqueMatch) {
            let focusText = enfoqueMatch[1].trim();
            // Remove markdown bold markers
            focusText = focusText.replace(/^\*\*|\*\*$/g, '').trim();
            currentSession.focus = focusText;
            console.log(`📝 Enfoque detectado (misma línea): ${currentSession.focus}`);
          }
        }
        continue;
      }
      
      // Parse focus - check if it's on its own line (next line after session)
      if (trimmedLine.match(/^Enfoque:/i) && currentSession && !currentSession.focus) {
        let focusText = trimmedLine.replace(/^Enfoque:\s*/i, '').trim();
        // Remove markdown bold markers
        focusText = focusText.replace(/^\*\*|\*\*$/g, '').trim();
        if (focusText) {
          currentSession.focus = focusText;
          console.log(`📝 Enfoque detectado (línea separada): ${currentSession.focus}`);
        }
        continue;
      }
      
      // Parse activities section
      if (trimmedLine.match(/^\*{0,2}Qué hacer:\*{0,2}/i)) {
        inActivities = true;
        console.log('📋 Sección "Qué hacer" detectada');
        continue;
      }
      
      // Parse activities - FIXED: Now handles indented bullets with markdown
      if (inActivities && currentSession) {
        // Check if line has a bullet (with or without indentation)
        // Match: "   • **Text**" or "• Text" or "   * Text"
        if (trimmedLine.match(/^[•✓✅\-\*]/)) {
          // Remove bullet and clean up
          let activity = trimmedLine.replace(/^[•✓✅\-\*]\s*/, '').trim();
          
          // Remove ALL markdown bold markers (both at start and throughout text)
          activity = activity.replace(/\*\*/g, '').trim();
          
          if (activity && activity.length > 2) {
            currentSession.activities.push(activity);
            console.log(`✅ Actividad agregada: "${activity.substring(0, 80)}..."`);
          }
        }
      }
      
      // Parse break - ends activities section
      if (trimmedLine.match(/^\*{0,2}DESCANSO\*{0,2}/i)) {
        inActivities = false;
        // Try to get break description from same line or next line
        const breakMatch = trimmedLine.match(/DESCANSO\*{0,2}\s*\([^)]+\)\s*(.+)/i);
        if (breakMatch && currentSession) {
          currentSession.break = breakMatch[1].trim();
          console.log(`☕ Descanso detectado (misma línea): ${currentSession.break}`);
        } else {
          const nextLine = lines[i + 1]?.trim();
          if (currentSession && nextLine && !nextLine.match(/^━/)) {
            let breakText = nextLine.replace(/^[•✓✅\-\*]\s*/, '').trim();
            breakText = breakText.replace(/\*\*/g, '').trim();
            currentSession.break = breakText;
            console.log(`☕ Descanso detectado (siguiente línea): ${currentSession.break}`);
          }
        }
      }
    }
    
    // Add last session
    if (currentSession && currentSession.focus && currentSession.activities.length > 0) {
      sessions.push(currentSession);
      console.log('💾 Última sesión guardada:', currentSession);
    }
    
    console.log(`📊 Total sesiones Pomodoro parseadas: ${sessions.length}`);
    if (sessions.length === 0) {
      console.warn('⚠️ No se parsearon sesiones Pomodoro.');
      console.log('📋 Primeras 800 caracteres del contenido:', content.substring(0, 800));
    } else {
      console.log('🎉 Sesiones parseadas exitosamente:', sessions);
    }
    
    return sessions.length > 0 ? sessions : null;
  }, [content]);

  // Parse Summary (Resumen Fácil)
  const summaryData = useMemo(() => {
    // More flexible detection - check for the title or key sections
    if (content.match(/RESUMEN FÁCIL/i) || 
        content.match(/RESUMEN:/i) ||
        (content.match(/¿QUÉ ES Y POR QUÉ IMPORTA\?/i) && content.match(/CONCEPTOS CLAVE/i))) {
      console.log('🔍 Parseando Resumen Fácil...');
      const parsed = parseSummary(content);
      if (parsed) {
        console.log('✅ Resumen parseado:', parsed.length, 'secciones');
        // Clean emojis from parsed content
        return parsed.map(section => ({
          ...section,
          title: removeEmojis(section.title),
          content: removeEmojis(section.content),
          keyPoints: section.keyPoints?.map(removeEmojis)
        }));
      } else {
        console.warn('⚠️ Parser no encontró secciones. Contenido:', content.substring(0, 200));
      }
    }
    return null;
  }, [content]);

  // Parse Feynman Method
  const feynmanData = useMemo(() => {
    if (content.match(/EXPLICA CON TUS PALABRAS|TÉCNICA FEYNMAN|MÉTODO FEYNMAN/i)) {
      console.log('🔍 Parseando Explica con tus palabras...');
      const parsed = parseFeynman(content);
      if (parsed) {
        console.log('✅ Explica con tus palabras parseado:', parsed.length, 'pasos');
        // Clean emojis from parsed content
        return parsed.map(step => ({
          ...step,
          title: removeEmojis(step.title),
          content: removeEmojis(step.content)
        }));
      }
    }
    return null;
  }, [content]);

  // Parse Cornell Notes
  const cornellData = useMemo(() => {
    if (content.match(/APUNTES ORGANIZADOS|APUNTES CORNELL|NOTAS CORNELL|CORNELL/i)) {
      console.log('🔍 Parseando Apuntes Organizados...');
      const parsed = parseCornell(content);
      if (parsed) {
        console.log('✅ Apuntes Organizados parseados:', parsed.cues.length, 'pistas,', parsed.notes.length, 'notas');
        // Clean emojis from parsed content
        return {
          cues: parsed.cues.map(removeEmojis),
          notes: parsed.notes.map(removeEmojis),
          summary: removeEmojis(parsed.summary)
        };
      }
    }
    return null;
  }, [content]);

  // Parse Mind Map
  const mindMapData = useMemo(() => {
    if (content.match(/DIBUJA LAS IDEAS|MAPA MENTAL/i)) {
      console.log('🔍 Parseando Dibuja las Ideas...');
      const parsed = parseMindMap(content);
      if (parsed) {
        console.log('✅ Dibuja las Ideas parseado:', parsed.nodes.length, 'nodos');
        // Clean emojis from parsed content
        const cleanNode = (node: any): any => ({
          ...node,
          label: removeEmojis(node.label),
          children: node.children?.map(cleanNode)
        });
        return {
          centralTopic: removeEmojis(parsed.centralTopic),
          nodes: parsed.nodes.map(cleanNode)
        };
      }
    }
    return null;
  }, [content]);

  // Parse Spaced Repetition
  const spacedRepetitionData = useMemo(() => {
    // More flexible detection - check for day markers
    if (content.match(/REPASA CADA DÍA|REPETICIÓN ESPACIADA|REPASO ESPACIADO|DÍA\s+\d+\s*[-–—]/i)) {
      console.log('🔍 Parseando Repasa Cada Día...');
      console.log('📄 Contenido a parsear:', content.substring(0, 200));
      const parsed = parseSpacedRepetition(content);
      if (parsed) {
        console.log('✅ Repasa Cada Día parseado:', parsed.length, 'sesiones');
        // Clean emojis from parsed content
        return parsed.map(session => ({
          ...session,
          date: removeEmojis(session.date),
          topics: session.topics.map(removeEmojis)
        }));
      } else {
        console.warn('⚠️ Parser retornó null - no se detectaron sesiones');
      }
    }
    return null;
  }, [content]);

  // Parse Active Recall
  const activeRecallData = useMemo(() => {
    if (content.match(/PRACTICA RECORDAR|RECUPERACIÓN ACTIVA|RECUERDO ACTIVO|ACTIVE RECALL/i)) {
      console.log('🔍 Parseando Practica Recordar...');
      const parsed = parseActiveRecall(content);
      if (parsed) {
        console.log('✅ Practica Recordar parseado:', parsed.length, 'preguntas');
        // Clean emojis from parsed content
        return parsed.map(q => ({
          question: removeEmojis(q.question),
          answer: removeEmojis(q.answer),
          hint: q.hint ? removeEmojis(q.hint) : undefined
        }));
      }
    }
    return null;
  }, [content]);

  // Track which items have been added to prevent infinite loops
  const addedItemsRef = useRef<Set<string>>(new Set());

  // Reset tracking when messageId changes
  useEffect(() => {
    addedItemsRef.current.clear();
  }, [messageId]);

  // Auto-add preview items when messageId changes (only once per message)
  useEffect(() => {
    if (!isUser && messageId) {
      console.log('🔍 MessageBubble: Verificando contenido interactivo para messageId:', messageId);
      
      // Check flashcards
      if (flashcards && flashcards.length > 0) {
        const itemId = `${messageId}-flashcards`;
        if (!addedItemsRef.current.has(itemId)) {
          console.log('✅ Agregando flashcards al panel:', flashcards.length, 'tarjetas');
          addPreviewItem({
            id: itemId,
            type: 'flashcards',
            title: 'Tarjetas de Memoria',
            data: flashcards,
            messageId,
          });
          addedItemsRef.current.add(itemId);
        }
      }
      
      // Check quiz
      if (quizQuestions && quizQuestions.length > 0) {
        const itemId = `${messageId}-quiz`;
        if (!addedItemsRef.current.has(itemId)) {
          console.log('✅ Agregando quiz al panel:', quizQuestions.length, 'preguntas');
          addPreviewItem({
            id: itemId,
            type: 'quiz',
            title: 'Quiz Interactivo',
            data: quizQuestions,
            messageId,
          });
          addedItemsRef.current.add(itemId);
        }
      }
      
      // Check pomodoro
      if (pomodoroSessions && pomodoroSessions.length > 0) {
        const itemId = `${messageId}-pomodoro`;
        if (!addedItemsRef.current.has(itemId)) {
          console.log('✅ Agregando pomodoro al panel:', pomodoroSessions.length, 'sesiones');
          addPreviewItem({
            id: itemId,
            type: 'pomodoro',
            title: 'Estudia 25 Minutos',
            data: pomodoroSessions,
            messageId,
          });
          addedItemsRef.current.add(itemId);
        }
      }

      // Check summary
      if (summaryData && summaryData.length > 0) {
        const itemId = `${messageId}-summary`;
        if (!addedItemsRef.current.has(itemId)) {
          console.log('✅ Agregando resumen al panel:', summaryData.length, 'secciones');
          addPreviewItem({
            id: itemId,
            type: 'summary',
            title: 'Resumen Fácil',
            data: summaryData,
            messageId,
          });
          addedItemsRef.current.add(itemId);
        }
      }

      // Check feynman
      if (feynmanData && feynmanData.length > 0) {
        const itemId = `${messageId}-feynman`;
        if (!addedItemsRef.current.has(itemId)) {
          console.log('✅ Agregando Explica con tus palabras al panel:', feynmanData.length, 'pasos');
          addPreviewItem({
            id: itemId,
            type: 'feynman',
            title: 'Explica con Tus Palabras',
            data: feynmanData,
            messageId,
          });
          addedItemsRef.current.add(itemId);
        }
      }

      // Check cornell
      if (cornellData) {
        const itemId = `${messageId}-cornell`;
        if (!addedItemsRef.current.has(itemId)) {
          console.log('✅ Agregando Apuntes Organizados al panel');
          addPreviewItem({
            id: itemId,
            type: 'cornell',
            title: 'Apuntes Organizados',
            data: cornellData,
            messageId,
          });
          addedItemsRef.current.add(itemId);
        }
      }

      // Check mindmap
      if (mindMapData) {
        const itemId = `${messageId}-mindmap`;
        if (!addedItemsRef.current.has(itemId)) {
          console.log('✅ Agregando Dibuja las Ideas al panel:', mindMapData.nodes.length, 'nodos');
          addPreviewItem({
            id: itemId,
            type: 'mindmap',
            title: 'Dibuja las Ideas',
            data: mindMapData,
            messageId,
          });
          addedItemsRef.current.add(itemId);
        }
      }

      // Check spaced repetition
      if (spacedRepetitionData && spacedRepetitionData.length > 0) {
        const itemId = `${messageId}-spaced`;
        if (!addedItemsRef.current.has(itemId)) {
          console.log('✅ Agregando Repasa Cada Día al panel:', spacedRepetitionData.length, 'sesiones');
          addPreviewItem({
            id: itemId,
            type: 'spaced',
            title: 'Repasa Cada Día',
            data: spacedRepetitionData,
            messageId,
          });
          addedItemsRef.current.add(itemId);
        }
      }

      // Check active recall
      if (activeRecallData && activeRecallData.length > 0) {
        const itemId = `${messageId}-recall`;
        if (!addedItemsRef.current.has(itemId)) {
          console.log('✅ Agregando Practica Recordar al panel:', activeRecallData.length, 'preguntas');
          addPreviewItem({
            id: itemId,
            type: 'recall',
            title: 'Practica Recordar',
            data: activeRecallData,
            messageId,
          });
          addedItemsRef.current.add(itemId);
        }
      }
    }
  }, [messageId, isUser, flashcards, quizQuestions, pomodoroSessions, summaryData, feynmanData, cornellData, mindMapData, spacedRepetitionData, activeRecallData, addPreviewItem]);

  // Clean content by removing ALL emojis including variation selectors and enhance video suggestions
  const cleanedContent = useMemo(() => {
    const withoutEmojis = content
      // Remove all emojis with their variation selectors
      .replace(/[\u{1F300}-\u{1F9FF}][\u{FE00}-\u{FE0F}]?|[\u{2600}-\u{26FF}][\u{FE00}-\u{FE0F}]?|[\u{2700}-\u{27BF}][\u{FE00}-\u{FE0F}]?|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2300}-\u{23FF}][\u{FE00}-\u{FE0F}]?|[\u{2B50}][\u{FE00}-\u{FE0F}]?|[\u{2B55}][\u{FE00}-\u{FE0F}]?|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23EC}]|[\u{23F0}]|[\u{23F3}]|[\u{25FD}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}][\u{FE00}-\u{FE0F}]?|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}-\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}-\u{2B1C}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]/gu, '')
      // Remove keycap emojis (0️⃣-9️⃣, #️⃣, *️⃣)
      .replace(/[0-9#*][\u{FE0F}]?[\u{20E3}]/gu, '')
      // Remove any remaining variation selectors
      .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
      // Remove combining enclosing keycap
      .replace(/[\u{20E3}]/gu, '');
    
    // Enhance video suggestions with links
    return enhanceVideoSuggestions(withoutEmojis);
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    onSave?.();
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(feedback === type ? null : type);
    onFeedback?.(type);
  };

  const handleSpeak = () => {
    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
    } else if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.onend = () => setIsReading(false);
      speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  return (
    <div className={`flex w-full max-w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex gap-3 w-full max-w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white shadow-lg">
              <PersonIcon sx={{ fontSize: 20 }} />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-1.5">
               <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" alt="AI" className="w-full h-full" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden">
          
          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <div className={`flex flex-wrap gap-2 mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {attachments.map((att, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-xl border-2 border-border bg-surface shadow-md hover:shadow-lg transition-shadow">
                  {att.mimeType.startsWith('image/') ? (
                    <img 
                      src={`data:${att.mimeType};base64,${att.data}`} 
                      alt="Archivo adjunto" 
                      className="h-40 w-auto object-cover"
                    />
                  ) : (
                    <div className="h-20 w-32 flex items-center justify-center gap-2 p-3">
                       <FileIcon sx={{ fontSize: 24 }} className="text-accent"/>
                       <span className="text-xs text-primary truncate font-medium">{att.name || 'Archivo'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Message Bubble */}
          {isThinking ? (
            <div className="bg-surface border border-border rounded-2xl p-5 max-w-md shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <SparklesIcon sx={{ fontSize: 20 }} className="text-accent animate-pulse" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-primary">Pensando...</span>
                  <span className="block text-xs text-secondary">Analizando tu pregunta</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-surfaceHighlight rounded-full w-full animate-pulse"></div>
                <div className="h-2 bg-surfaceHighlight rounded-full w-4/5 animate-pulse"></div>
                <div className="h-2 bg-surfaceHighlight rounded-full w-5/6 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              <div className={`${isUser 
                ? 'bg-accent text-white rounded-2xl rounded-tr-md' 
                : isError 
                  ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl rounded-tl-md'
                  : 'bg-surface border border-border rounded-2xl rounded-tl-md'
              } p-4 shadow-md overflow-x-hidden max-w-full`}>
                <div className={`prose ${isUser ? 'prose-invert' : 'dark:prose-invert'} prose-sm sm:prose-base prose-p:my-2 prose-p:leading-relaxed prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2 prose-strong:font-bold prose-code:bg-surfaceHighlight prose-code:text-accent prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-pre:bg-surfaceHighlight prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-4 prose-pre:my-3 prose-pre:code:bg-transparent prose-pre:code:p-0 prose-a:text-accent prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-ul:my-2 prose-ol:my-2 prose-li:my-1 max-w-full break-words overflow-wrap-anywhere word-break-break-word ${isUser ? 'text-white' : 'text-primary'}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {cleanedContent}
                  </ReactMarkdown>
                </div>
                
                {/* Error Retry Button */}
                {isError && onRegenerate && (
                  <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
                    <button
                      onClick={onRegenerate}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold transition-all shadow-lg hover:shadow-xl"
                    >
                      <RefreshIcon sx={{ fontSize: 20 }} />
                      <span>Reintentar ahora</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Preview Buttons - Removed, panel is always visible */}
            </>
          )}

          {/* Sources */}
          {!isUser && groundingSources && groundingSources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-xs font-semibold text-secondary uppercase tracking-wide">Fuentes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {groundingSources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-surface hover:bg-surfaceHighlight border border-border rounded-lg px-3 py-2 text-xs text-secondary hover:text-primary transition-all max-w-[240px]"
                  >
                    <LanguageIcon sx={{ fontSize: 14 }} className="text-accent flex-shrink-0" />
                    <span className="truncate">{source.title || new URL(source.uri).hostname}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isUser && !isThinking && !isError && content && (
            <div className="mt-3 flex flex-wrap gap-2">
              {/* Primary Actions */}
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  copied 
                    ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                    : 'bg-surface hover:bg-surfaceHighlight text-secondary hover:text-primary border border-border'
                }`}
              >
                {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <CopyIcon sx={{ fontSize: 16 }} />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
              
              {onSave && (
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    saved
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'bg-surface hover:bg-surfaceHighlight text-secondary hover:text-accent border border-border'
                  }`}
                >
                  {saved ? <BookmarkIcon sx={{ fontSize: 16 }} /> : <BookmarkBorderIcon sx={{ fontSize: 16 }} />}
                  <span>{saved ? 'Guardado' : 'Guardar'}</span>
                </button>
              )}
              
              <button
                onClick={handleSpeak}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isReading
                    ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                    : 'bg-surface hover:bg-surfaceHighlight text-secondary hover:text-purple-600 border border-border'
                }`}
              >
                <VolumeUpIcon sx={{ fontSize: 16 }} />
                <span>{isReading ? 'Leyendo...' : 'Escuchar'}</span>
              </button>
              
              {/* Feedback */}
              <div className="flex items-center gap-1 ml-auto">
                <button 
                  onClick={() => handleFeedback('like')}
                  className={`p-2 rounded-lg transition-all ${
                    feedback === 'like' 
                      ? 'bg-green-500/10 text-green-600' 
                      : 'bg-surface hover:bg-surfaceHighlight text-secondary hover:text-green-600'
                  }`}
                  title="Útil"
                >
                  <ThumbUpIcon sx={{ fontSize: 16 }} />
                </button>
                
                <button 
                  onClick={() => handleFeedback('dislike')}
                  className={`p-2 rounded-lg transition-all ${
                    feedback === 'dislike' 
                      ? 'bg-red-500/10 text-red-600' 
                      : 'bg-surface hover:bg-surfaceHighlight text-secondary hover:text-red-600'
                  }`}
                  title="No útil"
                >
                  <ThumbDownIcon sx={{ fontSize: 16 }} />
                </button>
                
                {onRegenerate && (
                  <button 
                    onClick={onRegenerate}
                    className="p-2 rounded-lg bg-surface hover:bg-surfaceHighlight text-secondary hover:text-primary transition-all" 
                    title="Regenerar"
                  >
                    <RefreshIcon sx={{ fontSize: 16 }} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;
