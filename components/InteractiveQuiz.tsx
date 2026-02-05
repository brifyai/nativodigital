import React, { useState, useEffect } from 'react';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon,
  Refresh as RefreshIcon,
  Bookmark as BookmarkIcon,
  ArrowForward as ArrowForwardIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { QuizQuestion, QuizSession } from '../types';
import { useSavedContent } from '../contexts/SavedContentContext';

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  title: string;
  topic: string;
  subject: string;
  onClose: () => void;
  onComplete: (score: number, session: QuizSession) => void;
}

const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  questions,
  title,
  topic,
  subject,
  onClose,
  onComplete,
}) => {
  const { addSavedContent, updateTopicPerformance } = useSavedContent();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [timePerQuestion, setTimePerQuestion] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sessionStartTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    setTimePerQuestion(prev => [...prev, timeSpent]);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);
    
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleCompleteQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleCompleteQuiz = () => {
    const correctAnswers = answers.filter((answer, idx) => answer === questions[idx].correctAnswer).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    const session: QuizSession = {
      id: crypto.randomUUID(),
      title,
      questions,
      currentQuestionIndex: questions.length,
      answers,
      score,
      startedAt: sessionStartTime,
      completedAt: Date.now(),
      timePerQuestion,
    };

    // Update topic performance
    updateTopicPerformance(topic, subject, score);

    onComplete(score, session);
  };

  const handleSaveQuiz = () => {
    const quizContent = questions.map((q, idx) => 
      `**Pregunta ${idx + 1}:** ${q.question}\n` +
      q.options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`).join('\n') +
      `\n**Respuesta correcta:** ${String.fromCharCode(65 + q.correctAnswer)}\n` +
      `**Explicación:** ${q.explanation}\n`
    ).join('\n---\n\n');

    addSavedContent({
      type: 'quiz',
      title,
      content: quizContent,
      topic,
      subject,
      isFavorite: false,
      tags: [subject, topic, 'quiz'],
    });

    alert('✅ Quiz guardado en tu biblioteca');
  };

  const correctCount = answers.filter((answer, idx) => answer === questions[idx].correctAnswer).length;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-purple-500/20 p-2 rounded-lg text-purple-500">
              <PsychologyIcon sx={{ fontSize: 24 }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-primary truncate">{title}</h3>
              <p className="text-xs text-secondary">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveQuiz}
              className="p-2 hover:bg-surfaceHighlight rounded-lg text-secondary hover:text-accent transition-colors"
              title="Guardar quiz"
            >
              <BookmarkIcon sx={{ fontSize: 20 }} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-surfaceHighlight rounded-lg text-secondary hover:text-primary transition-colors">
              <CloseIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-border relative">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-surfaceHighlight border-b border-border">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircleIcon sx={{ fontSize: 16 }} className="text-green-500" />
            <span className="text-primary font-medium">{correctCount} correctas</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CancelIcon sx={{ fontSize: 16 }} className="text-red-500" />
            <span className="text-primary font-medium">
              {currentQuestionIndex - correctCount} incorrectas
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TimerIcon sx={{ fontSize: 16 }} className="text-accent" />
            <span className="text-primary font-medium">
              {Math.floor((Date.now() - sessionStartTime) / 1000)}s
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-xl font-bold text-primary mb-4 leading-relaxed">
              {currentQuestion.question}
            </h4>
            {currentQuestion.difficulty && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                currentQuestion.difficulty === 'easy' 
                  ? 'bg-green-500/10 text-green-500'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-yellow-500/10 text-yellow-500'
                  : 'bg-red-500/10 text-red-500'
              }`}>
                {currentQuestion.difficulty === 'easy' ? 'Fácil' : currentQuestion.difficulty === 'medium' ? 'Media' : 'Difícil'}
              </span>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentQuestion.correctAnswer;
              const showCorrect = showFeedback && isCorrectOption;
              const showIncorrect = showFeedback && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect
                      ? 'bg-green-500/10 border-green-500 text-green-700'
                      : showIncorrect
                      ? 'bg-red-500/10 border-red-500 text-red-700'
                      : isSelected
                      ? 'bg-accent/10 border-accent text-primary'
                      : 'bg-surfaceHighlight border-border text-primary hover:border-accent/50'
                  } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      showCorrect
                        ? 'bg-green-500 text-white'
                        : showIncorrect
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-accent text-white'
                        : 'bg-background text-secondary'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showCorrect && <CheckCircleIcon sx={{ fontSize: 24 }} className="text-green-500" />}
                    {showIncorrect && <CancelIcon sx={{ fontSize: 24 }} className="text-red-500" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`p-4 rounded-xl mb-6 animate-in slide-in-from-bottom-4 fade-in ${
              isCorrect
                ? 'bg-green-500/10 border-2 border-green-500/30'
                : 'bg-red-500/10 border-2 border-red-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircleIcon sx={{ fontSize: 20 }} className="text-green-500" />
                    <span className="font-bold text-green-700">¡Correcto! 🎉</span>
                  </>
                ) : (
                  <>
                    <CancelIcon sx={{ fontSize: 20 }} className="text-red-500" />
                    <span className="font-bold text-red-700">Incorrecto</span>
                  </>
                )}
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                <strong>Explicación:</strong> {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {!showFeedback ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  selectedAnswer !== null
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 shadow-lg'
                    : 'bg-surfaceHighlight text-secondary cursor-not-allowed'
                }`}
              >
                Responder
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-purple-500 text-white hover:scale-105 transition-all shadow-lg"
              >
                {isLastQuestion ? (
                  <>
                    Ver Resultados <TrophyIcon sx={{ fontSize: 24 }} />
                  </>
                ) : (
                  <>
                    Siguiente <ArrowForwardIcon sx={{ fontSize: 24 }} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveQuiz;
