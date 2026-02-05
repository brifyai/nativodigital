
import React from 'react';
import {
  LocalFlorist as LocalFloristIcon,
  MenuBook as MenuBookIcon,
  Calculate as CalculateIcon,
  EditNote as EditNoteIcon,
} from '@mui/icons-material';

export const INITIAL_GREETING = "Hola. ¿Qué quieres aprender hoy?";

export const SUGGESTIONS = [
  { text: "Explícame la fotosíntesis", icon: LocalFloristIcon, color: "text-green-500" },
  { text: "Resumen de Don Quijote", icon: MenuBookIcon, color: "text-blue-500" },
  { text: "Ayuda con ecuaciones", icon: CalculateIcon, color: "text-purple-500" },
  { text: "Crear un plan de estudio", icon: EditNoteIcon, color: "text-orange-500" },
];

export const GEMINI_MODEL_OPTIONS = [
  { 
    id: 'gemini-3-flash-preview', 
    name: 'Modo Estudio (Recomendado)',
    instruction: "IDIOMA: Responde SIEMPRE en español. ESTRATEGIA: Modo Estudio Equilibrado. Tu tono es motivador y pedagógico. Fomenta la curiosidad. Si das una respuesta larga, usa listas y negritas para facilitar la lectura. Eres un tutor paciente." 
  },
  { 
    id: 'gemini-3-pro-preview', 
    name: 'Modo Experto (Matemáticas/Tesis)',
    instruction: "IDIOMA: Responde SIEMPRE en español. ESTRATEGIA: Modo Experto/Académico. Prioriza la profundidad, el rigor técnico y el razonamiento complejo. Cita fuentes cuando sea posible. En matemáticas y ciencias, explica el 'por qué' detalladamente. No simplifiques excesivamente a menos que se pida." 
  },
  { 
    id: 'gemini-flash-lite-latest', 
    name: 'Modo Ahorro (Rápido)',
    instruction: "IDIOMA: Responde SIEMPRE en español. ESTRATEGIA: Modo Ahorro de Datos. SÉ EXTREMADAMENTE CONCISO. Ve directo al grano. Evita saludos largos o explicaciones innecesarias. Prioriza listas cortas y respuestas directas para minimizar el uso de tokens y datos del usuario." 
  },
];
