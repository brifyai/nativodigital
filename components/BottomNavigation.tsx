import React from 'react';
import {
  ChatBubbleOutline as ChatIcon,
  Psychology as BrainIcon,
  Bookmark as BookmarkIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface BottomNavigationProps {
  onOpenStudyTools: () => void;
  onOpenLibrary: () => void;
  onNewChat: () => void;
  currentView?: 'chat' | 'tools' | 'library';
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  onOpenStudyTools,
  onOpenLibrary,
  onNewChat,
  currentView = 'chat'
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border h-16 flex items-center justify-around px-2 z-40 md:hidden safe-area-bottom">
      {/* Chat */}
      <button
        onClick={() => {/* Already in chat */}}
        className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${
          currentView === 'chat'
            ? 'text-accent bg-accent/10'
            : 'text-secondary hover:text-primary hover:bg-surfaceHighlight'
        }`}
      >
        <ChatIcon sx={{ fontSize: 24 }} />
        <span className="text-xs font-medium">Chat</span>
      </button>

      {/* Herramientas */}
      <button
        onClick={onOpenStudyTools}
        className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${
          currentView === 'tools'
            ? 'text-accent bg-accent/10'
            : 'text-secondary hover:text-primary hover:bg-surfaceHighlight'
        }`}
      >
        <BrainIcon sx={{ fontSize: 24 }} />
        <span className="text-xs font-medium">Herramientas</span>
      </button>

      {/* Biblioteca */}
      <button
        onClick={onOpenLibrary}
        className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${
          currentView === 'library'
            ? 'text-accent bg-accent/10'
            : 'text-secondary hover:text-primary hover:bg-surfaceHighlight'
        }`}
      >
        <BookmarkIcon sx={{ fontSize: 24 }} />
        <span className="text-xs font-medium">Biblioteca</span>
      </button>

      {/* Nuevo Chat */}
      <button
        onClick={onNewChat}
        className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl text-white bg-gradient-to-br from-accent to-purple-600 hover:shadow-lg transition-all active:scale-95"
      >
        <AddIcon sx={{ fontSize: 24 }} />
        <span className="text-xs font-medium">Nuevo</span>
      </button>
    </nav>
  );
};

export default BottomNavigation;
