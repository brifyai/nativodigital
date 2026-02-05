
import React from 'react';
import {
  Add as PlusIcon,
  ChatBubbleOutline as MessageIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  School as SchoolIcon,
  Delete as DeleteIcon,
  Psychology as BrainIcon,
  TrendingUp as TrendingUpIcon,
  Bookmark as BookmarkIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { ChatSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (e: React.MouseEvent, id: string) => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  onOpenStudyTools?: () => void;
  onOpenProgress?: () => void;
  onOpenLibrary?: () => void;
  onOpenWeakTopics?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenHelp,
  onOpenSettings,
  onOpenStudyTools,
  onOpenProgress,
  onOpenLibrary,
  onOpenWeakTopics
}) => {
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-40 w-72 bg-surface transform transition-transform duration-300 ease-in-out border-r border-border flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 ${!isOpen && 'md:w-0 md:border-none md:overflow-hidden'}`}
    >
      <div className="p-4 flex items-center justify-between">
         <button onClick={toggleSidebar} className="p-2 hover:bg-surfaceHighlight rounded-full text-primary md:hidden">
            <MenuIcon sx={{ fontSize: 20 }} />
          </button>
          <div className="flex items-center gap-2 text-primary font-medium">
             <SchoolIcon className="text-accent" />
             <span className="font-bold tracking-tight text-lg">Nativo Digital</span>
          </div>
      </div>

      <div className="px-4 mb-4">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center gap-3 bg-surfaceHighlight hover:bg-border text-primary px-4 py-3 rounded-full transition-colors text-sm font-medium shadow-sm"
        >
          <PlusIcon sx={{ fontSize: 18 }} />
          Nuevo Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <div className="text-xs font-medium text-secondary px-3 py-2">Recientes</div>
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`group relative w-full text-left flex items-center gap-3 px-3 py-2 rounded-full text-sm cursor-pointer transition-colors ${
              currentSessionId === session.id 
                ? 'bg-accent/20 text-accent font-medium' 
                : 'text-secondary hover:bg-surfaceHighlight hover:text-primary'
            }`}
          >
            <MessageIcon sx={{ fontSize: 16 }} className="flex-shrink-0" />
            <span className="truncate flex-1 pr-6">{session.title}</span>
            
            <button 
                onClick={(e) => onDeleteSession(e, session.id)}
                className={`absolute right-2 p-1 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-all ${
                    currentSessionId === session.id 
                    ? 'opacity-100 text-accent' 
                    : 'opacity-0 group-hover:opacity-100 text-secondary'
                }`}
                title="Eliminar chat"
            >
                <DeleteIcon sx={{ fontSize: 14 }} />
            </button>
          </div>
        ))}
        {sessions.length === 0 && (
           <div className="text-secondary text-sm px-4 py-4 text-center italic">
             No hay historial.
           </div>
        )}
      </div>

      <div className="p-3 border-t border-border mt-auto">
         {onOpenStudyTools && (
           <button 
              onClick={onOpenStudyTools}
              className="w-full flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-md text-sm transition-colors mb-1"
           >
              <BrainIcon sx={{ fontSize: 18 }} />
              <span>Herramientas de Estudio</span>
           </button>
         )}
         {onOpenProgress && (
           <button 
              onClick={onOpenProgress}
              className="w-full flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-md text-sm transition-colors mb-1"
           >
              <TrendingUpIcon sx={{ fontSize: 18 }} />
              <span>Mi Progreso</span>
           </button>
         )}
         {onOpenLibrary && (
           <button 
              onClick={onOpenLibrary}
              className="w-full flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-md text-sm transition-colors mb-1"
           >
              <BookmarkIcon sx={{ fontSize: 18 }} />
              <span>Mi Biblioteca</span>
           </button>
         )}
         {onOpenWeakTopics && (
           <button 
              onClick={onOpenWeakTopics}
              className="w-full flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-md text-sm transition-colors mb-1"
           >
              <WarningIcon sx={{ fontSize: 18 }} />
              <span>Temas Débiles</span>
           </button>
         )}
         <button 
            onClick={onOpenHelp}
            className="w-full flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-md text-sm transition-colors"
         >
            <HelpIcon sx={{ fontSize: 18 }} />
            <span>Ayuda</span>
         </button>
         <button 
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-md text-sm transition-colors"
         >
            <SettingsIcon sx={{ fontSize: 18 }} />
            <span>Ajustes</span>
         </button>
         <div className="px-3 py-2 text-xs text-secondary mt-2">
            Educación Libre y Gratuita
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
