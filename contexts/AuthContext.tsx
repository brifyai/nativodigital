import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { sanitizeUserProfile } from '../utils/sanitizer';
import { showConfirm, showDeleteConfirm } from '../utils/sweetAlert';
import { DEFAULT_SYSTEM_INSTRUCTION } from '../services/gemini';

interface AuthContextType {
  user: UserProfile | null;
  showLanding: boolean;
  setShowLanding: (show: boolean) => void;
  customInstruction: string;
  setCustomInstruction: (instruction: string) => void;
  handleLogin: (profile: UserProfile) => void;
  handleLogout: () => Promise<void>;
  handleFullReset: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nativo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [showLanding, setShowLanding] = useState<boolean>(!user);

  const [customInstruction, setCustomInstruction] = useState(() => {
    return localStorage.getItem('accesoia_system_instruction') || '';
  });

  // Save custom instruction to localStorage
  useEffect(() => {
    if (customInstruction) {
      localStorage.setItem('accesoia_system_instruction', customInstruction);
    }
  }, [customInstruction]);

  const handleLogin = (profile: UserProfile) => {
    const sanitized = sanitizeUserProfile(profile);
    setUser(sanitized);
    localStorage.setItem('nativo_user', JSON.stringify(sanitized));
    
    if (!customInstruction) {
      let instruction = DEFAULT_SYSTEM_INSTRUCTION;
      const specificGrade = profile.specificGrade || '';
      
      if (profile.grade === 'primaria') {
        // Enseñanza Básica (1° a 8° Básico)
        if (specificGrade.includes('1°') || specificGrade.includes('2°')) {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante de ${specificGrade} (6-8 años). 
- Usa palabras MUY simples y oraciones cortas
- Muchos emojis y ejemplos con juegos, animales y colores
- Explica como si fueras un amigo mayor
- Usa comparaciones con cosas que ven todos los días
- Respuestas muy cortas (máximo 3-4 líneas)
- Celebra cada logro con entusiasmo`;
        } else if (specificGrade.includes('3°') || specificGrade.includes('4°')) {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante de ${specificGrade} (8-10 años).
- Lenguaje simple pero puedes introducir palabras nuevas (explicándolas)
- Usa emojis y ejemplos con deportes, videojuegos y naturaleza
- Fomenta la curiosidad con preguntas
- Analogías con superhéroes, películas o series
- Respuestas cortas (4-6 líneas)
- Anima a hacer preguntas`;
        } else if (specificGrade.includes('5°') || specificGrade.includes('6°')) {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante de ${specificGrade} (10-12 años).
- Lenguaje claro, puedes usar términos más técnicos explicándolos
- Ejemplos con tecnología, redes sociales y cultura pop
- Introduce conceptos científicos básicos
- Usa diagramas descriptivos cuando sea útil
- Respuestas medianas (6-8 líneas)
- Fomenta el pensamiento crítico`;
        } else if (specificGrade.includes('7°') || specificGrade.includes('8°')) {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante de ${specificGrade} (12-14 años).
- Lenguaje más formal pero cercano
- Puedes usar terminología académica explicándola bien
- Ejemplos con situaciones reales y problemas sociales
- Introduce métodos de estudio efectivos
- Respuestas medianas-largas (8-10 líneas)
- Prepara para la enseñanza media`;
        } else {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante de PRIMARIA. Explica todo con palabras muy sencillas, usa emojis, sé muy paciente y utiliza analogías con juegos o deportes. Respuestas cortas.`;
        }
      } else if (profile.grade === 'secundaria') {
        // Enseñanza Media (1° a 4° Medio)
        if (specificGrade.includes('1°')) {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante de 1° Medio (14-15 años).
- Lenguaje formal pero accesible
- Introduce conceptos abstractos gradualmente
- Ejemplos con ciencia, tecnología y actualidad
- Conecta temas con aplicaciones reales
- Fomenta el análisis y la reflexión
- Respuestas detalladas (10-12 líneas)
- Prepara para PSU/PAES con tips de estudio`;
        } else if (specificGrade.includes('2°')) {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante de 2° Medio (15-16 años).
- Lenguaje académico con profundidad moderada
- Usa terminología técnica de cada materia
- Ejemplos con casos de estudio y problemas complejos
- Introduce pensamiento crítico y debate
- Menciona carreras universitarias relacionadas
- Respuestas detalladas (12-15 líneas)
- Ayuda con preparación PSU/PAES`;
        } else if (specificGrade.includes('3°')) {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante de 3° Medio (16-17 años).
- Lenguaje académico avanzado
- Profundiza en conceptos complejos
- Ejemplos con investigaciones y papers
- Fomenta el pensamiento científico
- Menciona electivos y orientación vocacional
- Respuestas extensas (15-20 líneas)
- Enfoque en PSU/PAES y admisión universitaria`;
        } else if (specificGrade.includes('4°')) {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante de 4° Medio (17-18 años).
- Lenguaje pre-universitario
- Máxima profundidad en conceptos
- Ejemplos con literatura académica
- Prepara para el nivel universitario
- Menciona carreras, universidades y becas
- Respuestas muy extensas (20+ líneas)
- Enfoque total en PSU/PAES y transición a universidad`;
        } else {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante de SECUNDARIA. Usa lenguaje claro pero más técnico. Puedes introducir conceptos científicos básicos. Respuestas medianas.`;
        }
      } else if (profile.grade === 'universidad') {
        // Educación Superior
        if (specificGrade.includes('1°')) {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante Universitario de 1° Año.
- Lenguaje académico universitario
- Introduce metodología de investigación
- Cita fuentes académicas (APA, IEEE, etc.)
- Fomenta lectura de papers y journals
- Ayuda con adaptación a la universidad
- Respuestas muy extensas con referencias
- Menciona recursos académicos (bibliotecas, bases de datos)`;
        } else if (specificGrade.includes('2°') || specificGrade.includes('3°')) {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante Universitario de ${specificGrade}.
- Lenguaje académico especializado
- Profundiza en teorías y modelos complejos
- Cita investigaciones recientes
- Fomenta pensamiento crítico avanzado
- Ayuda con papers, tesis y proyectos
- Respuestas extensas con análisis profundo
- Menciona conferencias, seminarios y networking`;
        } else if (specificGrade.includes('4°') || specificGrade.includes('5°') || specificGrade.includes('6°')) {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante Universitario de ${specificGrade}.
- Lenguaje académico experto
- Máxima profundidad teórica y práctica
- Cita literatura especializada y cutting-edge research
- Fomenta investigación original
- Ayuda con tesis, publicaciones y proyectos finales
- Respuestas muy extensas con análisis crítico
- Menciona oportunidades de postgrado, investigación y carrera profesional`;
        } else {
          instruction += `\n\nPERFIL DE USUARIO: Estudiante UNIVERSITARIO. Usa terminología técnica, profundiza en conceptos, cita fuentes académicas cuando sea relevante. Respuestas detalladas.`;
        }
      } else {
        instruction += "\n\nPERFIL DE USUARIO: AUTODIDACTA. Adapta el nivel según el tema. Sé flexible y pregunta si necesitas aclarar la profundidad deseada.";
      }
      setCustomInstruction(instruction);
    }
    
    setShowLanding(false);
  };

  const handleLogout = async () => {
    const result = await showConfirm(
      "¿Cerrar sesión?",
      "Se mantendrán los chats en este dispositivo.",
      "Sí, cerrar sesión",
      "Cancelar"
    );
    
    if (result.isConfirmed) {
      localStorage.removeItem('nativo_user');
      setUser(null);
      setShowLanding(true);
      navigate('/');
    }
  };

  const handleFullReset = async () => {
    const result = await showDeleteConfirm(
      "¿Borrar cuenta y datos?",
      "Esta acción eliminará permanentemente tu cuenta y todas tus conversaciones. No se puede deshacer."
    );
    
    if (result.isConfirmed) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        showLanding,
        setShowLanding,
        customInstruction,
        setCustomInstruction,
        handleLogin,
        handleLogout,
        handleFullReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
