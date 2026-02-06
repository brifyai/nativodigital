/**
 * Prompt para generar mapas mentales visuales
 * Estructura: Tema central + Ramas principales + Sub-conceptos + Conexiones
 */

export const MINDMAP_PROMPT = (topic: string): string => {
  return `🎨 **DIBUJA LAS IDEAS: ${topic}**

Crea un diagrama visual y detallado sobre "${topic}" para que un niño pueda dibujarlo.

IMPORTANTE: Usa el nombre "DIBUJA LAS IDEAS" en tu respuesta, NO "Mapa Mental".

---
**DIBUJA LAS IDEAS**
---

**TEMA CENTRAL: ${topic.toUpperCase()}**

**RAMA 1: [Nombre de la rama]**

• **Sub-concepto 1:** [Nombre]
  - [Explicación breve]
  - Ejemplo: [Ejemplo rápido]

• **Sub-concepto 2:** [Nombre]
  - [Explicación breve]
  - Ejemplo: [Ejemplo rápido]

• **Sub-concepto 3:** [Nombre]
  - [Explicación breve]
  - Ejemplo: [Ejemplo rápido]

**Conecta con:** [Otras ramas relacionadas]

---

**RAMA 2: [Nombre de la rama]**

• **Sub-concepto 1:** [Nombre]
  - [Explicación breve]
  - Ejemplo: [Ejemplo rápido]

• **Sub-concepto 2:** [Nombre]
  - [Explicación breve]
  - Ejemplo: [Ejemplo rápido]

• **Sub-concepto 3:** [Nombre]
  - [Explicación breve]
  - Ejemplo: [Ejemplo rápido]

**Conecta con:** [Otras ramas relacionadas]

---

**RAMA 3: [Nombre de la rama]**

• **Sub-concepto 1:** [Nombre]
  - [Explicación breve]
  - Ejemplo: [Ejemplo rápido]

• **Sub-concepto 2:** [Nombre]
  - [Explicación breve]
  - Ejemplo: [Ejemplo rápido]

• **Sub-concepto 3:** [Nombre]
  - [Explicación breve]
  - Ejemplo: [Ejemplo rápido]

**Conecta con:** [Otras ramas relacionadas]

---

**CONEXIONES CLAVE:**

• [Rama 1] ↔ [Rama 2]: [Cómo se relacionan]
• [Rama 2] ↔ [Rama 3]: [Cómo se relacionan]
• [Rama 1] ↔ [Rama 3]: [Cómo se relacionan]

---

**PALABRAS CLAVE PARA RECORDAR:**

[Término 1] | [Término 2] | [Término 3] | [Término 4]

**TIP:** Dibuja esto en papel con colores para memorizarlo mejor.

Haz que sea super visual y fácil de recordar.`;
};
