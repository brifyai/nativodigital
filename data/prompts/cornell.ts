/**
 * Prompt para generar apuntes organizados usando el sistema Cornell
 * Estructura: Preguntas clave + Notas detalladas + Resumen
 */

export const CORNELL_PROMPT = (topic: string): string => {
  return `📓 **APUNTES ORGANIZADOS: ${topic}**

Crea apuntes organizados sobre "${topic}".

**IMPORTANTE: El título de tu respuesta debe ser "APUNTES ORGANIZADOS: ${topic}", NO uses "Apuntes Cornell" ni "Notas Cornell".**

---
**SISTEMA DE APUNTES ORGANIZADOS**
---

**COLUMNA IZQUIERDA: PREGUNTAS CLAVE**

**Pregunta 1:** [Pregunta sobre tema 1]

**Pregunta 2:** [Pregunta sobre tema 2]

**Pregunta 3:** [Pregunta sobre tema 3]

**Pregunta 4:** [Pregunta sobre tema 4]

---

**COLUMNA DERECHA: NOTAS DETALLADAS**

**Tema 1:**
• Punto importante 1
• Punto importante 2
• Punto importante 3
• Dato clave

**Tema 2:**
• Punto importante 1
• Punto importante 2
• Punto importante 3
• Dato clave

**Tema 3:**
• Punto importante 1
• Punto importante 2
• Punto importante 3
• Dato clave

**Tema 4:**
• Punto importante 1
• Punto importante 2
• Dato clave

---

**RESUMEN (Escribe esto al final de tu sesión)**

[Resume TODO en 3-4 oraciones clave que capturen lo esencial]

---

**CÓMO USAR ESTOS APUNTES:**

1. **Durante el estudio:** Toma notas en la columna derecha
2. **Después:** Crea preguntas en la columna izquierda
3. **Para repasar:** Cubre la columna derecha y responde las preguntas
4. **Antes de dormir:** Lee el resumen

**TIP PRO:** Repasa estos apuntes 24 horas después para mejor retención.

Haz que sea fácil de escanear visualmente.`;
};
