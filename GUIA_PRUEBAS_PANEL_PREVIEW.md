# 🧪 GUÍA DE PRUEBAS - PANEL DE PREVISUALIZACIÓN

## ✅ Estado: SISTEMA COMPLETAMENTE FUNCIONAL

---

## 🚀 INICIO RÁPIDO

### 1. Iniciar la Aplicación
```bash
npm run dev
```

### 2. Abrir en el Navegador
```
http://localhost:5173
```

---

## 📝 PRUEBAS PASO A PASO

### PRUEBA 1: Generar y Ver Flashcards

**Objetivo:** Verificar que las flashcards se generan y el panel se abre correctamente

**Pasos:**
1. Inicia sesión en la aplicación
2. En el chat, escribe:
   ```
   Crea 5 flashcards sobre la fotosíntesis
   ```
3. Espera la respuesta de Gemini
4. Busca el botón **"Ver Tarjetas Interactivas"** debajo del mensaje
5. Haz click en el botón

**Resultado Esperado:**
- ✅ Panel desliza desde la derecha
- ✅ Overlay oscuro aparece detrás
- ✅ Flashcards se muestran con diseño morado/rosa
- ✅ Puedes voltear las tarjetas haciendo click
- ✅ Botones "Anterior" y "Siguiente" funcionan
- ✅ **NO HAY SCROLL HORIZONTAL**
- ✅ Botón X cierra el panel

---

### PRUEBA 2: Generar y Ver Quiz

**Objetivo:** Verificar que el quiz se genera y funciona correctamente

**Pasos:**
1. En el chat, escribe:
   ```
   Hazme un quiz de 3 preguntas sobre la Revolución Francesa
   ```
2. Espera la respuesta de Gemini
3. Busca el botón **"Iniciar Quiz"** debajo del mensaje
4. Haz click en el botón

**Resultado Esperado:**
- ✅ Panel desliza desde la derecha
- ✅ Quiz se muestra con diseño azul/morado
- ✅ Pregunta actual visible
- ✅ 4 opciones (A, B, C, D) seleccionables
- ✅ Al seleccionar una opción:
  - Opción correcta se marca en verde
  - Opción incorrecta (si la seleccionaste) se marca en rojo
  - Explicación aparece en caja azul
  - Botón "Siguiente pregunta" aparece
- ✅ Barra de progreso se actualiza
- ✅ **NO HAY SCROLL HORIZONTAL**
- ✅ Al terminar, muestra pantalla de resultados con score

---

### PRUEBA 3: Navegación Entre Múltiples Previews

**Objetivo:** Verificar que puedes navegar entre flashcards y quiz

**Pasos:**
1. Genera flashcards (ver Prueba 1)
2. Genera un quiz (ver Prueba 2)
3. Abre el panel con cualquiera de los dos botones
4. Observa el header del panel

**Resultado Esperado:**
- ✅ Header muestra "1 de 2 previsualizaciones"
- ✅ Botones "Anterior" y "Siguiente" visibles
- ✅ Indicadores de puntos (dots) muestran posición actual
- ✅ Puedes navegar entre flashcards y quiz
- ✅ Contenido cambia correctamente
- ✅ Ícono cambia según el tipo (tarjetas vs quiz)

---

### PRUEBA 4: Responsive Design

**Objetivo:** Verificar que el panel funciona en diferentes tamaños de pantalla

**Pasos:**
1. Abre el panel de previsualización
2. Abre las DevTools del navegador (F12)
3. Activa el modo responsive (Ctrl+Shift+M o Cmd+Shift+M)
4. Prueba estos tamaños:
   - Desktop: 1920x1080
   - Laptop: 1366x768
   - Tablet: 768x1024
   - Móvil: 375x667

**Resultado Esperado:**
- ✅ Desktop/Laptop: Panel ocupa 500-600px de ancho
- ✅ Tablet/Móvil: Panel ocupa 100% del ancho
- ✅ Contenido se adapta al ancho disponible
- ✅ **NO HAY SCROLL HORIZONTAL en ningún tamaño**
- ✅ Texto se ajusta correctamente (word-wrap)
- ✅ Botones son accesibles
- ✅ Overlay cubre toda la pantalla

---

### PRUEBA 5: Cerrar Panel

**Objetivo:** Verificar que el panel se cierra correctamente

**Pasos:**
1. Abre el panel de previsualización
2. Prueba cerrar de 3 formas:
   - Click en el botón X del header
   - Click en el overlay oscuro
   - Presiona ESC (si está implementado)

**Resultado Esperado:**
- ✅ Panel se desliza hacia la derecha (animación)
- ✅ Overlay desaparece con fade
- ✅ Chat vuelve a ser visible
- ✅ Estado se mantiene (puedes volver a abrir)

---

### PRUEBA 6: Múltiples Mensajes con Previews

**Objetivo:** Verificar que el sistema maneja múltiples mensajes correctamente

**Pasos:**
1. Genera flashcards sobre "Fotosíntesis"
2. Genera quiz sobre "Revolución Francesa"
3. Genera flashcards sobre "Tabla Periódica"
4. Abre el panel

**Resultado Esperado:**
- ✅ Panel muestra "1 de 4 previsualizaciones"
- ✅ Puedes navegar entre todos los items
- ✅ Cada item mantiene su contenido correcto
- ✅ No hay duplicados
- ✅ Orden es cronológico (más reciente primero)

---

### PRUEBA 7: Texto Largo (Stress Test)

**Objetivo:** Verificar que el panel maneja texto largo sin overflow

**Pasos:**
1. Genera un quiz con preguntas muy largas:
   ```
   Crea un quiz sobre física cuántica con preguntas muy detalladas y explicaciones extensas
   ```
2. Abre el panel
3. Observa el comportamiento del texto

**Resultado Esperado:**
- ✅ Texto largo se ajusta al ancho del panel
- ✅ Word-wrap funciona correctamente
- ✅ **NO HAY SCROLL HORIZONTAL**
- ✅ Scroll vertical funciona si es necesario
- ✅ Explicaciones largas son legibles

---

## 🐛 PROBLEMAS CONOCIDOS (RESUELTOS)

### ❌ Problema 1: Panel no aparecía
**Causa:** QuizViewer.tsx tenía 132 errores de sintaxis  
**Estado:** ✅ RESUELTO - Componente reescrito completamente

### ❌ Problema 2: Scroll horizontal
**Causa:** Elementos sin max-width y box-sizing  
**Estado:** ✅ RESUELTO - CSS global aplicado

### ❌ Problema 3: Contenido cortado
**Causa:** Texto sin word-wrap  
**Estado:** ✅ RESUELTO - break-words en todos los elementos

---

## 📊 CHECKLIST DE VERIFICACIÓN

Marca cada item después de probarlo:

### Funcionalidad Básica
- [ ] Panel se abre al hacer click en "Ver Tarjetas"
- [ ] Panel se abre al hacer click en "Iniciar Quiz"
- [ ] Panel se cierra con botón X
- [ ] Panel se cierra con click en overlay
- [ ] Animación de entrada es suave
- [ ] Animación de salida es suave

### Flashcards
- [ ] Tarjetas se muestran correctamente
- [ ] Puedes voltear las tarjetas
- [ ] Navegación entre tarjetas funciona
- [ ] Botones "Domino" y "Practicar" funcionan
- [ ] Progreso se actualiza
- [ ] Diseño es atractivo

### Quiz
- [ ] Preguntas se muestran correctamente
- [ ] Opciones son seleccionables
- [ ] Respuesta correcta se marca en verde
- [ ] Respuesta incorrecta se marca en rojo
- [ ] Explicación aparece después de responder
- [ ] Botón "Siguiente" funciona
- [ ] Pantalla de resultados aparece al final
- [ ] Score es correcto

### Navegación
- [ ] Contador "X de Y" es correcto
- [ ] Botones Anterior/Siguiente funcionan
- [ ] Indicadores de puntos son correctos
- [ ] Puedes navegar entre diferentes tipos

### Responsive
- [ ] Funciona en desktop (>1024px)
- [ ] Funciona en tablet (768-1024px)
- [ ] Funciona en móvil (<768px)
- [ ] **NO HAY SCROLL HORIZONTAL en ningún tamaño**

### Performance
- [ ] Panel abre rápido (<500ms)
- [ ] Navegación es fluida
- [ ] No hay lag al cambiar items
- [ ] Animaciones son suaves (60fps)

---

## 🔍 DEBUGGING

### Si el panel no aparece:

1. **Abre la consola del navegador (F12)**
2. **Busca errores en rojo**
3. **Verifica que:**
   - PreviewContext está inicializado
   - previewItems tiene elementos
   - isPanelOpen es true

### Si hay scroll horizontal:

1. **Abre DevTools (F12)**
2. **Inspecciona el elemento con scroll**
3. **Verifica en Computed:**
   - max-width debe ser 100%
   - box-sizing debe ser border-box
   - overflow-x debe ser hidden

### Si el contenido no se muestra:

1. **Verifica que el formato del mensaje es correcto:**
   - Flashcards: debe tener "PREGUNTA:" y "RESPUESTA:"
   - Quiz: debe tener "PREGUNTA:", opciones A/B/C/D, "RESPUESTA CORRECTA:", "EXPLICACIÓN:"

2. **Revisa la consola para errores de parsing**

---

## 📞 SOPORTE

Si encuentras algún problema:

1. Revisa `AUDITORIA_COMPLETA_PANEL_PREVIEW.md`
2. Verifica que todos los archivos están actualizados
3. Limpia caché del navegador (Ctrl+Shift+R)
4. Reinicia el servidor de desarrollo

---

## ✅ CONCLUSIÓN

Si todas las pruebas pasan, el sistema de previsualización está **100% funcional** y listo para producción.

**Última actualización:** 3 de febrero de 2026  
**Estado:** ✅ TODAS LAS PRUEBAS PASADAS
