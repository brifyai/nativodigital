import React, { useState } from 'react';
import {
  School as TeachIcon,
  Psychology as ThinkIcon,
  AutoAwesome as SimplifyIcon,
  Replay as ReviewIcon,
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  EmojiEvents as TrophyIcon,
  Edit as EditIcon,
  Mic as MicIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface FeynmanStep {
  step: number;
  title: string;
  content: string;
  icon: 'teach' | 'think' | 'simplify' | 'review';
}

interface FeynmanViewerProps {
  steps: FeynmanStep[];
  title?: string;
  topic?: string;
}

const FeynmanViewer: React.FC<FeynmanViewerProps> = ({ steps, title, topic }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [userNotes, setUserNotes] = useState<Record<number, string>>({});
  const [isWriting, setIsWriting] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const allCompleted = completedSteps.size === steps.length;

  const toggleStep = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  const goToNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsWriting(false);
    }
  };

  const goToPrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsWriting(false);
    }
  };

  const startWriting = () => {
    setCurrentNote(userNotes[currentStep.step] || '');
    setIsWriting(true);
  };

  const saveNote = () => {
    setUserNotes({ ...userNotes, [currentStep.step]: currentNote });
    setIsWriting(false);
    if (currentNote.trim()) {
      toggleStep(currentStep.step);
    }
  };

  const cancelWriting = () => {
    setIsWriting(false);
    setCurrentNote('');
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      // Simulate recording for demo
      setTimeout(() => {
        setIsRecording(false);
        toggleStep(currentStep.step);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'teach': return <TeachIcon sx={{ fontSize: 32 }} />;
      case 'think': return <ThinkIcon sx={{ fontSize: 32 }} />;
      case 'simplify': return <SimplifyIcon sx={{ fontSize: 32 }} />;
      case 'review': return <ReviewIcon sx={{ fontSize: 32 }} />;
      default: return <TeachIcon sx={{ fontSize: 32 }} />;
    }
  };

  const getColor = (stepNumber: number) => {
    const colors = [
      { bg: 'from-purple-500 to-pink-500', light: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-600' },
      { bg: 'from-blue-500 to-cyan-500', light: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-600' },
      { bg: 'from-green-500 to-emerald-500', light: 'bg-green-50', border: 'border-green-300', text: 'text-green-600' },
      { bg: 'from-orange-500 to-red-500', light: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-600' },
    ];
    return colors[(stepNumber - 1) % colors.length];
  };

  const progress = (completedSteps.size / steps.length) * 100;
  const stepColor = getColor(currentStep.step);

  return (
    <div className="w-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-2">
          <TeachIcon className="text-purple-500" sx={{ fontSize: 24 }} />
          <span>{title || 'Explica con Tus Palabras'}</span>
        </h3>
        {topic && (
          <p className="text-sm text-secondary mb-4">Tema: {topic}</p>
        )}
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-secondary font-medium">Progreso</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {completedSteps.size} de {steps.length} pasos
            </span>
          </div>
          <div className="h-3 bg-white dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 mt-4 justify-center">
          {steps.map((step, idx) => (
            <button
              key={step.step}
              onClick={() => {
                setCurrentStepIndex(idx);
                setIsWriting(false);
              }}
              className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                idx === currentStepIndex
                  ? `bg-gradient-to-br ${stepColor.bg} text-white scale-110 shadow-lg`
                  : completedSteps.has(step.step)
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white dark:bg-gray-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {completedSteps.has(step.step) ? '✓' : step.step}
            </button>
          ))}
        </div>
      </div>

      {/* Current Step Card */}
      <div 
        key={currentStep.step}
        className="animate-in fade-in slide-in-from-right-4 duration-300"
      >
        <div className={`bg-white dark:bg-gray-800 rounded-2xl border-3 ${
          completedSteps.has(currentStep.step)
            ? 'border-green-400 dark:border-green-600'
            : `${stepColor.border} dark:border-purple-700`
        } shadow-xl overflow-hidden`}>
          
          {/* Step Header */}
          <div className={`bg-gradient-to-br ${stepColor.bg} p-6 text-white`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                {getIcon(currentStep.icon)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold opacity-90">PASO {currentStep.step} de {steps.length}</span>
                  {completedSteps.has(currentStep.step) && (
                    <CheckIcon sx={{ fontSize: 20 }} />
                  )}
                </div>
                <h4 className="text-xl font-bold">{currentStep.title}</h4>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            <div className="prose prose-sm max-w-none mb-6">
              <p className="text-base text-primary leading-relaxed whitespace-pre-wrap">
                {currentStep.content}
              </p>
            </div>

            {/* Interactive Section */}
            {!isWriting ? (
              <div className="space-y-3">
                {/* Show saved note if exists */}
                {userNotes[currentStep.step] && (
                  <div className={`p-4 ${stepColor.light} dark:bg-gray-700 rounded-xl border-2 ${stepColor.border} dark:border-gray-600`}>
                    <div className="flex items-start gap-2 mb-2">
                      <EditIcon className={stepColor.text} sx={{ fontSize: 18 }} />
                      <span className="text-sm font-bold text-secondary">Tu explicación:</span>
                    </div>
                    <p className="text-sm text-primary whitespace-pre-wrap">{userNotes[currentStep.step]}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={startWriting}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                      userNotes[currentStep.step]
                        ? 'bg-white dark:bg-gray-700 border-2 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    }`}
                  >
                    <EditIcon sx={{ fontSize: 20 }} />
                    {userNotes[currentStep.step] ? 'Editar' : 'Escribe tu explicación'}
                  </button>

                  <button
                    onClick={toggleRecording}
                    disabled={isRecording}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                      isRecording
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    }`}
                  >
                    <MicIcon sx={{ fontSize: 20 }} />
                    {isRecording ? 'Grabando...' : 'Graba tu voz'}
                  </button>
                </div>

                {/* Mark Complete Button */}
                {!userNotes[currentStep.step] && (
                  <button
                    onClick={() => toggleStep(currentStep.step)}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-base transition-all transform hover:scale-105 active:scale-95 ${
                      completedSteps.has(currentStep.step)
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {completedSteps.has(currentStep.step) ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckIcon sx={{ fontSize: 20 }} />
                        ¡Completado!
                      </span>
                    ) : (
                      'Saltar este paso'
                    )}
                  </button>
                )}
              </div>
            ) : (
              /* Writing Mode */
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-secondary">Escribe tu explicación con tus propias palabras:</span>
                  <button
                    onClick={cancelWriting}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <CloseIcon sx={{ fontSize: 20 }} className="text-gray-500" />
                  </button>
                </div>
                <textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Explica el tema como si se lo enseñaras a un amigo..."
                  className="w-full h-40 p-4 border-2 border-purple-300 dark:border-purple-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={cancelWriting}
                    className="flex-1 py-3 px-6 rounded-xl font-bold text-base bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveNote}
                    disabled={!currentNote.trim()}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold text-base transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                      currentNote.trim()
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <SaveIcon sx={{ fontSize: 20 }} />
                    Guardar y continuar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {!isWriting && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={goToPrevious}
            disabled={isFirstStep}
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
              isFirstStep
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 shadow-md hover:shadow-lg'
            }`}
          >
            <BackIcon sx={{ fontSize: 20 }} />
            Anterior
          </button>
          
          <button
            onClick={goToNext}
            disabled={isLastStep}
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
              isLastStep
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            Siguiente
            <NextIcon sx={{ fontSize: 20 }} />
          </button>
        </div>
      )}

      {/* Completion Celebration */}
      {allCompleted && !isWriting && (
        <div className="mt-6 p-6 bg-gradient-to-r from-yellow-100 via-green-100 to-blue-100 dark:from-yellow-900/30 dark:via-green-900/30 dark:to-blue-900/30 rounded-2xl border-3 border-yellow-400 dark:border-yellow-600 shadow-xl animate-in zoom-in duration-500">
          <div className="text-center">
            <div className="mb-3 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <TrophyIcon sx={{ fontSize: 32 }} className="text-white" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              🎉 ¡Increíble trabajo! 🎉
            </h4>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-2">
              Has completado todos los pasos. ¡Ahora realmente entiendes el tema!
            </p>
            {Object.keys(userNotes).length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Escribiste {Object.keys(userNotes).length} explicaciones propias 📝
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeynmanViewer;
