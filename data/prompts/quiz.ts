export const QUIZ_PROMPT = (topic: string) => `Crea un quiz de 5 preguntas sobre "${topic}".

**IMPORTANTE:**
- Usa un formato limpio y estructurado
- NO uses líneas decorativas ni separadores
- Cada pregunta debe estar claramente separada
- Incluye 2 preguntas fáciles, 2 medias y 1 difícil

**FORMATO EXACTO PARA CADA PREGUNTA:**

**PREGUNTA #1 - Nivel: Fácil**

**PREGUNTA:**
¿Pregunta clara y específica?

**OPCIONES:**
A) Opción A
B) Opción B
C) Opción C
D) Opción D

**RESPUESTA CORRECTA:** A

**EXPLICACIÓN:**
Explicación clara de por qué A es correcta y las demás no.

**CONCEPTO CLAVE:**
El concepto principal que evalúa esta pregunta.

(Repite este formato para las 5 preguntas)

Haz las explicaciones educativas y motivadoras.`;
