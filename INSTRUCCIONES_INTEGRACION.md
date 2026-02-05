# 🔧 INSTRUCCIONES DE INTEGRACIÓN - PASO A PASO

**IMPORTANTE:** Sigue estos pasos en orden para integrar las 3 mejoras críticas en tu app.

---

## ✅ PASO 1: VERIFICAR QUE TODO ESTÁ CREADO

Asegúrate de que existen estos archivos:

```
✅ types.ts (actualizado)
✅ contexts/SavedContentContext.tsx
✅ contexts/AppProviders.tsx (actualizado)
✅ components/SavedContentLibrary.tsx
✅ components/InteractiveQuiz.tsx
✅ components/QuizResults.tsx
✅ components/WeakTopicsAnalysis.tsx
✅ utils/quizParser.ts
```

---

## ✅ PASO 2: AGREGAR IMPORTS EN APP.TSX

Agrega estos imports al inicio de `App.tsx`:

```typescript
// Nuevos componentes
import SavedContentLibrary from './components/SavedContentLibrary';
import InteractiveQuiz from './components/InteractiveQuiz';
import QuizResults from './components/QuizResults';
import WeakTopicsAnalysis from './components/WeakTopicsAnalysis';

// Nuevo hook
import { useSavedContent } from './contexts/SavedContentContext';

// Utilidades
import { parseQuizFromText, isQuizContent, extractQuizTitle } from './utils/quizParser';

// Tipos
import { QuizSession, SavedContent, QuizQuestion } from './types';

// Iconos adicionales
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  PlayArrow as PlayArrowIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
```

---

## ✅ PASO 3: AGREGAR HOOK EN APP.TSX

Después de los otros hooks (useAuth, useChat, useUI), agrega:

```typescript
// Hook de contenido guardado
const { addSavedContent } = useSavedContent();
```

---

## ✅ PASO 4: AGREGAR ESTADOS EN APP.TSX

Después de los estados existentes, agrega:

```typescript
// Estados para nuevas funcionalidades
const [showSavedContent, setShowSavedContent] = useState(false);
const [showInteractiveQuiz, setShowInteractiveQuiz] = useState(false);
const [showQuizResults, setShowQuizResults] = useState(false);
const [showWeakTopics, setShowWeakTopics] = useState(false);
const [currentQuiz, setCurrentQuiz] = useState<{
  questions: QuizQuestion[];
  title: string;
  topic: string;
  subject: string;
} | null>(null);
const [quizResults, setQuizResults] = useState<QuizSession | null>(null);
const [viewingContent, setViewingContent] = useState<SavedContent | null>(null);
```

---

## ✅ PASO 5: AGREGAR FUNCIONES HELPER EN APP.TSX

Antes del return, agrega estas funciones:

```typescript
// Guardar contenido desde mensaje
const handleSaveContent = (message: Message) => {
  const title = prompt('Título para este contenido:');
  if (!title) return;
  
  const topic = prompt('Tema principal:') || 'General';
  const subject = prompt('Materia:') || 'General';
  
  let type: SavedContent['type'] = 'other';
  if (message.content.includes('flashcard') || message.content.includes('tarjeta')) {
    type = 'flashcards';
  } else if (isQuizContent(message.content)) {
    type = 'quiz';
  } else if (message.content.includes('resumen') || message.content.includes('summary')) {
    type = 'summary';
  } else if (message.content.includes('plan') || message.content.includes('pomodoro')) {
    type = 'plan';
  } else if (message.content.includes('nota') || message.content.includes('cornell')) {
    type = 'notes';
  }
  
  addSavedContent({
    type,
    title,
    content: message.content,
    topic,
    subject,
    isFavorite: false,
    tags: [subject, topic],
  });
  
  showToast('✅ Contenido guardado en tu biblioteca', 'success');
};

// Iniciar quiz interactivo desde mensaje
const handleStartInteractiveQuiz = (message: Message) => {
  const questions = parseQuizFromText(message.content);
  
  if (questions.length === 0) {
    showToast('No se pudo parsear el quiz. Intenta regenerarlo.', 'error');
    return;
  }
  
  const title = extractQuizTitle(message.content, 'Quiz Interactivo');
  const topic = prompt('¿Sobre qué tema es este quiz?') || 'General';
  const subject = prompt('¿De qué materia?') || 'General';
  
  setCurrentQuiz({
    questions,
    title,
    topic,
    subject,
  });
  
  setShowInteractiveQuiz(true);
};

// Repasar tema débil
const handleReviewWeakTopic = (topic: string, subject: string) => {
  setShowWeakTopics(false);
  handleSendWrapper(`Crea un quiz de 5 preguntas sobre ${topic} de ${subject}. Incluye explicaciones detalladas.`);
  showToast(`Generando quiz de repaso sobre ${topic}...`, 'info');
};
```

---

## ✅ PASO 6: AGREGAR BOTONES EN EL HEADER

Busca la sección del header (donde están los botones "Estudiar", "Progreso", etc.) y agrega:

```typescript
{/* Botón Biblioteca */}
<button 
  onClick={() => setShowSavedContent(true)}
  className="hidden md:flex items-center gap-2 px-4 py-2 bg-surfaceHighlight hover:bg-border text-primary rounded-xl transition-colors text-sm font-medium"
  title="Mi Biblioteca"
>
  <BookmarkIcon sx={{ fontSize: 18 }} />
  <span>Biblioteca</span>
</button>

{/* Botón Temas Débiles */}
<button 
  onClick={() => setShowWeakTopics(true)}
  className="hidden md:flex items-center gap-2 px-4 py-2 bg-surfaceHighlight hover:bg-border text-primary rounded-xl transition-colors text-sm font-medium"
  title="Análisis de Temas Débiles"
>
  <WarningIcon sx={{ fontSize: 18 }} />
  <span>Temas Débiles</span>
</button>
```

---

## ✅ PASO 7: AGREGAR BOTONES EN MESSAGEBUBBLE

Abre `components/MessageBubble.tsx` y agrega estos botones en la sección de acciones:

```typescript
{/* Botón Guardar */}
<button
  onClick={() => onSave?.(message)}
  className="p-1.5 hover:bg-surfaceHighlight rounded-lg text-secondary hover:text-accent transition-colors"
  title="Guardar en biblioteca"
>
  <BookmarkBorderIcon sx={{ fontSize: 18 }} />
</button>

{/* Botón Quiz Interactivo (solo si es quiz) */}
{isQuizContent(message.content) && (
  <button
    onClick={() => onStartQuiz?.(message)}
    className="p-1.5 hover:bg-surfaceHighlight rounded-lg text-secondary hover:text-purple-500 transition-colors"
    title="Practicar quiz interactivo"
  >
    <PlayArrowIcon sx={{ fontSize: 18 }} />
  </button>
)}
```

Y actualiza la interfaz de props:

```typescript
interface MessageBubbleProps {
  message: Message;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onSave?: (message: Message) => void;        // NUEVO
  onStartQuiz?: (message: Message) => void;   // NUEVO
}
```

---

## ✅ PASO 8: PASAR FUNCIONES A MESSAGEBUBBLE

En App.tsx, donde renderizas MessageBubble, agrega las props:

```typescript
<MessageBubble
  message={msg}
  onCopy={() => {/* ... */}}
  onRegenerate={() => {/* ... */}}
  onLike={() => {/* ... */}}
  onDislike={() => {/* ... */}}
  onSave={handleSaveContent}           // NUEVO
  onStartQuiz={handleStartInteractiveQuiz}  // NUEVO
/>
```

---

## ✅ PASO 9: RENDERIZAR MODALES EN APP.TSX

Antes del cierre del div principal, agrega:

```typescript
{/* Biblioteca de Contenido Guardado */}
{showSavedContent && (
  <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
    <SavedContentLibrary
      onClose={() => setShowSavedContent(false)}
      onViewContent={(content) => {
        setViewingContent(content);
        setShowSavedContent(false);
        // Opcional: Mostrar contenido en el chat
        showToast(`Viendo: ${content.title}`, 'info');
      }}
    />
  </Suspense>
)}

{/* Quiz Interactivo */}
{showInteractiveQuiz && currentQuiz && (
  <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
    <InteractiveQuiz
      questions={currentQuiz.questions}
      title={currentQuiz.title}
      topic={currentQuiz.topic}
      subject={currentQuiz.subject}
      onClose={() => {
        setShowInteractiveQuiz(false);
        setCurrentQuiz(null);
      }}
      onComplete={(score, session) => {
        setQuizResults(session);
        setShowInteractiveQuiz(false);
        setShowQuizResults(true);
        showToast(`¡Quiz completado! Score: ${score}%`, 'success');
      }}
    />
  </Suspense>
)}

{/* Resultados del Quiz */}
{showQuizResults && quizResults && (
  <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
    <QuizResults
      session={quizResults}
      onClose={() => {
        setShowQuizResults(false);
        setQuizResults(null);
      }}
      onRetry={() => {
        setShowQuizResults(false);
        setShowInteractiveQuiz(true);
      }}
    />
  </Suspense>
)}

{/* Análisis de Temas Débiles */}
{showWeakTopics && (
  <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
    <WeakTopicsAnalysis
      onClose={() => setShowWeakTopics(false)}
      onReviewTopic={handleReviewWeakTopic}
    />
  </Suspense>
)}
```

---

## ✅ PASO 10: AGREGAR LAZY LOADING

Al inicio de App.tsx, donde están los otros lazy imports, agrega:

```typescript
const SavedContentLibrary = lazy(() => import('./components/SavedContentLibrary'));
const InteractiveQuiz = lazy(() => import('./components/InteractiveQuiz'));
const QuizResults = lazy(() => import('./components/QuizResults'));
const WeakTopicsAnalysis = lazy(() => import('./components/WeakTopicsAnalysis'));
```

---

## ✅ PASO 11: AGREGAR BOTONES EN SIDEBAR (OPCIONAL)

En `components/Sidebar.tsx`, agrega props y botones:

```typescript
interface SidebarProps {
  // ... props existentes
  onOpenLibrary?: () => void;      // NUEVO
  onOpenWeakTopics?: () => void;   // NUEVO
}

// En el render, agrega botones:
<button
  onClick={onOpenLibrary}
  className="w-full flex items-center gap-3 px-4 py-3 text-primary hover:bg-surfaceHighlight rounded-xl transition-colors"
>
  <BookmarkIcon sx={{ fontSize: 20 }} />
  <span>Mi Biblioteca</span>
</button>

<button
  onClick={onOpenWeakTopics}
  className="w-full flex items-center gap-3 px-4 py-3 text-primary hover:bg-surfaceHighlight rounded-xl transition-colors"
>
  <WarningIcon sx={{ fontSize: 20 }} />
  <span>Temas Débiles</span>
</button>
```

Y en App.tsx, pasa las funciones:

```typescript
<Sidebar
  // ... props existentes
  onOpenLibrary={() => setShowSavedContent(true)}
  onOpenWeakTopics={() => setShowWeakTopics(true)}
/>
```

---

## ✅ PASO 12: TESTING

### **Test 1: Guardar Contenido**
1. Genera un resumen: "Resumen de la fotosíntesis"
2. Click en botón "Guardar" (bookmark)
3. Ingresa título, tema, materia
4. Abre "Biblioteca"
5. Verifica que aparece el contenido

### **Test 2: Quiz Interactivo**
1. Genera un quiz: "Hazme un quiz de 5 preguntas sobre matemáticas"
2. Click en botón "Practicar" (play)
3. Responde las preguntas
4. Verifica feedback inmediato
5. Completa el quiz
6. Verifica pantalla de resultados

### **Test 3: Temas Débiles**
1. Completa 2-3 quizzes del mismo tema con diferentes scores
2. Abre "Temas Débiles"
3. Verifica que aparece el tema con estadísticas
4. Click "Repasar Ahora"
5. Verifica que genera nuevo quiz

### **Test 4: Favoritos y Búsqueda**
1. Guarda varios contenidos
2. Marca algunos como favoritos
3. Usa filtro de favoritos
4. Busca por palabra clave
5. Filtra por tipo (quiz, resumen, etc.)

### **Test 5: Repasos**
1. Guarda contenido
2. Ábrelo desde biblioteca
3. Verifica que contador de repasos aumenta
4. Verifica fecha de último repaso

---

## ✅ PASO 13: VERIFICAR BUILD

```bash
npm run build
```

Verifica que no hay errores de TypeScript.

---

## 🎯 RESULTADO ESPERADO

Después de la integración, tu app tendrá:

✅ **Botón "Biblioteca"** en el header
✅ **Botón "Temas Débiles"** en el header
✅ **Botón "Guardar"** en cada mensaje de IA
✅ **Botón "Practicar"** en mensajes con quizzes
✅ **Modal de Biblioteca** con búsqueda y filtros
✅ **Quiz Interactivo** con feedback en tiempo real
✅ **Pantalla de Resultados** con análisis detallado
✅ **Análisis de Temas Débiles** con recomendaciones
✅ **Tracking automático** de rendimiento
✅ **Persistencia** en localStorage

---

## 🐛 TROUBLESHOOTING

### **Error: "useSavedContent is not defined"**
- Verifica que importaste el hook
- Verifica que SavedContentProvider está en AppProviders.tsx

### **Error: "Cannot read property 'questions' of null"**
- Agrega validación: `{currentQuiz && <InteractiveQuiz ... />}`

### **Quiz no se parsea correctamente**
- Verifica formato de la respuesta de IA
- Usa `console.log(parseQuizFromText(text))` para debug
- Ajusta el prompt para que la IA genere el formato correcto

### **Botones no aparecen**
- Verifica que pasaste las props a MessageBubble
- Verifica que los botones están dentro del return

### **Modal no se cierra**
- Verifica que pasaste `onClose` correctamente
- Verifica que actualizas el estado al cerrar

---

## 📝 NOTAS FINALES

- **Tiempo estimado:** 2-3 horas
- **Dificultad:** Media
- **Impacto:** 🔥🔥🔥 ALTO

**¡Éxito con la integración!** 🚀

Si encuentras problemas, revisa:
1. Imports correctos
2. Estados inicializados
3. Props pasadas correctamente
4. Funciones definidas antes del return
5. Modales renderizados condicionalmente
