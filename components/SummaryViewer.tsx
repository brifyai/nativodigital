import React, { useState } from 'react';
import {
  Description as SummaryIcon,
  ExpandMore as ExpandIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';

interface SummarySection {
  title: string;
  content: string;
  keyPoints?: string[];
}

interface SummaryViewerProps {
  sections: SummarySection[];
  title?: string;
  topic?: string;
}

const SummaryViewer: React.FC<SummaryViewerProps> = ({ sections, title, topic }) => {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [readSections, setReadSections] = useState<Set<number>>(new Set());
  const [currentSection, setCurrentSection] = useState(0);

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
      setReadSections(prev => new Set(prev).add(index));
    }
    setExpandedSections(newExpanded);
    setCurrentSection(index);
  };

  const toggleAll = () => {
    if (expandedSections.size === sections.length) {
      setExpandedSections(new Set());
    } else {
      const allIndices = sections.map((_, i) => i);
      setExpandedSections(new Set(allIndices));
      setReadSections(new Set(allIndices));
    }
  };

  const goToNext = () => {
    if (currentSection < sections.length - 1) {
      const nextIndex = currentSection + 1;
      setCurrentSection(nextIndex);
      setExpandedSections(new Set([nextIndex]));
      setReadSections(prev => new Set(prev).add(nextIndex));
    }
  };

  const goToPrev = () => {
    if (currentSection > 0) {
      const prevIndex = currentSection - 1;
      setCurrentSection(prevIndex);
      setExpandedSections(new Set([prevIndex]));
    }
  };

  const progress = (readSections.size / sections.length) * 100;
  const isComplete = readSections.size === sections.length;

  const sectionColors = [
    { bg: 'from-pink-200 to-pink-100 dark:from-pink-900/40 dark:to-pink-800/20', border: 'border-pink-400 dark:border-pink-600', icon: '🌸', accent: 'bg-pink-500' },
    { bg: 'from-blue-200 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/20', border: 'border-blue-400 dark:border-blue-600', icon: '🌊', accent: 'bg-blue-500' },
    { bg: 'from-green-200 to-green-100 dark:from-green-900/40 dark:to-green-800/20', border: 'border-green-400 dark:border-green-600', icon: '🌿', accent: 'bg-green-500' },
    { bg: 'from-purple-200 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/20', border: 'border-purple-400 dark:border-purple-600', icon: '🦄', accent: 'bg-purple-500' },
    { bg: 'from-amber-200 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/20', border: 'border-amber-400 dark:border-amber-600', icon: '⭐', accent: 'bg-amber-500' },
    { bg: 'from-red-200 to-red-100 dark:from-red-900/40 dark:to-red-800/20', border: 'border-red-400 dark:border-red-600', icon: '🎈', accent: 'bg-red-500' },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-shrink-0 p-4 border-b-4 border-indigo-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <SummaryIcon className="text-white" sx={{ fontSize: 24 }} />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">
                {title || 'Resumen Fácil'}
              </h3>
              {topic && (
                <p className="text-xs text-secondary font-medium">
                  📚 {topic}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={toggleAll}
            className="text-xs px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            {expandedSections.size === sections.length ? '📕 Cerrar' : '📖 Ver Todo'}
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-primary flex items-center gap-1">
              <StarIcon className="text-yellow-500" sx={{ fontSize: 16 }} />
              Progreso: {readSections.size} de {sections.length}
            </span>
            {isComplete && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold animate-bounce">
                <TrophyIcon sx={{ fontSize: 16 }} />
                ¡Completado!
              </span>
            )}
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sections.map((section, index) => {
          const isExpanded = expandedSections.has(index);
          const isRead = readSections.has(index);
          const isCurrent = currentSection === index;
          const colorScheme = sectionColors[index % sectionColors.length];

          return (
            <div
              key={index}
              className={`rounded-2xl border-3 bg-gradient-to-br ${colorScheme.bg} ${colorScheme.border} overflow-hidden transition-all duration-300 ${
                isExpanded ? 'shadow-2xl scale-[1.02]' : 'shadow-lg hover:shadow-xl hover:scale-[1.01]'
              } ${isCurrent ? 'ring-4 ring-indigo-400 dark:ring-indigo-600' : ''}`}
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/40 dark:hover:bg-black/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${colorScheme.accent} flex items-center justify-center font-bold text-white shadow-lg text-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                    {colorScheme.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-base text-primary flex items-center gap-2">
                      {section.title}
                      {isRead && (
                        <CheckIcon className="text-green-500" sx={{ fontSize: 18 }} />
                      )}
                    </h4>
                    <p className="text-xs text-secondary">
                      {isExpanded ? '👇 Leyendo...' : '👆 Toca para leer'}
                    </p>
                  </div>
                </div>
                <ExpandIcon
                  className={`text-secondary transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  sx={{ fontSize: 28 }}
                />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  {section.content && (
                    <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-xl shadow-inner border-2 border-white/50 dark:border-gray-700/50">
                      <div className="flex items-start gap-2 mb-2">
                        <LightbulbIcon className="text-yellow-500 flex-shrink-0" sx={{ fontSize: 20 }} />
                        <p className="text-sm font-semibold text-secondary uppercase tracking-wide">
                          Explicación:
                        </p>
                      </div>
                      <p className="text-base text-primary leading-relaxed font-medium">
                        {section.content}
                      </p>
                    </div>
                  )}

                  {section.keyPoints && section.keyPoints.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <StarIcon className="text-yellow-500" sx={{ fontSize: 20 }} />
                        <p className="text-sm font-bold text-primary">
                          ¡Puntos Importantes!
                        </p>
                      </div>
                      <ul className="space-y-2">
                        {section.keyPoints.map((point, pointIndex) => (
                          <li
                            key={pointIndex}
                            className="flex items-start gap-3 text-sm text-primary bg-white/70 dark:bg-gray-800/70 p-3 rounded-xl shadow-md border-2 border-white/50 dark:border-gray-700/50 hover:scale-[1.02] transition-transform"
                          >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-md">
                              <CheckIcon className="text-white" sx={{ fontSize: 16 }} />
                            </div>
                            <span className="font-medium">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t-2 border-white/50 dark:border-gray-700/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrev();
                      }}
                      disabled={currentSection === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        currentSection === 0
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      }`}
                    >
                      <PrevIcon sx={{ fontSize: 20 }} />
                      Anterior
                    </button>
                    <span className="text-xs font-bold text-secondary">
                      {index + 1} de {sections.length}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                      disabled={currentSection === sections.length - 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        currentSection === sections.length - 1
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      }`}
                    >
                      Siguiente
                      <NextIcon sx={{ fontSize: 20 }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isComplete && (
          <div className="mt-4 p-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-2xl shadow-2xl text-center animate-in zoom-in duration-500">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">
              ¡Felicitaciones!
            </h3>
            <p className="text-white/90 font-medium">
              ¡Has leído todas las secciones! Eres increíble 🌟
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryViewer;
