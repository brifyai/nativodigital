import React from 'react';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  MenuBook as BookIcon,
  Psychology as PsychologyIcon,
  Timer as TimerIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useSavedContent } from '../contexts/SavedContentContext';
import { TopicPerformance } from '../types';

interface WeakTopicsAnalysisProps {
  onClose: () => void;
  onReviewTopic: (topic: string, subject: string) => void;
}

const WeakTopicsAnalysis: React.FC<WeakTopicsAnalysisProps> = ({ onClose, onReviewTopic }) => {
  const { topicPerformance, getWeakTopics } = useSavedContent();
  
  const weakTopics = getWeakTopics();
  const allTopics = topicPerformance.sort((a, b) => a.averageScore - b.averageScore);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10';
    if (score >= 60) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  const getScoreBorder = (score: number) => {
    if (score >= 80) return 'border-green-500/30';
    if (score >= 60) return 'border-yellow-500/30';
    return 'border-red-500/30';
  };

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

  const getRecommendation = (performance: TopicPerformance) => {
    if (performance.averageScore < 50) {
      return '🔴 Necesitas repasar urgentemente este tema';
    } else if (performance.averageScore < 70) {
      return '🟡 Practica más para mejorar tu comprensión';
    } else if (performance.averageScore < 80) {
      return '🟢 Vas bien, un repaso más y lo dominarás';
    }
    return '✅ ¡Excelente! Sigue así';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-surface border border-border rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500 my-8">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-orange-500/10 to-red-500/10">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500">
              <PsychologyIcon sx={{ fontSize: 24 }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary">Análisis de Temas Débiles</h3>
              <p className="text-xs text-secondary">
                {weakTopics.length > 0 
                  ? `${weakTopics.length} temas necesitan refuerzo`
                  : 'No hay temas débiles detectados'
                }
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary p-1 hover:bg-surfaceHighlight rounded-full transition-colors">
            <CloseIcon sx={{ fontSize: 24 }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {allTopics.length === 0 ? (
            <div className="text-center py-12">
              <BarChartIcon sx={{ fontSize: 48 }} className="text-secondary/50 mb-4" />
              <p className="text-secondary text-lg mb-2">No hay datos suficientes</p>
              <p className="text-secondary/70 text-sm">
                Completa algunos quizzes para ver tu análisis de rendimiento
              </p>
            </div>
          ) : (
            <>
              {/* Weak Topics Section */}
              {weakTopics.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <WarningIcon sx={{ fontSize: 20 }} className="text-orange-500" />
                    <h4 className="font-bold text-primary">Temas que Necesitan Refuerzo</h4>
                  </div>

                  <div className="space-y-4">
                    {weakTopics.map((topic, idx) => (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border-2 ${getScoreBg(topic.averageScore)} ${getScoreBorder(topic.averageScore)}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h5 className="font-bold text-primary text-lg mb-1">{topic.topic}</h5>
                            <p className="text-sm text-secondary mb-2">{topic.subject}</p>
                            <p className="text-xs text-secondary italic">{getRecommendation(topic)}</p>
                          </div>
                          <div className={`text-3xl font-bold ${getScoreColor(topic.averageScore)}`}>
                            {Math.round(topic.averageScore)}%
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-background rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-primary">{topic.attempts}</div>
                            <div className="text-xs text-secondary">Intentos</div>
                          </div>
                          <div className="bg-background rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-green-500">{topic.successes}</div>
                            <div className="text-xs text-secondary">Aciertos</div>
                          </div>
                          <div className="bg-background rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-red-500">{topic.failures}</div>
                            <div className="text-xs text-secondary">Fallos</div>
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-secondary mb-4">
                          <span className="flex items-center gap-1">
                            <TimerIcon sx={{ fontSize: 14 }} />
                            Último intento: {formatDate(topic.lastAttempt)}
                          </span>
                          <span>
                            Tasa de éxito: {Math.round((topic.successes / topic.attempts) * 100)}%
                          </span>
                        </div>

                        {/* Action */}
                        <button
                          onClick={() => onReviewTopic(topic.topic, topic.subject)}
                          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <RefreshIcon sx={{ fontSize: 18 }} />
                          Repasar Ahora
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Topics Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BarChartIcon sx={{ fontSize: 20 }} className="text-accent" />
                  <h4 className="font-bold text-primary">Todos los Temas</h4>
                </div>

                <div className="space-y-3">
                  {allTopics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-surfaceHighlight border border-border hover:border-accent/50 transition-all"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-primary truncate">{topic.topic}</h5>
                          <p className="text-xs text-secondary">{topic.subject}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Score Bar */}
                          <div className="w-32">
                            <div className="flex items-center justify-between text-xs text-secondary mb-1">
                              <span>Promedio</span>
                              <span className={`font-bold ${getScoreColor(topic.averageScore)}`}>
                                {Math.round(topic.averageScore)}%
                              </span>
                            </div>
                            <div className="h-2 bg-border rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  topic.averageScore >= 80 ? 'bg-green-500' :
                                  topic.averageScore >= 60 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${topic.averageScore}%` }}
                              />
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="text-center">
                            <div className="text-sm font-bold text-primary">{topic.attempts}</div>
                            <div className="text-xs text-secondary">intentos</div>
                          </div>

                          {/* Action */}
                          {topic.needsReview && (
                            <button
                              onClick={() => onReviewTopic(topic.topic, topic.subject)}
                              className="p-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-lg transition-colors"
                              title="Repasar"
                            >
                              <RefreshIcon sx={{ fontSize: 18 }} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <BookIcon sx={{ fontSize: 20 }} className="text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-primary mb-1">Consejos para Mejorar</h5>
                    <ul className="text-sm text-secondary space-y-1 list-disc list-inside">
                      <li>Repasa los temas débiles al menos 3 veces por semana</li>
                      <li>Usa diferentes métodos de estudio (flashcards, resúmenes, mapas mentales)</li>
                      <li>Practica con quizzes hasta alcanzar 80% o más</li>
                      <li>Pide ayuda si un tema sigue siendo difícil después de varios intentos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeakTopicsAnalysis;
