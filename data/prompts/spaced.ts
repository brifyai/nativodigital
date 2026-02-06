/**
 * Prompt para generar calendarios de repaso espaciado
 * Basado en la ciencia de la repetición espaciada para mejor retención
 */

export const SPACED_PROMPT = (topic: string): string => {
  return `📆 **REPASA CADA DÍA: ${topic}**

Crea un calendario de repaso con CONTENIDO EDUCATIVO COMPLETO para "${topic}".

IMPORTANTE: 
- Usa el nombre "REPASA CADA DÍA" en tu respuesta
- En "QUÉ ESTUDIAR" debes entregar el CONTENIDO REAL, no solo tareas
- Explica los conceptos, da ejemplos, enseña el material

---
**REPASA CADA DÍA (Método Científico)**
---

**DÍA 1 - HOY**
Tiempo: 60 minutos

**QUÉ ESTUDIAR:**
• [Concepto 1]: [Explicación completa del concepto con ejemplos]
• [Concepto 2]: [Explicación completa del concepto con ejemplos]
• [Concepto 3]: [Explicación completa del concepto con ejemplos]
• Ejemplo práctico: [Ejemplo detallado aplicando los conceptos]

**OBJETIVO:** [Qué debes lograr entender hoy]

---

**DÍA 2 - MAÑANA**
Tiempo: 15 minutos

**QUÉ ESTUDIAR:**
• Repaso de [Concepto 1]: [Resumen breve con punto clave]
• Repaso de [Concepto 2]: [Resumen breve con punto clave]
• Pregunta de práctica: [Pregunta con respuesta]

**OBJETIVO:** [Qué debes reforzar]

---

**DÍA 4 - EN 3 DÍAS**
Tiempo: 10 minutos

**QUÉ ESTUDIAR:**
• Concepto clave: [Recordatorio del concepto más importante]
• Conexión: [Cómo se relaciona con otros temas]
• Mini-quiz: [Pregunta rápida para verificar]

**OBJETIVO:** [Qué debes recordar]

---

**DÍA 7 - EN 1 SEMANA**
Tiempo: 20 minutos

**QUÉ ESTUDIAR:**
• Repaso profundo: [Explicación completa de nuevo]
• Aplicación práctica: [Ejemplo real de uso]
• Dato curioso: [Información interesante relacionada]

**OBJETIVO:** [Qué debes dominar]

---

**DÍA 14 - EN 2 SEMANAS**
Tiempo: 15 minutos

**QUÉ ESTUDIAR:**
• Verificación: [Resumen de todos los conceptos]
• Autoevaluación: [Preguntas para verificar conocimiento]
• Áreas de mejora: [Qué repasar si tienes dudas]

**OBJETIVO:** [Qué debes asegurar]

---

**DÍA 30 - EN 1 MES**
Tiempo: 10 minutos

**QUÉ ESTUDIAR:**
• Mantenimiento: [Recordatorio rápido de conceptos clave]
• Aplicación avanzada: [Cómo usar en situaciones nuevas]
• Conexión con otros temas: [Relación con otros conocimientos]

**OBJETIVO:** [Qué debes mantener activo]

---

**TIPS PRO:**

• Pon alarmas en tu teléfono para cada día de repaso
• Lee en voz alta para mejor retención
• Enseña a alguien más lo que aprendiste
• Duerme bien después de estudiar

**DATO CIENTÍFICO:** Repasar cada día aumenta la retención hasta un 200% comparado con estudiar todo de una vez.

Entrega CONTENIDO EDUCATIVO REAL en cada día, no solo tareas.`;
};
