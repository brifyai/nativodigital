# 💬 PROMPTS PARA TESTING - 3 MEJORAS CRÍTICAS

**Guía rápida de prompts para probar todas las funcionalidades**

---

## 📚 PROMPTS PARA GENERAR CONTENIDO GUARDABLE

### Resúmenes
```
Hazme un resumen completo sobre la Revolución Francesa
```

```
Resume los conceptos clave de la fotosíntesis
```

```
Explícame el teorema de Pitágoras de forma simple
```

### Flashcards
```
Genera 10 flashcards sobre vocabulario de inglés nivel básico
```

```
Crea flashcards para memorizar las capitales de Europa
```

```
Hazme tarjetas de estudio sobre los elementos químicos
```

### Planes de Estudio
```
Crea un plan de estudio Pomodoro para aprender álgebra
```

```
Hazme un calendario de estudio para el examen de historia
```

```
Diseña un plan de 2 semanas para aprender programación básica
```

### Notas Cornell
```
Crea notas Cornell sobre la Segunda Guerra Mundial
```

```
Hazme apuntes estilo Cornell sobre el sistema solar
```

---

## 🎯 PROMPTS PARA GENERAR QUIZZES

### Quizzes Básicos (5 preguntas)
```
Hazme un quiz de 5 preguntas sobre matemáticas básicas. Incluye:
- Pregunta
- 4 opciones (A, B, C, D)
- Respuesta correcta
- Explicación
```

```
Crea un quiz de 5 preguntas sobre historia de Chile
```

```
Quiz de 5 preguntas sobre biología celular
```

### Quizzes por Materia

#### Matemáticas
```
Quiz de 5 preguntas sobre:
- Suma y resta
- Multiplicación
- División
- Fracciones
- Porcentajes
```

#### Ciencias
```
Quiz de 5 preguntas sobre:
- Fotosíntesis
- Ciclo del agua
- Estados de la materia
- Sistema solar
- Energía
```

#### Historia
```
Quiz de 5 preguntas sobre:
- Independencia de Chile
- Revolución Francesa
- Segunda Guerra Mundial
- Descubrimiento de América
- Civilizaciones antiguas
```

#### Lenguaje
```
Quiz de 5 preguntas sobre:
- Gramática española
- Ortografía
- Comprensión lectora
- Figuras literarias
- Tipos de texto
```

#### Inglés
```
Quiz de 5 preguntas sobre:
- Vocabulario básico
- Tiempos verbales
- Preposiciones
- Phrasal verbs
- Conversación
```

### Quizzes Avanzados (10 preguntas)
```
Crea un quiz de 10 preguntas sobre física cuántica. Formato:

**Pregunta 1:** [texto]
A) [opción]
B) [opción]
C) [opción]
D) [opción]
**Respuesta correcta:** [letra]
**Explicación:** [por qué es correcta]
```

---

## 🎓 PROMPTS PARA GENERAR TEMAS DÉBILES

### Estrategia: Completar múltiples quizzes del mismo tema

#### Paso 1: Primer quiz (intenta sacar 60%)
```
Quiz de 5 preguntas sobre álgebra básica
```
*Responde mal algunas preguntas a propósito*

#### Paso 2: Segundo quiz del mismo tema (intenta sacar 70%)
```
Otro quiz de 5 preguntas sobre álgebra, pero con diferentes ejercicios
```
*Responde un poco mejor*

#### Paso 3: Tercer quiz del mismo tema (intenta sacar 80%)
```
Un último quiz de álgebra para practicar
```
*Responde mejor*

#### Resultado
- El sistema detectará "Álgebra" como tema débil
- Podrás hacer click en "Repasar Ahora"
- Se generará automáticamente un nuevo quiz de repaso

---

## 🔥 PROMPTS PARA TESTING COMPLETO

### Secuencia Recomendada

#### 1. Generar contenido variado
```
1. "Resumen de la fotosíntesis"
2. "10 flashcards sobre vocabulario inglés"
3. "Plan Pomodoro para estudiar historia"
4. "Notas Cornell sobre el sistema solar"
5. "Quiz de 5 preguntas sobre matemáticas"
```

#### 2. Guardar todo en biblioteca
- Click en "Guardar" en cada respuesta
- Categorizar correctamente

#### 3. Practicar quizzes
```
1. "Quiz de 5 preguntas sobre biología"
2. "Quiz de 5 preguntas sobre historia"
3. "Quiz de 5 preguntas sobre matemáticas"
4. "Quiz de 5 preguntas sobre física"
5. "Quiz de 5 preguntas sobre química"
```

#### 4. Completar quizzes con diferentes scores
- Biología: 90% (bien)
- Historia: 80% (bien)
- Matemáticas: 60% (mal)
- Física: 65% (mal)
- Química: 85% (bien)

#### 5. Verificar temas débiles
- Abrir "Temas Débiles"
- Verificar que Matemáticas y Física aparecen en rojo/amarillo
- Hacer click en "Repasar Ahora"

---

## 🎨 PROMPTS CREATIVOS

### Para probar el parser de quizzes

#### Formato Estándar (debe funcionar)
```
Crea un quiz con este formato exacto:

**Pregunta 1:** ¿Cuál es la capital de Francia?
A) Londres
B) París
C) Madrid
D) Roma
**Respuesta correcta:** B
**Explicación:** París es la capital de Francia desde el siglo XII.

**Pregunta 2:** ¿Cuánto es 2 + 2?
A) 3
B) 4
C) 5
D) 6
**Respuesta correcta:** B
**Explicación:** 2 + 2 = 4 es una suma básica.
```

#### Formato Incorrecto (debe fallar)
```
Hazme preguntas sobre historia pero sin formato específico
```
*Esto debe mostrar error al intentar practicar*

---

## 📊 PROMPTS PARA DIFERENTES NIVELES

### Primaria (6-12 años)
```
Quiz de 5 preguntas sobre animales para niños de 8 años
```

```
Resumen simple sobre el ciclo del agua para primaria
```

```
Flashcards de colores en inglés para niños
```

### Secundaria (12-18 años)
```
Quiz de 5 preguntas sobre la Revolución Industrial
```

```
Resumen de ecuaciones cuadráticas para secundaria
```

```
Plan de estudio para el examen de química
```

### Universidad
```
Quiz de 10 preguntas sobre cálculo diferencial
```

```
Resumen avanzado de termodinámica
```

```
Notas Cornell sobre teoría de la relatividad
```

---

## 🌍 PROMPTS EN DIFERENTES IDIOMAS

### Español
```
Quiz de 5 preguntas sobre gramática española
```

### Inglés
```
Create a quiz with 5 questions about English grammar
```

### Mezcla (para probar traducción)
```
Quiz de 5 questions sobre vocabulary en inglés
```

---

## 🎯 PROMPTS PARA EDGE CASES

### Quiz muy largo
```
Crea un quiz de 20 preguntas sobre historia universal
```
*Debe funcionar pero tomar más tiempo*

### Quiz muy corto
```
Quiz de 2 preguntas sobre matemáticas
```
*Debe funcionar*

### Sin formato
```
Hazme preguntas sobre ciencia
```
*No debe tener botón "Practicar"*

### Contenido muy largo
```
Hazme un resumen de 2000 palabras sobre la historia de la humanidad
```
*Debe guardarse correctamente*

### Caracteres especiales
```
Quiz sobre símbolos matemáticos: ∑, ∫, √, π, ∞
```
*Debe renderizar correctamente*

---

## 📝 TEMPLATE DE QUIZ PERFECTO

Usa este template para generar quizzes que siempre funcionen:

```
Crea un quiz de 5 preguntas sobre [TEMA]. Usa este formato exacto:

**Pregunta 1:** [Tu pregunta aquí]
A) [Opción A]
B) [Opción B]
C) [Opción C]
D) [Opción D]
**Respuesta correcta:** [A/B/C/D]
**Explicación:** [Por qué es correcta]

**Pregunta 2:** [Tu pregunta aquí]
A) [Opción A]
B) [Opción B]
C) [Opción C]
D) [Opción D]
**Respuesta correcta:** [A/B/C/D]
**Explicación:** [Por qué es correcta]

[... continúa hasta 5 preguntas]
```

---

## 🚀 SECUENCIA DE TESTING RÁPIDO (5 minutos)

### Minuto 1: Guardar contenido
```
"Resumen de la fotosíntesis"
```
→ Click "Guardar" → Abrir "Biblioteca" → Verificar

### Minuto 2: Quiz interactivo
```
"Quiz de 5 preguntas sobre matemáticas básicas"
```
→ Click "Practicar" → Responder → Ver resultados

### Minuto 3: Segundo quiz
```
"Quiz de 5 preguntas sobre matemáticas"
```
→ Click "Practicar" → Responder mal → Ver resultados

### Minuto 4: Temas débiles
→ Abrir "Temas Débiles" → Verificar "Matemáticas" en rojo

### Minuto 5: Repasar
→ Click "Repasar Ahora" → Verificar que genera nuevo quiz

---

## 🎉 PROMPTS DIVERTIDOS

### Para hacer el testing más entretenido

```
Quiz de 5 preguntas sobre curiosidades de animales
```

```
Resumen de los superpoderes más cool de la ciencia
```

```
Flashcards de datos random que nadie sabe
```

```
Quiz de 5 preguntas sobre mitos y leyendas
```

```
Plan de estudio para aprender a cocinar pizza perfecta
```

---

## 📌 NOTAS IMPORTANTES

### Para que el quiz funcione correctamente:
1. ✅ Usa el formato exacto con `**Pregunta X:**`
2. ✅ Incluye 4 opciones (A, B, C, D)
3. ✅ Especifica `**Respuesta correcta:**` con la letra
4. ✅ Agrega `**Explicación:**` después de cada respuesta

### Si el quiz no se parsea:
1. Regenera la respuesta
2. Pide explícitamente el formato
3. Usa el template de arriba

---

## 🎯 CHECKLIST DE PROMPTS

Marca los que ya probaste:

### Contenido Guardable
- [ ] Resumen
- [ ] Flashcards
- [ ] Plan de estudio
- [ ] Notas Cornell
- [ ] Quiz

### Quizzes por Materia
- [ ] Matemáticas
- [ ] Ciencias
- [ ] Historia
- [ ] Lenguaje
- [ ] Inglés

### Niveles
- [ ] Primaria
- [ ] Secundaria
- [ ] Universidad

### Edge Cases
- [ ] Quiz largo
- [ ] Quiz corto
- [ ] Sin formato
- [ ] Caracteres especiales

---

**¡Listo para empezar el testing!** 🚀

Copia y pega estos prompts en el chat para probar todas las funcionalidades.
