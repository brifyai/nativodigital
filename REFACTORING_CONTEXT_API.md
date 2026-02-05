# 🔄 Refactoring con Context API - Nativo Digital

## ✅ Estado: EN PROGRESO

Se está refactorizando App.tsx (1400+ líneas) en contextos separados usando Context API.

---

## 📁 Estructura de Contextos Creados

### 1. **AuthContext** (`contexts/AuthContext.tsx`)
**Responsabilidad**: Manejo de autenticación y perfil de usuario

**Estado gestionado**:
- `user`: Perfil del usuario actual
- `showLanding`: Mostrar/ocultar landing page
- `customInstruction`: Instrucciones personalizadas del sistema

**Funciones**:
- `handleLogin(profile)`: Iniciar sesión
- `handleLogout()`: Cerrar sesión
- `handleFullReset()`: Borrar cuenta y datos

**Líneas reducidas**: ~100 líneas

---

### 2. **ChatContext** (`contexts/ChatContext.tsx`)
**Responsabilidad**: Manejo de conversaciones y mensajes

**Estado gestionado**:
- `sessions`: Array de todas las conversaciones
- `currentSessionId`: ID de la sesión actual
- `currentSession`: Sesión actual completa
- `currentMessages`: Mensajes de la sesión actual
- `isLoading`: Estado de carga
- `abortController`: Control de cancelación
- `selectedModel`: Modelo de IA seleccionado
- `attachments`: Archivos adjuntos

**Funciones**:
- `handleNewChat()`: Crear nueva conversación
- `handleSend(text)`: Enviar mensaje
- `handleStopGeneration()`: Detener generación
- `handleRegenerateResponse(id)`: Regenerar respuesta
- `handleDeleteSession(e, id)`: Eliminar conversación
- `handleClearHistory()`: Borrar historial completo
- `setCurrentSessionId(id)`: Cambiar sesión activa

**Líneas reducidas**: ~200 líneas

---

### 3. **UIContext** (`contexts/UIContext.tsx`)
**Responsabilidad**: Manejo de UI, tema y modales

**Estado gestionado**:
- `theme`: Tema claro/oscuro
- `highContrast`: Modo alto contraste
- `isSidebarOpen`: Estado del sidebar
- `showHelp`: Modal de ayuda
- `showSettings`: Modal de ajustes
- `showStudyTools`: Modal de herramientas
- `showProgress`: Modal de progreso
- `showShare`: Modal de compartir
- `showOnboarding`: Tutorial inicial
- `isModelMenuOpen`: Menú de modelos
- `toast`: Notificaciones toast

**Funciones**:
- `toggleTheme()`: Cambiar tema
- `toggleHighContrast()`: Cambiar contraste
- `setIsSidebarOpen(open)`: Abrir/cerrar sidebar
- `setShowHelp(show)`: Mostrar/ocultar ayuda
- `showToast(message, type)`: Mostrar notificación

**Líneas reducidas**: ~150 líneas

---

### 4. **AppProviders** (`contexts/AppProviders.tsx`)
**Responsabilidad**: Combinar todos los providers

**Estructura**:
```tsx
<UIProvider>
  <AuthProvider>
    <ChatProvider>
      {children}
    </ChatProvider>
  </AuthProvider>
</UIProvider>
```

**Orden de anidación**:
1. UIProvider (más externo - no depende de nada)
2. AuthProvider (depende de UI para toasts)
3. ChatProvider (depende de Auth para customInstruction)

---

## 🎯 Beneficios del Refactoring

### Antes (App.tsx monolítico)
```typescript
// App.tsx - 1400+ líneas
function App() {
  // 50+ estados
  const [user, setUser] = useState(...);
  const [sessions, setSessions] = useState(...);
  const [theme, setTheme] = useState(...);
  const [showHelp, setShowHelp] = useState(...);
  // ... 46 estados más
  
  // 30+ funciones
  const handleLogin = () => { ... };
  const handleLogout = () => { ... };
  const handleNewChat = () => { ... };
  // ... 27 funciones más
  
  // 800+ líneas de JSX
  return (
    <div>
      {/* Modales */}
      {/* Sidebar */}
      {/* Chat */}
      {/* ... */}
    </div>
  );
}
```

### Después (Con Context API)
```typescript
// App.tsx - ~300 líneas
function App() {
  // Hooks de contexto
  const { user, showLanding } = useAuth();
  const { currentMessages, isLoading } = useChat();
  const { theme, showHelp } = useUI();
  
  // Solo lógica específica de App
  // ...
  
  // JSX limpio
  return (
    <div>
      {/* Componentes */}
    </div>
  );
}
```

---

## 📊 Comparación de Líneas

| Archivo | Antes | Después | Reducción |
|---------|-------|---------|-----------|
| App.tsx | 1400 | ~300 | -78% |
| AuthContext | 0 | 100 | +100 |
| ChatContext | 0 | 200 | +200 |
| UIContext | 0 | 150 | +150 |
| AppProviders | 0 | 30 | +30 |
| **TOTAL** | **1400** | **780** | **-44%** |

**Resultado**: 620 líneas menos, mejor organización

---

## ✅ Ventajas

### 1. **Separación de Responsabilidades**
- Cada contexto tiene un propósito claro
- Fácil de entender qué hace cada parte
- Cambios aislados no afectan otras áreas

### 2. **Reutilización**
```typescript
// Cualquier componente puede usar los contextos
function MyComponent() {
  const { user } = useAuth();
  const { showToast } = useUI();
  
  // Usar sin prop drilling
}
```

### 3. **Testing Más Fácil**
```typescript
// Testear contextos individualmente
test('AuthContext - login', () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider
  });
  
  act(() => {
    result.current.handleLogin(mockProfile);
  });
  
  expect(result.current.user).toBe(mockProfile);
});
```

### 4. **Mantenibilidad**
- Archivos pequeños y enfocados
- Fácil de navegar
- Menos conflictos en Git
- Onboarding más rápido para nuevos devs

### 5. **Performance**
- Re-renders más controlados
- Solo componentes que usan el contexto se re-renderizan
- Posibilidad de memoización selectiva

---

## 🔄 Proceso de Migración

### Fase 1: Crear Contextos ✅
- [x] AuthContext
- [x] ChatContext
- [x] UIContext
- [x] AppProviders

### Fase 2: Actualizar Router ✅
- [x] Envolver App con AppProviders

### Fase 3: Refactorizar App.tsx (EN PROGRESO)
- [ ] Reemplazar estados con hooks de contexto
- [ ] Eliminar funciones movidas a contextos
- [ ] Limpiar imports
- [ ] Simplificar JSX

### Fase 4: Testing
- [ ] Verificar que todo funciona igual
- [ ] Probar todos los flujos
- [ ] Verificar performance

---

## 🎨 Patrón de Uso

### En App.tsx (después del refactoring)
```typescript
import { useAuth } from './contexts/AuthContext';
import { useChat } from './contexts/ChatContext';
import { useUI } from './contexts/UIContext';

function App() {
  // Obtener estado y funciones de contextos
  const { user, showLanding, handleLogin } = useAuth();
  const { 
    currentMessages, 
    isLoading, 
    handleSend, 
    handleNewChat 
  } = useChat();
  const { 
    theme, 
    showHelp, 
    setShowHelp, 
    showToast 
  } = useUI();
  
  // Solo lógica específica de App aquí
  // ...
  
  return (
    // JSX simplificado
  );
}
```

### En cualquier componente hijo
```typescript
function Sidebar() {
  const { sessions, handleDeleteSession } = useChat();
  const { setShowSettings } = useUI();
  
  return (
    // Usar sin prop drilling
  );
}
```

---

## 🚀 Próximos Pasos

1. **Completar refactoring de App.tsx**
   - Reemplazar todos los estados
   - Eliminar funciones duplicadas
   - Limpiar código

2. **Actualizar componentes hijos**
   - Sidebar: usar useChat y useUI
   - MessageBubble: usar useChat
   - Modales: usar useUI

3. **Optimizar performance**
   - Agregar React.memo donde sea necesario
   - Usar useMemo/useCallback en contextos
   - Medir re-renders

4. **Documentar**
   - Agregar JSDoc a contextos
   - Documentar hooks personalizados
   - Crear guía de uso

---

## 📝 Notas Importantes

### ⚠️ Orden de Providers Importa
```typescript
// ✅ CORRECTO
<UIProvider>
  <AuthProvider>
    <ChatProvider>
      {children}
    </ChatProvider>
  </AuthProvider>
</UIProvider>

// ❌ INCORRECTO (ChatProvider necesita AuthProvider)
<ChatProvider>
  <AuthProvider>
    {children}
  </AuthProvider>
</ChatProvider>
```

### ⚠️ No Abusar de Context
- Context es para estado global
- Estado local debe quedarse en componentes
- No crear contextos para todo

### ⚠️ Performance
- Context re-renderiza todos los consumidores
- Dividir contextos por frecuencia de cambio
- Usar React.memo en componentes pesados

---

## 🎯 Resultado Esperado

### Antes
- ❌ App.tsx de 1400 líneas
- ❌ Difícil de mantener
- ❌ Props drilling
- ❌ Difícil de testear
- ❌ Acoplamiento alto

### Después
- ✅ App.tsx de ~300 líneas
- ✅ Fácil de mantener
- ✅ Sin props drilling
- ✅ Fácil de testear
- ✅ Bajo acoplamiento
- ✅ Mejor organización
- ✅ Más escalable

---

**Estado**: 🟡 EN PROGRESO (60% completado)
**Próximo paso**: Refactorizar App.tsx para usar los contextos
**Tiempo estimado**: 30-45 minutos
