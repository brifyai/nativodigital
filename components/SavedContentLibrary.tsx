import React, { useState } from 'react';
import {
  Close as CloseIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Style as StyleIcon,
  Quiz as QuizIcon,
  Summarize as SummarizeIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarTodayIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useSavedContent } from '../contexts/SavedContentContext';
import { SavedContent } from '../types';

interface SavedContentLibraryProps {
  onClose: () => void;
  onViewContent: (content: SavedContent) => void;
}

const SavedContentLibrary: React.FC<SavedContentLibraryProps> = ({ onClose, onViewContent }) => {
  const { 
    savedContent, 
    removeSavedContent, 
    toggleFavorite, 
    markAsReviewed,
    searchSavedContent 
  } = useSavedContent();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<SavedContent['type'] | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const getTypeIcon = (type: SavedContent['type']) => {
    switch (type) {
      case 'flashcards': return StyleIcon;
      case 'quiz': return QuizIcon;
      case 'summary': return SummarizeIcon;
      case 'notes': return DescriptionIcon;
      case 'plan': return CalendarTodayIcon;
      default: return DescriptionIcon;
    }
  };

  const getTypeColor = (type: SavedContent['type']) => {
    switch (type) {
      case 'flashcards': return 'text-blue-500';
      case 'quiz': return 'text-purple-500';
      case 'summary': return 'text-green-500';
      case 'notes': return 'text-orange-500';
      case 'plan': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  };

  const getTypeBg = (type: SavedContent['type']) => {
    switch (type) {
      case 'flashcards': return 'bg-blue-500/10';
      case 'quiz': return 'bg-purple-500/10';
      case 'summary': return 'bg-green-500/10';
      case 'notes': return 'bg-orange-500/10';
      case 'plan': return 'bg-pink-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const getTypeLabel = (type: SavedContent['type']) => {
    switch (type) {
      case 'flashcards': return 'Tarjetas';
      case 'quiz': return 'Quiz';
      case 'summary': return 'Resumen';
      case 'notes': return 'Apuntes';
      case 'plan': return 'Plan';
      default: return 'Otro';
    }
  };

  const filteredContent = savedContent
    .filter(item => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (showFavoritesOnly && !item.isFavorite) return false;
      if (searchQuery) {
        return searchSavedContent(searchQuery).some(s => s.id === item.id);
      }
      return true;
    })
    .sort((a, b) => {
      // Favoritos primero
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      // Luego por fecha
      return b.createdAt - a.createdAt;
    });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-surface border border-border rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500 my-8">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-accent/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="bg-accent/20 p-2 rounded-lg text-accent">
              <BookmarkIcon sx={{ fontSize: 24 }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary">Mi Biblioteca</h3>
              <p className="text-xs text-secondary">{filteredContent.length} elementos guardados</p>
            </div>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary p-1 hover:bg-surfaceHighlight rounded-full transition-colors">
            <CloseIcon sx={{ fontSize: 24 }} />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-border space-y-4">
          {/* Search */}
          <div className="relative">
            <SearchIcon sx={{ fontSize: 20 }} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, tema o etiqueta..."
              className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:border-accent outline-none transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                showFavoritesOnly
                  ? 'bg-accent text-white'
                  : 'bg-surfaceHighlight text-primary hover:bg-border'
              }`}
            >
              <BookmarkIcon sx={{ fontSize: 16 }} className="inline mr-1" />
              Favoritos
            </button>

            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-primary text-background'
                  : 'bg-surfaceHighlight text-primary hover:bg-border'
              }`}
            >
              Todos
            </button>

            {(['flashcards', 'quiz', 'summary', 'notes', 'plan'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterType === type
                    ? 'bg-primary text-background'
                    : 'bg-surfaceHighlight text-primary hover:bg-border'
                }`}
              >
                {getTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <BookmarkBorderIcon sx={{ fontSize: 48 }} className="text-secondary/50 mb-4" />
              <p className="text-secondary text-lg mb-2">No hay contenido guardado</p>
              <p className="text-secondary/70 text-sm">
                {searchQuery 
                  ? 'Intenta con otra búsqueda'
                  : 'Guarda respuestas importantes para repasarlas después'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredContent.map(item => {
                const Icon = getTypeIcon(item.type);
                return (
                  <div
                    key={item.id}
                    className="bg-surfaceHighlight border border-border rounded-2xl p-4 hover:border-accent/50 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 ${getTypeBg(item.type)} rounded-xl flex items-center justify-center ${getTypeColor(item.type)} flex-shrink-0`}>
                        <Icon sx={{ fontSize: 24 }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-bold text-primary text-base line-clamp-1">{item.title}</h4>
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className="text-secondary hover:text-accent transition-colors flex-shrink-0"
                          >
                            {item.isFavorite ? (
                              <BookmarkIcon sx={{ fontSize: 20 }} className="text-accent" />
                            ) : (
                              <BookmarkBorderIcon sx={{ fontSize: 20 }} />
                            )}
                          </button>
                        </div>

                        <p className="text-sm text-secondary mb-3 line-clamp-2">{item.topic}</p>

                        {/* Tags */}
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-background border border-border rounded-lg text-xs text-secondary"
                              >
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="px-2 py-1 text-xs text-secondary">
                                +{item.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-secondary">
                          <span className="flex items-center gap-1">
                            <CalendarTodayIcon sx={{ fontSize: 14 }} />
                            {formatDate(item.createdAt)}
                          </span>
                          {item.reviewCount > 0 && (
                            <span className="flex items-center gap-1">
                              <CheckCircleIcon sx={{ fontSize: 14 }} />
                              Repasado {item.reviewCount}x
                            </span>
                          )}
                          {item.lastReviewed && (
                            <span className="flex items-center gap-1">
                              <TrendingUpIcon sx={{ fontSize: 14 }} />
                              Último: {formatDate(item.lastReviewed)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            markAsReviewed(item.id);
                            onViewContent(item);
                          }}
                          className="p-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors"
                          title="Ver contenido"
                        >
                          <VisibilityIcon sx={{ fontSize: 18 }} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar este contenido?')) {
                              removeSavedContent(item.id);
                            }
                          }}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedContentLibrary;
