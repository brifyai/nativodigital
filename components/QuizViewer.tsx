import React, { useState, useEffect } from 'react';
import {
  CheckCircle as CheckIcon,
  Cancel as WrongIcon,
  NavigateNext as NextIcon,
  Replay as ReplayIcon,
  EmojiEvents as TrophyIcon,
  Lightbulb as LightbulbIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: string;
}

interface QuizViewerProps {
  questions: QuizQuestion[];
  title?: string;
}

const QuizViewer: React.FC<QuizViewerProps> = ({ questions, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);

  // Reset state when questions change
  useEffect(() => {
    console.log('🔄 QuizViewer: questions changed, length =', questions?.length);
    if (questions && questions.length > 0) {
      // Always reset to ensure we're showing the correct count
      if (currentIndex >= questions.length) {
        console.log('⚠️ Current index out of bounds, resetting to 0');
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
      }
    }
  }, [questions, currentIndex]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isAnswered = answeredQuestions.has(currentIndex);

  const handleSelectAnswer = (option: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setShowExplanation(true);
    
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentIndex);
    setAnsweredQuestions(newAnswered);
    
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Set());
    setIsComplete(false);
  };

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'fácil':
      case 'facil':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medio':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'difícil':
      case 'dificil':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    }
  };

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = score === questions.length;
    const isGood = percentage >= 70;

    return (
      <div style={{ width: '100%', maxWidth: '100%', padding: '1rem', boxSizing: 'border-box', overflow: 'hidden' }} className="bg-surface rounded-2xl border-2 border-border">
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '100%' }}>
          <div style={{ display: 'inline-block', padding: '0.75rem', borderRadius: '50%', margin: '0 auto' }} className="bg-background">
            <TrophyIcon sx={{ fontSize: 48 }} className={isPerfect ? 'text-yellow-500' : isGood ? 'text-blue-500' : 'text-gray-500'} />
          </div>
          
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="text-primary">
              {isPerfect ? '¡Perfecto!' : isGood ? '¡Bien hecho!' : '¡Sigue practicando!'}
            </h3>
            <p style={{ fontSize: '1rem' }} className="text-secondary">
              Has completado el quiz
            </p>
          </div>

          <div style={{ borderRadius: '0.75rem', padding: '1rem', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} className="bg-background">
            <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }} className="text-primary">
              {score}/{questions.length}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }} className="text-secondary">
              {percentage}% correcto
            </div>
          </div>

          <button
            onClick={handleRestart}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1rem',
              borderRadius: '0.75rem',
              background: '#4285F4',
              color: 'white',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              margin: '0 auto',
              transition: 'all 0.2s',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#3367d6'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#4285F4'}
          >
            <ReplayIcon sx={{ fontSize: 20 }} />
            <span>Intentar de nuevo</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%', padding: '1rem', boxSizing: 'border-box', overflow: 'hidden' }} className="bg-surface rounded-2xl border-2 border-border">
      {/* Header */}
      <div style={{ marginBottom: '1rem', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem', width: '100%', maxWidth: '100%' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="text-primary">
            {title || 'Quiz Interactivo'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', flexShrink: 0 }} className="text-secondary">
            <TimerIcon sx={{ fontSize: 18 }} />
            <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{score}/{answeredQuestions.size}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', gap: '0.5rem' }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="text-secondary">
              Pregunta {currentIndex + 1} de {questions.length}
            </span>
            {currentQuestion.difficulty && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </span>
            )}
          </div>
          <div style={{ height: '0.5rem', borderRadius: '9999px', overflow: 'hidden', width: '100%', maxWidth: '100%' }} className="bg-background">
            <div
              style={{ 
                height: '100%', 
                background: '#4285F4',
                borderRadius: '9999px',
                width: `${progress}%`,
                transition: 'width 0.3s',
                maxWidth: '100%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div style={{ borderRadius: '1rem', padding: '1rem', marginBottom: '1rem', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} className="bg-background">
        <p style={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: '1.625', wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' }} className="text-primary">
          {currentQuestion.question}
        </p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', width: '100%', maxWidth: '100%' }}>
        {currentQuestion.options.map((option, index) => {
          const optionLabel = getOptionLabel(index);
          const isCorrect = option === currentQuestion.correctAnswer;
          const isSelected = option === selectedAnswer;
          
          let bgColor = 'bg-background';
          let borderColor = 'border-border';
          let textColor = 'text-primary';
          
          if (showExplanation) {
            if (isCorrect) {
              bgColor = 'bg-green-50 dark:bg-green-900/20';
              borderColor = 'border-green-500';
              textColor = 'text-green-900 dark:text-green-100';
            } else if (isSelected && !isCorrect) {
              bgColor = 'bg-red-50 dark:bg-red-900/20';
              borderColor = 'border-red-500';
              textColor = 'text-red-900 dark:text-red-100';
            }
          } else if (isSelected) {
            bgColor = 'bg-blue-50 dark:bg-blue-900/20';
            borderColor = 'border-blue-500';
          }

          return (
            <button
              key={index}
              onClick={() => handleSelectAnswer(option)}
              disabled={isAnswered}
              style={{
                width: '100%',
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                textAlign: 'left',
                border: '2px solid',
                transition: 'all 0.2s',
                cursor: isAnswered ? 'default' : 'pointer',
                boxSizing: 'border-box'
              }}
              className={`${bgColor} ${borderColor} ${textColor} ${!isAnswered && 'hover:border-blue-400'}`}
            >
              <div style={{ flexShrink: 0, width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }} className="bg-gray-200 dark:bg-gray-700">
                {optionLabel}
              </div>
              <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, lineHeight: '1.625', minWidth: 0, wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                {option}
              </span>
              {showExplanation && isCorrect && (
                <CheckIcon className="text-green-500 flex-shrink-0" sx={{ fontSize: 18 }} />
              )}
              {showExplanation && isSelected && !isCorrect && (
                <WrongIcon className="text-red-500 flex-shrink-0" sx={{ fontSize: 18 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div style={{ borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '1rem', border: '2px solid #3b82f6', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} className="bg-blue-50 dark:bg-blue-900/20">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', width: '100%', maxWidth: '100%' }}>
            <LightbulbIcon className="text-blue-600 flex-shrink-0" sx={{ fontSize: 18, marginTop: '0.125rem' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.75rem' }} className="text-blue-900 dark:text-blue-100">
                Explicación:
              </p>
              <p style={{ lineHeight: '1.625', fontSize: '0.75rem', wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' }} className="text-blue-800 dark:text-blue-200">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      {showExplanation && (
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            background: '#4285F4',
            color: 'white',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
            boxSizing: 'border-box'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#3367d6'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#4285F4'}
        >
          <span>{currentIndex < questions.length - 1 ? 'Siguiente pregunta' : 'Ver resultados'}</span>
          <NextIcon sx={{ fontSize: 20 }} />
        </button>
      )}
    </div>
  );
};

export default QuizViewer;
