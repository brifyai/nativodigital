# REFACTORING FASE 1 - PLAN DETALLADO

## OBJETIVO
Reducir App.tsx de 2,140 líneas a ~500 líneas sin perder funcionalidad, diseño ni características.

## PROGRESO ACTUAL
✅ **Paso 1: Extracción de prompts COMPLETADA (100%)**
- ✅ 9 archivos de prompts modulares creados
- ✅ Helper `getPromptForTool()` implementado
- ✅ App.tsx actualizado para usar prompts modulares

✅ **Paso 2: Custom Hooks COMPLETADO (100%)**
- ✅ `hooks/useFileHandling.ts` - Manejo de archivos e imágenes (103 líneas)
- ✅ `hooks/useVoiceRecognition.ts` - Reconocimiento de voz (95 líneas)
- ✅ `hooks/useStudyTools.ts` - Generación de herramientas de estudio (60 líneas)
- ✅ `hooks/useExport.ts` - Exportación de datos (135 líneas)
- ✅ App.tsx actualizado para usar los hooks
- ✅ Eliminadas ~300 líneas adicionales de App.tsx

**RESULTADO ACUMULADO:** App.tsx reducido en ~700 líneas totales (de 2,140 a ~1,440 líneas)

## PASOS RESTANTES

### ✅ PASO 1: Extracción de prompts COMPLETADO

### ✅ PASO 2: Custom Hooks COMPLETADO

### PASO 3: Crear componentes de UI (1 hora)
Extraer lógica de App.tsx a hooks reutilizables:

**2.1 `hooks/useFileHandling.ts`**
```typescript
export const useFileHandling = () => {
  // handleFileSelect
  // removeAttachment
  // validateFile
  // optimizeImage
}
```

**2.2 `hooks/useVoiceRecognition.ts`**
```typescript
export const useVoiceRecognition = () => {
  // toggleListening
  // recognitionRef
  // isListening state
}
```

**2.3 `hooks/useStudyTools.ts`**
```typescript
export const useStudyTools = () => {
  // handleGenerateStudyTool
  // askForTopic
  // getPromptForTool (importado de data/prompts)
}
```

**2.4 `hooks/useExport.ts`**
```typescript
export const useExport = () => {
  // handleExportData
  // handleExportMarkdown
  // handleExportText
}
```

### PASO 3: Crear componentes de UI (1 hora)
Extraer JSX repetitivo a componentes:

**3.1 `components/ChatInterface.tsx`**
- Área de mensajes
- Scroll automático
- Loading states

**3.2 `components/InputArea.tsx`**
- Textarea
- Botones de envío
- Attachments preview
- Voice button

**3.3 `components/AttachmentPreview.tsx`**
- Preview de archivos adjuntos
- Botón de eliminar

### PASO 4: Actualizar App.tsx (30 min)
- Importar hooks y componentes nuevos
- Reemplazar lógica con hooks
- Reemplazar JSX con componentes
- Importar prompts desde `data/prompts`

### PASO 5: Unificar variables de entorno (15 min)
- [ ] Buscar todas las referencias a `REACT_APP_`
- [ ] Reemplazar con `VITE_`
- [ ] Actualizar `vite.config.ts`
- [ ] Actualizar `.env.local` y `.env.production`

### PASO 6: Testing manual (30 min)
- [ ] Probar cada método de estudio
- [ ] Probar file upload
- [ ] Probar voice input
- [ ] Probar exportación
- [ ] Probar navegación
- [ ] Verificar que no hay errores en consola

## ESTIMACIÓN TOTAL
**Tiempo:** 4-5 horas
**Riesgo:** BAJO (no tocamos lógica, solo reorganizamos)
**Beneficio:** App.tsx pasa de 2,140 a ~500 líneas

## SIGUIENTE SESIÓN

**PASO 1 COMPLETADO ✅**

El Paso 1 (Extracción de prompts) está 100% completado. App.tsx ahora usa prompts modulares desde `data/prompts/`.

**¿Qué sigue?**

Opciones para continuar el refactoring:

1. **PASO 2: Crear custom hooks** (1-2 horas)
   - `hooks/useFileHandling.ts` - Manejo de archivos e imágenes
   - `hooks/useVoiceRecognition.ts` - Reconocimiento de voz
   - `hooks/useStudyTools.ts` - Generación de herramientas de estudio
   - `hooks/useExport.ts` - Exportación de datos

2. **PASO 3: Crear componentes de UI** (1 hora)
   - `components/ChatInterface.tsx` - Área de mensajes
   - `components/InputArea.tsx` - Input con attachments y voz
   - `components/AttachmentPreview.tsx` - Preview de archivos

3. **PASO 4: Actualizar App.tsx** (30 min)
   - Importar y usar los nuevos hooks
   - Reemplazar JSX con componentes nuevos

4. **PASO 5: Testing manual** (30 min)
   - Verificar que todo funciona correctamente

**Dime por dónde quieres continuar.**
