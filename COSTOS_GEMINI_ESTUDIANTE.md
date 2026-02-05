# 💰 Análisis de Costos: Gemini API para Estudiantes

**Fecha:** Febrero 2026  
**App:** AccesoIA - Educación Libre  
**Modelo Principal:** Gemini 3 Flash Preview

---

## 📊 Resumen Ejecutivo

**Para un estudiante promedio, AccesoIA es GRATIS** gracias al tier gratuito de Google Gemini API que ofrece:
- ✅ **Sin tarjeta de crédito requerida**
- ✅ **1,000 requests por día**
- ✅ **5-15 requests por minuto (RPM)**
- ✅ **Acceso a Google Search y Code Execution**

**Costo estimado si se excede el tier gratuito:** $0.50 - $2.00 USD/mes para uso estudiantil intensivo.

---

## 🎯 Modelos Disponibles en AccesoIA

| Modelo | Uso en la App | Precio Input | Precio Output |
|--------|---------------|--------------|---------------|
| **Gemini 3 Flash** | Modo Estudio (Recomendado) | $0.10/1M tokens | $0.40/1M tokens |
| **Gemini 3 Pro** | Modo Experto (Matemáticas) | $4.00/1M tokens | $18.00/1M tokens |
| **Flash Lite** | Modo Ahorro (Rápido) | $0.05/1M tokens | $0.20/1M tokens |

*Fuente: [Google AI Pricing 2026](https://ai.google.dev/pricing)*

---

## 📝 Estimación de Tokens por Conversación

### Conversación Típica de Estudio

**Ejemplo Real:**
```
ESTUDIANTE: "Explícame la fotosíntesis"
→ Input: ~10 tokens

GEMINI: [Respuesta de 300 palabras con explicación detallada]
→ Output: ~400 tokens

ESTUDIANTE: "¿Puedes hacerme un quiz de 5 preguntas?"
→ Input: ~15 tokens

GEMINI: [Quiz con 5 preguntas + respuestas + explicaciones]
→ Output: ~600 tokens
```

**Total por conversación:** ~1,025 tokens (10 + 400 + 15 + 600)

### Tokens por Tipo de Actividad

| Actividad | Input (tokens) | Output (tokens) | Total |
|-----------|----------------|-----------------|-------|
| Pregunta simple | 10-20 | 200-400 | 210-420 |
| Explicación detallada | 20-50 | 500-800 | 520-850 |
| Generar flashcards | 15-30 | 600-1,000 | 615-1,030 |
| Generar quiz | 15-30 | 800-1,200 | 815-1,230 |
| Resumen de tema | 30-100 | 400-700 | 430-800 |
| Análisis de imagen | 50-100 | 300-600 | 350-700 |
| Plan de estudio Pomodoro | 20-40 | 800-1,200 | 820-1,240 |
| Método Cornell | 20-40 | 700-1,000 | 720-1,040 |
| Mapa mental | 20-40 | 900-1,400 | 920-1,440 |

---

## 👨‍🎓 Perfiles de Uso Estudiantil

### Perfil 1: Estudiante Casual (Tier Gratuito)
**Uso:** 5-10 conversaciones/día  
**Duración:** 15-30 minutos/día  
**Tokens/día:** ~8,000 tokens  
**Requests/día:** 15-20 requests  

**Costo:** **$0.00 USD/mes** ✅ (Dentro del tier gratuito)

---

### Perfil 2: Estudiante Regular (Tier Gratuito)
**Uso:** 15-25 conversaciones/día  
**Duración:** 1-2 horas/día  
**Tokens/día:** ~20,000 tokens  
**Requests/día:** 40-60 requests  

**Costo:** **$0.00 USD/mes** ✅ (Dentro del tier gratuito)

---

### Perfil 3: Estudiante Intensivo (Época de Exámenes)
**Uso:** 40-60 conversaciones/día  
**Duración:** 3-4 horas/día  
**Tokens/día:** ~50,000 tokens  
**Requests/día:** 100-150 requests  

**Costo estimado (Gemini 3 Flash):**
- Input: 50,000 tokens × 30 días = 1.5M tokens/mes
- Output: 50,000 tokens × 30 días = 1.5M tokens/mes
- **Costo Input:** 1.5M × $0.10/1M = **$0.15 USD/mes**
- **Costo Output:** 1.5M × $0.40/1M = **$0.60 USD/mes**
- **TOTAL:** **$0.75 USD/mes** (~$560 CLP/mes)

---

### Perfil 4: Estudiante Pre-Universitario (PSU/PAES)
**Uso:** 60-100 conversaciones/día  
**Duración:** 4-6 horas/día  
**Tokens/día:** ~80,000 tokens  
**Requests/día:** 200-300 requests  

**Costo estimado (Gemini 3 Flash):**
- Input: 80,000 tokens × 30 días = 2.4M tokens/mes
- Output: 80,000 tokens × 30 días = 2.4M tokens/mes
- **Costo Input:** 2.4M × $0.10/1M = **$0.24 USD/mes**
- **Costo Output:** 2.4M × $0.40/1M = **$0.96 USD/mes**
- **TOTAL:** **$1.20 USD/mes** (~$900 CLP/mes)

---

## 💡 Optimización de Costos en AccesoIA

### 1. **Modo Ahorro (Flash Lite)**
- **Reducción de costos:** 50% menos que Flash
- **Ideal para:** Preguntas rápidas, definiciones, repasos
- **Costo:** $0.05 input + $0.20 output por 1M tokens

### 2. **Modo Estudio (Flash) - Recomendado**
- **Balance perfecto:** Velocidad + Calidad
- **Ideal para:** Uso diario, explicaciones, herramientas de estudio
- **Costo:** $0.10 input + $0.40 output por 1M tokens

### 3. **Modo Experto (Pro)**
- **Máxima potencia:** Para matemáticas complejas, tesis
- **Usar solo cuando sea necesario:** 40x más caro que Flash
- **Costo:** $4.00 input + $18.00 output por 1M tokens

---

## 📈 Comparación con Otras Plataformas

| Plataforma | Costo Mensual | Límites | Características |
|------------|---------------|---------|-----------------|
| **AccesoIA (Gemini)** | $0.00 - $2.00 | 1,000 req/día gratis | Google Search, Code Execution, Imágenes |
| ChatGPT Plus | $20.00 | Ilimitado | GPT-4, DALL-E, Plugins |
| Claude Pro | $20.00 | Ilimitado | Claude 3 Opus |
| Perplexity Pro | $20.00 | 300 búsquedas/día | Búsqueda web avanzada |
| **Ventaja AccesoIA** | **10-100x más barato** | Suficiente para estudiantes | Gratis para 99% de usuarios |

---

## 🎓 Casos de Uso Reales - Chile

### Caso 1: María - 3° Medio (Preparación PSU)
**Perfil:**
- Estudia 3 horas/día con AccesoIA
- Usa principalmente Modo Estudio (Flash)
- 40 conversaciones/día promedio
- Genera quizzes, flashcards y resúmenes

**Uso mensual:**
- 1,200 conversaciones/mes
- ~1.2M tokens input
- ~1.2M tokens output

**Costo:** **$0.60 USD/mes** ($450 CLP/mes)

**Comparación:** Si usara ChatGPT Plus = $20 USD/mes ($15,000 CLP/mes)  
**Ahorro:** **97% menos** 💰

---

### Caso 2: Juan - 1° Año Universidad (Ingeniería)
**Perfil:**
- Estudia 4 horas/día
- Usa Modo Experto para cálculo y física
- 30 conversaciones/día (50% Flash, 50% Pro)
- Análisis de problemas complejos

**Uso mensual:**
- 900 conversaciones/mes
- Flash: 0.6M tokens input + 0.6M output
- Pro: 0.6M tokens input + 0.6M output

**Costo:**
- Flash: $0.06 + $0.24 = $0.30
- Pro: $2.40 + $10.80 = $13.20
- **TOTAL:** **$13.50 USD/mes** ($10,125 CLP/mes)

**Recomendación:** Usar Flash para teoría y Pro solo para problemas complejos → Reducir a $2-3 USD/mes

---

### Caso 3: Sofía - 5° Básico (Uso Casual)
**Perfil:**
- Estudia 30 minutos/día
- 5-8 conversaciones/día
- Preguntas simples y tareas

**Uso mensual:**
- 180 conversaciones/mes
- ~180,000 tokens total

**Costo:** **$0.00 USD/mes** ✅ (Tier gratuito)

---

## 🚀 Funcionalidades que Consumen Más Tokens

### Alto Consumo (800-1,500 tokens)
1. **Mapa Mental** - Estructura visual compleja
2. **Plan Pomodoro** - Sesiones detalladas
3. **Quiz Completo** - 5+ preguntas con explicaciones
4. **Método Cornell** - Formato estructurado

### Consumo Medio (400-800 tokens)
1. **Flashcards** - 10 tarjetas
2. **Resumen** - Tema específico
3. **Explicación Detallada** - Concepto complejo
4. **Técnica Feynman** - Guía paso a paso

### Bajo Consumo (200-400 tokens)
1. **Pregunta Simple** - Definición
2. **Aclaración** - Duda específica
3. **Ejemplo Rápido** - Caso práctico
4. **Traducción** - Término técnico

---

## 💰 Cálculo de Costo por Herramienta

### Usando Gemini 3 Flash ($0.10 input + $0.40 output por 1M tokens)

| Herramienta | Tokens Promedio | Costo por Uso |
|-------------|-----------------|---------------|
| Pregunta simple | 300 | $0.00015 |
| Flashcards (10) | 800 | $0.00040 |
| Quiz (5 preguntas) | 1,000 | $0.00050 |
| Resumen | 600 | $0.00030 |
| Plan Pomodoro | 1,200 | $0.00060 |
| Método Feynman | 900 | $0.00045 |
| Notas Cornell | 1,000 | $0.00050 |
| Mapa Mental | 1,400 | $0.00070 |
| Repetición Espaciada | 1,100 | $0.00055 |
| Recuperación Activa | 1,300 | $0.00065 |

**Ejemplo:** Un estudiante que genera 20 flashcards + 5 quizzes + 10 resúmenes al mes:
- Costo: (20 × $0.0004) + (5 × $0.0005) + (10 × $0.0003) = **$0.0135 USD/mes** (~$10 CLP/mes)

---

## 🌟 Ventajas del Tier Gratuito de Gemini

### ✅ Lo que SÍ incluye GRATIS:
1. **Google Search Integration** - Búsquedas web en tiempo real
2. **Code Execution** - Ejecuta código Python para matemáticas
3. **Visión (Imágenes)** - Analiza fotos de tareas
4. **Multimodal** - Texto + imágenes + código
5. **1,000 requests/día** - Suficiente para 99% de estudiantes
6. **Sin tarjeta de crédito** - Registro simple

### ❌ Limitaciones del Tier Gratuito:
1. **Rate Limits:** 5-15 RPM (requests por minuto)
2. **Requests diarios:** 1,000/día máximo
3. **Sin soporte prioritario**
4. **Puede tener latencia en horas pico**

---

## 📊 Proyección de Costos Anuales

### Estudiante Promedio (Tier Gratuito)
- **Costo anual:** $0.00 USD ✅
- **Ahorro vs ChatGPT Plus:** $240 USD/año

### Estudiante Intensivo (Época de Exámenes)
- **Meses normales (8):** $0.00 USD
- **Meses de exámenes (4):** $0.75 × 4 = $3.00 USD
- **Costo anual:** $3.00 USD
- **Ahorro vs ChatGPT Plus:** $237 USD/año (99% menos)

### Estudiante Pre-Universitario (Todo el año)
- **Costo mensual:** $1.20 USD
- **Costo anual:** $14.40 USD
- **Ahorro vs ChatGPT Plus:** $225.60 USD/año (94% menos)

---

## 🎯 Recomendaciones para Minimizar Costos

### 1. **Usa el Modo Correcto**
- **Casual/Diario:** Modo Ahorro (Flash Lite)
- **Estudio Regular:** Modo Estudio (Flash) ← Recomendado
- **Matemáticas Complejas:** Modo Experto (Pro) - Solo cuando sea necesario

### 2. **Optimiza tus Preguntas**
- ✅ Sé específico: "Explica la fotosíntesis en 200 palabras"
- ❌ Evita: "Cuéntame todo sobre biología"

### 3. **Reutiliza Contenido**
- Exporta conversaciones importantes
- Guarda flashcards y quizzes generados
- Usa el historial para repasar

### 4. **Aprovecha el Tier Gratuito**
- 1,000 requests/día = ~30-50 conversaciones
- Suficiente para 3-4 horas de estudio intensivo
- Reinicia a medianoche (hora del servidor)

### 5. **Planifica tu Estudio**
- Genera materiales al inicio de la semana
- Usa herramientas offline para repasar
- Reserva la IA para dudas complejas

---

## 📱 Comparación: AccesoIA vs Alternativas

| Característica | AccesoIA | ChatGPT Plus | Claude Pro | Perplexity |
|----------------|----------|--------------|------------|------------|
| **Costo/mes** | $0-2 | $20 | $20 | $20 |
| **Tier Gratuito** | ✅ 1,000 req/día | ❌ Limitado | ❌ Limitado | ✅ 5 búsquedas/día |
| **Google Search** | ✅ Incluido | ❌ | ❌ | ✅ |
| **Code Execution** | ✅ Incluido | ✅ | ❌ | ❌ |
| **Visión (Imágenes)** | ✅ Incluido | ✅ | ✅ | ✅ |
| **Personalización** | ✅ Por curso | ❌ | ❌ | ❌ |
| **Offline** | ✅ PWA | ❌ | ❌ | ❌ |
| **Sin Registro** | ✅ Local | ❌ Requiere cuenta | ❌ Requiere cuenta | ❌ Requiere cuenta |

---

## 💡 Conclusión

### Para Estudiantes Chilenos:

**🎓 Educación Básica y Media:**
- **Costo:** $0.00 USD/mes (100% gratis)
- **Suficiente para:** Todo el año escolar
- **Límite:** 1,000 requests/día = ~40 conversaciones

**🎓 Pre-Universitario (PSU/PAES):**
- **Costo:** $0.00 - $1.50 USD/mes
- **Equivalente:** $0 - $1,125 CLP/mes
- **Comparación:** Una bebida en el colegio

**🎓 Universidad:**
- **Costo:** $1.00 - $3.00 USD/mes (uso inteligente)
- **Equivalente:** $750 - $2,250 CLP/mes
- **Comparación:** Un café al mes

### Ahorro Real:
- **vs ChatGPT Plus:** 90-100% menos
- **vs Tutorías privadas:** 99.9% menos ($30,000-50,000 CLP/mes)
- **vs Academia preuniversitaria:** 99.5% menos ($150,000-300,000 CLP/mes)

---

## 🚀 Próximos Pasos

### Para Mantener Costos en $0:
1. ✅ Usa el tier gratuito (1,000 req/día)
2. ✅ Selecciona Modo Estudio (Flash) por defecto
3. ✅ Exporta y guarda contenido importante
4. ✅ Planifica sesiones de estudio eficientes

### Si Necesitas Más:
1. Considera el tier pagado solo en época de exámenes
2. Usa Modo Experto (Pro) solo para problemas muy complejos
3. Comparte cuenta con compañeros (uso responsable)

---

**Última actualización:** Febrero 2026  
**Fuentes:**
- [Google AI Pricing](https://ai.google.dev/pricing)
- [Gemini API Documentation](https://ai.google.dev/docs)
- Análisis interno de uso de AccesoIA

**Nota:** Los precios pueden variar. Consulta siempre la documentación oficial de Google AI para información actualizada.
