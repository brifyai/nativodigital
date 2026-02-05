import React, { useState, useEffect } from 'react';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Timer as TimerIcon,
  Coffee as CoffeeIcon,
} from '@mui/icons-material';

interface PomodoroSession {
  number: number;
  focus: string;
  activities: string[];
  break: string;
}

interface PomodoroViewerProps {
  sessions: PomodoroSession[];
  title: string;
}

const PomodoroViewer: React.FC<PomodoroViewerProps> = ({ sessions, title }) => {
  // Debug logging
  console.log('🎯 PomodoroViewer recibió:', { 
    sessions, 
    sessionsLength: sessions?.length,
    firstSession: sessions?.[0]
  });
  
  const [currentSession, setCurrentSession] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos en segundos
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Sesión completada
      setIsRunning(false);
      if (!isBreak) {
        setCompletedSessions([...completedSessions, currentSession]);
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, currentSession, completedSessions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const handleStartBreak = () => {
    setIsBreak(true);
    setTimeLeft(currentSession === 3 ? 15 * 60 : 5 * 60);
    setIsRunning(true);
  };

  const handleNextSession = () => {
    if (currentSession < sessions.length - 1) {
      setCurrentSession(currentSession + 1);
      setIsBreak(false);
      setTimeLeft(25 * 60);
      setIsRunning(false);
    }
  };

  const progress = ((isBreak ? (currentSession === 3 ? 15 * 60 : 5 * 60) : 25 * 60) - timeLeft) / (isBreak ? (currentSession === 3 ? 15 * 60 : 5 * 60) : 25 * 60) * 100;

  // Show error message if no sessions
  if (!sessions || sessions.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        maxWidth: '100%', 
        boxSizing: 'border-box',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '1rem',
          padding: '2rem',
          color: '#92400e'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            ⚠️ No se detectaron sesiones
          </h3>
          <p style={{ margin: 0 }}>
            El formato del contenido no pudo ser parseado. Por favor, genera un nuevo plan de estudio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '100%', 
      boxSizing: 'border-box',
      overflow: 'hidden',
      overflowX: 'hidden'
    }}>
      <div style={{ 
        background: '#4285F4',
        color: 'white',
        padding: '1.5rem',
        borderRadius: '1rem',
        marginBottom: '1.5rem',
        boxSizing: 'border-box',
        maxWidth: '100%',
        overflow: 'hidden',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        wordBreak: 'break-word'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <TimerIcon sx={{ fontSize: 28 }} />
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            margin: 0,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            wordBreak: 'break-word'
          }}>{title}</h2>
        </div>
        <p style={{ opacity: 0.9, margin: 0 }}>
          Sesión {currentSession + 1} de {sessions.length}
        </p>
      </div>

      {/* Timer Display */}
      <div style={{
        background: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
        boxSizing: 'border-box',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <div style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          color: isBreak ? '#10b981' : '#4285F4', 
          marginBottom: '1rem',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}>
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress Bar */}
        <div style={{ 
          width: '100%', 
          height: '8px', 
          background: '#e5e7eb', 
          borderRadius: '999px', 
          overflow: 'hidden',
          marginBottom: '1.5rem',
          boxSizing: 'border-box',
          maxWidth: '100%'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: isBreak ? '#10b981' : '#4285F4',
            transition: 'width 1s linear',
            borderRadius: '999px',
            maxWidth: '100%'
          }} />
        </div>

        <div style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '1.5rem',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          wordBreak: 'break-word'
        }}>
          {isBreak ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <CoffeeIcon sx={{ color: '#10b981' }} />
              <span>Descanso {currentSession === 3 ? 'Largo' : 'Corto'}</span>
            </div>
          ) : (
            <span>Sesión de Enfoque</span>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleStartPause}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              background: isRunning ? '#ef4444' : '#10b981',
              color: 'white',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxSizing: 'border-box',
              maxWidth: '100%',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {isRunning ? <PauseIcon /> : <PlayIcon />}
            <span>{isRunning ? 'Pausar' : 'Iniciar'}</span>
          </button>
          
          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxSizing: 'border-box',
              maxWidth: '100%',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            <RefreshIcon />
            <span>Reiniciar</span>
          </button>
        </div>

        {/* Break/Next Session Buttons */}
        {timeLeft === 0 && !isBreak && (
          <button
            onClick={handleStartBreak}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              boxSizing: 'border-box',
              maxWidth: '100%',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            Iniciar Descanso
          </button>
        )}
        
        {timeLeft === 0 && isBreak && currentSession < sessions.length - 1 && (
          <button
            onClick={handleNextSession}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              background: '#4285F4',
              color: 'white',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              boxSizing: 'border-box',
              maxWidth: '100%',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            Siguiente Sesión
          </button>
        )}
      </div>

      {/* Current Session Details */}
      {!isBreak && sessions[currentSession] && (
        <div style={{
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxSizing: 'border-box',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '1rem',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            wordBreak: 'break-word'
          }}>
            {sessions[currentSession].focus}
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ 
              fontWeight: '600', 
              color: '#4b5563', 
              marginBottom: '0.5rem',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              wordBreak: 'break-word'
            }}>Qué hacer:</p>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#6b7280' }}>
              {sessions[currentSession].activities.map((activity, idx) => (
                <li key={idx} style={{ 
                  marginBottom: '0.25rem',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word'
                }}>{activity}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Session Progress */}
      <div style={{
        background: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxSizing: 'border-box',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '1rem',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          wordBreak: 'break-word'
        }}>
          Progreso de Sesiones
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
          {sessions.map((session, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                background: completedSessions.includes(idx) ? '#dcfce7' : idx === currentSession ? '#dbeafe' : '#f3f4f6',
                border: `2px solid ${completedSessions.includes(idx) ? '#10b981' : idx === currentSession ? '#4285F4' : '#e5e7eb'}`,
                textAlign: 'center',
                boxSizing: 'border-box',
                maxWidth: '100%',
                overflow: 'hidden'
              }}
            >
              {completedSessions.includes(idx) ? (
                <CheckIcon sx={{ color: '#10b981', fontSize: 24 }} />
              ) : (
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: idx === currentSession ? '#4285F4' : '#9ca3af' }}>
                  {idx + 1}
                </span>
              )}
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                margin: '0.25rem 0 0 0',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}>
                Sesión {idx + 1}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PomodoroViewer;
