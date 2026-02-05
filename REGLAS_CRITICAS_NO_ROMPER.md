# 🚨 REGLAS CRÍTICAS - NO ROMPER NUNCA

## ⚠️ ESTAS REGLAS SON SAGRADAS

Este documento contiene las reglas que **NUNCA** deben romperse en este proyecto. Fueron aprendidas después de múltiples intentos de corrección.

---

## 🚫 REGLA #1: NUNCA USAR GRADIENTES CSS EN PANELES LATERALES

### ❌ PROHIBIDO:
```tsx
// NO HACER ESTO EN PreviewPanel, QuizViewer, FlashcardViewer
className="bg-gradient-to-r from-blue-500 to-purple-500"
className="bg-gradient-to-br from-purple-50 to-pink-50"
```

### ✅ PERMITIDO:
```tsx
// Usar colores sólidos
style={{ background: '#4285F4' }}
className="bg-blue-500"
```

### 📝 RAZÓN:
Los gradientes CSS pueden causar overflow horizontal en paneles laterales porque se renderizan más allá del contenedor en algunos navegadores.

### 🎯 COMPONENTES AFECTADOS:
- `components/PreviewPanel.tsx`
- `components/QuizViewer.tsx`
- `components/FlashcardViewer.tsx`
- Cualquier componente que se renderice dentro del PreviewPanel

---

## 🚫 REGLA #2: SIEMPRE USAR `boxSizing: 'border-box'` EN PANELES

### ✅ OBLIGATORIO:
```tsx
// TODOS los contenedores en paneles laterales DEBEN tener:
style={{
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box'
}}
```

### 📝 RAZÓN:
Sin `box-sizing: border-box`, el padding y border se agregan al ancho, causando overflow.

---

## 🚫 REGLA #3: NUNCA USAR `shadow-lg` o `shadow-xl` EN PANELES

### ❌ PROHIBIDO:
```tsx
className="shadow-lg hover:shadow-xl"
```

### ✅ PERMITIDO:
```tsx
// Sin sombras, o sombras muy pequeñas
className="shadow-sm"
```

### 📝 RAZÓN:
Las sombras grandes se extienden fuera del contenedor y pueden causar scroll horizontal.

---

## 🚫 REGLA #4: SIEMPRE FORZAR WORD-WRAP EN TEXTOS

### ✅ OBLIGATORIO:
```tsx
// TODOS los textos en paneles DEBEN tener:
style={{
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  wordBreak: 'break-word'
}}
```

### 📝 RAZÓN:
Textos largos sin word-wrap causan overflow horizontal.

---

## 🚫 REGLA #5: CONTENEDOR PRINCIPAL DEBE TENER `overflow: 'hidden'`

### ✅ OBLIGATORIO:
```tsx
// El contenedor principal del panel DEBE tener:
<div style={{ 
  width: '100%', 
  maxWidth: '100%', 
  overflow: 'hidden',
  boxSizing: 'border-box' 
}}>
```

### 📝 RAZÓN:
Previene cualquier overflow accidental de elementos hijos.

---

## 🚫 REGLA #6: NUNCA USAR `input: 'text'` EN SweetAlert DE ELIMINACIÓN

### ❌ PROHIBIDO:
```tsx
Swal.fire({
  title: '¿Eliminar?',
  input: 'text',  // ← NO HACER ESTO
  showCancelButton: true
})
```

### ✅ OBLIGATORIO:
```tsx
// En showDeleteConfirm SIEMPRE usar:
{
  input: undefined,
  didOpen: () => {
    // Eliminar inputs manualmente
    const popup = Swal.getPopup();
    if (popup) {
      const inputs = popup.querySelectorAll('input, textarea');
      inputs.forEach(input => input.remove());
    }
  }
}
```

### 📝 RAZÓN:
Los inputs en diálogos de confirmación confunden al usuario y no son necesarios.

---

## 🚫 REGLA #7: ESTILOS INLINE PARA DIMENSIONES CRÍTICAS

### ✅ OBLIGATORIO:
```tsx
// Para width, maxWidth, boxSizing, overflow:
// SIEMPRE usar estilos inline, NO Tailwind
style={{
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  overflow: 'hidden'
}}

// NO usar:
className="w-full max-w-full"  // ← Puede ser sobrescrito
```

### 📝 RAZÓN:
Los estilos inline tienen mayor especificidad y no pueden ser sobrescritos accidentalmente.

---

## 🚫 REGLA #8: NUNCA USAR ANCHOS FIJOS EN PANELES LATERALES

### ❌ PROHIBIDO:
```tsx
style={{ width: '500px' }}
className="w-[500px]"
```

### ✅ PERMITIDO:
```tsx
style={{ width: '100%', maxWidth: '100%' }}
className="w-full max-w-full"
```

### 📝 RAZÓN:
Anchos fijos pueden exceder el ancho del contenedor en pantallas pequeñas.

---

## 🚫 REGLA #9: VERIFICAR SIEMPRE CON TEXTO LARGO

### ✅ OBLIGATORIO:
Antes de considerar un componente "terminado", probarlo con:

```tsx
// Texto de prueba largo
const testLongText = "Esta es una pregunta extremadamente larga que contiene muchas palabras y debería ajustarse correctamente al ancho del contenedor sin causar scroll horizontal en ninguna circunstancia posible incluso en pantallas muy pequeñas";
```

### 📝 RAZÓN:
Los problemas de overflow solo aparecen con contenido real largo.

---

## 🚫 REGLA #10: NUNCA CONFIAR EN TAILWIND PARA OVERFLOW

### ✅ OBLIGATORIO:
```tsx
// Para prevenir overflow, SIEMPRE usar estilos inline:
style={{
  overflow: 'hidden',
  overflowX: 'hidden',
  maxWidth: '100%'
}}

// NO confiar solo en:
className="overflow-hidden max-w-full"  // ← Puede fallar
```

### 📝 RAZÓN:
Tailwind puede ser sobrescrito por otros estilos. Los estilos inline son más confiables.

---

## 📋 CHECKLIST ANTES DE COMMIT

Antes de hacer commit de cualquier cambio en componentes de panel, verificar:

- [ ] ❌ No hay gradientes CSS (`bg-gradient-*`)
- [ ] ✅ Todos los contenedores tienen `boxSizing: 'border-box'`
- [ ] ✅ Contenedor principal tiene `overflow: 'hidden'`
- [ ] ✅ Todos los textos tienen word-wrap forzado
- [ ] ❌ No hay sombras grandes (`shadow-lg`, `shadow-xl`)
- [ ] ✅ Dimensiones críticas usan estilos inline
- [ ] ❌ No hay anchos fijos
- [ ] ✅ Probado con texto largo
- [ ] ✅ Probado en móvil (375px)
- [ ] ✅ No hay scroll horizontal en ningún tamaño

---

## 🚨 SI APARECE SCROLL HORIZONTAL

### Pasos de debugging:

1. **Abrir DevTools (F12)**
2. **Inspeccionar el elemento con scroll**
3. **Verificar en Computed:**
   - `box-sizing` debe ser `border-box`
   - `max-width` debe ser `100%`
   - `overflow-x` debe ser `hidden`
4. **Buscar:**
   - ❌ Gradientes CSS
   - ❌ Sombras grandes
   - ❌ Anchos fijos
   - ❌ Textos sin word-wrap
5. **Aplicar solución:**
   - Eliminar gradientes
   - Agregar estilos inline
   - Forzar word-wrap

---

## 📁 COMPONENTES CRÍTICOS

Estos componentes DEBEN seguir TODAS las reglas:

1. **`components/PreviewPanel.tsx`**
   - Contenedor del panel lateral
   - NUNCA usar gradientes
   - SIEMPRE `overflow: 'hidden'`

2. **`components/QuizViewer.tsx`**
   - Renderizado dentro del panel
   - NUNCA usar gradientes
   - SIEMPRE word-wrap en textos

3. **`components/FlashcardViewer.tsx`**
   - Renderizado dentro del panel
   - Puede usar gradientes SOLO en tarjetas individuales
   - NUNCA en contenedor principal

4. **`utils/sweetAlert.ts`**
   - `showDeleteConfirm` NUNCA debe tener input
   - SIEMPRE `input: undefined`
   - SIEMPRE eliminar inputs en `didOpen`

---

## 🎯 RESUMEN EJECUTIVO

### ❌ NUNCA:
1. Gradientes CSS en paneles laterales
2. Sombras grandes
3. Anchos fijos
4. Inputs en diálogos de eliminación
5. Confiar solo en Tailwind para overflow

### ✅ SIEMPRE:
1. `boxSizing: 'border-box'`
2. `overflow: 'hidden'` en contenedor principal
3. Word-wrap forzado en textos
4. Estilos inline para dimensiones críticas
5. Probar con texto largo
6. Verificar en móvil

---

## 📞 CONTACTO DE EMERGENCIA

Si estas reglas se rompen y aparece scroll horizontal:

1. **Leer:** `SOLUCION_DEFINITIVA_SCROLL.md`
2. **Verificar:** Checklist arriba
3. **Aplicar:** Solución de estilos inline + sin gradientes
4. **Probar:** Con texto largo en móvil

---

## ⚠️ ADVERTENCIA FINAL

**Estas reglas fueron aprendidas después de 50+ intentos de corrección.**

**NO las ignores.**

**NO pienses "esta vez será diferente".**

**NO uses gradientes en paneles laterales.**

**PUNTO.**

---

**Fecha de creación:** 3 de febrero de 2026  
**Última actualización:** 3 de febrero de 2026  
**Intentos previos:** 50+  
**Estado:** ✅ REGLAS ESTABLECIDAS  
**Prioridad:** 🚨 CRÍTICA - NO ROMPER NUNCA
