# 🧪 GUÍA DE TESTING - NUEVOS VISUALIZADORES

## 📋 RESUMEN

Esta guía te ayudará a probar los **6 nuevos visualizadores** que se acaban de integrar en Nativo Digital.

---

## 🎯 VISUALIZADORES A PROBAR

1. ✅ Resumen Fácil
2. ✅ Método Feynman
3. ✅ Notas Cornell
4. ✅ Mapa Mental
5. ✅ Repetición Espaciada
6. ✅ Recuperación Activa

---

## 🚀 PREPARACIÓN

### Paso 1: Iniciar la aplicación
```bash
npm run dev
```

### Paso 2: Abrir la consola del navegador
- Chrome/Edge: `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Ir a la pestaña "Console"
- Dejar abierta para ver los logs de debugging

### Paso 3: Iniciar sesión
- Usar cualquier email/contraseña (modo demo)
- O crear una cuenta nueva

---

## 🧪 TESTS POR VISUALIZADOR

### 1️⃣ RESUMEN FÁCIL

**Pasos**:
1. Clic en el botón de menú (☰) en la esquina superior izquierda
2. Clic en "Herramientas de Estudio" 
3. Buscar y hacer clic en "Resumen Fácil"
4. Ingresar un tema, por ejemplo: `Fotosíntesis`
5. Clic en "Generar"

**Qué verificar**:
- ✅ El chat muestra el resumen con secciones
- ✅ El panel derecho se abre automáticamente
- ✅ Aparece "Resumen Fácil" en el panel
- ✅ Las secciones se pueden expandir/colapsar
- ✅ Los puntos clave aparecen en bullets
- ✅ No hay emojis en el contenido

**Logs esperados en consola**:
```
🔍 Parseando Resumen Fácil...
✅ Resumen parseado: X secciones
✅ Agregando resumen al panel: X secciones
```

---

### 2️⃣ MÉTODO FEYNMAN

**Pasos**:
1. Herramientas de Estudio → "Método Feynman"
2. Ingresar tema: `Teoría de la Relatividad`
3. Generar

**Qué verificar**:
- ✅ Panel muestra "Método Feynman"
- ✅ Aparecen 4 pasos numerados
- ✅ Cada paso tiene un icono diferente
- ✅ Barra de progreso funciona
- ✅ Botones "Anterior" y "Siguiente" funcionan
- ✅ Al completar los 4 pasos, aparece mensaje de felicitación
- ✅ No hay emojis

**Logs esperados**:
```
🔍 Parseando Método Feynman...
✅ Feynman parseado: 4 pasos
✅ Agregando Feynman al panel: 4 pasos
```

---

### 3️⃣ NOTAS CORNELL

**Pasos**:
1. Herramientas de Estudio → "Notas Cornell"
2. Ingresar tema: `Revolución Francesa`
3. Generar

**Qué verificar**:
- ✅ Panel muestra "Notas Cornell"
- ✅ Aparecen 3 secciones: Pistas, Notas, Resumen
- ✅ Cada sección tiene su color distintivo
- ✅ Las pistas están en la columna izquierda
- ✅ Las notas en la columna derecha
- ✅ El resumen al final
- ✅ Responsive en móvil (si reduces la ventana)

**Logs esperados**:
```
🔍 Parseando Notas Cornell...
✅ Cornell parseado: X pistas, Y notas
✅ Agregando Cornell al panel
```

---

### 4️⃣ MAPA MENTAL

**Pasos**:
1. Herramientas de Estudio → "Mapa Mental"
2. Ingresar tema: `Sistema Solar`
3. Generar

**Qué verificar**:
- ✅ Panel muestra "Mapa Mental"
- ✅ Aparece el tema central destacado
- ✅ Ramas principales con colores
- ✅ Sub-conceptos bajo cada rama
- ✅ Botones de expandir/colapsar funcionan
- ✅ Animaciones suaves al expandir
- ✅ Estructura jerárquica clara

**Logs esperados**:
```
🔍 Parseando Mapa Mental...
✅ Mapa Mental parseado: X nodos
✅ Agregando Mapa Mental al panel: X nodos
```

---

### 5️⃣ REPETICIÓN ESPACIADA

**Pasos**:
1. Herramientas de Estudio → "Repetición Espaciada"
2. Ingresar tema: `Tabla Periódica`
3. Generar

**Qué verificar**:
- ✅ Panel muestra "Repetición Espaciada"
- ✅ Aparece timeline con 6 sesiones (Días 1, 2, 4, 7, 14, 30)
- ✅ Cada sesión tiene fecha y temas
- ✅ Checkboxes para marcar completadas
- ✅ Al marcar, cambia el color/estilo
- ✅ Indicadores visuales de progreso
- ✅ Colores diferentes por estado

**Logs esperados**:
```
🔍 Parseando Repetición Espaciada...
✅ Repetición Espaciada parseada: 6 sesiones
✅ Agregando Repetición Espaciada al panel: 6 sesiones
```

---

### 6️⃣ RECUPERACIÓN ACTIVA

**Pasos**:
1. Herramientas de Estudio → "Recuperación Activa"
2. Ingresar tema: `Mitosis y Meiosis`
3. Generar

**Qué verificar**:
- ✅ Panel muestra "Recuperación Activa"
- ✅ Aparecen preguntas numeradas
- ✅ Respuestas están ocultas inicialmente
- ✅ Botón "Revelar respuesta" funciona
- ✅ Pistas opcionales aparecen si existen
- ✅ Navegación entre preguntas funciona
- ✅ Contador "Pregunta X de Y" correcto
- ✅ Botones "Anterior" y "Siguiente" funcionan

**Logs esperados**:
```
🔍 Parseando Recuperación Activa...
✅ Recuperación Activa parseada: X preguntas
✅ Agregando Recuperación Activa al panel: X preguntas
```

---

## 🔍 TESTS ADICIONALES

### Test 1: Múltiples Visualizadores en una Sesión
1. Generar un Resumen Fácil
2. Sin cerrar el panel, generar un Quiz
3. Verificar que ambos aparecen en el panel
4. Cambiar entre ellos usando el selector

### Test 2: Persistencia al Recargar
1. Generar cualquier visualizador
2. Recargar la página (F5)
3. Verificar que el visualizador sigue ahí
4. Verificar que funciona correctamente

### Test 3: Cambio de Sesión
1. Generar un visualizador
2. Crear un nuevo chat (Ctrl+N o botón "Nuevo Chat")
3. Verificar que el panel se cierra
4. Volver al chat anterior
5. Verificar que el visualizador sigue ahí

### Test 4: Tema Claro/Oscuro
1. Generar cualquier visualizador
2. Cambiar entre tema claro y oscuro
3. Verificar que los colores se adaptan
4. Verificar que el texto es legible en ambos temas

### Test 5: Responsive (Móvil)
1. Reducir el ancho de la ventana a ~400px
2. Generar visualizadores
3. Verificar que se adaptan al ancho
4. Verificar que no hay scroll horizontal
5. Verificar que los botones son accesibles

---

## ❌ PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: El visualizador no aparece

**Síntomas**:
- El chat muestra el contenido
- Pero el panel no se abre

**Solución**:
1. Verificar consola - buscar logs de parsing
2. Si no hay logs, el formato del prompt puede estar mal
3. Verificar que el prompt incluye las palabras clave exactas
4. Ejemplo: debe decir `**RESUMEN FÁCIL:**` no `Resumen:`

### Problema 2: Solo muestra 1 item en lugar de varios

**Síntomas**:
- Feynman muestra 1 paso en lugar de 4
- Active Recall muestra 1 pregunta en lugar de varias

**Solución**:
- Este bug ya fue corregido
- Si persiste, verificar que el `useEffect` en el visualizador actualiza el estado cuando cambian los props

### Problema 3: Emojis aparecen en el contenido

**Síntomas**:
- Ves emojis como 🎯, 📚, etc. en el texto

**Solución**:
- Verificar que `removeEmojis()` se está aplicando
- Verificar logs de consola
- Puede ser que el modelo generó emojis nuevos no cubiertos por el regex

### Problema 4: Panel no se cierra al cambiar de chat

**Síntomas**:
- Cambias de sesión pero el panel sigue abierto

**Solución**:
- Este bug ya fue corregido en ChatContext
- Verificar que `clearPreviewItems()` se llama en `useEffect`

---

## 📊 CHECKLIST DE TESTING COMPLETO

Marca cada item al completarlo:

### Visualizadores Individuales
- [ ] Resumen Fácil - Genera correctamente
- [ ] Resumen Fácil - Secciones colapsables funcionan
- [ ] Método Feynman - 4 pasos aparecen
- [ ] Método Feynman - Navegación funciona
- [ ] Método Feynman - Barra de progreso correcta
- [ ] Notas Cornell - 3 columnas aparecen
- [ ] Notas Cornell - Responsive en móvil
- [ ] Mapa Mental - Estructura jerárquica clara
- [ ] Mapa Mental - Expandir/colapsar funciona
- [ ] Repetición Espaciada - 6 sesiones aparecen
- [ ] Repetición Espaciada - Checkboxes funcionan
- [ ] Recuperación Activa - Preguntas numeradas
- [ ] Recuperación Activa - Revelar respuesta funciona

### Funcionalidad General
- [ ] Panel se abre automáticamente
- [ ] Múltiples visualizadores en una sesión
- [ ] Selector de visualizadores funciona
- [ ] Persistencia al recargar página
- [ ] Panel se cierra al cambiar de chat
- [ ] Tema claro/oscuro funciona
- [ ] Responsive en móvil
- [ ] No hay emojis en el contenido
- [ ] Logs de consola aparecen correctamente

### Performance
- [ ] Generación es rápida (< 10 segundos)
- [ ] No hay lag al navegar entre items
- [ ] No hay scroll horizontal
- [ ] Animaciones son suaves

---

## 🐛 REPORTAR BUGS

Si encuentras un bug, reporta con:

1. **Visualizador afectado**: ¿Cuál?
2. **Pasos para reproducir**: ¿Qué hiciste?
3. **Comportamiento esperado**: ¿Qué debería pasar?
4. **Comportamiento actual**: ¿Qué pasó?
5. **Logs de consola**: Copia los logs relevantes
6. **Screenshot**: Si es posible

---

## ✅ CRITERIOS DE ÉXITO

El testing es exitoso si:

1. ✅ Los 6 visualizadores se generan correctamente
2. ✅ El panel se abre automáticamente
3. ✅ La navegación funciona en todos
4. ✅ No hay emojis en el contenido
5. ✅ Persisten al recargar
6. ✅ Se limpian al cambiar de chat
7. ✅ Funcionan en tema claro y oscuro
8. ✅ Son responsive en móvil
9. ✅ No hay errores en consola
10. ✅ La experiencia es fluida y rápida

---

## 📚 DOCUMENTACIÓN RELACIONADA

- `INTEGRACION_NUEVOS_VISUALIZADORES.md` - Detalles técnicos
- `ESTADO_FINAL_VISUALIZADORES.md` - Documentación de componentes
- `GUIA_PRUEBAS_PANEL_PREVIEW.md` - Testing del panel

---

**Fecha**: 3 de Febrero, 2026
**Versión**: 1.0
**Estado**: ✅ LISTO PARA TESTING
