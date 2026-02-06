
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Send as SendIcon,
  Mic as MicIcon,
  Image as ImageIcon,
  ExpandMore as ExpandMoreIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
  StopCircle as StopIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  AutoAwesome as SparklesIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  MenuBook as BookIcon,
  Psychology as BrainIcon,
  CameraAlt as CameraIcon,
  Logout as LogoutIcon,
  LightMode as SunIcon,
  DarkMode as MoonIcon,
  TrendingUp as TrendingUpIcon,
  Share as ShareIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  PlayArrow as PlayArrowIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Toast from './components/Toast';
import ResourceSuggestions from './components/ResourceSuggestions';
import PreviewPanel from './components/PreviewPanel';
import BottomNavigation from './components/BottomNavigation';
import { usePreview } from './contexts/PreviewContext';
import { Message, Role, Attachment, GroundingSource, QuizSession, SavedContent, QuizQuestion } from './types';
import { sendMessageStream } from './services/gemini';
import { SUGGESTIONS, GEMINI_MODEL_OPTIONS } from './constants';
import { getStorageSizeFormatted } from './utils/storage';
import { optimizeImage, validateImageFile } from './utils/imageOptimizer';
import { sanitizeText, validateFile, checkRateLimit } from './utils/sanitizer';
import { useTranslation } from './hooks/useTranslation';
import { useIsMobile } from './hooks/useMediaQuery';
import { suggestResources, EducationalResource } from './data/educationalResources';
import { detectSubject } from './data/subjectTemplates';
import { showError } from './utils/sweetAlert';
import Swal from 'sweetalert2';
import { parseQuizFromText, isQuizContent, extractQuizTitle } from './utils/quizParser';
import { getPromptForTool } from './data/prompts';

// Context hooks
import { useAuth } from './contexts/AuthContext';
import { useChat } from './contexts/ChatContext';
import { useUI } from './contexts/UIContext';
import { useSavedContent } from './contexts/SavedContentContext';

// Lazy load heavy components
const OnboardingTour = lazy(() => import('./components/OnboardingTour'));
const StudyTools = lazy(() => import('./components/StudyTools'));
const ProgressStats = lazy(() => import('./components/ProgressStats'));
const ShareDialog = lazy(() => import('./components/ShareDialog'));
const SavedContentLibrary = lazy(() => import('./components/SavedContentLibrary'));
const InteractiveQuiz = lazy(() => import('./components/InteractiveQuiz'));
const QuizResults = lazy(() => import('./components/QuizResults'));
const WeakTopicsAnalysis = lazy(() => import('./components/WeakTopicsAnalysis'));

function App() {
  const navigate = useNavigate();
  
  // Context hooks
  const { user, showLanding, setShowLanding, customInstruction, setCustomInstruction, handleLogin, handleLogout, handleFullReset } = useAuth();
  const { previewItems, isPanelOpen, closePanel } = usePreview();
  const { 
    sessions, 
    currentSessionId, 
    currentSession,
    currentMessages, 
    isLoading, 
    selectedModel,
    setSelectedModel,
    attachments,
    setAttachments,
    handleNewChat, 
    handleDeleteSession,
    handleClearHistory,
    handleStopGeneration,
    setCurrentSessionId,
    chatRef,
    handleSend
  } = useChat();
  const { 
    theme, 
    highContrast,
    toggleTheme, 
    toggleHighContrast,
    isSidebarOpen,
    setIsSidebarOpen,
    showHelp, 
    setShowHelp,
    helpTab,
    setHelpTab,
    showSettings, 
    setShowSettings,
    showStudyTools,
    setShowStudyTools,
    showProgress,
    setShowProgress,
    showShare,
    setShowShare,
    showOnboarding,
    setShowOnboarding,
    isModelMenuOpen,
    setIsModelMenuOpen,
    toast,
    showToast,
    clearToast
  } = useUI();
  
  // Hook de contenido guardado
  const { addSavedContent } = useSavedContent();
  
  // Translation
  const { language, changeLanguage } = useTranslation();
  
  // Mobile detection
  const isMobile = useIsMobile();
  
  // Local state (specific to App component)
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [suggestedResources, setSuggestedResources] = useState<EducationalResource[]>([]);
  
  // Estados para nuevas funcionalidades
  const [showSavedContent, setShowSavedContent] = useState(false);
  const [showInteractiveQuiz, setShowInteractiveQuiz] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [showWeakTopics, setShowWeakTopics] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<{
    questions: QuizQuestion[];
    title: string;
    topic: string;
    subject: string;
  } | null>(null);
  const [quizResults, setQuizResults] = useState<QuizSession | null>(null);
  const [viewingContent, setViewingContent] = useState<SavedContent | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isLoading, attachments]);

  // Keyboard shortcuts for input focus and new chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewChat();
        showToast('Nuevo chat creado', 'success');
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.querySelector('textarea')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewChat, showToast]);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('nativo_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  // File Handling
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = Array.from(e.target.files);
      const newAttachments: Attachment[] = [];

      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          showToast(validation.error || 'Archivo inválido', 'error');
          continue;
        }

        try {
          if (file.type.startsWith('image/')) {
            const imageValidation = validateImageFile(file);
            if (!imageValidation.valid) {
              showToast(imageValidation.error || 'Imagen inválida', 'error');
              continue;
            }

            showToast('Optimizando imagen...', 'info');
            const optimized = await optimizeImage(file);
            
            newAttachments.push({
              mimeType: optimized.mimeType,
              data: optimized.data,
              name: file.name
            });
            
            if (optimized.compressionRatio > 1.5) {
              showToast(
                `Imagen optimizada: ${(optimized.compressionRatio).toFixed(1)}x más pequeña`, 
                'success'
              );
            }
          } else {
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
              reader.onload = (e) => {
                const result = e.target?.result as string;
                const base64 = result.split(',')[1];
                resolve(base64);
              };
            });
            reader.readAsDataURL(file);
            const base64 = await base64Promise;
            
            newAttachments.push({
              mimeType: file.type,
              data: base64,
              name: file.name
            });
          }
        } catch (error) {
          console.error('Error processing file:', error);
          showToast('Error al procesar el archivo', 'error');
        }
      }
      
      setAttachments(prev => [...prev, ...newAttachments]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Voice Handling
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'es' ? 'es-ES' : 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onstart = () => setIsListening(true);
      
      let finalTranscript = '';

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
            setInput(prev => prev + (finalTranscript ? " " + finalTranscript : "")); 
            finalTranscript = '';
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } else {
      showError(
        "Función no disponible",
        "Tu navegador no soporta la entrada de voz. Intenta usar Chrome o Edge."
      );
    }
  };

  // Wrapper for handleSend from ChatContext
  const handleSendWrapper = async (manualText?: string) => {
    const textToSend = typeof manualText === 'string' ? manualText : input;

    if ((!textToSend.trim() && attachments.length === 0) || !currentSessionId) return;

    // Check rate limit
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      showToast(rateLimitCheck.error || 'Demasiados mensajes', 'warning');
      return;
    }

    // Sanitize input
    const sanitizedText = sanitizeText(textToSend);
    if (sanitizedText !== textToSend) {
      showToast('Algunos caracteres fueron removidos por seguridad', 'info');
    }

    // Detect subject and suggest resources
    detectSubject(sanitizedText);
    const resources = suggestResources(sanitizedText, user?.grade || 'secundaria', language);
    
    if (resources.length > 0) {
      setSuggestedResources(resources);
    }

    if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
    }

    setInput('');
    
    // Delegate to ChatContext
    await handleSend(sanitizedText, attachments);
  };

  // Helper para pedir tema con SweetAlert
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

  const handleGenerateStudyTool = (type: 'flashcards' | 'quiz' | 'summary' | 'pomodoro' | 'feynman' | 'cornell' | 'mindmap' | 'spaced' | 'active-recall', topic: string) => {
    const prompt = getPromptForTool(type, topic);
    
    handleSendWrapper(prompt);
    const toolNames: Record<typeof type, string> = {
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
    showToast(`✨ Creando tus ${toolNames[type]}...`, 'info');
  };

  const handleShareConversation = (shareId: string) => {
    showToast('Enlace copiado al portapapeles', 'success');
  };

  const handleSuggestionClick = (text: string) => {
    handleSendWrapper(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendWrapper();
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `nativo_digital_historial_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showToast('Historial exportado correctamente', 'success');
  };

  const handleExportMarkdown = () => {
    if (!currentSessionId) {
      showToast('No hay conversación activa para exportar', 'warning');
      return;
    }
    
    const session = sessions.find(s => s.id === currentSessionId);
    if (!session) return;

    let markdown = `# ${session.title}\n\n`;
    markdown += `*Exportado el ${new Date().toLocaleString('es-ES')}*\n\n---\n\n`;

    session.messages.forEach(msg => {
      const role = msg.role === Role.USER ? '👤 **Usuario**' : '🤖 **Nativo Digital**';
      markdown += `### ${role}\n\n${msg.content}\n\n`;
      
      if (msg.groundingSources && msg.groundingSources.length > 0) {
        markdown += `**Fuentes:**\n`;
        msg.groundingSources.forEach(source => {
          markdown += `- [${source.title}](${source.uri})\n`;
        });
        markdown += `\n`;
      }
      
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Conversación exportada a Markdown', 'success');
  };

  const handleExportText = () => {
    if (!currentSessionId) {
      showToast('No hay conversación activa para exportar', 'warning');
      return;
    }
    
    const session = sessions.find(s => s.id === currentSessionId);
    if (!session) return;

    let text = `${session.title}\n`;
    text += `Exportado el ${new Date().toLocaleString('es-ES')}\n`;
    text += `${'='.repeat(60)}\n\n`;

    session.messages.forEach(msg => {
      const role = msg.role === Role.USER ? 'USUARIO' : 'NATIVO DIGITAL';
      text += `[${role}]\n${msg.content}\n\n`;
      
      if (msg.groundingSources && msg.groundingSources.length > 0) {
        text += `Fuentes:\n`;
        msg.groundingSources.forEach(source => {
          text += `- ${source.title}: ${source.uri}\n`;
        });
        text += `\n`;
      }
      
      text += `${'-'.repeat(60)}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Conversación exportada a texto', 'success');
  };
  
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported) && imported.length > 0) {
          // Import sessions - this will be handled by ChatContext
          showToast(`${imported.length} conversaciones importadas`, 'success');
        } else {
          showToast('Archivo inválido', 'error');
        }
      } catch (error) {
        showToast('Error al importar el archivo', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleModelSelect = (model: string) => {
      setSelectedModel(model);
      setIsModelMenuOpen(false);
      handleNewChat();
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Guardar contenido desde mensaje
  const handleSaveContent = (message: Message) => {
    const title = prompt('Título para este contenido:');
    if (!title) return;
    
    const topic = prompt('Tema principal:') || 'General';
    const subject = prompt('Materia:') || 'General';
    
    let type: SavedContent['type'] = 'other';
    if (message.content.includes('flashcard') || message.content.includes('tarjeta')) {
      type = 'flashcards';
    } else if (isQuizContent(message.content)) {
      type = 'quiz';
    } else if (message.content.includes('resumen') || message.content.includes('summary')) {
      type = 'summary';
    } else if (message.content.includes('plan') || message.content.includes('pomodoro')) {
      type = 'plan';
    } else if (message.content.includes('nota') || message.content.includes('cornell')) {
      type = 'notes';
    }
    
    addSavedContent({
      type,
      title,
      content: message.content,
      topic,
      subject,
      isFavorite: false,
      tags: [subject, topic],
    });
    
    showToast('✅ Contenido guardado en tu biblioteca', 'success');
  };

  // Iniciar quiz interactivo desde mensaje
  const handleStartInteractiveQuiz = (message: Message) => {
    const questions = parseQuizFromText(message.content);
    
    if (questions.length === 0) {
      showToast('No se pudo parsear el quiz. Intenta regenerarlo.', 'error');
      return;
    }
    
    const title = extractQuizTitle(message.content, 'Quiz Interactivo');
    const topic = prompt('¿Sobre qué tema es este quiz?') || 'General';
    const subject = prompt('¿De qué materia?') || 'General';
    
    setCurrentQuiz({
      questions,
      title,
      topic,
      subject,
    });
    
    setShowInteractiveQuiz(true);
  };

  // Repasar tema débil
  const handleReviewWeakTopic = (topic: string, subject: string) => {
    setShowWeakTopics(false);
    handleSendWrapper(`Crea un quiz de 5 preguntas sobre ${topic} de ${subject}. Incluye explicaciones detalladas.`);
    showToast(`Generando quiz de repaso sobre ${topic}...`, 'info');
  };

  // Regenerar última respuesta
  const handleRegenerateResponse = () => {
    if (currentMessages.length < 2) return;
    
    const lastUserMessage = [...currentMessages].reverse().find(m => m.role === Role.USER);
    if (!lastUserMessage) return;
    
    handleSendWrapper(lastUserMessage.content);
  };

  // --- RENDER FLOW ---
  if (!user) {
    if (showLanding) {
        return <LandingPage onStart={() => setShowLanding(false)} toggleTheme={toggleTheme} isDarkMode={theme === 'dark'} />;
    }
    return <Login onLogin={handleLogin} toggleTheme={toggleTheme} isDarkMode={theme === 'dark'} />;
  }

  return (
    <div className="flex h-screen w-full bg-background text-primary font-sans selection:bg-accent selection:text-black">
      
      {/* Onboarding Tour */}
      {user && showOnboarding && (
        <Suspense fallback={<div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
          <OnboardingTour onComplete={handleCompleteOnboarding} />
        </Suspense>
      )}
      
      {/* Study Tools Modal */}
      {showStudyTools && (
        <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
          <StudyTools 
            onClose={() => setShowStudyTools(false)}
            onGenerateTool={handleGenerateStudyTool}
          />
        </Suspense>
      )}

      {/* Progress Stats Modal */}
      {showProgress && (
        <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
          <ProgressStats 
            sessions={sessions}
            onClose={() => setShowProgress(false)}
          />
        </Suspense>
      )}

      {/* Share Dialog */}
      {showShare && currentSession && (
        <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
          <ShareDialog 
            session={currentSession}
            onClose={() => setShowShare(false)}
            onShare={handleShareConversation}
          />
        </Suspense>
      )}

      {/* Biblioteca de Contenido Guardado */}
      {showSavedContent && (
        <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
          <SavedContentLibrary
            onClose={() => setShowSavedContent(false)}
            onViewContent={(content) => {
              setViewingContent(content);
              setShowSavedContent(false);
              showToast(`Viendo: ${content.title}`, 'info');
            }}
          />
        </Suspense>
      )}

      {/* Quiz Interactivo */}
      {showInteractiveQuiz && currentQuiz && (
        <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
          <InteractiveQuiz
            questions={currentQuiz.questions}
            title={currentQuiz.title}
            topic={currentQuiz.topic}
            subject={currentQuiz.subject}
            onClose={() => {
              setShowInteractiveQuiz(false);
              setCurrentQuiz(null);
            }}
            onComplete={(score, session) => {
              setQuizResults(session);
              setShowInteractiveQuiz(false);
              setShowQuizResults(true);
              showToast(`¡Quiz completado! Score: ${score}%`, 'success');
            }}
          />
        </Suspense>
      )}

      {/* Resultados del Quiz */}
      {showQuizResults && quizResults && (
        <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
          <QuizResults
            session={quizResults}
            onClose={() => {
              setShowQuizResults(false);
              setQuizResults(null);
            }}
            onRetry={() => {
              setShowQuizResults(false);
              setShowInteractiveQuiz(true);
            }}
          />
        </Suspense>
      )}

      {/* Análisis de Temas Débiles */}
      {showWeakTopics && (
        <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
          <WeakTopicsAnalysis
            onClose={() => setShowWeakTopics(false)}
            onReviewTopic={handleReviewWeakTopic}
          />
        </Suspense>
      )}
      
      {/* Toast Notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={clearToast} 
        />
      )}
      
      {/* Help Modal */}
      {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden text-primary">
                  
                  {/* Header */}
                  <div className="flex justify-between items-center p-6 border-b border-border bg-surface">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent/20 p-2 rounded-lg text-accent">
                          <BookIcon sx={{ fontSize: 24 }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">Centro de Ayuda Nativo Digital</h3>
                          <p className="text-xs text-secondary">Aprende a estudiar mejor</p>
                        </div>
                      </div>
                      <button onClick={() => setShowHelp(false)} className="text-secondary hover:text-primary p-1 hover:bg-surfaceHighlight rounded-full transition-colors">
                        <CloseIcon sx={{ fontSize: 24 }} />
                      </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-border bg-surface">
                      <button onClick={() => setHelpTab('start')} className={`flex-1 py-4 text-sm font-medium transition-colors relative ${helpTab === 'start' ? 'text-accent' : 'text-secondary hover:text-primary'}`}>Inicio Rápido {helpTab === 'start' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>}</button>
                      <button onClick={() => setHelpTab('tools')} className={`flex-1 py-4 text-sm font-medium transition-colors relative ${helpTab === 'tools' ? 'text-accent' : 'text-secondary hover:text-primary'}`}>Herramientas {helpTab === 'tools' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>}</button>
                      <button onClick={() => setHelpTab('models')} className={`flex-1 py-4 text-sm font-medium transition-colors relative ${helpTab === 'models' ? 'text-accent' : 'text-secondary hover:text-primary'}`}>Modelos IA {helpTab === 'models' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>}</button>
                  </div>

                  {/* Content */}
                  <div className="p-6 overflow-y-auto bg-background flex-1">
                      
                      {/* Tab: Inicio Rápido */}
                      {helpTab === 'start' && (
                        <div className="space-y-6">
                            <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-4">
                                <h4 className="font-bold text-accent mb-2 flex items-center gap-2">
                                    <SparklesIcon sx={{ fontSize: 18 }} /> Atajos de Teclado
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-secondary">Nuevo chat</span>
                                        <kbd className="px-2 py-1 bg-surface border border-border rounded text-xs font-mono">Ctrl + N</kbd>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-secondary">Enfocar input</span>
                                        <kbd className="px-2 py-1 bg-surface border border-border rounded text-xs font-mono">Ctrl + /</kbd>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-secondary">Abrir ayuda</span>
                                        <kbd className="px-2 py-1 bg-surface border border-border rounded text-xs font-mono">Ctrl + H</kbd>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-secondary">Alternar sidebar</span>
                                        <kbd className="px-2 py-1 bg-surface border border-border rounded text-xs font-mono">Ctrl + B</kbd>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                                <div><h4 className="font-medium mb-1">Elige un tema</h4><p className="text-secondary text-sm">Escribe lo que quieras aprender. Ejemplo: "Explícame la Revolución Francesa".</p></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                                <div><h4 className="font-medium mb-1">Interactúa</h4><p className="text-secondary text-sm">Si no entiendes algo, pregunta de nuevo. Puedes decir "Más simple" o "Hazme un quiz".</p></div>
                            </div>
                             <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                                <div><h4 className="font-medium mb-1">Verifica</h4><p className="text-secondary text-sm">Nativo Digital te mostrará enlaces para que confirmes la información.</p></div>
                            </div>
                            
                            <div className="bg-surfaceHighlight rounded-xl p-4 mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <TipsAndUpdatesIcon sx={{ fontSize: 18 }} className="text-accent" />
                                  <h4 className="font-medium text-sm">Consejos Pro</h4>
                                </div>
                                <ul className="text-xs text-secondary space-y-1 list-disc list-inside">
                                    <li>Sé específico en tus preguntas para mejores respuestas</li>
                                    <li>Usa el botón de regenerar si la respuesta no te convence</li>
                                    <li>Exporta conversaciones importantes para estudiar después</li>
                                    <li>Cambia de modelo según la complejidad del tema</li>
                                </ul>
                            </div>
                        </div>
                      )}

                      {/* Tab: Herramientas */}
                      {helpTab === 'tools' && (
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-surface p-4 rounded-xl border border-border flex gap-4">
                                <div className="bg-surfaceHighlight p-3 rounded-lg h-fit text-accent"><CameraIcon sx={{ fontSize: 20 }}/></div>
                                <div><h4 className="font-medium text-sm">Visión (Cámara)</h4><p className="text-secondary text-xs mt-1">Sube una foto de tu tarea. La IA analizará la imagen.</p></div>
                            </div>
                            <div className="bg-surface p-4 rounded-lg border border-border flex gap-4">
                                <div className="bg-surfaceHighlight p-3 rounded-lg h-fit text-accent"><MicIcon sx={{ fontSize: 20 }}/></div>
                                <div><h4 className="font-medium text-sm">Voz (Micrófono)</h4><p className="text-secondary text-xs mt-1">Ideal para practicar idiomas o si prefieres hablar.</p></div>
                            </div>
                            <div className="bg-surface p-4 rounded-lg border border-border flex gap-4">
                                <div className="bg-surfaceHighlight p-3 rounded-lg h-fit text-accent"><AttachFileIcon sx={{ fontSize: 20 }}/></div>
                                <div><h4 className="font-medium text-sm">Archivos (PDF/TXT)</h4><p className="text-secondary text-xs mt-1">Adjunta tus apuntes o libros en PDF para resumirlos.</p></div>
                            </div>
                        </div>
                      )}

                      {/* Tab: Modelos */}
                      {helpTab === 'models' && (
                        <div className="space-y-4">
                            <p className="text-sm text-secondary mb-4">Puedes cambiar el "cerebro" de la IA en el menú superior.</p>
                            <div className="border-l-2 border-accent pl-4 py-1">
                                <h4 className="text-accent font-medium text-sm">Modo Estudio (Flash)</h4>
                                <p className="text-secondary text-xs mt-1">El mejor equilibrio. Rápido e inteligente.</p>
                            </div>
                            <div className="border-l-2 border-purple-400 pl-4 py-1">
                                <h4 className="text-purple-400 font-medium text-sm">Modo Experto (Pro)</h4>
                                <p className="text-secondary text-xs mt-1">Más lento pero potente para matemáticas complejas.</p>
                            </div>
                        </div>
                      )}

                  </div>

                  <div className="p-4 border-t border-border bg-surface">
                      <button onClick={() => setShowHelp(false)} className="w-full bg-primary hover:opacity-90 text-background font-medium py-3 rounded-xl transition-colors">¡Entendido, vamos a estudiar!</button>
                  </div>
              </div>
          </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSettings(false);
            }
          }}>
              <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col max-h-[90vh] text-primary" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold flex items-center gap-2">Mi Perfil</h3>
                      <button onClick={() => setShowSettings(false)} className="text-secondary hover:text-primary">
                        <CancelIcon sx={{ fontSize: 24 }} />
                      </button>
                  </div>
                  
                  <div className="overflow-y-auto space-y-6 pr-2">
                      {/* Profile Edit Section */}
                      <div className="space-y-4 pb-6 border-b border-border">
                          <div className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg text-white">
                                  {user.avatarId}
                              </div>
                              <div className="flex-1">
                                  <h3 className="font-bold text-lg">{user.name}</h3>
                                  <p className="text-sm text-accent capitalize">
                                    {user.specificGrade || user.grade}
                                  </p>
                                  {(user.email || user.rut) && (
                                    <p className="text-xs text-secondary mt-1">{user.email || user.rut}</p>
                                  )}
                              </div>
                          </div>

                          {/* Edit Profile Button */}
                          <button
                            onClick={() => {
                              const newName = prompt('Nuevo nombre:', user.name);
                              if (newName && newName.trim()) {
                                const updatedUser = { ...user, name: newName.trim() };
                                localStorage.setItem('nativo_user', JSON.stringify(updatedUser));
                                window.location.reload();
                              }
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-surfaceHighlight hover:bg-border text-primary px-4 py-2 rounded-xl transition-colors text-sm"
                          >
                            <PersonIcon sx={{ fontSize: 16 }} />
                            Editar nombre
                          </button>

                          {/* Change Email/RUT */}
                          <button
                            onClick={async () => {
                              const newIdentifier = prompt('Nuevo email o RUT:');
                              
                              if (newIdentifier && newIdentifier.trim()) {
                                const isEmail = newIdentifier.includes('@');
                                const updatedUser = {
                                  ...user,
                                  email: isEmail ? newIdentifier.trim() : undefined,
                                  rut: !isEmail ? newIdentifier.trim() : undefined
                                };
                                localStorage.setItem('nativo_user', JSON.stringify(updatedUser));
                                showToast('Perfil actualizado', 'success');
                                window.location.reload();
                              }
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-surfaceHighlight hover:bg-border text-primary px-4 py-2 rounded-xl transition-colors text-sm"
                          >
                            <EmailIcon sx={{ fontSize: 16 }} />
                            Cambiar email/RUT
                          </button>

                          {/* Change Password */}
                          <button
                            onClick={() => {
                              const newPassword = prompt('Nueva contraseña (mínimo 6 caracteres):');
                              if (newPassword && newPassword.length >= 6) {
                                const updatedUser = { ...user, password: newPassword };
                                localStorage.setItem('nativo_user', JSON.stringify(updatedUser));
                                showToast('Contraseña actualizada', 'success');
                              } else if (newPassword) {
                                showToast('La contraseña debe tener al menos 6 caracteres', 'error');
                              }
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-surfaceHighlight hover:bg-border text-primary px-4 py-2 rounded-xl transition-colors text-sm"
                          >
                            <LockIcon sx={{ fontSize: 16 }} />
                            Cambiar contraseña
                          </button>

                          {/* Change Grade */}
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary uppercase tracking-wider">Nivel Educativo</label>
                            <select
                              value={user.grade}
                              onChange={(e) => {
                                const updatedUser = { ...user, grade: e.target.value as any, specificGrade: undefined };
                                localStorage.setItem('nativo_user', JSON.stringify(updatedUser));
                                showToast('Nivel actualizado', 'success');
                                window.location.reload();
                              }}
                              className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:border-accent outline-none"
                            >
                              <option value="primaria">Primaria (6-12 años)</option>
                              <option value="secundaria">Secundaria (12-18 años)</option>
                              <option value="universidad">Universidad</option>
                              <option value="autodidacta">Autodidacta</option>
                            </select>
                          </div>

                          {/* Specific Grade Selection */}
                          {user.grade !== 'autodidacta' && (
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-secondary uppercase tracking-wider">Curso</label>
                              <select
                                value={user.specificGrade || ''}
                                onChange={(e) => {
                                  const updatedUser = { ...user, specificGrade: e.target.value || undefined };
                                  localStorage.setItem('nativo_user', JSON.stringify(updatedUser));
                                  showToast('Curso actualizado', 'success');
                                  window.location.reload();
                                }}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:border-accent outline-none"
                              >
                                <option value="">Selecciona tu curso</option>
                                {user.grade === 'primaria' && (
                                  <>
                                    <option value="1° Básico">1° Básico</option>
                                    <option value="2° Básico">2° Básico</option>
                                    <option value="3° Básico">3° Básico</option>
                                    <option value="4° Básico">4° Básico</option>
                                    <option value="5° Básico">5° Básico</option>
                                    <option value="6° Básico">6° Básico</option>
                                    <option value="7° Básico">7° Básico</option>
                                    <option value="8° Básico">8° Básico</option>
                                  </>
                                )}
                                {user.grade === 'secundaria' && (
                                  <>
                                    <option value="1° Medio">1° Medio</option>
                                    <option value="2° Medio">2° Medio</option>
                                    <option value="3° Medio">3° Medio</option>
                                    <option value="4° Medio">4° Medio</option>
                                  </>
                                )}
                                {user.grade === 'universidad' && (
                                  <>
                                    <option value="1° Año">1° Año</option>
                                    <option value="2° Año">2° Año</option>
                                    <option value="3° Año">3° Año</option>
                                    <option value="4° Año">4° Año</option>
                                    <option value="5° Año">5° Año</option>
                                    <option value="6° Año">6° Año</option>
                                  </>
                                )}
                              </select>
                            </div>
                          )}
                      </div>

                      <div className="space-y-2">
                          <label className="text-sm font-medium text-secondary flex items-center gap-2">
                              <SparklesIcon sx={{ fontSize: 16 }} className="text-accent" />
                              Personalidad del Tutor
                          </label>
                          <textarea 
                              value={customInstruction}
                              onChange={(e) => setCustomInstruction(e.target.value)}
                              placeholder="Ej: Explica todo con metáforas de fútbol..."
                              className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-accent outline-none min-h-[100px] resize-y"
                          />
                          <div className="flex justify-end gap-2">
                              {customInstruction && (
                                <button onClick={() => setCustomInstruction('')} className="text-xs text-secondary hover:text-primary flex items-center gap-1">
                                  <RefreshIcon sx={{ fontSize: 12 }} /> Restaurar
                                </button>
                              )}
                          </div>
                      </div>

                      <div className="h-px bg-border"></div>

                      <div className="space-y-3">
                          <div className="text-xs font-medium text-secondary uppercase tracking-wider mb-2">Ayuda y Aprendizaje</div>
                          <button 
                            onClick={() => {
                              setShowSettings(false);
                              setShowOnboarding(true);
                            }} 
                            className="w-full flex items-center justify-between bg-surfaceHighlight hover:bg-border text-primary px-4 py-3 rounded-xl transition-colors text-sm"
                          >
                              <span className="flex items-center gap-2">
                                <BookIcon sx={{ fontSize: 18 }} /> Ver tutorial de nuevo
                              </span>
                          </button>
                          
                          <div className="text-xs font-medium text-secondary uppercase tracking-wider mb-2 mt-4">Almacenamiento</div>
                          <div className="bg-surfaceHighlight rounded-xl p-4 border border-border">
                              <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-secondary">Espacio usado</span>
                                  <span className="text-sm font-bold text-primary">{getStorageSizeFormatted()}</span>
                              </div>
                              <div className="text-xs text-secondary">
                                  {sessions.length} conversaciones guardadas
                              </div>
                          </div>
                          
                          <div className="text-xs font-medium text-secondary uppercase tracking-wider mb-2 mt-4">Accesibilidad</div>
                          <button 
                            onClick={toggleHighContrast}
                            className="w-full flex items-center justify-between bg-surfaceHighlight hover:bg-border text-primary px-4 py-3 rounded-xl transition-colors text-sm"
                          >
                              <span className="flex items-center gap-2">
                                <SunIcon sx={{ fontSize: 18 }} /> Alto Contraste
                              </span>
                              <div className={`w-10 h-6 rounded-full transition-colors ${highContrast ? 'bg-accent' : 'bg-border'} relative`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${highContrast ? 'translate-x-5' : 'translate-x-1'}`}></div>
                              </div>
                          </button>
                          
                          <div className="text-xs font-medium text-secondary uppercase tracking-wider mb-2 mt-4">Idioma / Language</div>
                          <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => changeLanguage('es')}
                                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                                  language === 'es'
                                    ? 'bg-accent text-white'
                                    : 'bg-surfaceHighlight hover:bg-border text-primary'
                                }`}
                              >
                                🇪🇸 Español
                              </button>
                              <button
                                onClick={() => changeLanguage('en')}
                                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                                  language === 'en'
                                    ? 'bg-accent text-white'
                                    : 'bg-surfaceHighlight hover:bg-border text-primary'
                                }`}
                              >
                                🇬🇧 English
                              </button>
                          </div>
                          
                          <div className="text-xs font-medium text-secondary uppercase tracking-wider mb-2 mt-4">Exportar Conversación Actual</div>
                          <button onClick={handleExportMarkdown} className="w-full flex items-center justify-between bg-surfaceHighlight hover:bg-border text-primary px-4 py-3 rounded-xl transition-colors text-sm">
                              <span className="flex items-center gap-2"><DownloadIcon sx={{ fontSize: 18 }} /> Exportar como Markdown</span>
                          </button>
                          <button onClick={handleExportText} className="w-full flex items-center justify-between bg-surfaceHighlight hover:bg-border text-primary px-4 py-3 rounded-xl transition-colors text-sm">
                              <span className="flex items-center gap-2"><DownloadIcon sx={{ fontSize: 18 }} /> Exportar como Texto</span>
                          </button>
                          
                          <div className="text-xs font-medium text-secondary uppercase tracking-wider mb-2 mt-4">Gestión de Datos</div>
                          <button onClick={handleExportData} className="w-full flex items-center justify-between bg-surfaceHighlight hover:bg-border text-primary px-4 py-3 rounded-xl transition-colors text-sm">
                              <span className="flex items-center gap-2"><DownloadIcon sx={{ fontSize: 18 }} /> Exportar todo (JSON)</span>
                          </button>
                          <label className="w-full flex items-center justify-between bg-surfaceHighlight hover:bg-border text-primary px-4 py-3 rounded-xl transition-colors text-sm cursor-pointer">
                              <span className="flex items-center gap-2"><SaveIcon sx={{ fontSize: 18 }} /> Importar conversaciones</span>
                              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                          </label>
                          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-secondary hover:text-primary hover:bg-surfaceHighlight px-4 py-3 rounded-xl transition-colors text-sm mt-2 justify-center border border-border">
                                <LogoutIcon sx={{ fontSize: 18 }} /> Cerrar Sesión
                          </button>
                          <button onClick={handleClearHistory} className="w-full flex items-center gap-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 px-4 py-3 rounded-xl transition-colors text-sm justify-center border border-orange-500/30">
                                <DeleteIcon sx={{ fontSize: 18 }} /> Borrar todo el historial
                          </button>
                          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl mt-2">
                              <h4 className="text-red-400 font-medium text-sm mb-1">Zona de Peligro</h4>
                              <button onClick={handleFullReset} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm w-full py-2"><DeleteIcon sx={{ fontSize: 16 }} /> Borrar cuenta y datos</button>
                          </div>
                      </div>
                  </div>
                  <div className="text-xs text-center text-secondary mt-6 pt-4 border-t border-border">Nativo Digital v1.6 • {user.name}</div>
              </div>
          </div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={(id) => {
          setCurrentSessionId(id);
          navigate(`/chat/${id}`);
        }}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onOpenHelp={() => setShowHelp(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenStudyTools={() => setShowStudyTools(true)}
        onOpenProgress={() => setShowProgress(true)}
        onOpenLibrary={() => setShowSavedContent(true)}
        onOpenWeakTopics={() => setShowWeakTopics(true)}
      />

      <div className={`flex-1 flex flex-col h-full relative ${isMobile && isPanelOpen ? 'hidden' : ''}`}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-3">
                {!isSidebarOpen && (
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-surface rounded-full text-secondary hover:text-primary transition-colors">
                        <MenuIcon sx={{ fontSize: 20 }} />
                    </button>
                )}
                
                <div className="relative">
                    <button onClick={() => setIsModelMenuOpen(!isModelMenuOpen)} className="flex items-center gap-2 text-lg font-medium text-primary hover:bg-surface px-3 py-1.5 rounded-lg transition-colors group">
                        <span className="flex items-center gap-2"><SparklesIcon sx={{ fontSize: 16 }} className="text-accent" /> {GEMINI_MODEL_OPTIONS.find(m => m.id === selectedModel)?.name}</span>
                        <ExpandMoreIcon sx={{ fontSize: 16 }} className={`text-secondary transition-transform ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isModelMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-2xl py-2 z-50">
                            <div className="px-4 py-2 text-xs font-bold text-secondary uppercase tracking-wider">Modo de Aprendizaje</div>
                            {GEMINI_MODEL_OPTIONS.map(opt => (
                                <button key={opt.id} onClick={() => handleModelSelect(opt.id)} className={`w-full text-left px-4 py-3 text-sm hover:bg-surfaceHighlight flex items-center justify-between ${selectedModel === opt.id ? 'text-accent bg-accent/10' : 'text-primary'}`}>
                                    <span>{opt.name}</span>
                                    {selectedModel === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                {currentSessionId && (
                  <button 
                    onClick={() => setShowShare(true)}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-surfaceHighlight hover:bg-border text-primary rounded-xl transition-colors text-sm"
                    title="Compartir conversación"
                  >
                    <ShareIcon sx={{ fontSize: 18 }} />
                  </button>
                )}
                
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full text-secondary hover:text-primary hover:bg-surface transition-colors"
                  title={theme === 'light' ? "Modo Oscuro" : "Modo Claro"}
                >
                  {theme === 'light' ? <MoonIcon sx={{ fontSize: 20 }} /> : <SunIcon sx={{ fontSize: 20 }} />}
                </button>
                
                <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-surface rounded-full text-secondary hover:text-primary transition-transform active:scale-95 flex items-center gap-2 pr-4 hidden md:flex" title="Mi Perfil">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-lg">{user.avatarId}</div>
                    <span className="text-sm font-medium text-primary">{user.name}</span>
                </button>
            </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden max-w-full ${isMobile ? 'px-3' : 'px-4'}`}>
          <div className={`w-full max-w-full pt-8 ${isMobile ? 'pb-24 max-w-full' : 'pb-40 max-w-3xl mx-auto'}`}>
            {currentMessages.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full min-h-[50vh] animate-in fade-in duration-700">
                  <div className="mb-8">
                     <span className="text-5xl md:text-6xl font-medium gradient-text block mb-2 text-center md:text-left">Hola, {user.name}.</span>
                     <span className="text-2xl text-secondary block text-center md:text-left">¿Qué vamos a aprender hoy?</span>
                  </div>
                  
                  <div className={`w-full ${isMobile ? 'max-w-full' : 'max-w-3xl'}`}>
                     <div className="text-sm text-secondary mb-4 text-center">Herramientas de Estudio</div>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {/* Tarjetas de Memoria */}
                        <button 
                          onClick={async () => {
                            const topic = await askForTopic('Tarjetas de Memoria');
                            if (topic) handleGenerateStudyTool('flashcards', topic);
                          }}
                          className="bg-surface hover:bg-surfaceHighlight p-3 rounded-xl transition-colors flex flex-col items-center gap-2 group border border-transparent hover:border-accent/30"
                        >
                          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                            <SparklesIcon sx={{ fontSize: 20 }} />
                          </div>
                          <span className="text-xs text-secondary group-hover:text-primary font-medium text-center">Tarjetas de Memoria</span>
                        </button>

                        {/* Preguntas y Respuestas */}
                        <button 
                          onClick={async () => {
                            const topic = await askForTopic('Preguntas y Respuestas');
                            if (topic) handleGenerateStudyTool('quiz', topic);
                          }}
                          className="bg-surface hover:bg-surfaceHighlight p-3 rounded-xl transition-colors flex flex-col items-center gap-2 group border border-transparent hover:border-accent/30"
                        >
                          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                            <BrainIcon sx={{ fontSize: 20 }} />
                          </div>
                          <span className="text-xs text-secondary group-hover:text-primary font-medium text-center">Preguntas y Respuestas</span>
                        </button>

                        {/* Resumen Fácil */}
                        <button 
                          onClick={async () => {
                            const topic = await askForTopic('Resumen Fácil');
                            if (topic) handleGenerateStudyTool('summary', topic);
                          }}
                          className="bg-surface hover:bg-surfaceHighlight p-3 rounded-xl transition-colors flex flex-col items-center gap-2 group border border-transparent hover:border-accent/30"
                        >
                          <div className="p-2 bg-green-500/10 rounded-lg text-green-400 group-hover:scale-110 transition-transform">
                            <BookIcon sx={{ fontSize: 20 }} />
                          </div>
                          <span className="text-xs text-secondary group-hover:text-primary font-medium text-center">Resumen Fácil</span>
                        </button>

                        {/* Estudia 25 Minutos */}
                        <button 
                          onClick={async () => {
                            const topic = await askForTopic('Estudia 25 Minutos');
                            if (topic) handleGenerateStudyTool('pomodoro', topic);
                          }}
                          className="bg-surface hover:bg-surfaceHighlight p-3 rounded-xl transition-colors flex flex-col items-center gap-2 group border border-transparent hover:border-accent/30"
                        >
                          <div className="p-2 bg-red-500/10 rounded-lg text-red-400 group-hover:scale-110 transition-transform">
                            <TipsAndUpdatesIcon sx={{ fontSize: 20 }} />
                          </div>
                          <span className="text-xs text-secondary group-hover:text-primary font-medium text-center">Estudia 25 Minutos</span>
                        </button>

                        {/* Explica con Tus Palabras */}
                        <button 
                          onClick={async () => {
                            const topic = await askForTopic('Explica con Tus Palabras');
                            if (topic) handleGenerateStudyTool('feynman', topic);
                          }}
                          className="bg-surface hover:bg-surfaceHighlight p-3 rounded-xl transition-colors flex flex-col items-center gap-2 group border border-transparent hover:border-accent/30"
                        >
                          <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 group-hover:scale-110 transition-transform">
                            <BrainIcon sx={{ fontSize: 20 }} />
                          </div>
                          <span className="text-xs text-secondary group-hover:text-primary font-medium text-center">Explica con Tus Palabras</span>
                        </button>

                        {/* Apuntes Organizados */}
                        <button 
                          onClick={async () => {
                            const topic = await askForTopic('Apuntes Organizados');
                            if (topic) handleGenerateStudyTool('cornell', topic);
                          }}
                          className="bg-surface hover:bg-surfaceHighlight p-3 rounded-xl transition-colors flex flex-col items-center gap-2 group border border-transparent hover:border-accent/30"
                        >
                          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform">
                            <BookIcon sx={{ fontSize: 20 }} />
                          </div>
                          <span className="text-xs text-secondary group-hover:text-primary font-medium text-center">Apuntes Organizados</span>
                        </button>

                        {/* Dibuja las Ideas */}
                        <button 
                          onClick={async () => {
                            const topic = await askForTopic('Dibuja las Ideas');
                            if (topic) handleGenerateStudyTool('mindmap', topic);
                          }}
                          className="bg-surface hover:bg-surfaceHighlight p-3 rounded-xl transition-colors flex flex-col items-center gap-2 group border border-transparent hover:border-accent/30"
                        >
                          <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400 group-hover:scale-110 transition-transform">
                            <SparklesIcon sx={{ fontSize: 20 }} />
                          </div>
                          <span className="text-xs text-secondary group-hover:text-primary font-medium text-center">Dibuja las Ideas</span>
                        </button>

                        {/* Repasa Cada Día */}
                        <button 
                          onClick={async () => {
                            const topic = await askForTopic('Repasa Cada Día');
                            if (topic) handleGenerateStudyTool('spaced', topic);
                          }}
                          className="bg-surface hover:bg-surfaceHighlight p-3 rounded-xl transition-colors flex flex-col items-center gap-2 group border border-transparent hover:border-accent/30"
                        >
                          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:scale-110 transition-transform">
                            <TipsAndUpdatesIcon sx={{ fontSize: 20 }} />
                          </div>
                          <span className="text-xs text-secondary group-hover:text-primary font-medium text-center">Repasa Cada Día</span>
                        </button>

                        {/* Practica Recordar */}
                        <button 
                          onClick={async () => {
                            const topic = await askForTopic('Practica Recordar');
                            if (topic) handleGenerateStudyTool('active-recall', topic);
                          }}
                          className="bg-surface hover:bg-surfaceHighlight p-3 rounded-xl transition-colors flex flex-col items-center gap-2 group border border-transparent hover:border-accent/30"
                        >
                          <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400 group-hover:scale-110 transition-transform">
                            <BrainIcon sx={{ fontSize: 20 }} />
                          </div>
                          <span className="text-xs text-secondary group-hover:text-primary font-medium text-center">Practica Recordar</span>
                        </button>
                     </div>
                  </div>
               </div>
            ) : (
                <>
                    {currentMessages.map((msg, idx) => (
                        <MessageBubble 
                          key={msg.id} 
                          role={msg.role} 
                          content={msg.content} 
                          attachments={msg.attachments} 
                          groundingSources={msg.groundingSources}
                          isError={msg.isError}
                          messageId={msg.id}
                          onRegenerate={msg.role === Role.MODEL && idx === currentMessages.length - 1 ? handleRegenerateResponse : undefined}
                          onSave={msg.role === Role.MODEL ? () => handleSaveContent(msg) : undefined}
                        />
                    ))}
                    {isLoading && <MessageBubble role={Role.MODEL} content="" isThinking={true} />}
                    
                    {/* Show suggested resources after AI response */}
                    {!isLoading && suggestedResources.length > 0 && currentMessages.length > 0 && (
                      <div className={`w-full ${isMobile ? 'max-w-full' : 'max-w-3xl mx-auto'}`}>
                        <ResourceSuggestions 
                          resources={suggestedResources}
                          onClose={() => setSuggestedResources([])}
                        />
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className={`absolute left-0 right-0 bg-background/95 backdrop-blur-sm pt-4 ${isMobile ? 'bottom-16 pb-4 px-3' : 'bottom-0 pb-6 px-4'}`}>
           <div className={`w-full relative ${isMobile ? 'max-w-full' : 'max-w-3xl mx-auto'}`}>
              <div className="bg-surface rounded-3xl flex flex-col border border-border focus-within:border-secondary transition-colors shadow-lg">
                 {attachments.length > 0 && (
                   <div className="px-6 pt-4 flex gap-3 overflow-x-auto">
                     {attachments.map((file, idx) => (
                       <div key={idx} className="relative group/attachment flex-shrink-0">
                         <div className="w-16 h-16 rounded-lg border border-border overflow-hidden bg-background flex items-center justify-center">
                            {file.mimeType.startsWith('image/') ? (
                              <img src={`data:${file.mimeType};base64,${file.data}`} className="w-full h-full object-cover opacity-80" alt="Preview"/>
                            ) : (
                              <FileIcon sx={{ fontSize: 24 }} className="text-secondary"/>
                            )}
                         </div>
                         <button onClick={() => removeAttachment(idx)} className="absolute -top-1.5 -right-1.5 bg-secondary rounded-full p-0.5 text-background hover:bg-red-500">
                           <CloseIcon sx={{ fontSize: 12 }} />
                         </button>
                       </div>
                     ))}
                   </div>
                 )}
                 <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? "Escuchando..." : "Escribe, sube una foto de tu tarea o pregunta..."}
                    className="w-full bg-transparent text-primary placeholder-secondary px-6 py-4 outline-none resize-none min-h-[60px] max-h-[200px]"
                    rows={1}
                    aria-label="Campo de entrada de mensaje"
                    maxLength={4000}
                 />
                 
                 {/* Character Counter */}
                 {input.length > 0 && (
                   <div className="px-6 pb-2 flex items-center justify-between">
                     <div className={`text-xs ${input.length > 3500 ? 'text-orange-500' : 'text-secondary'}`}>
                       {input.length} / 4000 caracteres
                     </div>
                     {input.length > 3500 && (
                       <div className="text-xs text-orange-500">⚠️ Cerca del límite</div>
                     )}
                   </div>
                 )}
                 
                 <div className="flex justify-between items-center px-4 pb-3">
                    <div className="flex items-center gap-2">
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         className="hidden" 
                         multiple 
                         accept="image/*,application/pdf,text/*" 
                         onChange={handleFileSelect}
                         aria-label="Seleccionar archivos para adjuntar"
                       />
                       <button 
                         onClick={triggerFileUpload} 
                         className="p-2 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-full transition-colors" 
                         title="Adjuntar archivo"
                         aria-label="Adjuntar archivo"
                       >
                         <AttachFileIcon sx={{ fontSize: 20 }} />
                       </button>
                       <button 
                         onClick={triggerFileUpload} 
                         className="p-2 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-full transition-colors" 
                         title="Subir imagen"
                         aria-label="Subir imagen"
                       >
                         <ImageIcon sx={{ fontSize: 20 }} />
                       </button>
                       <button 
                         onClick={toggleListening} 
                         className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-secondary hover:text-primary hover:bg-surfaceHighlight'}`} 
                         title="Usar micrófono"
                         aria-label={isListening ? "Detener grabación de voz" : "Iniciar grabación de voz"}
                       >
                         {isListening ? <StopIcon sx={{ fontSize: 20 }} /> : <MicIcon sx={{ fontSize: 20 }} />}
                       </button>
                    </div>
                    {isLoading ? (
                      <button 
                        onClick={handleStopGeneration}
                        className="p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
                        title="Detener generación"
                        aria-label="Detener generación de respuesta"
                      >
                        <StopIcon sx={{ fontSize: 18 }} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSendWrapper()} 
                        disabled={(!input.trim() && attachments.length === 0)} 
                        className={`p-2 rounded-full transition-all duration-200 ${(input.trim() || attachments.length > 0) ? 'bg-primary text-background hover:opacity-90' : 'bg-surfaceHighlight text-secondary cursor-not-allowed'}`}
                        aria-label="Enviar mensaje"
                        title="Enviar mensaje (Enter)"
                      >
                        <SendIcon sx={{ fontSize: 18 }} className={(input.trim() || attachments.length > 0) ? "ml-0.5" : ""} />
                      </button>
                    )}
                 </div>
              </div>
              <div className="text-center mt-3 text-xs text-secondary">Nativo Digital ayuda a estudiar y aprender. Verifica la información.</div>
           </div>
        </div>
      </div>
      
      {/* Preview Panel - Hermano del chat area, no hijo */}
      {previewItems.length > 0 && (
        <PreviewPanel 
          items={previewItems}
          isOpen={isPanelOpen}
          onClose={closePanel}
        />
      )}

      {/* Bottom Navigation - Solo en mobile */}
      {isMobile && (
        <BottomNavigation
          onOpenStudyTools={() => setShowStudyTools(true)}
          onOpenLibrary={() => setShowSavedContent(true)}
          onNewChat={handleNewChat}
          currentView="chat"
        />
      )}
    </div>
  );
}

export default App;
