import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatSession, Message, Role, ModelProvider, GeminiModelId, Attachment, GroundingSource } from '../types';
import { createChatSession, sendMessageStream } from '../services/gemini';
import { saveToStorage, getFromStorage } from '../utils/storage';
import { showToast } from '../utils/sweetAlert';
import { GEMINI_MODEL_OPTIONS } from '../constants';
import { usePreview } from './PreviewContext';

interface ChatContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentSession: ChatSession | null;
  currentMessages: Message[];
  isLoading: boolean;
  abortController: AbortController | null;
  selectedModel: string;
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  setSelectedModel: (model: string) => void;
  handleNewChat: () => void;
  handleSend: (text: string, attachmentsToSend: Attachment[]) => Promise<void>;
  handleStopGeneration: () => void;
  handleRegenerateResponse: () => void;
  handleDeleteSession: (e: React.MouseEvent, sessionId: string) => Promise<void>;
  handleClearHistory: () => Promise<void>;
  setCurrentSessionId: (id: string) => void;
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  chatRef: React.MutableRefObject<any>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode; customInstruction: string }> = ({ 
  children, 
  customInstruction 
}) => {
  const navigate = useNavigate();
  const { sessionId, shareId } = useParams<{ sessionId?: string; shareId?: string }>();
  const { clearPreviewItems } = usePreview();
  
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    return getFromStorage('accesoia_sessions', []);
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(GeminiModelId.FLASH);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  const chatRef = useRef<any>(null);

  // Save sessions to storage
  useEffect(() => {
    if (sessions.length > 0) {
      saveToStorage('accesoia_sessions', sessions);
    }
  }, [sessions]);

  // Get current session
  const currentSession = sessions.find(s => s.id === currentSessionId) || null;
  const currentMessages = currentSession?.messages || [];

  // Combined system instruction
  const getCombinedSystemInstruction = useCallback((modelId: string, customInstr: string) => {
    const modelOption = GEMINI_MODEL_OPTIONS.find(m => m.id === modelId);
    const modeInstruction = modelOption?.instruction || "";
    return `${customInstr}\n\n${modeInstruction}`;
  }, []);

  // Handle new chat
  const handleNewChat = useCallback(() => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'Nueva Conversación',
      messages: [],
      updatedAt: Date.now(),
      modelId: selectedModel,
      provider: ModelProvider.GEMINI
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setAttachments([]);
    
    // Limpiar panel de preview al crear nuevo chat
    clearPreviewItems();
    
    navigate(`/chat/${newSession.id}`);
    
    const finalInstruction = getCombinedSystemInstruction(selectedModel, customInstruction);
    chatRef.current = createChatSession(selectedModel, [], finalInstruction);
  }, [selectedModel, customInstruction, navigate, getCombinedSystemInstruction, clearPreviewItems]);

  // Handle send message - COMPLETE IMPLEMENTATION
  const handleSend = useCallback(async (textToSend: string, attachmentsToSend: Attachment[]) => {
    if ((!textToSend.trim() && attachmentsToSend.length === 0) || !currentSessionId) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: Role.USER,
      content: textToSend,
      attachments: [...attachmentsToSend],
      timestamp: Date.now()
    };

    // Helper function to remove emojis from text
    const removeEmojis = (text: string): string => {
      return text
        .replace(/[\u{1F300}-\u{1F9FF}][\u{FE00}-\u{FE0F}]?|[\u{2600}-\u{26FF}][\u{FE00}-\u{FE0F}]?|[\u{2700}-\u{27BF}][\u{FE00}-\u{FE0F}]?|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2300}-\u{23FF}][\u{FE00}-\u{FE0F}]?|[\u{2B50}][\u{FE00}-\u{FE0F}]?|[\u{2B55}][\u{FE00}-\u{FE0F}]?|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23EC}]|[\u{23F0}]|[\u{23F3}]|[\u{25FD}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}][\u{FE00}-\u{FE0F}]?|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}-\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}-\u{2B1C}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]/gu, '')
        .replace(/[0-9#*][\u{FE0F}]?[\u{20E3}]/gu, '')
        .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
        .replace(/[\u{20E3}]/gu, '')
        .trim();
    };

    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        const cleanTitle = textToSend ? removeEmojis(textToSend).slice(0, 40) : "Análisis de archivo";
        return {
          ...session,
          messages: [...session.messages, userMsg],
          title: session.messages.length === 0 ? cleanTitle : session.title
        };
      }
      return session;
    }));

    setAttachments([]);
    setIsLoading(true);

    const aiMsgId = crypto.randomUUID();
    const aiMsg: Message = {
      id: aiMsgId,
      role: Role.MODEL,
      content: '', 
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        return { ...session, messages: [...session.messages, aiMsg] };
      }
      return session;
    }));

    const controller = new AbortController();
    setAbortController(controller);

    try {
      if (!chatRef.current) {
        const session = sessions.find(s => s.id === currentSessionId);
        const finalInstruction = getCombinedSystemInstruction(selectedModel, customInstruction);
        chatRef.current = createChatSession(selectedModel, session ? session.messages : [], finalInstruction);
      }

      await sendMessageStream(
          chatRef.current, 
          userMsg.content, 
          userMsg.attachments, 
          (chunk) => {
              if (controller.signal.aborted) return;
              setSessions(prev => prev.map(session => {
                  if (session.id === currentSessionId) {
                    const updatedMessages = session.messages.map(msg => {
                        if (msg.id === aiMsgId) {
                          return { ...msg, content: msg.content + chunk };
                        }
                        return msg;
                    });
                    return { ...session, messages: updatedMessages };
                  }
                  return session;
              }));
          },
          (sources: GroundingSource[]) => {
              if (controller.signal.aborted) return;
              setSessions(prev => prev.map(session => {
                  if (session.id === currentSessionId) {
                    const updatedMessages = session.messages.map(msg => {
                        if (msg.id === aiMsgId) {
                            const existing = msg.groundingSources || [];
                            const newSources = sources.filter(s => !existing.some(e => e.uri === s.uri));
                            return { ...msg, groundingSources: [...existing, ...newSources] };
                        }
                        return msg;
                    });
                    return { ...session, messages: updatedMessages };
                  }
                  return session;
              }));
          }
      );
    } catch (error: any) {
      if (error.name === 'AbortError' || controller.signal.aborted) {
        setSessions(prev => prev.map(session => {
          if (session.id === currentSessionId) {
            const updatedMessages = session.messages.map(msg => {
              if (msg.id === aiMsgId && !msg.content) {
                return { 
                    ...msg, 
                    content: `_Generación detenida por el usuario._`,
                };
              }
              return msg;
            });
            return { ...session, messages: updatedMessages };
          }
          return session;
        }));
      } else {
        console.error("Error sending message", error);
        
        let errorMessage = "No se pudo conectar con el servidor.";
        
        if (error.message?.includes('API key')) {
          errorMessage = "⚠️ **API Key inválida o no configurada**\n\nPor favor, configura tu API key de Gemini en el archivo `.env.local`:\n\n```\nGEMINI_API_KEY=tu_api_key_aqui\n```\n\nObtén tu API key gratis en: https://aistudio.google.com/apikey";
        } else if (error.message?.includes('503') || error.message?.includes('overloaded') || error.message?.includes('UNAVAILABLE')) {
          errorMessage = "🔄 **Servidor sobrecargado**\n\nGemini está recibiendo muchas solicitudes en este momento.\n\n**¿Qué puedes hacer?**\n- Espera 30-60 segundos e intenta de nuevo\n- Usa el botón de regenerar\n- Si persiste, intenta más tarde\n\n_Este error es temporal y se resolverá pronto._";
        } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
          errorMessage = "⏱️ **Límite de uso alcanzado**\n\nHas alcanzado el límite de solicitudes. Espera unos minutos e intenta de nuevo.";
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          errorMessage = "🌐 **Error de conexión**\n\nNo se pudo conectar con el servidor. Verifica tu conexión a internet.";
        } else {
          errorMessage = `❌ **Error inesperado**\n\n${error.message || "Algo salió mal."}\n\n_Intenta regenerar la respuesta._`;
        }
        
        setSessions(prev => prev.map(session => {
            if (session.id === currentSessionId) {
              const updatedMessages = session.messages.map(msg => {
                if (msg.id === aiMsgId) {
                  return { 
                      ...msg, 
                      content: errorMessage,
                      isError: true 
                  };
                }
                return msg;
              });
              return { ...session, messages: updatedMessages };
            }
            return session;
          }));
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  }, [currentSessionId, selectedModel, customInstruction, sessions, getCombinedSystemInstruction]);

  // Handle stop generation
  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
    }
  };

  // Handle regenerate
  const handleRegenerateResponse = useCallback(() => {
    if (!currentSession) return;
    
    const messages = [...currentSession.messages];
    if (messages.length < 2) return;
    
    const lastAiIndex = messages.length - 1;
    const lastUserIndex = messages.length - 2;
    
    if (messages[lastAiIndex].role !== Role.MODEL || messages[lastUserIndex].role !== Role.USER) return;

    const lastUserMessage = messages[lastUserIndex];
    
    setSessions(prev => prev.map(s => 
      s.id === currentSessionId 
        ? { ...s, messages: messages.slice(0, -1) }
        : s
    ));
    
    chatRef.current = null;
    
    setTimeout(() => {
      handleSend(lastUserMessage.content, lastUserMessage.attachments || []);
    }, 100);
  }, [currentSession, currentSessionId, handleSend]);

  // Handle delete session
  // Handle delete session
  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    
    const { showDeleteConfirm } = await import('../utils/sweetAlert');
    const result = await showDeleteConfirm(
      "¿Eliminar conversación?",
      "Esta conversación se eliminará permanentemente."
    );
    
    if (result.isConfirmed) {
      const newSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(newSessions);
      
      // Limpiar panel de preview al eliminar sesión
      if (currentSessionId === sessionId) {
        clearPreviewItems();
        if (newSessions.length > 0) {
          setCurrentSessionId(newSessions[0].id);
          chatRef.current = null;
        } else {
          handleNewChat();
        }
      }
      
      // No mostrar toast de éxito - eliminación silenciosa
    }
  };

  // Handle clear history
  // Handle clear history
  const handleClearHistory = async () => {
    const { showDeleteConfirm } = await import('../utils/sweetAlert');
    const result = await showDeleteConfirm(
      "¿Borrar todo el historial?",
      "Esta acción no se puede deshacer. Se eliminarán todas tus conversaciones."
    );
    
    if (result.isConfirmed) {
      setSessions([]);
      localStorage.removeItem('accesoia_sessions');
      // Limpiar panel de preview al borrar historial
      clearPreviewItems();
      handleNewChat();
      // No mostrar toast de éxito - borrado silencioso
    }
  };

  // Sync URL with session ID
  useEffect(() => {
    if (sessionId) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setCurrentSessionId(sessionId);
      } else {
        navigate('/');
      }
    } else if (shareId) {
      const sharedConversations = JSON.parse(localStorage.getItem('nativo_shared') || '{}');
      const shared = sharedConversations[shareId];
      if (shared && shared.session) {
        const sharedSession = shared.session;
        const existingSession = sessions.find(s => s.id === sharedSession.id);
        
        if (!existingSession) {
          setSessions(prev => [sharedSession, ...prev]);
        }
        
        setCurrentSessionId(sharedSession.id);
        shared.views = (shared.views || 0) + 1;
        sharedConversations[shareId] = shared;
        localStorage.setItem('nativo_shared', JSON.stringify(sharedConversations));
        
        showToast('Conversación compartida cargada (solo lectura)', 'success');
      } else {
        showToast('Conversación compartida no encontrada', 'error');
        navigate('/');
      }
    }
  }, [sessionId, shareId, sessions, navigate]);

  // Limpiar panel de preview solo al cambiar de sesión manualmente (no en carga inicial)
  const previousSessionIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    // Solo limpiar si hubo una sesión previa y cambió (no en la carga inicial)
    if (previousSessionIdRef.current !== null && previousSessionIdRef.current !== currentSessionId) {
      clearPreviewItems();
    }
    previousSessionIdRef.current = currentSessionId;
  }, [currentSessionId, clearPreviewItems]);

  // Initial load
  useEffect(() => {
    if (sessions.length === 0 && !sessionId) {
      handleNewChat();
    } else if (!currentSessionId && sessions.length > 0 && !sessionId) {
      const firstSessionId = sessions[0].id;
      setCurrentSessionId(firstSessionId);
      navigate(`/chat/${firstSessionId}`);
    }
  }, [sessionId, sessions.length, currentSessionId, handleNewChat, navigate]);

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSessionId,
        currentSession,
        currentMessages,
        isLoading,
        abortController,
        selectedModel,
        attachments,
        setAttachments,
        setSelectedModel,
        handleNewChat,
        handleSend,
        handleStopGeneration,
        handleRegenerateResponse,
        handleDeleteSession,
        handleClearHistory,
        setCurrentSessionId,
        setSessions,
        chatRef,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
