# ✅ CHECKLIST DE VERIFICACIÓN

Usa este checklist para verificar que todo funciona correctamente.

---

## 🚀 PREPARACIÓN

- [ ] Ejecutar `npm run dev`
- [ ] Abrir http://localhost:5173
- [ ] Abrir DevTools (F12) → Pestaña Console
- [ ] Iniciar sesión en la app

---

## 🧪 TESTING DE VISUALIZADORES

### 1. Resumen Fácil

- [ ] Abrir Herramientas de Estudio
- [ ] Clic en "Resumen Fácil"
- [ ] Ingresar tema: "Fotosíntesis"
- [ ] Verificar que aparece en el panel derecho
- [ ] Verificar que hay secciones colapsables
- [ ] Expandir/colapsar secciones
- [ ] Verificar que no hay emojis
- [ ] Ver logs en consola: `✅ Resumen parseado`

### 2. Método Feynman

- [ ] Clic en "Método Feynman"
- [ ] Ingresar tema: "Teoría de la Relatividad"
- [ ] Verificar que aparece en el panel
- [ ] Verificar que hay 4 pasos
- [ ] Navegar entre pasos con botones
- [ ] Verificar barra de progreso
- [ ] Completar los 4 pasos
- [ ] Ver mensaje de felicitación
- [ ] Ver logs: `✅ Feynman parseado: 4 pasos`

### 3. Notas Cornell

- [ ] Clic en "Notas Cornell"
- [ ] Ingresar tema: "Revolución Francesa"
- [ ] Verificar que aparece en el panel
- [ ] Verificar 3 secciones: Pistas, Notas, Resumen
- [ ] Verificar colores distintivos
- [ ] Verificar responsive (reducir ventana)
- [ ] Ver logs: `✅ Cornell parseado`

### 4. Mapa Mental

- [ ] Clic en "Mapa Mental"
- [ ] Ingresar tema: "Sistema Solar"
- [ ] Verificar que aparece en el panel
- [ ] Verificar tema central destacado
- [ ] Verificar ramas principales
- [ ] Expandir/colapsar nodos
- [ ] Verificar animaciones suaves
- [ ] Ver logs: `✅ Mapa Mental parseado: X nodos`

### 5. Repetición Espaciada

- [ ] Clic en "Repetición Espaciada"
- [ ] Ingresar tema: "Tabla Periódica"
- [ ] Verificar que aparece en el panel
- [ ] Verificar 6 sesiones (Días 1, 2, 4, 7, 14, 30)
- [ ] Marcar sesiones como completadas
- [ ] Verificar cambio de color al marcar
- [ ] Desmarcar sesiones
- [ ] Ver logs: `✅ Repetición Espaciada parseada: 6 sesiones`

### 6. Recuperación Activa

- [ ] Clic en "Recuperación Activa"
- [ ] Ingresar tema: "Mitosis y Meiosis"
- [ ] Verificar que aparece en el panel
- [ ] Verificar preguntas numeradas
- [ ] Verificar respuestas ocultas
- [ ] Clic en "Revelar respuesta"
- [ ] Verificar pistas (si existen)
- [ ] Navegar entre preguntas
- [ ] Verificar contador "Pregunta X de Y"
- [ ] Ver logs: `✅ Recuperación Activa parseada: X preguntas`

---

## 🔄 TESTS ADICIONALES

### Múltiples Visualizadores

- [ ] Generar Resumen Fácil
- [ ] Sin cerrar panel, generar Quiz
- [ ] Verificar que ambos aparecen en el selector
- [ ] Cambiar entre ellos
- [ ] Verificar que ambos funcionan

### Persistencia

- [ ] Generar cualquier visualizador
- [ ] Recargar página (F5)
- [ ] Verificar que el visualizador sigue ahí
- [ ] Verificar que funciona correctamente

### Cambio de Sesión

- [ ] Generar un visualizador
- [ ] Crear nuevo chat (Ctrl+N)
- [ ] Verificar que el panel se cierra
- [ ] Volver al chat anterior
- [ ] Verificar que el visualizador sigue ahí

### Temas

- [ ] Generar visualizador en tema claro
- [ ] Cambiar a tema oscuro
- [ ] Verificar que los colores se adaptan
- [ ] Verificar legibilidad del texto
- [ ] Cambiar de vuelta a tema claro

### Responsive

- [ ] Reducir ventana a ~400px
- [ ] Generar visualizadores
- [ ] Verificar que se adaptan
- [ ] Verificar que no hay scroll horizontal
- [ ] Verificar que los botones son accesibles

---

## 🐛 VERIFICACIÓN DE BUGS CORREGIDOS

### Bug 1: Quiz mostraba solo 1 pregunta

- [ ] Generar Quiz Interactivo
- [ ] Verificar que muestra todas las preguntas (5)
- [ ] Verificar contador "Pregunta X de 5"
- [ ] Navegar entre todas las preguntas

### Bug 2: Flashcards mostraban solo 1 tarjeta

- [ ] Generar Tarjetas de Memoria
- [ ] Verificar que muestra todas las tarjetas (10)
- [ ] Verificar contador "Tarjeta X de 10"
- [ ] Navegar entre todas las tarjetas

### Bug 3: Panel no se cerraba al cambiar de chat

- [ ] Generar visualizador
- [ ] Cambiar a otro chat
- [ ] Verificar que el panel se cierra automáticamente

### Bug 4: Emojis en el contenido

- [ ] Generar cualquier visualizador
- [ ] Verificar que NO hay emojis en:
  - [ ] Títulos
  - [ ] Contenido
  - [ ] Respuestas
  - [ ] Tips
  - [ ] Pistas

---

## 📊 VERIFICACIÓN DE CONSOLA

Buscar estos logs en la consola:

### Resumen Fácil
```
🔍 Parseando Resumen Fácil...
✅ Resumen parseado: X secciones
✅ Agregando resumen al panel: X secciones
```

### Método Feynman
```
🔍 Parseando Método Feynman...
✅ Feynman parseado: 4 pasos
✅ Agregando Feynman al panel: 4 pasos
```

### Notas Cornell
```
🔍 Parseando Notas Cornell...
✅ Cornell parseado: X pistas, Y notas
✅ Agregando Cornell al panel
```

### Mapa Mental
```
🔍 Parseando Mapa Mental...
✅ Mapa Mental parseado: X nodos
✅ Agregando Mapa Mental al panel: X nodos
```

### Repetición Espaciada
```
🔍 Parseando Repetición Espaciada...
✅ Repetición Espaciada parseada: 6 sesiones
✅ Agregando Repetición Espaciada al panel: 6 sesiones
```

### Recuperación Activa
```
🔍 Parseando Recuperación Activa...
✅ Recuperación Activa parseada: X preguntas
✅ Agregando Recuperación Activa al panel: X preguntas
```

---

## ❌ SI ALGO NO FUNCIONA

### El visualizador no aparece

1. [ ] Verificar consola - ¿Hay logs de parsing?
2. [ ] Si no hay logs, el parser no detectó el formato
3. [ ] Verificar que el prompt se envió correctamente
4. [ ] Intentar de nuevo

### Solo muestra 1 item

1. [ ] Verificar logs - ¿Cuántos items parseó?
2. [ ] Si parseó varios pero muestra 1, es un bug del visualizador
3. [ ] Reportar con screenshot

### Hay emojis en el contenido

1. [ ] Verificar que `removeEmojis()` se está aplicando
2. [ ] Puede ser un emoji nuevo no cubierto
3. [ ] Reportar el emoji específico

### Panel no se cierra

1. [ ] Verificar que `clearPreviewItems()` se llama
2. [ ] Ver logs de ChatContext
3. [ ] Reportar con pasos para reproducir

---

## ✅ CRITERIOS DE ÉXITO

Marca cuando se cumplan todos:

- [ ] Los 6 nuevos visualizadores funcionan
- [ ] El panel se abre automáticamente
- [ ] La navegación funciona en todos
- [ ] No hay emojis en el contenido
- [ ] Persisten al recargar
- [ ] Se limpian al cambiar de chat
- [ ] Funcionan en tema claro y oscuro
- [ ] Son responsive en móvil
- [ ] No hay errores en consola
- [ ] La experiencia es fluida

---

## 📝 NOTAS

Usa este espacio para anotar cualquier observación:

```
[Escribe aquí tus notas]
```

---

**Fecha**: _______________  
**Probado por**: _______________  
**Resultado**: ⬜ Aprobado  ⬜ Con observaciones  ⬜ Rechazado
