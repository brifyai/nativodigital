import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SavedContent, TopicPerformance } from '../types';

interface SavedContentContextType {
  savedContent: SavedContent[];
  topicPerformance: TopicPerformance[];
  addSavedContent: (content: Omit<SavedContent, 'id' | 'createdAt' | 'reviewCount' | 'lastReviewed'>) => void;
  removeSavedContent: (id: string) => void;
  toggleFavorite: (id: string) => void;
  markAsReviewed: (id: string) => void;
  updateTopicPerformance: (topic: string, subject: string, score: number) => void;
  getWeakTopics: () => TopicPerformance[];
  getSavedContentByType: (type: SavedContent['type']) => SavedContent[];
  searchSavedContent: (query: string) => SavedContent[];
}

const SavedContentContext = createContext<SavedContentContextType | undefined>(undefined);

export const useSavedContent = () => {
  const context = useContext(SavedContentContext);
  if (!context) {
    throw new Error('useSavedContent must be used within SavedContentProvider');
  }
  return context;
};

interface SavedContentProviderProps {
  children: ReactNode;
}

export const SavedContentProvider: React.FC<SavedContentProviderProps> = ({ children }) => {
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [topicPerformance, setTopicPerformance] = useState<TopicPerformance[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('nativo_saved_content');
    if (stored) {
      try {
        setSavedContent(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading saved content:', error);
      }
    }

    const storedPerformance = localStorage.getItem('nativo_topic_performance');
    if (storedPerformance) {
      try {
        setTopicPerformance(JSON.parse(storedPerformance));
      } catch (error) {
        console.error('Error loading topic performance:', error);
      }
    }
  }, []);

  // Save to localStorage whenever content changes
  useEffect(() => {
    localStorage.setItem('nativo_saved_content', JSON.stringify(savedContent));
  }, [savedContent]);

  useEffect(() => {
    localStorage.setItem('nativo_topic_performance', JSON.stringify(topicPerformance));
  }, [topicPerformance]);

  const addSavedContent = (content: Omit<SavedContent, 'id' | 'createdAt' | 'reviewCount' | 'lastReviewed'>) => {
    const newContent: SavedContent = {
      ...content,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      reviewCount: 0,
      lastReviewed: undefined,
    };
    setSavedContent(prev => [newContent, ...prev]);
  };

  const removeSavedContent = (id: string) => {
    setSavedContent(prev => prev.filter(item => item.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setSavedContent(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const markAsReviewed = (id: string) => {
    setSavedContent(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            lastReviewed: Date.now(), 
            reviewCount: item.reviewCount + 1 
          } 
        : item
    ));
  };

  const updateTopicPerformance = (topic: string, subject: string, score: number) => {
    setTopicPerformance(prev => {
      const existing = prev.find(p => p.topic === topic && p.subject === subject);
      
      if (existing) {
        const newAttempts = existing.attempts + 1;
        const newSuccesses = score >= 60 ? existing.successes + 1 : existing.successes;
        const newFailures = score < 60 ? existing.failures + 1 : existing.failures;
        const newAverageScore = ((existing.averageScore * existing.attempts) + score) / newAttempts;
        
        return prev.map(p => 
          p.topic === topic && p.subject === subject
            ? {
                ...p,
                attempts: newAttempts,
                successes: newSuccesses,
                failures: newFailures,
                lastAttempt: Date.now(),
                averageScore: newAverageScore,
                needsReview: newAverageScore < 70 || newFailures > newSuccesses,
              }
            : p
        );
      } else {
        const newPerformance: TopicPerformance = {
          topic,
          subject,
          attempts: 1,
          successes: score >= 60 ? 1 : 0,
          failures: score < 60 ? 1 : 0,
          lastAttempt: Date.now(),
          averageScore: score,
          needsReview: score < 70,
        };
        return [...prev, newPerformance];
      }
    });
  };

  const getWeakTopics = () => {
    return topicPerformance
      .filter(p => p.needsReview && p.attempts >= 2)
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 5);
  };

  const getSavedContentByType = (type: SavedContent['type']) => {
    return savedContent.filter(item => item.type === type);
  };

  const searchSavedContent = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return savedContent.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.topic.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      (item.subject && item.subject.toLowerCase().includes(lowerQuery))
    );
  };

  return (
    <SavedContentContext.Provider
      value={{
        savedContent,
        topicPerformance,
        addSavedContent,
        removeSavedContent,
        toggleFavorite,
        markAsReviewed,
        updateTopicPerformance,
        getWeakTopics,
        getSavedContentByType,
        searchSavedContent,
      }}
    >
      {children}
    </SavedContentContext.Provider>
  );
};
