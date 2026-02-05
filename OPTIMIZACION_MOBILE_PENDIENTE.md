# 📱 Optimización Mobile - Tareas Pendientes

## ✅ Completado

### StudyTools Modal
- [x] Full-screen en mobile (sin padding, sin bordes redondeados)
- [x] Header responsive con tamaños ajustados
- [x] Grid de 1 columna en mobile, 2 en desktop
- [x] Padding reducido en mobile (p-4 vs p-6)
- [x] Botones con active:scale en lugar de hover en mobile

## ⚠️ Pendiente

### 1. PreviewPanel - CRÍTICO
**Problema:** Los visualizadores no se ajustan a mobile

**Solución Recomendada:** Full-Screen Modal en mobile

```tsx
// En PreviewPanel.tsx
import { useIsMobile } from '../hooks/useMediaQuery';

const PreviewPanel = ({ items, isOpen, onClose }) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        {/* Full screen en mobile */}
        <div className="h-full flex flex-col">
          {/* Header fijo */}
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={onClose}>← Volver</button>
            <h3>{currentItem.title}</h3>
            <div className="w-8" /> {/* Spacer */}
          </div>
          
          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Visualizador aquí */}
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop: Panel lateral como está ahora
  return (
    <div className="w-96 border-l">
      {/* ... */}
    </div>
  );
};
```

### 2. Todos los Visualizadores
**Problema:** Anchos fijos, no responsive

**Archivos a modificar:**
- [ ] FlashcardViewer.tsx
- [ ] QuizViewer.tsx
- [ ] PomodoroViewer.tsx
- [ ] SummaryViewer.tsx
- [ ] FeynmanViewer.tsx
- [ ] CornellViewer.tsx
- [ ] MindMapViewer.tsx
- [ ] SpacedRepetitionViewer.tsx
- [ ] ActiveRecallViewer.tsx

**Cambios necesarios:**
```tsx
// Cambiar de:
className="w-96 p-6"

// A:
className="w-full max-w-full md:max-w-md p-4 md:p-6"
```

**Botones táctiles:**
```tsx
// Mínimo 44x44px
className="min-h-[44px] min-w-[44px] p-3"
```

**Textos responsive:**
```tsx
className="text-sm md:text-base"
```

### 3. Modals Generales
**Archivos:**
- [ ] SavedContentLibrary.tsx
- [ ] ProgressStats.tsx
- [ ] WeakTopicsAnalysis.tsx
- [ ] ShareDialog.tsx
- [ ] InteractiveQuiz.tsx
- [ ] QuizResults.tsx

**Patrón a aplicar:**
```tsx
<div className="fixed inset-0 z-[100] p-0 md:p-4">
  <div className="w-full h-full md:h-auto md:max-w-4xl md:rounded-3xl">
    {/* Contenido */}
  </div>
</div>
```

### 4. Input Area Mobile
**Problema:** Botones pequeños en mobile

**Solución:**
```tsx
// Botones más grandes
<button className="p-3 md:p-2">
  <Icon sx={{ fontSize: 24 }} className="md:text-[20px]" />
</button>

// Textarea con mejor padding
<textarea className="p-4 md:p-3 text-base md:text-sm" />
```

### 5. Gestures para Flashcards
**Mejora futura:** Swipe left/right

```tsx
// Usar react-swipeable o similar
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: () => nextCard(),
  onSwipedRight: () => prevCard(),
});

<div {...handlers}>
  {/* Flashcard */}
</div>
```

---

## 🎯 Prioridad de Implementación

### Fase 1: CRÍTICO (Ahora)
1. **PreviewPanel full-screen en mobile**
2. **Optimizar visualizadores principales:**
   - FlashcardViewer
   - QuizViewer
   - ActiveRecallViewer

### Fase 2: IMPORTANTE (Siguiente)
3. Optimizar resto de visualizadores
4. Optimizar modals (SavedContentLibrary, etc.)
5. Input area más táctil

### Fase 3: MEJORAS (Futuro)
6. Gestures para flashcards
7. Animaciones suaves
8. Haptic feedback

---

## 📐 Especificaciones Mobile

### Breakpoints
```
Mobile:  < 768px
Tablet:  768-1023px
Desktop: >= 1024px
```

### Espaciado Mobile
```
Padding: 16px (p-4)
Gap: 12px (gap-3)
Botones: min 44x44px
Texto: 14-16px base
```

### Touch Targets
```
Mínimo: 44x44px
Recomendado: 48x48px
Spacing entre botones: 8px
```

---

## 🛠️ Código de Ejemplo

### PreviewPanel Responsive
```tsx
const PreviewPanel = ({ items, isOpen, onClose }) => {
  const isMobile = useIsMobile();
  
  if (!isOpen || items.length === 0) return null;
  
  const currentItem = items[0];
  
  // Mobile: Full screen
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-right duration-300">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-surface sticky top-0 z-10">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-primary"
            >
              <ChevronLeftIcon />
              <span>Volver</span>
            </button>
            <h3 className="font-bold text-primary truncate flex-1 text-center px-4">
              {currentItem.title}
            </h3>
            <div className="w-20" /> {/* Spacer para centrar título */}
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {renderVisualizer(currentItem)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop: Sidebar
  return (
    <div className="w-96 border-l border-border bg-surface">
      {/* ... código actual ... */}
    </div>
  );
};
```

### Visualizador Responsive
```tsx
const FlashcardViewer = ({ cards }) => {
  return (
    <div className="w-full p-4 md:p-6">
      {/* Card */}
      <div className="aspect-[3/4] md:aspect-[4/3] max-w-full md:max-w-md mx-auto">
        {/* Contenido */}
      </div>
      
      {/* Botones */}
      <div className="flex gap-3 md:gap-4 mt-4 md:mt-6">
        <button className="flex-1 min-h-[48px] md:min-h-[44px] text-base md:text-sm">
          Anterior
        </button>
        <button className="flex-1 min-h-[48px] md:min-h-[44px] text-base md:text-sm">
          Siguiente
        </button>
      </div>
    </div>
  );
};
```

---

## ✅ Checklist Detallado

### PreviewPanel
- [ ] Importar useIsMobile
- [ ] Crear layout mobile (full-screen)
- [ ] Header con botón volver
- [ ] Contenido scrolleable
- [ ] Mantener layout desktop
- [ ] Animación slide-in

### Visualizadores
- [ ] Remover anchos fijos (w-96 → w-full)
- [ ] Padding responsive (p-4 md:p-6)
- [ ] Textos responsive (text-sm md:text-base)
- [ ] Botones táctiles (min-h-[48px])
- [ ] Iconos responsive (fontSize: 20 → 24 en mobile)
- [ ] Grids responsive (grid-cols-1 md:grid-cols-2)

### Modals
- [ ] Full-screen en mobile (inset-0, no padding)
- [ ] Bordes redondeados solo en desktop
- [ ] Header sticky en mobile
- [ ] Contenido scrolleable
- [ ] Botones de cerrar accesibles

---

## 🐛 Problemas Comunes

### Problema: Visualizador se sale de la pantalla
**Solución:** `max-w-full` y `overflow-x-hidden`

### Problema: Botones muy pequeños
**Solución:** `min-h-[48px] min-w-[48px]`

### Problema: Texto muy grande/pequeño
**Solución:** `text-sm md:text-base`

### Problema: Modal no ocupa toda la pantalla
**Solución:** `inset-0` sin padding en mobile

---

## 🎨 Resultado Esperado

### Mobile (< 768px)
```
┌─────────────────────────┐
│ ← Volver  Flashcards    │ ← Header fijo
├─────────────────────────┤
│                         │
│                         │
│    [Visualizador]       │
│    Full Screen          │
│                         │
│                         │
│                         │
├─────────────────────────┤
│ [Botones grandes]       │
└─────────────────────────┘
```

### Desktop (>= 768px)
```
┌──────────────┬──────────┐
│              │ Preview  │
│   Chat       │ Panel    │
│              │ (Sidebar)│
│              │          │
└──────────────┴──────────┘
```

---

## 🚀 Siguiente Paso

**Implementar PreviewPanel responsive primero**, ya que es el más crítico y afecta a todos los visualizadores.

¿Quieres que implemente el PreviewPanel responsive ahora?
