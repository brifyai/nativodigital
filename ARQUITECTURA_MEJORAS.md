# 🏗️ ARQUITECTURA DE LAS 3 MEJORAS CRÍTICAS

**Documentación técnica de la implementación**

---

## 📊 DIAGRAMA DE COMPONENTES

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              AppProviders.tsx                          │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         SavedContentProvider                     │ │ │
│  │  │  - savedContent: SavedContent[]                  │ │ │
│  │  │  - quizSessions: QuizSession[]                   │ │ │
│  │  │  - topicPerformance: TopicPerformance[]         │ │ │
│  │  │  - addSavedContent()                             │ │ │
│  │  │  - deleteSavedContent()                          │ │ │
│  │  │  - toggleFavorite()                              │ │ │
│  │  │  - addQuizSession()                              │ │ │
│  │  │  - getWeakTopics()                               │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Header                              │ │
│  │  [Biblioteca] [Temas Débiles] [Progreso] [Estudiar]  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Chat Area                             │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │            MessageBubble                         │ │ │
│  │  │  [💬 Mensaje]                                    │ │ │
│  │  │  [🔖 Guardar] [▶️ Practicar] [👍] [👎] [🔄]     │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Modales                             │ │
│  │  - SavedContentLibrary                                 │ │
│  │  - InteractiveQuiz                                     │ │
│  │  - QuizResults                                         │ │
│  │  - WeakTopicsAnalysis                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE DATOS

### 1. Sistema de Guardados

```
Usuario → MessageBubble → handleSaveContent() → SavedContentContext
                                                        ↓
                                                  localStorage
                                                        ↓
                                              SavedContentLibrary
```

**Detalle:**
1. Usuario hace click en "Guardar" en MessageBubble
2. App.tsx ejecuta `handleSaveContent(message)`
3. Pide título, tema, materia al usuario
4. Llama a `addSavedContent()` del context
5. Context guarda en `localStorage` con key `nativo_saved_content`
6. SavedContentLibrary lee del context para mostrar

### 2. Quiz Interactivo

```
Usuario → MessageBubble → handleStartInteractiveQuiz() → parseQuizFromText()
                                                                ↓
                                                          QuizQuestion[]
                                                                ↓
                                                        InteractiveQuiz
                                                                ↓
                                                          QuizResults
                                                                ↓
                                                    SavedContentContext
                                                                ↓
                                                          localStorage
```

**Detalle:**
1. Usuario hace click en "Practicar" en MessageBubble
2. App.tsx ejecuta `handleStartInteractiveQuiz(message)`
3. Llama a `parseQuizFromText(message.content)` para extraer preguntas
4. Crea objeto `currentQuiz` con preguntas, título, tema, materia
5. Abre modal InteractiveQuiz
6. Usuario responde pregunta por pregunta
7. Al terminar, se crea QuizSession con resultados
8. Se muestra QuizResults
9. Session se guarda en context → localStorage

### 3. Análisis de Temas Débiles

```
QuizSession → SavedContentContext → calculateTopicPerformance()
                                              ↓
                                    TopicPerformance[]
                                              ↓
                                    WeakTopicsAnalysis
                                              ↓
                                    handleReviewWeakTopic()
                                              ↓
                                    Genera nuevo quiz
```

**Detalle:**
1. Cada vez que se completa un quiz, se guarda QuizSession
2. Context calcula automáticamente TopicPerformance
3. Agrupa por tema y calcula score promedio
4. WeakTopicsAnalysis lee del context
5. Muestra temas con score < 70% en rojo
6. Usuario hace click en "Repasar Ahora"
7. App.tsx ejecuta `handleReviewWeakTopic(topic, subject)`
8. Genera prompt automático para nuevo quiz
9. Envía mensaje a IA

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
src/
├── App.tsx                              # Componente principal
├── types.ts                             # Tipos TypeScript
├── components/
│   ├── MessageBubble.tsx                # Mensaje con botones
│   ├── SavedContentLibrary.tsx          # Biblioteca de contenido
│   ├── InteractiveQuiz.tsx              # Quiz interactivo
│   ├── QuizResults.tsx                  # Resultados del quiz
│   ├── WeakTopicsAnalysis.tsx           # Análisis de temas débiles
│   └── Sidebar.tsx                      # Sidebar con botones
├── contexts/
│   ├── AppProviders.tsx                 # Wrapper de providers
│   ├── SavedContentContext.tsx          # Context de contenido guardado
│   ├── AuthContext.tsx                  # Context de autenticación
│   ├── ChatContext.tsx                  # Context de chat
│   └── UIContext.tsx                    # Context de UI
└── utils/
    ├── quizParser.ts                    # Parser de quizzes
    ├── storage.ts                       # Utilidades de localStorage
    └── sweetAlert.ts                    # Alertas y toasts
```

---

## 🗄️ ESTRUCTURA DE DATOS

### SavedContent
```typescript
interface SavedContent {
  id: string;                    // UUID
  type: 'quiz' | 'summary' | 'flashcards' | 'plan' | 'notes' | 'other';
  title: string;                 // Título del contenido
  content: string;               // Contenido completo (markdown)
  topic: string;                 // Tema principal
  subject: string;               // Materia
  createdAt: number;             // Timestamp de creación
  lastReviewed?: number;         // Timestamp de último repaso
  reviewCount: number;           // Contador de repasos
  isFavorite: boolean;           // Marcado como favorito
  tags: string[];                // Tags para búsqueda
}
```

### QuizQuestion
```typescript
interface QuizQuestion {
  id: string;                    // UUID
  question: string;              // Texto de la pregunta
  options: string[];             // [A, B, C, D]
  correctAnswer: number;         // Índice de respuesta correcta (0-3)
  explanation: string;           // Explicación de la respuesta
  userAnswer?: number;           // Respuesta del usuario (0-3)
  isCorrect?: boolean;           // Si respondió correctamente
}
```

### QuizSession
```typescript
interface QuizSession {
  id: string;                    // UUID
  title: string;                 // Título del quiz
  topic: string;                 // Tema principal
  subject: string;               // Materia
  questions: QuizQuestion[];     // Array de preguntas
  score: number;                 // Score en porcentaje (0-100)
  correctCount: number;          // Número de correctas
  totalQuestions: number;        // Total de preguntas
  completedAt: number;           // Timestamp de finalización
  timeSpent?: number;            // Tiempo en segundos
}
```

### TopicPerformance
```typescript
interface TopicPerformance {
  topic: string;                 // Tema
  subject: string;               // Materia
  averageScore: number;          // Score promedio (0-100)
  totalAttempts: number;         // Número de intentos
  lastAttempt: number;           // Timestamp de último intento
  sessions: string[];            // IDs de sesiones
}
```

---

## 🔑 KEYS DE LOCALSTORAGE

```typescript
// Contenido guardado
localStorage.getItem('nativo_saved_content')
// → SavedContent[]

// Sesiones de quiz
localStorage.getItem('nativo_quiz_sessions')
// → QuizSession[]

// Rendimiento por tema
localStorage.getItem('nativo_topic_performance')
// → TopicPerformance[]
```

---

## 🎨 COMPONENTES DETALLADOS

### SavedContentLibrary

**Props:**
```typescript
interface SavedContentLibraryProps {
  onClose: () => void;
  onViewContent: (content: SavedContent) => void;
}
```

**Estado interno:**
- `searchQuery: string` - Búsqueda
- `filterType: string` - Filtro por tipo
- `showFavoritesOnly: boolean` - Solo favoritos

**Funciones:**
- `handleSearch()` - Filtra por búsqueda
- `handleFilterType()` - Filtra por tipo
- `handleToggleFavorite()` - Marca/desmarca favorito
- `handleDelete()` - Elimina contenido
- `handleExport()` - Exporta contenido

### InteractiveQuiz

**Props:**
```typescript
interface InteractiveQuizProps {
  questions: QuizQuestion[];
  title: string;
  topic: string;
  subject: string;
  onClose: () => void;
  onComplete: (score: number, session: QuizSession) => void;
}
```

**Estado interno:**
- `currentQuestionIndex: number` - Pregunta actual
- `selectedAnswer: number | null` - Respuesta seleccionada
- `showFeedback: boolean` - Mostrar feedback
- `startTime: number` - Tiempo de inicio

**Funciones:**
- `handleSelectAnswer()` - Selecciona respuesta
- `handleConfirmAnswer()` - Confirma respuesta
- `handleNextQuestion()` - Siguiente pregunta
- `handleFinishQuiz()` - Finaliza quiz

### QuizResults

**Props:**
```typescript
interface QuizResultsProps {
  session: QuizSession;
  onClose: () => void;
  onRetry: () => void;
}
```

**Muestra:**
- Score total
- Número de correctas/incorrectas
- Tiempo total
- Desglose por pregunta
- Botones: Reintentar, Cerrar

### WeakTopicsAnalysis

**Props:**
```typescript
interface WeakTopicsAnalysisProps {
  onClose: () => void;
  onReviewTopic: (topic: string, subject: string) => void;
}
```

**Muestra:**
- Lista de temas con scores
- Colores según rendimiento:
  - 🔴 < 70%
  - 🟡 70-85%
  - 🟢 > 85%
- Botón "Repasar Ahora" para cada tema

---

## 🔧 UTILIDADES

### quizParser.ts

**Funciones:**

```typescript
// Parsea texto a array de preguntas
parseQuizFromText(text: string): QuizQuestion[]

// Detecta si el texto es un quiz
isQuizContent(text: string): boolean

// Extrae título del quiz
extractQuizTitle(text: string, defaultTitle: string): string
```

**Formato esperado:**
```
**Pregunta 1:** [texto]
A) [opción]
B) [opción]
C) [opción]
D) [opción]
**Respuesta correcta:** [A/B/C/D]
**Explicación:** [texto]
```

---

## 🎯 HOOKS PERSONALIZADOS

### useSavedContent

**Retorna:**
```typescript
{
  savedContent: SavedContent[];
  quizSessions: QuizSession[];
  topicPerformance: TopicPerformance[];
  addSavedContent: (content: Omit<SavedContent, 'id' | 'createdAt' | 'reviewCount'>) => void;
  deleteSavedContent: (id: string) => void;
  toggleFavorite: (id: string) => void;
  incrementReviewCount: (id: string) => void;
  addQuizSession: (session: Omit<QuizSession, 'id' | 'completedAt'>) => void;
  getWeakTopics: () => TopicPerformance[];
}
```

---

## 🔄 CICLO DE VIDA

### Inicialización
1. App.tsx se monta
2. AppProviders envuelve toda la app
3. SavedContentProvider lee de localStorage
4. Inicializa estados con datos guardados

### Guardar contenido
1. Usuario hace click en "Guardar"
2. handleSaveContent() crea SavedContent
3. addSavedContent() guarda en context
4. useEffect guarda en localStorage
5. UI se actualiza automáticamente

### Completar quiz
1. Usuario completa quiz
2. InteractiveQuiz crea QuizSession
3. addQuizSession() guarda en context
4. Context calcula TopicPerformance
5. useEffect guarda en localStorage
6. WeakTopicsAnalysis se actualiza

---

## 🚀 OPTIMIZACIONES

### Lazy Loading
```typescript
const SavedContentLibrary = lazy(() => import('./components/SavedContentLibrary'));
const InteractiveQuiz = lazy(() => import('./components/InteractiveQuiz'));
const QuizResults = lazy(() => import('./components/QuizResults'));
const WeakTopicsAnalysis = lazy(() => import('./components/WeakTopicsAnalysis'));
```

### Suspense
```typescript
<Suspense fallback={<LoadingSpinner />}>
  <SavedContentLibrary ... />
</Suspense>
```

### Memoización (si es necesario)
```typescript
const weakTopics = useMemo(() => getWeakTopics(), [topicPerformance]);
```

---

## 🔒 SEGURIDAD

### Validación de datos
- Sanitización de inputs
- Validación de formato de quiz
- Límites de tamaño de contenido

### localStorage
- Datos solo en cliente
- No se envían al servidor
- Usuario tiene control total

---

## 📈 MÉTRICAS

### Tamaño de bundle
```
SavedContentLibrary: ~7 KB
InteractiveQuiz: ~6.7 KB
QuizResults: ~6.5 KB
WeakTopicsAnalysis: ~7.3 KB
Total: ~27.5 KB (gzipped)
```

### Rendimiento
- Lazy loading reduce bundle inicial
- localStorage es síncrono pero rápido
- Re-renders optimizados con context

---

## 🐛 DEBUGGING

### Console logs útiles
```typescript
// Ver contenido guardado
console.log(localStorage.getItem('nativo_saved_content'));

// Ver sesiones de quiz
console.log(localStorage.getItem('nativo_quiz_sessions'));

// Ver rendimiento por tema
console.log(localStorage.getItem('nativo_topic_performance'));
```

### Limpiar datos
```typescript
localStorage.removeItem('nativo_saved_content');
localStorage.removeItem('nativo_quiz_sessions');
localStorage.removeItem('nativo_topic_performance');
```

---

## 📚 DEPENDENCIAS

### Nuevas
- Ninguna (usa las existentes)

### Existentes usadas
- React (hooks, lazy, Suspense)
- Material UI (iconos)
- TypeScript (tipos)
- localStorage (persistencia)

---

## 🎉 CONCLUSIÓN

La arquitectura está diseñada para ser:
- ✅ **Modular** - Componentes independientes
- ✅ **Escalable** - Fácil agregar nuevas funcionalidades
- ✅ **Mantenible** - Código limpio y documentado
- ✅ **Performante** - Lazy loading y optimizaciones
- ✅ **Segura** - Validación y sanitización

---

**Documentación completa de la arquitectura de las 3 mejoras críticas** 🏗️
