import React, { useState } from 'react';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  AutoAwesome as SparklesIcon,
  ChatBubbleOutline as MessageIcon,
  Mic as MicIcon,
  CameraAlt as CameraIcon,
  Code as CodeIcon,
  Language as LanguageIcon,
  Bolt as BoltIcon,
} from '@mui/icons-material';

interface OnboardingTourProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "¡Bienvenido a Nativo Digital! 🎉",
    description: "Tu tutor personal de IA está listo para ayudarte a aprender cualquier cosa. Déjame mostrarte cómo funciona.",
    icon: SparklesIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Haz Preguntas Naturales 💬",
    description: "Escribe como si hablaras con un amigo. Puedes preguntar sobre matemáticas, historia, ciencias, o cualquier tema. La IA se adapta a tu nivel educativo.",
    icon: MessageIcon,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Usa tu Voz 🎤",
    description: "Haz clic en el ícono del micrófono para hablar en lugar de escribir. Perfecto para practicar idiomas o cuando estás ocupado.",
    icon: MicIcon,
    color: "text-green-500",
    bg: "bg-green-500/10"
  },
  {
    title: "Sube Imágenes 📸",
    description: "¿Tienes una tarea en papel? Toma una foto y súbela. La IA analizará la imagen y te ayudará a resolverla.",
    icon: CameraIcon,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    title: "Datos en Tiempo Real 🌐",
    description: "Pregunta sobre noticias actuales, clima o eventos recientes. La IA está conectada a Google Search para darte información actualizada.",
    icon: LanguageIcon,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  },
  {
    title: "Matemáticas Avanzadas 🧮",
    description: "Para problemas complejos, la IA puede ejecutar código Python para calcular y graficar resultados al instante.",
    icon: CodeIcon,
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  },
  {
    title: "¡Listo para Empezar! 🚀",
    description: "Recuerda: puedes copiar respuestas, regenerarlas si no te convencen, y exportar tus conversaciones para estudiar después. ¡A aprender!",
    icon: BoltIcon,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10"
  }
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500">
        
        {/* Progress Bar */}
        <div className="h-1.5 bg-border relative">
          <div 
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className={`w-20 h-20 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 ${step.color} animate-in zoom-in duration-500`}>
            <Icon sx={{ fontSize: 40 }} />
          </div>

          <h2 className="text-2xl font-bold text-primary mb-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100">
            {step.title}
          </h2>
          
          <p className="text-secondary text-base leading-relaxed mb-8 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200">
            {step.description}
          </p>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep 
                    ? 'w-8 bg-accent' 
                    : idx < currentStep 
                    ? 'w-2 bg-accent/50' 
                    : 'w-2 bg-border'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex-1 py-3 px-4 bg-surfaceHighlight hover:bg-border text-primary rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} /> Anterior
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-4 bg-primary hover:opacity-90 text-background rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>¡Empezar! <BoltIcon sx={{ fontSize: 18 }} /></>
              ) : (
                <>Siguiente <ArrowForwardIcon sx={{ fontSize: 18 }} /></>
              )}
            </button>
          </div>

          {currentStep < steps.length - 1 && (
            <button
              onClick={handleSkip}
              className="mt-4 text-sm text-secondary hover:text-primary transition-colors"
            >
              Saltar tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
