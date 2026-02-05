import React, { useState, useEffect } from 'react';
import {
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Shuffle as ShuffleIcon,
  Replay as ReplayIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AutoAwesome as SparklesIcon,
  Lightbulb as LightbulbIcon,
  HelpOutline as QuestionIcon,
  CheckCircle as AnswerIcon,
  TouchApp as TouchIcon,
} from '@mui/icons-material';

interface Flashcard {
  question: string;
  answer: string;
  tip?: string;
}

interface FlashcardViewerProps {
  cards: Flashcard[];
  title?: string;
}

const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ cards, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());
  const [cardOrder, setCardOrder] = useState<number[]>([]);

  // Update cardOrder when cards change
  useEffect(() => {
    if (cards && cards.length > 0) {
      setCardOrder(cards.map((_, i) => i));
      // Reset to first card if current index is out of bounds
      if (currentIndex >= cards.length) {
        setCurrentIndex(0);
      }
    }
  }, [cards, currentIndex]);

  // Safety check: ensure currentIndex is valid
  const safeCurrentIndex = Math.min(currentIndex, cards.length - 1);
  const currentCard = cards[cardOrder[safeCurrentIndex]];
  
  // If no valid card, show error state
  if (!currentCard || !cards || cards.length === 0) {
    return (
      <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border-2 border-red-200 dark:border-red-800">
        <p className="text-center text-red-600 dark:text-red-400">
          ⚠️ No hay tarjetas disponibles
        </p>
      </div>
    );
  }
  
  const progress = ((safeCurrentIndex + 1) / cards.length) * 100;
  const masteredCount = masteredCards.size;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMastered = () => {
    const newMastered = new Set(masteredCards);
    newMastered.add(cardOrder[currentIndex]);
    setMasteredCards(newMastered);
    handleNext();
  };

  const handleNeedsPractice = () => {
    handleNext();
  };

  const handleShuffle = () => {
    const shuffled = [...cardOrder].sort(() => Math.random() - 0.5);
    setCardOrder(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCards(new Set());
  };

  return (
    <div className="w-full p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-xl">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3 className="text-base font-bold text-primary flex items-center gap-2 flex-1 min-w-0">
            <SparklesIcon className="text-purple-500 flex-shrink-0" sx={{ fontSize: 20 }} />
            <span className="truncate">{title || 'Tarjetas de Memoria'}</span>
          </h3>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleShuffle}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 transition-all shadow-md hover:shadow-lg"
              title="Mezclar"
            >
              <ShuffleIcon sx={{ fontSize: 18 }} />
            </button>
            <button
              onClick={handleRestart}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 transition-all shadow-md hover:shadow-lg"
              title="Reiniciar"
            >
              <ReplayIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm gap-2">
            <span className="text-secondary font-medium">
              Tarjeta {safeCurrentIndex + 1} de {cards.length}
            </span>
            <span className="text-green-600 dark:text-green-400 font-bold whitespace-nowrap flex items-center gap-1">
              <CheckIcon sx={{ fontSize: 16 }} />
              <span>{masteredCount}</span>
            </span>
          </div>
          <div className="h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative mb-4" style={{ perspective: '1000px' }}>
        <div
          className={`relative w-full h-72 transition-transform duration-500 cursor-pointer`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
          onClick={handleFlip}
        >
          {/* Front Side - Question */}
          <div
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center border-4 border-purple-300 dark:border-purple-700"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="text-center space-y-3 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900 rounded-full">
                <QuestionIcon sx={{ fontSize: 16 }} className="text-purple-600 dark:text-purple-300" />
                <span className="text-xs font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wide">
                  Pregunta
                </span>
              </div>
              <p className="text-lg font-bold text-primary leading-relaxed break-words px-2">
                {currentCard.question}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-secondary italic mt-3">
                <TouchIcon sx={{ fontSize: 16 }} />
                <span>Toca para ver la respuesta</span>
              </div>
            </div>
          </div>

          {/* Back Side - Answer */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center border-4 border-purple-600"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-center space-y-3 text-white w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                <AnswerIcon sx={{ fontSize: 16 }} />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Respuesta
                </span>
              </div>
              <p className="text-lg font-bold leading-relaxed break-words px-2">
                {currentCard.answer}
              </p>
              {currentCard.tip && (
                <div className="mt-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-2 mb-1">
                    <LightbulbIcon sx={{ fontSize: 16 }} />
                    <p className="text-xs font-semibold">Tip:</p>
                  </div>
                  <p className="text-sm break-words">{currentCard.tip}</p>
                </div>
              )}
              <div className="flex items-center justify-center gap-2 text-xs italic mt-3 opacity-90">
                <TouchIcon sx={{ fontSize: 16 }} />
                <span>Toca para volver</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Actions */}
      <div className="space-y-3">
        {/* Mastery Buttons (only show when flipped) */}
        {isFlipped && (
          <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={handleNeedsPractice}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-bold transition-all shadow-md hover:shadow-lg text-sm"
            >
              <CloseIcon sx={{ fontSize: 18 }} />
              <span className="hidden sm:inline">Practicar</span>
            </button>
            <button
              onClick={handleMastered}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 font-bold transition-all shadow-md hover:shadow-lg text-sm"
            >
              <CheckIcon sx={{ fontSize: 18 }} />
              <span className="hidden sm:inline">¡Domino!</span>
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <PrevIcon sx={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <div className="flex-1 text-center">
            <button
              onClick={handleFlip}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold transition-all shadow-lg hover:shadow-xl text-sm"
            >
              {isFlipped ? (
                <>
                  <QuestionIcon sx={{ fontSize: 18 }} />
                  <span>Pregunta</span>
                </>
              ) : (
                <>
                  <AnswerIcon sx={{ fontSize: 18 }} />
                  <span>Respuesta</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <NextIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </div>

      {/* Completion Message */}
      {safeCurrentIndex === cards.length - 1 && masteredCount === cards.length && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl border-2 border-green-300 dark:border-green-700 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-center text-sm font-bold text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
            <CheckIcon sx={{ fontSize: 20 }} />
            <span>¡Felicidades! Todas dominadas</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardViewer;
