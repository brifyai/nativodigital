import React from 'react';
import {
  Close as CloseIcon,
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Celebration as CelebrationIcon,
} from '@mui/icons-material';
import { QuizSession } from '../types';

interface QuizResultsProps {
  session: QuizSession;
  onClose: () => void;
  onRetry?: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ session, onClose, onRetry }) => {
  const correctCount = session.answers.filter((answer, idx) => 
    answer === session.questions[idx].correctAnswer
  ).length;
  const incorrectCount = session.questions.length - correctCount;
  const totalTime = session.timePerQuestion.reduce((a, b) => a + b, 0);
  const avgTime = Math.round(totalTime / session.questions.length);

  const getGrade = (score: number) => {
    if (score >= 90) return { label: '¡Excelente!', color: 'text-green-500', icon: CelebrationIcon };
    if (score >= 70) return { label: 'Muy Bien', color: 'text-blue-500', icon: TrophyIcon };
    if (score >= 50) return { label: 'Bien', color: 'text-yellow-500', icon: TrendingUpIcon };
    return { label: 'Necesitas Repasar', color: 'text-red-500', icon: WarningIcon };
  };

  const grade = getGrade(session.score);
  const GradeIcon = grade.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-surface border border-border rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500 my-8">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-accent/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="bg-accent/20 p-2 rounded-lg text-accent">
              <TrophyIcon sx={{ fontSize: 24 }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary">Resultados del Quiz</h3>
              <p className="text-xs text-secondary">{session.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary p-1 hover:bg-surfaceHighlight rounded-full transition-colors">
            <CloseIcon sx={{ fontSize: 24 }} />
          </button>
        </div>

        {/* Score Card */}
        <div className="p-8 text-center border-b border-border">
          <div className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br ${
            session.score >= 90 ? 'from-green-500 to-emerald-500' :
            session.score >= 70 ? 'from-blue-500 to-cyan-500' :
            session.score >= 50 ? 'from-yellow-500 to-orange-500' :
            'from-red-500 to-pink-500'
          } flex items-center justify-center shadow-2xl animate-in zoom-in duration-500`}>
            <div className="text-white">
              <div className="text-5xl font-bold">{session.score}</div>
              <div className="text-sm font-medium">puntos</div>
            </div>
          </div>

          <div className={`flex items-center justify-center gap-2 mb-2 ${grade.color}`}>
            <GradeIcon sx={{ fontSize: 28 }} />
            <h4 className="text-2xl font-bold">{grade.label}</h4>
          </div>
          
          <p className="text-secondary">
            {correctCount} de {session.questions.length} respuestas correctas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircleIcon sx={{ fontSize: 20 }} className="text-green-500" />
              <span className="text-2xl font-bold text-primary">{correctCount}</span>
            </div>
            <p className="text-xs text-secondary">Correctas</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CancelIcon sx={{ fontSize: 20 }} className="text-red-500" />
              <span className="text-2xl font-bold text-primary">{incorrectCount}</span>
            </div>
            <p className="text-xs text-secondary">Incorrectas</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TimerIcon sx={{ fontSize: 20 }} className="text-accent" />
              <span className="text-2xl font-bold text-primary">{avgTime}s</span>
            </div>
            <p className="text-xs text-secondary">Promedio</p>
          </div>
        </div>

        {/* Question Review */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
            <TrendingUpIcon sx={{ fontSize: 20 }} className="text-accent" />
            Revisión de Respuestas
          </h4>

          <div className="space-y-4">
            {session.questions.map((question, idx) => {
              const userAnswer = session.answers[idx];
              const isCorrect = userAnswer === question.correctAnswer;
              const timeSpent = session.timePerQuestion[idx];

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-2 ${
                    isCorrect
                      ? 'bg-green-500/5 border-green-500/30'
                      : 'bg-red-500/5 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-primary mb-2">{question.question}</p>
                      
                      {userAnswer !== null && (
                        <div className="space-y-1 text-sm">
                          <p className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                            <strong>Tu respuesta:</strong> {String.fromCharCode(65 + userAnswer)}) {question.options[userAnswer]}
                          </p>
                          {!isCorrect && (
                            <p className="text-green-600">
                              <strong>Correcta:</strong> {String.fromCharCode(65 + question.correctAnswer)}) {question.options[question.correctAnswer]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-secondary flex-shrink-0">
                      <TimerIcon sx={{ fontSize: 14 }} />
                      {timeSpent}s
                    </div>
                  </div>

                  {!isCorrect && (
                    <div className="ml-11 p-3 bg-background rounded-lg">
                      <p className="text-xs text-secondary">
                        <strong className="text-primary">Explicación:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border flex gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-3 px-4 bg-surfaceHighlight hover:bg-border text-primary rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshIcon sx={{ fontSize: 20 }} />
              Intentar de Nuevo
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-primary hover:opacity-90 text-background rounded-xl font-bold transition-all"
          >
            Cerrar
          </button>
        </div>

        {/* Motivational Message */}
        {session.score < 70 && (
          <div className="p-4 bg-yellow-500/10 border-t border-yellow-500/30">
            <p className="text-sm text-center text-secondary">
              💡 <strong>Tip:</strong> Repasa los temas donde fallaste y vuelve a intentarlo. ¡La práctica hace al maestro!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResults;
