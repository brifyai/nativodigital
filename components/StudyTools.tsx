import React, { useState } from 'react';
import {
  Close as CloseIcon,
  MenuBook as BookOpenIcon,
  Psychology as BrainIcon,
  InsertDriveFile as FileTextIcon,
  AutoAwesome as SparklesIcon,
  ChevronRight as ChevronRightIcon,
  Timer as TimerIcon,
  School as SchoolIcon,
  Description as DescriptionIcon,
  AccountTree as AccountTreeIcon,
  Repeat as RepeatIcon,
  Lightbulb as LightbulbIcon,
  Style as StyleIcon,
  Quiz as QuizIcon,
  Summarize as SummarizeIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  EventRepeat as EventRepeatIcon,
  Psychology as PsychologyIcon,
  TouchApp as TouchAppIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
} from '@mui/icons-material';

interface StudyToolsProps {
  onClose: () => void;
  onGenerateTool: (type: 'flashcards' | 'quiz' | 'summary' | 'pomodoro' | 'feynman' | 'cornell' | 'mindmap' | 'spaced' | 'active-recall', topic: string) => void;
}

const StudyTools: React.FC<StudyToolsProps> = ({ onClose, onGenerateTool }) => {
  const [selectedTool, setSelectedTool] = useState<'flashcards' | 'quiz' | 'summary' | 'pomodoro' | 'feynman' | 'cornell' | 'mindmap' | 'spaced' | 'active-recall' | null>(null);
  const [topic, setTopic] = useState('');

  const tools = [
    {
      id: 'flashcards' as const,
      name: 'Tarjetas de Memoria',
      shortName: 'Tarjetas',
      description: 'Pregunta y respuesta para memorizar fácil',
      icon: StyleIcon,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500',
      example: 'Ej: "Verbos en inglés"'
    },
    {
      id: 'quiz' as const,
      name: 'Preguntas y Respuestas',
      shortName: 'Quiz',
      description: 'Elige la respuesta correcta y aprende',
      icon: QuizIcon,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500',
      example: 'Ej: "Segunda Guerra Mundial"'
    },
    {
      id: 'summary' as const,
      name: 'Resumen Fácil',
      shortName: 'Resumen',
      description: 'Todo lo importante en pocas palabras',
      icon: SummarizeIcon,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500',
      example: 'Ej: "La célula"'
    },
    {
      id: 'pomodoro' as const,
      name: 'Estudia 25 Minutos',
      shortName: 'Cronómetro',
      description: 'Estudia un rato, descansa, y repite',
      icon: TimerIcon,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500',
      example: 'Ej: "Matemáticas"'
    },
    {
      id: 'feynman' as const,
      name: 'Explica con Tus Palabras',
      shortName: 'Explica',
      description: 'Aprende enseñando como si fueras el profe',
      icon: RecordVoiceOverIcon,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500',
      example: 'Ej: "Fotosíntesis"'
    },
    {
      id: 'cornell' as const,
      name: 'Apuntes Organizados',
      shortName: 'Apuntes',
      description: 'Toma notas ordenadas con preguntas',
      icon: DescriptionIcon,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500',
      example: 'Ej: "Historia de Chile"'
    },
    {
      id: 'mindmap' as const,
      name: 'Dibuja las Ideas',
      shortName: 'Dibujo',
      description: 'Conecta todo como un árbol de ideas',
      icon: AccountTreeIcon,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500',
      example: 'Ej: "El cuerpo humano"'
    },
    {
      id: 'spaced' as const,
      name: 'Repasa Cada Día',
      shortName: 'Calendario',
      description: 'Plan para repasar y no olvidar',
      icon: EventRepeatIcon,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500',
      example: 'Ej: "Vocabulario"'
    },
    {
      id: 'active-recall' as const,
      name: 'Practica Recordar',
      shortName: 'Practica',
      description: 'Preguntas para ver qué recuerdas',
      icon: PsychologyIcon,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500',
      example: 'Ej: "Tabla periódica"'
    }
  ];

  const handleGenerate = () => {
    if (selectedTool && topic.trim()) {
      onGenerateTool(selectedTool, topic.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in">
      <div className="bg-surface border-0 md:border md:border-border rounded-none md:rounded-2xl w-full h-full md:h-auto md:max-w-4xl md:max-h-[92vh] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-4 fade-in duration-500 flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-3 md:p-4 border-b border-border bg-gradient-to-r from-accent/10 to-purple-500/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-accent/20 p-1.5 rounded-lg text-accent">
              <SparklesIcon sx={{ fontSize: 20 }} className="md:text-[24px]" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-primary">¿Cómo quieres estudiar?</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary p-1.5 hover:bg-surfaceHighlight rounded-full transition-colors flex-shrink-0">
            <CloseIcon sx={{ fontSize: 20 }} className="md:text-[24px]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 md:p-4 flex-1 overflow-hidden flex flex-col">
          
          {!selectedTool ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-secondary text-sm mb-2">
                <TouchAppIcon sx={{ fontSize: 18 }} className="text-accent" />
                <span>Toca la opción que prefieras</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`text-left p-3 md:p-4 rounded-xl border-2 ${tool.bg} border-transparent active:${tool.border} md:hover:${tool.border} transition-all active:scale-95 md:hover:scale-105 group relative overflow-hidden`}
                    >
                      <div className="relative flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 md:w-14 md:h-14 ${tool.bg} rounded-xl flex items-center justify-center ${tool.color} border-2 ${tool.border} group-hover:scale-110 transition-transform shadow-sm`}>
                          <Icon sx={{ fontSize: 24 }} className="md:text-[28px]" />
                        </div>
                        <h4 className="font-bold text-primary text-sm md:text-base text-center leading-tight">
                          {tool.shortName}
                        </h4>
                        <p className="text-xs md:text-sm text-secondary/80 text-center leading-tight">{tool.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Ayuda visual */}
              <div className="mt-3 p-3 bg-accent/10 rounded-xl border border-accent/30">
                <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-primary">
                  <TipsAndUpdatesIcon sx={{ fontSize: 16 }} className="text-accent flex-shrink-0" />
                  <span><span className="font-semibold">Tip:</span> Prueba diferentes métodos</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in slide-in-from-right fade-in duration-300">
              <button
                onClick={() => setSelectedTool(null)}
                className="text-sm text-secondary hover:text-primary flex items-center gap-1 font-medium hover:gap-2 transition-all"
              >
                ← Volver a elegir
              </button>

              {(() => {
                const tool = tools.find(t => t.id === selectedTool)!;
                const Icon = tool.icon;
                return (
                  <div className={`p-4 rounded-xl ${tool.bg} border-2 ${tool.border} relative overflow-hidden`}>
                    <div className="relative flex items-center gap-3">
                      <div className={`w-12 h-12 bg-surface rounded-xl flex items-center justify-center ${tool.color} border-2 ${tool.border} shadow-md`}>
                        <Icon sx={{ fontSize: 24 }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-primary text-base mb-1">{tool.name}</h4>
                        <p className="text-sm text-secondary leading-relaxed">{tool.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="bg-surface/50 p-4 rounded-xl border-2 border-border">
                <label className="flex items-center gap-2 text-sm md:text-base font-semibold text-primary mb-3">
                  <BookOpenIcon sx={{ fontSize: 20 }} className="text-accent" />
                  ¿Sobre qué tema quieres estudiar?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={tools.find(t => t.id === selectedTool)?.example}
                  className="w-full bg-background border-2 border-border rounded-xl py-3 px-4 text-primary text-base focus:border-accent focus:ring-4 focus:ring-accent/20 outline-none transition-all placeholder:text-secondary/50"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && topic.trim()) {
                      handleGenerate();
                    }
                  }}
                />
                <div className="flex items-center justify-center gap-2 text-xs text-secondary mt-2">
                  <TipsAndUpdatesIcon sx={{ fontSize: 16 }} className="text-accent" />
                  <span>Escribe el tema y presiona Enter</span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!topic.trim()}
                className={`w-full py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                  topic.trim()
                    ? 'bg-gradient-to-r from-accent to-purple-500 text-white hover:scale-105 hover:shadow-2xl active:scale-95'
                    : 'bg-surfaceHighlight text-secondary cursor-not-allowed opacity-50'
                }`}
              >
                <SparklesIcon sx={{ fontSize: 22 }} />
                ¡Crear {tools.find(t => t.id === selectedTool)?.shortName}!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyTools;
