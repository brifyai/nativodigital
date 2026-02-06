export const FLASHCARDS_PROMPT = (topic: string) => `🎴 **TARJETAS DE MEMORIA: ${topic}**

Crea 5 flashcards super visuales y fáciles de memorizar sobre "${topic}". 

**IMPORTANTE: 
- Responde TODO en español, incluyendo preguntas, respuestas y tips.
- NO uses emojis en el contenido de las tarjetas (preguntas, respuestas, tips).
- Usa un lenguaje claro y profesional.**

**FORMATO PARA CADA TARJETA:**

**TARJETA #1**

**PREGUNTA:**
[Pregunta clara y directa en español, sin emojis]

**RESPUESTA:**
[Respuesta concisa y clara en español, sin emojis]

**TIP PARA RECORDAR:**
[Truco mnemotécnico o analogía simple en español, sin emojis]

---

Haz cada tarjeta memorable con tips mnemotécnicos creativos y explicaciones claras. TODO debe estar en español y sin emojis.`;
