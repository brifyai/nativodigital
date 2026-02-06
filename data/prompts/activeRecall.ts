/**
 * Prompt para generar preguntas de recuperación activa
 * Ayuda a practicar recordar información sin mirar las notas
 */

export const ACTIVE_RECALL_PROMPT = (topic: string): string => {
  return `🎯 **PRACTICA RECORDAR: ${topic}**

Crea preguntas de práctica para recordar sobre "${topic}".

IMPORTANTE: 
- Usa el nombre "PRACTICA RECORDAR" en tu respuesta, NO "Recuperación Activa"
- Usa el formato exacto que se muestra abajo

---
**💪 PRACTICA RECORDAR**
---

**PREGUNTA 1:**
[Escribe aquí la primera pregunta sobre conceptos básicos]

**PISTA:**
[Una pista opcional para ayudar]

**RESPUESTA:**
[La respuesta completa y detallada]

---

**PREGUNTA 2:**
[Segunda pregunta sobre comprensión]

**PISTA:**
[Pista opcional]

**RESPUESTA:**
[Respuesta detallada]

---

**PREGUNTA 3:**
[Tercera pregunta sobre aplicación]

**PISTA:**
[Pista opcional]

**RESPUESTA:**
[Respuesta detallada]

---

**PREGUNTA 4:**
[Cuarta pregunta más avanzada]

**RESPUESTA:**
[Respuesta detallada]

---

**PREGUNTA 5:**
[Quinta pregunta de aplicación práctica]

**RESPUESTA:**
[Respuesta detallada]

---

💡 **CÓMO USAR:**
1. Lee cada pregunta
2. Intenta responder sin mirar
3. Verifica tu respuesta
4. Si acertaste, marca como dominada

🎯 **TIP:** Practica estas preguntas varias veces hasta dominarlas todas.

REGLAS IMPORTANTES:
- Crea 5-8 preguntas variadas (básicas, intermedias y avanzadas)
- NO uses emojis en las preguntas ni respuestas
- Las pistas son opcionales
- Cada pregunta debe tener su respuesta completa
- Usa el formato exacto: **PREGUNTA X:**, **PISTA:**, **RESPUESTA:**`;
};
