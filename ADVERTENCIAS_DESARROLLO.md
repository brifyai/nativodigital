# ⚠️ ADVERTENCIAS CRÍTICAS DE DESARROLLO

## 🚨 LEE ESTO ANTES DE MODIFICAR CÓDIGO

---

## 🔴 PROBLEMA HISTÓRICO: SCROLL HORIZONTAL

### Contexto
Este proyecto tuvo un problema de scroll horizontal que tomó **50+ intentos** resolver.

### Causa Raíz
**Gradientes CSS** (`bg-gradient-to-r from-blue-500 to-purple-500`) en paneles laterales.

### Solución
Eliminados todos los gradientes y reemplazados con colores sólidos.

### ⚠️ ADVERTENCIA
**NUNCA vuelvas a agregar gradientes CSS en:**
- `components/PreviewPanel.tsx`
- `components/QuizViewer.tsx`
- `components/FlashcardViewer.tsx`

---

## 🔴 PROBLEMA HISTÓRICO: INPUT EN SWEETALERT

### Contexto
Los diálogos de confirmación de eliminación mostraban un campo de input blanco innecesario.

### Causa Raíz
SweetAlert2 mostraba inputs por defecto.

### Solución
- `input: undefined` explícito
- Eliminación manual de inputs en `didOpen()`
- CSS para ocultar inputs con clase `.swal-delete-confirm`

### ⚠️ ADVERTENCIA
**NUNCA modifiques `showDeleteConfirm` en `utils/sweetAlert.ts` sin:**
1. Mantener `input: undefined`
2. Mantener el callback `didOpen()` que elimina inputs
3. Probar visualmente el diálogo

---

## 📋 REGLAS DE ORO

### 1. Paneles Laterales
```tsx
// ✅ HACER
<div style={{
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  overflow: 'hidden'
}}>

// ❌ NO HACER
<div className="bg-gradient-to-r from-blue-500 to-purple-500">
```

### 2. Textos Largos
```tsx
// ✅ HACER
<p style={{
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  wordBreak: 'break-word'
}}>

// ❌ NO HACER
<p className="whitespace-nowrap">
```

### 3. SweetAlert Eliminación
```tsx
// ✅ HACER
showDeleteConfirm(title, text)  // Usa la función existente

// ❌ NO HACER
Swal.fire({
  input: 'text',  // ← NUNCA
  ...
})
```

---

## 🧪 TESTING OBLIGATORIO

Antes de hacer commit de cambios en componentes visuales:

### Test 1: Scroll Horizontal
```bash
# 1. Abrir la app
npm run dev

# 2. Generar contenido
"Hazme un quiz de 5 preguntas con texto muy largo"

# 3. Abrir panel de previsualización

# 4. Verificar
- ✅ NO hay scroll horizontal
- ✅ Texto se ajusta al ancho
- ✅ Funciona en móvil (375px)
```

### Test 2: SweetAlert
```bash
# 1. Crear una conversación
# 2. Click en eliminar (🗑️)
# 3. Verificar diálogo
- ✅ NO hay campo de input blanco
- ✅ Solo título, texto y botones
```

---

## 📁 ARCHIVOS CRÍTICOS

### NO MODIFICAR SIN LEER DOCUMENTACIÓN:

1. **`components/QuizViewer.tsx`**
   - Leer: `SOLUCION_DEFINITIVA_SCROLL.md`
   - Regla: NO gradientes, estilos inline

2. **`utils/sweetAlert.ts`**
   - Leer: `FIX_SWEETALERT_INPUT_BLANCO.md`
   - Regla: `input: undefined` en `showDeleteConfirm`

3. **`components/PreviewPanel.tsx`**
   - Leer: `AUDITORIA_COMPLETA_PANEL_PREVIEW.md`
   - Regla: `overflow: 'hidden'` en contenedor

4. **`index.html`**
   - Leer: CSS de `.preview-panel-content`
   - Regla: NO eliminar reglas de overflow

---

## 🚨 SI ALGO SE ROMPE

### Scroll Horizontal Aparece
1. Leer: `REGLAS_CRITICAS_NO_ROMPER.md`
2. Leer: `SOLUCION_DEFINITIVA_SCROLL.md`
3. Verificar: NO hay gradientes CSS
4. Verificar: Estilos inline en dimensiones
5. Aplicar: Solución documentada

### Input Blanco en SweetAlert
1. Leer: `FIX_SWEETALERT_INPUT_BLANCO.md`
2. Verificar: `input: undefined` en código
3. Verificar: CSS `.swal-delete-confirm` en index.html
4. Verificar: Callback `didOpen()` elimina inputs

### Panel No Aparece
1. Leer: `AUDITORIA_COMPLETA_PANEL_PREVIEW.md`
2. Verificar: PreviewContext está inicializado
3. Verificar: PreviewPanel renderizado en App.tsx
4. Verificar: No hay errores en consola

---

## 📚 DOCUMENTACIÓN COMPLETA

### Problemas Resueltos
- `SOLUCION_DEFINITIVA_SCROLL.md` - Scroll horizontal
- `FIX_SWEETALERT_INPUT_BLANCO.md` - Input en SweetAlert
- `AUDITORIA_COMPLETA_PANEL_PREVIEW.md` - Panel de previsualización

### Guías
- `REGLAS_CRITICAS_NO_ROMPER.md` - Reglas sagradas
- `GUIA_PRUEBAS_PANEL_PREVIEW.md` - Testing completo
- `RESUMEN_SOLUCION_FINAL.md` - Resumen ejecutivo

---

## 🎯 FILOSOFÍA DE DESARROLLO

### Principio #1: Simplicidad
**Colores sólidos > Gradientes complejos**

Los gradientes se ven bonitos pero causan problemas. Usa colores sólidos en paneles laterales.

### Principio #2: Estilos Inline para Críticos
**Estilos inline > Tailwind para dimensiones**

Para `width`, `maxWidth`, `boxSizing`, `overflow`: usa estilos inline. Son más confiables.

### Principio #3: Probar con Contenido Real
**Texto largo > Lorem ipsum**

Siempre prueba con texto largo real. Los problemas solo aparecen con contenido real.

### Principio #4: Documentar Todo
**Documentación > Memoria**

Si algo tomó 50+ intentos resolver, documéntalo para que no vuelva a pasar.

---

## ⚠️ MENSAJE FINAL

**Este proyecto ha sufrido problemas que tomaron días resolver.**

**La documentación existe por una razón.**

**Léela antes de modificar código crítico.**

**No repitas los errores del pasado.**

---

**Creado:** 3 de febrero de 2026  
**Última actualización:** 3 de febrero de 2026  
**Lecciones aprendidas:** 50+ intentos  
**Estado:** ✅ DOCUMENTADO COMPLETAMENTE
