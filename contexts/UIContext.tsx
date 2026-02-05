import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ToastType } from '../components/Toast';

interface UIContextType {
  // Theme
  theme: 'light' | 'dark';
  highContrast: boolean;
  toggleTheme: () => void;
  toggleHighContrast: () => void;
  
  // Sidebar
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  
  // Modals
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  helpTab: 'start' | 'tools' | 'models';
  setHelpTab: (tab: 'start' | 'tools' | 'models') => void;
  
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  
  showStudyTools: boolean;
  setShowStudyTools: (show: boolean) => void;
  
  showProgress: boolean;
  setShowProgress: (show: boolean) => void;
  
  showShare: boolean;
  setShowShare: (show: boolean) => void;
  
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  
  isModelMenuOpen: boolean;
  setIsModelMenuOpen: (open: boolean) => void;
  
  // Toast
  toast: { message: string; type: ToastType } | null;
  showToast: (message: string, type?: ToastType) => void;
  clearToast: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('nativo_theme') as 'light' | 'dark') || 'light';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('nativo_high_contrast') === 'true';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    localStorage.setItem('nativo_theme', theme);
    localStorage.setItem('nativo_high_contrast', String(highContrast));
  }, [theme, highContrast]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleHighContrast = async () => {
    setHighContrast(prev => !prev);
    const { showToast: showSwalToast } = await import('../utils/sweetAlert');
    showSwalToast(!highContrast ? 'Alto contraste activado' : 'Modo normal activado', 'info');
  };

  // Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modals
  const [showHelp, setShowHelp] = useState(false);
  const [helpTab, setHelpTab] = useState<'start' | 'tools' | 'models'>('start');
  const [showSettings, setShowSettings] = useState(false);
  const [showStudyTools, setShowStudyTools] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('nativo_onboarding_completed');
  });

  // Toast
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'h') {
          e.preventDefault();
          setShowHelp(true);
        } else if (e.key === 'b') {
          e.preventDefault();
          setIsSidebarOpen(prev => !prev);
        }
      }
      
      if (e.key === 'Escape') {
        setShowHelp(false);
        setShowSettings(false);
        setIsModelMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <UIContext.Provider
      value={{
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
        clearToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
