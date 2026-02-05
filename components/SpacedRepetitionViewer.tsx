import React from 'react';
import {
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckIcon,
  Schedule as TimeIcon,
} from '@mui/icons-material';

interface ReviewSession {
  day: number;
  date: string;
  topics: string[];
  completed?: boolean;
}

interface SpacedRepetitionViewerProps {
  sessions: ReviewSession[];
  title?: string;
  topic?: string;
}

const SpacedRepetitionViewer: React.FC<SpacedRepetitionViewerProps> = ({ sessions, title, topic }) => {
  const completedCount = sessions.filter(s => s.completed).length;
  const progress = (completedCount / sessions.length) * 100;

  return (
    <div className="w-full p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-teal-200 dark:border-teal-800 shadow-xl">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-primary flex items-center gap-2 mb-1">
          <CalendarIcon className="text-teal-500" sx={{ fontSize: 20 }} />
          <span>{title || 'Repasa Cada Día'}</span>
        </h3>
        {topic && (
          <p className="text-sm text-secondary mb-3">Tema: {topic}</p>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-secondary">Progreso</span>
            <span className="font-bold text-teal-600 dark:text-teal-400">
              {completedCount} de {sessions.length} sesiones
            </span>
          </div>
          <div className="h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {sessions.map((session, index) => {
          const isCompleted = session.completed;
          const isFirst = index === 0;
          const isLast = index === sessions.length - 1;

          return (
            <div key={index} className="relative">
              {/* Connector Line */}
              {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-teal-200 dark:bg-teal-700" />
              )}

              <div className={`flex gap-3 ${isCompleted ? 'opacity-60' : ''}`}>
                {/* Day Badge */}
                <div className="flex-shrink-0 relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                    isCompleted
                      ? 'bg-green-500'
                      : isFirst
                      ? 'bg-gradient-to-br from-teal-500 to-cyan-500'
                      : 'bg-teal-400'
                  }`}>
                    {isCompleted ? (
                      <CheckIcon sx={{ fontSize: 24 }} />
                    ) : (
                      <span className="text-sm">D{session.day}</span>
                    )}
                  </div>
                </div>

                {/* Session Card */}
                <div className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : isFirst
                    ? 'bg-white dark:bg-gray-800 border-teal-400 dark:border-teal-600 shadow-md'
                    : 'bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-700'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TimeIcon className="text-teal-600 dark:text-teal-400" sx={{ fontSize: 16 }} />
                      <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase">
                        Día {session.day}
                      </span>
                    </div>
                    <span className="text-xs text-secondary">{session.date}</span>
                  </div>

                  <ul className="space-y-2">
                    {session.topics.map((topicItem, i) => (
                      <li key={i} className="text-sm text-primary flex items-start gap-2">
                        <span className="text-teal-500 flex-shrink-0 mt-0.5">•</span>
                        <span className="break-words leading-relaxed">{topicItem}</span>
                      </li>
                    ))}
                  </ul>

                  {session.objective && (
                    <div className="mt-3 pt-3 border-t border-teal-200 dark:border-teal-700">
                      <p className="text-xs font-medium text-teal-700 dark:text-teal-300 break-words leading-relaxed">
                        🎯 Objetivo: {session.objective.trim()}
                      </p>
                    </div>
                  )}

                  {isFirst && !isCompleted && (
                    <div className="mt-3 pt-3 border-t border-teal-200 dark:border-teal-700">
                      <p className="text-xs font-medium text-teal-700 dark:text-teal-300">
                        📌 Próxima sesión de repaso
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Footer */}
      <div className="mt-4 p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg border border-teal-300 dark:border-teal-700">
        <p className="text-xs text-teal-800 dark:text-teal-200">
          <strong>Repasa Cada Día:</strong> Revisa el material en intervalos crecientes (1, 3, 7, 14, 30 días) para mejorar la retención a largo plazo.
        </p>
      </div>
    </div>
  );
};

export default SpacedRepetitionViewer;
