/**
 * Prompt para generar guías de aprendizaje usando el método Feynman
 * Ayuda a los estudiantes a explicar conceptos con sus propias palabras
 */

export const FEYNMAN_PROMPT = (topic: string): string => {
  return `🎓 **EXPLICA CON TUS PALABRAS: ${topic}**

Ayúdame a aprender "${topic}" explicándolo como si fuera un niño de 10 años.

**IMPORTANTE: El título de tu respuesta debe ser "EXPLICA CON TUS PALABRAS: ${topic}", NO uses "Técnica Feynman" ni "Método Feynman".**

---
**APRENDE EXPLICANDO CON TUS PALABRAS**
---

**PASO 1: EXPLICA SIMPLE**

Explica "${topic}" como si le enseñaras a un niño de 10 años:

[Explicación super simple, sin palabras técnicas, con analogías cotidianas]

---

**PASO 2: ENCUENTRA LAS LAGUNAS**

**¿Qué partes son difíciles de explicar?**
• [Concepto difícil 1]
• [Concepto difícil 2]
• [Concepto difícil 3]

**¿Dónde usaste jerga técnica?**
• [Término técnico 1] → Necesitas simplificarlo
• [Término técnico 2] → Necesitas simplificarlo

---

**PASO 3: USA ANALOGÍAS**

Para cada concepto complejo, crea una analogía del mundo real:

**[Concepto 1]** es como...
   - [Analogía simple y memorable]

**[Concepto 2]** es como...
   - [Analogía simple y memorable]

**[Concepto 3]** es como...
   - [Analogía simple y memorable]

---

**PASO 4: RESUMEN FINAL**

Ahora resume TODO en 3-4 oraciones que cualquiera pueda entender:

[Resumen super claro y simple]

---

**PREGUNTAS DE VERIFICACIÓN:**

• ¿Puedo explicar esto sin mirar mis notas?
• ¿Usé palabras que un niño entendería?
• ¿Mis analogías son claras?
• ¿Podría enseñar esto a alguien más?

**SI RESPONDISTE SÍ A TODO:** ¡Realmente entiendes el tema!
**SI RESPONDISTE NO:** Repasa las partes difíciles.

Haz que sea divertido y fácil de entender.`;
};
