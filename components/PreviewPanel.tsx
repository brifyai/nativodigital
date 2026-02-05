import React, { useState } from 'react';
import {
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Style as CardsIcon,
  Quiz as QuizIcon,
  Timer as TimerIcon,
  Description as SummaryIcon,
  School as FeynmanIcon,
  Note as CornellIcon,
  AccountTree as MindMapIcon,
  CalendarMonth as SpacedIcon,
  Psychology as RecallIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useIsMobile } from '../hooks/useMediaQuery';
import FlashcardViewer from './FlashcardViewer';
import QuizViewer from './QuizViewer';
import PomodoroViewer from './PomodoroViewer';
import SummaryViewer from './SummaryViewer';
import FeynmanViewer from './FeynmanViewer';
import CornellViewer from './CornellViewer';
import MindMapViewer from './MindMapViewer';
import SpacedRepetitionViewer from './SpacedRepetitionViewer';
import ActiveRecallViewer from './ActiveRecallViewer';

export interface PreviewItem {
  id: string;
  type: 'flashcards' | 'quiz' | 'pomodoro' | 'summary' | 'feynman' | 'cornell' | 'mindmap' | 'spaced' | 'recall';
  title: string;
  data: any;
  messageId: string;
  topic?: string;
}

interface PreviewPanelProps {
  items: PreviewItem[];
  isOpen: boolean;
  onClose: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ items, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  // Si no hay items o no está abierto, no renderizar nada
  if (items.length === 0 || !isOpen) return null;

  const currentItem = items[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'flashcards':
        return <CardsIcon />;
      case 'quiz':
        return <QuizIcon />;
      case 'pomodoro':
        return <TimerIcon />;
      case 'summary':
        return <SummaryIcon />;
      case 'feynman':
        return <FeynmanIcon />;
      case 'cornell':
        return <CornellIcon />;
      case 'mindmap':
        return <MindMapIcon />;
      case 'spaced':
        return <SpacedIcon />;
      case 'recall':
        return <RecallIcon />;
      default:
        return null;
    }
  };

  // Mobile: Full-screen modal
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header Mobile */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface flex-shrink-0 sticky top-0 z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors p-2 -ml-2"
          >
            <ArrowBackIcon sx={{ fontSize: 24 }} />
            <span className="font-medium">Volver</span>
          </button>
          
          <div className="flex items-center gap-2 flex-1 justify-center px-4">
            <div className="p-1.5 bg-accent/10 rounded-lg text-accent">
              {getIcon(currentItem.type)}
            </div>
            <h3 className="font-bold text-primary text-sm truncate max-w-[150px]">
              {currentItem.title}
            </h3>
          </div>

          {items.length > 1 && (
            <span className="text-xs text-secondary whitespace-nowrap">
              {currentIndex + 1}/{items.length}
            </span>
          )}
        </div>

        {/* Content Mobile */}
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="p-4">
            {currentItem.type === 'flashcards' && (
              <FlashcardViewer cards={currentItem.data} title={currentItem.title} />
            )}
            {currentItem.type === 'quiz' && (
              <QuizViewer questions={currentItem.data} title={currentItem.title} />
            )}
            {currentItem.type === 'pomodoro' && (
              <PomodoroViewer sessions={currentItem.data} title={currentItem.title} topic={currentItem.topic} />
            )}
            {currentItem.type === 'summary' && (
              <SummaryViewer sections={currentItem.data} title={currentItem.title} topic={currentItem.topic} />
            )}
            {currentItem.type === 'feynman' && (
              <FeynmanViewer steps={currentItem.data} title={currentItem.title} topic={currentItem.topic} />
            )}
            {currentItem.type === 'cornell' && (
              <CornellViewer note={currentItem.data} title={currentItem.title} topic={currentItem.topic} />
            )}
            {currentItem.type === 'mindmap' && (
              <MindMapViewer data={currentItem.data} title={currentItem.title} topic={currentItem.topic} />
            )}
            {currentItem.type === 'spaced' && (
              <SpacedRepetitionViewer sessions={currentItem.data} title={currentItem.title} topic={currentItem.topic} />
            )}
            {currentItem.type === 'recall' && (
              <ActiveRecallViewer questions={currentItem.data} title={currentItem.title} topic={currentItem.topic} />
            )}
          </div>
        </div>

        {/* Navigation Mobile (si hay múltiples items) */}
        {items.length > 1 && (
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border flex gap-3">
            <button
              onClick={handlePrevious}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-surfaceHighlight hover:bg-border text-primary rounded-xl transition-colors font-medium"
            >
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
              <span>Anterior</span>
            </button>
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-accent hover:bg-accent/90 text-white rounded-xl transition-colors font-medium"
            >
              <span>Siguiente</span>
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Desktop: Sidebar panel
  return (
    <div 
      className="w-full lg:w-[500px] xl:w-[600px] bg-background border-l-2 border-border shadow-2xl h-full flex flex-col"
      style={{ boxSizing: 'border-box', maxWidth: '100vw' }}
    >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-border bg-surface flex-shrink-0" style={{ boxSizing: 'border-box' }}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-accent/10 rounded-lg text-accent flex-shrink-0">
              {getIcon(currentItem.type)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-primary truncate">{currentItem.title}</h3>
              <p className="text-xs text-secondary whitespace-nowrap">
                {currentIndex + 1} de {items.length} previsualizaciones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surfaceHighlight rounded-lg text-secondary hover:text-primary transition-colors flex-shrink-0"
            title="Cerrar"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        {items.length > 1 && (
          <div className="flex items-center justify-between p-2 bg-surface border-b border-border flex-shrink-0" style={{ boxSizing: 'border-box' }}>
            <button
              onClick={handlePrevious}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surfaceHighlight hover:bg-border text-secondary hover:text-primary transition-colors text-sm font-medium flex-shrink-0"
            >
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
              <span>Anterior</span>
            </button>
            
            <div className="flex gap-1 flex-shrink-0">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-accent w-6'
                      : 'bg-border hover:bg-secondary'
                  }`}
                  title={`Ir a ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surfaceHighlight hover:bg-border text-secondary hover:text-primary transition-colors text-sm font-medium flex-shrink-0"
            >
              <span>Siguiente</span>
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        )}

        {/* Content - altura dinámica basada en si hay navegación */}
        <div 
          className={`overflow-y-auto overflow-x-hidden preview-panel-content ${items.length > 1 ? 'h-[calc(100vh-9rem)]' : 'h-[calc(100vh-5rem)]'}`}
          style={{ boxSizing: 'border-box', padding: '1rem', maxWidth: '100%' }}
        >
          {currentItem.type === 'flashcards' && (
            <FlashcardViewer
              cards={currentItem.data}
              title={currentItem.title}
            />
          )}
          {currentItem.type === 'quiz' && (
            <QuizViewer
              questions={currentItem.data}
              title={currentItem.title}
            />
          )}
          {currentItem.type === 'pomodoro' && (
            <PomodoroViewer
              sessions={currentItem.data}
              title={currentItem.title}
            />
          )}
          {currentItem.type === 'summary' && (
            <SummaryViewer
              sections={currentItem.data}
              title={currentItem.title}
            />
          )}
          {currentItem.type === 'feynman' && (
            <FeynmanViewer
              steps={currentItem.data}
              title={currentItem.title}
              topic={currentItem.topic}
            />
          )}
          {currentItem.type === 'cornell' && (
            <CornellViewer
              note={currentItem.data}
              title={currentItem.title}
              topic={currentItem.topic}
            />
          )}
          {currentItem.type === 'mindmap' && (
            <MindMapViewer
              centralTopic={currentItem.data.centralTopic}
              nodes={currentItem.data.nodes}
              title={currentItem.title}
            />
          )}
          {currentItem.type === 'spaced' && (
            <SpacedRepetitionViewer
              sessions={currentItem.data}
              title={currentItem.title}
              topic={currentItem.topic}
            />
          )}
          {currentItem.type === 'recall' && (
            <ActiveRecallViewer
              questions={currentItem.data}
              title={currentItem.title}
              topic={currentItem.topic}
            />
          )}
        </div>
      </div>
  );
};

export default PreviewPanel;
