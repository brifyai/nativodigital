import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PreviewItem } from '../components/PreviewPanel';

interface PreviewContextType {
  previewItems: PreviewItem[];
  isPanelOpen: boolean;
  addPreviewItem: (item: PreviewItem) => void;
  removePreviewItem: (id: string) => void;
  clearPreviewItems: () => void;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export const PreviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const addPreviewItem = useCallback((item: PreviewItem) => {
    setPreviewItems((prev) => {
      // Remove existing item with same messageId if exists
      const filtered = prev.filter(i => i.messageId !== item.messageId || i.type !== item.type);
      return [...filtered, item];
    });
    // Panel siempre abierto cuando hay items
    setIsPanelOpen(true);
  }, []);

  const removePreviewItem = useCallback((id: string) => {
    setPreviewItems((prev) => prev.filter(item => item.id !== id));
  }, []);

  const clearPreviewItems = useCallback(() => {
    setPreviewItems([]);
    setIsPanelOpen(false);
  }, []);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);
  const togglePanel = useCallback(() => setIsPanelOpen(prev => !prev), []);

  return (
    <PreviewContext.Provider
      value={{
        previewItems,
        isPanelOpen,
        addPreviewItem,
        removePreviewItem,
        clearPreviewItems,
        openPanel,
        closePanel,
        togglePanel,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error('usePreview must be used within PreviewProvider');
  }
  return context;
};
