# 🔧 CAMBIOS PARA APP.TSX

**IMPORTANTE:** Estos son los cambios exactos que necesitas hacer en App.tsx

---

## 1. AGREGAR IMPORTS (Línea ~30, después de los imports existentes)

```typescript
// AGREGAR ESTOS IMPORTS:

// Nuevos componentes de mejoras críticas
import SavedContentLibrary from './components/SavedContentLibrary';
import InteractiveQuiz from './components/InteractiveQuiz';
import QuizResults from './components/QuizResults';
import WeakTopicsAnalysis from './components/WeakTopicsAnalysis';

// Nuevo hook
import { useSavedContent } from './contexts/SavedContentContext';

// Utilidades para quizzes
import { parseQuizFromText, isQuizContent, extractQuizTitle } from './utils/quizParser';

// Tipos adicionales
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

## 2. AGREGAR LAZY LOADING (Línea ~65, después de los lazy existentes)

```typescript
// AGREGAR ESTOS LAZY LOADS:
const SavedContentLibrary = lazy(() => import('./components/SavedContentLibrary'));
const InteractiveQuiz = lazy(() => import('./components/InteractiveQuiz'));
const QuizResults = lazy(() => import('./components/QuizResults'));
const WeakTopicsAnalysis = lazy(() => import('./components/WeakTopicsAnalysis'));
```

---

## 3. AGREGAR HOOK (Línea ~105, después de useUI)

```typescript
// AGREGAR ESTE HOOK:
// Hook de contenido guardado
const { addSavedContent } = useSavedContent();
```

---

## 4. AGREGAR ESTADOS (Línea ~115, después de los estados existentes)

```typescript
// AGREGAR ESTOS ESTADOS:
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

## 5. AGREGAR FUNCIONES HELPER (Línea ~700, antes del return final)

```typescript
// AGREGAR ESTAS FUNCIONES:

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

## 6. AGREGAR BOTONES EN EL HEADER (Línea ~1150, después del botón "Progreso")

```typescript
// AGREGAR ESTOS BOTONES EN EL HEADER (después del botón "Progreso"):

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

## 7. ACTUALIZAR MESSAGEBUBBLE (Línea ~1280, donde se renderiza MessageBubble)

```typescript
// REEMPLAZAR:
<MessageBubble 
  key={msg.id} 
  role={msg.role} 
  content={msg.content} 
  attachments={msg.attachments} 
  groundingSources={msg.groundingSources}
  onRegenerate={msg.role === Role.MODEL && idx === currentMessages.length - 1 ? handleRegenerateResponse : undefined}
/>

// POR:
<MessageBubble 
  key={msg.id} 
  role={msg.role} 
  content={msg.content} 
  attachments={msg.attachments} 
  groundingSources={msg.groundingSources}
  onRegenerate={msg.role === Role.MODEL && idx === currentMessages.length - 1 ? handleRegenerateResponse : undefined}
  onSave={msg.role === Role.MODEL ? () => handleSaveContent(msg) : undefined}
  onStartQuiz={msg.role === Role.MODEL && isQuizContent(msg.content) ? () => handleStartInteractiveQuiz(msg) : undefined}
/>
```

---

## 8. AGREGAR MODALES (Línea ~750, después del modal de ShareDialog)

```typescript
// AGREGAR ESTOS MODALES (después del ShareDialog):

{/* Biblioteca de Contenido Guardado */}
{showSavedContent && (
  <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>}>
    <SavedContentLibrary
      onClose={() => setShowSavedContent(false)}
      onViewContent={(content) => {
        setViewingContent(content);
        setShowSavedContent(false);
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

## 9. ACTUALIZAR SIDEBAR (Línea ~1100, donde se renderiza Sidebar)

```typescript
// REEMPLAZAR:
<Sidebar 
  isOpen={isSidebarOpen} 
  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
  sessions={sessions}
  currentSessionId={currentSessionId}
  onSelectSession={(id) => {
    setCurrentSessionId(id);
    navigate(`/chat/${id}`);
  }}
  onNewChat={handleNewChat}
  onDeleteSession={handleDeleteSession}
  onOpenHelp={() => setShowHelp(true)}
  onOpenSettings={() => setShowSettings(true)}
  onOpenStudyTools={() => setShowStudyTools(true)}
  onOpenProgress={() => setShowProgress(true)}
/>

// POR:
<Sidebar 
  isOpen={isSidebarOpen} 
  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
  sessions={sessions}
  currentSessionId={currentSessionId}
  onSelectSession={(id) => {
    setCurrentSessionId(id);
    navigate(`/chat/${id}`);
  }}
  onNewChat={handleNewChat}
  onDeleteSession={handleDeleteSession}
  onOpenHelp={() => setShowHelp(true)}
  onOpenSettings={() => setShowSettings(true)}
  onOpenStudyTools={() => setShowStudyTools(true)}
  onOpenProgress={() => setShowProgress(true)}
  onOpenLibrary={() => setShowSavedContent(true)}
  onOpenWeakTopics={() => setShowWeakTopics(true)}
/>
```

---

## 10. AGREGAR handleRegenerateResponse (Si no existe)

```typescript
// BUSCAR si existe handleRegenerateResponse
// Si NO existe, agregar esta función (línea ~700):

const handleRegenerateResponse = () => {
  if (currentMessages.length < 2) return;
  
  // Get the last user message
  const lastUserMessage = [...currentMessages].reverse().find(m => m.role === Role.USER);
  if (!lastUserMessage) return;
  
  // Remove last AI response
  const newMessages = currentMessages.slice(0, -1);
  
  // Regenerate
  handleSendWrapper(lastUserMessage.content);
};
```

---

## ✅ RESUMEN DE CAMBIOS

1. ✅ Imports agregados (componentes, hooks, utilidades, iconos)
2. ✅ Lazy loading agregado
3. ✅ Hook useSavedContent agregado
4. ✅ Estados agregados (7 nuevos estados)
5. ✅ Funciones helper agregadas (3 funciones)
6. ✅ Botones en header agregados (Biblioteca, Temas Débiles)
7. ✅ MessageBubble actualizado (props onSave y onStartQuiz)
8. ✅ Modales agregados (4 nuevos modales)
9. ✅ Sidebar actualizado (props onOpenLibrary y onOpenWeakTopics)
10. ✅ handleRegenerateResponse agregado (si no existe)

---

## 🧪 TESTING DESPUÉS DE INTEGRAR

1. **Compilar:** `npm run build` (verificar sin errores)
2. **Guardar contenido:** Genera un resumen y guárdalo
3. **Quiz interactivo:** Genera un quiz y practícalo
4. **Temas débiles:** Completa varios quizzes y revisa análisis
5. **Biblioteca:** Busca, filtra y marca favoritos
6. **Botones en header:** Verifica que todos funcionan

---

## 🐛 SI HAY ERRORES

### Error: "handleSend is not defined"
- Busca `handleSend` en ChatContext y verifica que se exporta

### Error: "Cannot read property 'questions' of null"
- Verifica que agregaste la validación: `{currentQuiz && <InteractiveQuiz ...`

### Error: "isQuizContent is not defined"
- Verifica que importaste: `import { isQuizContent } from './utils/quizParser'`

### Error en MessageBubble
- Abre `components/MessageBubble.tsx` y agrega las props:
```typescript
interface MessageBubbleProps {
  // ... props existentes
  onSave?: (message: Message) => void;
  onStartQuiz?: (message: Message) => void;
}
```

---

**¿Listo para aplicar los cambios?** 

Puedes hacerlo manualmente siguiendo este documento, o puedo ayudarte a aplicarlos uno por uno.
