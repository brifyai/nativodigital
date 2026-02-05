import React, { useState } from 'react';
import {
  Psychology as RecallIcon,
  Visibility as ShowIcon,
  VisibilityOff as HideIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

interface RecallQuestion {
  question: string;
  answer: string;
  hint?: string;
}

interface ActiveRecallViewerProps {
  questions: RecallQuestion[];
  title?: string;
  topic?: string;
}

const ActiveRecallViewer: React.FC<ActiveRecallViewerProps> = ({ questions, title, topic }) => {
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [masteredQuestions, setMasteredQuestions] = useState<Set<number>>(new Set());

  const toggleAnswer = (index: number) => {
    const newRevealed = new Set(revealedAnswers);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedAnswers(newRevealed);
  };

  const toggleMastered = (index: number) => {
    const newMastered = new Set(masteredQuestions);
    if (newMastered.has(index)) {
      newMastered.delete(index);
    } else {
      newMastered.add(index);
    }
    setMasteredQuestions(newMastered);
  };

  const progress = (masteredQuestions.size / questions.length) * 100;

  return (
    <div className="w-full p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-primary flex items-center gap-2 mb-1">
          <RecallIcon className="text-indigo-500" sx={{ fontSize: 20 }} />
          <span>{title || 'Practica Recordar'}</span>
        </h3>
        {topic && (
          <p className="text-sm text-secondary mb-3">Tema: {topic}</p>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-secondary">Dominadas</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {masteredQuestions.size} de {questions.length}
            </span>
          </div>
          <div className="h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, index) => {
          const isRevealed = revealedAnswers.has(index);
          const isMastered = masteredQuestions.has(index);

          return (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all ${
                isMastered
                  ? 'border-green-400 dark:border-green-600'
                  : 'border-indigo-200 dark:border-indigo-700'
              }`}
            >
              <div className="p-4">
                {/* Question */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-300">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary leading-relaxed">
                      {q.question}
                    </p>
                    {q.hint && !isRevealed && (
                      <p className="text-xs text-secondary italic mt-2">
                        💡 Pista: {q.hint}
                      </p>
                    )}
                  </div>
                  {isMastered && (
                    <CheckIcon className="text-green-500 flex-shrink-0" sx={{ fontSize: 20 }} />
                  )}
                </div>

                {/* Answer (revealed) */}
                {isRevealed && (
                  <div className="mb-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1 uppercase tracking-wide">
                      Respuesta:
                    </p>
                    <p className="text-sm text-primary leading-relaxed whitespace-pre-wrap">
                      {q.answer}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAnswer(index)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium text-sm transition-all"
                  >
                    {isRevealed ? (
                      <>
                        <HideIcon sx={{ fontSize: 16 }} />
                        <span>Ocultar</span>
                      </>
                    ) : (
                      <>
                        <ShowIcon sx={{ fontSize: 16 }} />
                        <span>Ver respuesta</span>
                      </>
                    )}
                  </button>

                  {isRevealed && (
                    <button
                      onClick={() => toggleMastered(index)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                        isMastered
                          ? 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <CheckIcon sx={{ fontSize: 16 }} />
                      <span>{isMastered ? 'Dominada' : 'Marcar'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {masteredQuestions.size === questions.length && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl border-2 border-green-300 dark:border-green-700">
          <p className="text-center text-sm font-bold text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
            <CheckIcon sx={{ fontSize: 20 }} />
            <span>¡Excelente! Has dominado todas las preguntas</span>
          </p>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-4 p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg border border-indigo-300 dark:border-indigo-700">
        <p className="text-xs text-indigo-800 dark:text-indigo-200">
          <strong>Practica Recordar:</strong> Intenta responder cada pregunta antes de ver la respuesta. Esto fortalece la memoria y mejora la retención.
        </p>
      </div>
    </div>
  );
};

export default ActiveRecallViewer;
