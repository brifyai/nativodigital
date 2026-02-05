import React from 'react';
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  ChatBubbleOutline as MessageSquareIcon,
  Schedule as ClockIcon,
  MenuBook as BookOpenIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as AwardIcon,
  TrackChanges as TargetIcon,
  Flag as FlagIcon,
  Psychology as PsychologyIcon,
  AutoStories as AutoStoriesIcon,
  Explore as ExploreIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
  Rocket as RocketIcon,
  FitnessCenter as FitnessCenterIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { ChatSession } from '../types';

interface ProgressStatsProps {
  sessions: ChatSession[];
  onClose: () => void;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ sessions, onClose }) => {
  // Calculate statistics
  const totalMessages = sessions.reduce((acc, s) => acc + s.messages.length, 0);
  const totalSessions = sessions.length;
  
  // Topics studied (extract from session titles)
  const topics = sessions.map(s => s.title).filter(t => t !== 'Nueva Conversación');
  const uniqueTopics = [...new Set(topics)];
  
  // Calculate study time (approximate based on messages)
  const estimatedMinutes = Math.round(totalMessages * 2); // ~2 min per message
  const hours = Math.floor(estimatedMinutes / 60);
  const minutes = estimatedMinutes % 60;
  
  // Recent activity (last 7 days)
  const now = Date.now();
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  const recentSessions = sessions.filter(s => s.updatedAt > sevenDaysAgo);
  
  // Most active day
  const dayActivity: { [key: string]: number } = {};
  sessions.forEach(s => {
    const day = new Date(s.updatedAt).toLocaleDateString('es-ES', { weekday: 'long' });
    dayActivity[day] = (dayActivity[day] || 0) + 1;
  });
  const mostActiveDay = Object.entries(dayActivity).sort((a, b) => b[1] - a[1])[0];
  
  // Achievements
  const achievements = [
    { 
      id: 'first_chat', 
      name: 'Primer Paso', 
      description: 'Iniciaste tu primera conversación',
      unlocked: totalSessions >= 1,
      icon: FlagIcon,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      id: 'curious', 
      name: 'Curioso', 
      description: 'Hiciste 50 preguntas',
      unlocked: totalMessages >= 50,
      icon: PsychologyIcon,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    { 
      id: 'dedicated', 
      name: 'Dedicado', 
      description: 'Estudiaste más de 5 horas',
      unlocked: hours >= 5,
      icon: AutoStoriesIcon,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    { 
      id: 'explorer', 
      name: 'Explorador', 
      description: 'Estudiaste 10 temas diferentes',
      unlocked: uniqueTopics.length >= 10,
      icon: ExploreIcon,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    },
    { 
      id: 'consistent', 
      name: 'Consistente', 
      description: 'Estudiaste 7 días seguidos',
      unlocked: recentSessions.length >= 7,
      icon: LocalFireDepartmentIcon,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-surface border border-border rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500 my-8">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-accent/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="bg-accent/20 p-2 rounded-lg text-accent">
              <TrendingUpIcon sx={{ fontSize: 24 }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary">Tu Progreso de Aprendizaje</h3>
              <p className="text-xs text-secondary">Estadísticas y logros</p>
            </div>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary p-1 hover:bg-surfaceHighlight rounded-full transition-colors">
            <CloseIcon sx={{ fontSize: 24 }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquareIcon sx={{ fontSize: 20 }} className="text-blue-500" />
                <span className="text-xs font-medium text-secondary uppercase">Mensajes</span>
              </div>
              <div className="text-3xl font-bold text-primary">{totalMessages}</div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpenIcon sx={{ fontSize: 20 }} className="text-purple-500" />
                <span className="text-xs font-medium text-secondary uppercase">Temas</span>
              </div>
              <div className="text-3xl font-bold text-primary">{uniqueTopics.length}</div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon sx={{ fontSize: 20 }} className="text-green-500" />
                <span className="text-xs font-medium text-secondary uppercase">Tiempo</span>
              </div>
              <div className="text-3xl font-bold text-primary">{hours}h {minutes}m</div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon sx={{ fontSize: 20 }} className="text-orange-500" />
                <span className="text-xs font-medium text-secondary uppercase">Esta Semana</span>
              </div>
              <div className="text-3xl font-bold text-primary">{recentSessions.length}</div>
            </div>
          </div>

          {/* Most Active Day */}
          {mostActiveDay && (
            <div className="bg-surfaceHighlight rounded-2xl p-5 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <TargetIcon sx={{ fontSize: 20 }} className="text-accent" />
                <h4 className="font-bold text-primary">Día Más Activo</h4>
              </div>
              <p className="text-secondary text-sm">
                Los <span className="font-bold text-primary capitalize">{mostActiveDay[0]}</span> son tu día favorito para estudiar 
                ({mostActiveDay[1]} sesiones)
              </p>
            </div>
          )}

          {/* Recent Topics */}
          {uniqueTopics.length > 0 && (
            <div>
              <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                <BookOpenIcon sx={{ fontSize: 20 }} className="text-accent" />
                Temas Estudiados Recientemente
              </h4>
              <div className="flex flex-wrap gap-2">
                {uniqueTopics.slice(0, 10).map((topic, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 bg-surfaceHighlight border border-border rounded-full text-xs font-medium text-primary"
                  >
                    {topic}
                  </span>
                ))}
                {uniqueTopics.length > 10 && (
                  <span className="px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-full text-xs font-medium text-accent">
                    +{uniqueTopics.length - 10} más
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Achievements */}
          <div>
            <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
              <AwardIcon sx={{ fontSize: 20 }} className="text-accent" />
              Logros ({unlockedAchievements.length}/{achievements.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border transition-all ${
                      achievement.unlocked
                        ? `${achievement.bg} border-accent/30`
                        : 'bg-surfaceHighlight border-border opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${achievement.bg} flex items-center justify-center ${achievement.color}`}>
                        <IconComponent sx={{ fontSize: 24 }} />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-primary text-sm mb-1">
                          {achievement.name}
                          {achievement.unlocked && (
                            <span className="ml-2 text-green-500">✓</span>
                          )}
                        </h5>
                        <p className="text-xs text-secondary">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-gradient-to-r from-accent/10 to-purple-500/10 border border-accent/30 rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {totalMessages < 10 ? (
                <>
                  <RocketIcon sx={{ fontSize: 24 }} className="text-accent" />
                  <p className="text-primary font-medium">¡Estás comenzando tu viaje de aprendizaje!</p>
                </>
              ) : totalMessages < 50 ? (
                <>
                  <FitnessCenterIcon sx={{ fontSize: 24 }} className="text-accent" />
                  <p className="text-primary font-medium">¡Vas por buen camino! Sigue así</p>
                </>
              ) : totalMessages < 100 ? (
                <>
                  <StarIcon sx={{ fontSize: 24 }} className="text-accent" />
                  <p className="text-primary font-medium">¡Increíble progreso! Eres un estudiante dedicado</p>
                </>
              ) : (
                <>
                  <TrophyIcon sx={{ fontSize: 24 }} className="text-accent" />
                  <p className="text-primary font-medium">¡Eres un maestro del aprendizaje!</p>
                </>
              )}
            </div>
            <p className="text-secondary text-sm">
              Continúa explorando nuevos temas y alcanzando tus metas educativas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;
