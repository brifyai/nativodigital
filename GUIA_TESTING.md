# 🧪 GUÍA DE TESTING - 3 MEJORAS CRÍTICAS

**Fecha:** 3 de febrero de 2026  
**Versión:** 1.0  
**Estado:** Listo para testing manual

---

## 🚀 INICIO RÁPIDO

### 1. Ejecutar la aplicación
```bash
npm run dev
```

### 2. Abrir en navegador
```
http://localhost:5173
```

### 3. Iniciar sesión
- Usa tu cuenta existente o crea una nueva

---

## ✅ TEST 1: SISTEMA DE GUARDADOS

### Objetivo
Verificar que puedes guardar contenido y acceder a tu biblioteca.

### Pasos

#### 1.1 Guardar un resumen
1. En el chat, escribe: **"Hazme un resumen de la fotosíntesis"**
2. Espera la respuesta de la IA
3. Busca el botón **"Guardar"** (icono de bookmark) en la respuesta
4. Haz click en "Guardar"
5. Ingresa:
   - **Título:** "Resumen de Fotosíntesis"
   - **Tema:** "Fotosíntesis"
   - **Materia:** "Biología"
6. Verifica que aparece el toast: **"✅ Contenido guardado en tu biblioteca"**

✅ **Resultado esperado:** Toast de confirmación

#### 1.2 Abrir biblioteca
1. Haz click en el botón **"Biblioteca"** en el header (arriba a la derecha)
2. Verifica que se abre un modal con tu contenido guardado
3. Verifica que aparece el resumen que guardaste

✅ **Resultado esperado:** Modal con 1 item guardado

#### 1.3 Buscar contenido
1. En la biblioteca, escribe **"fotosíntesis"** en el campo de búsqueda
2. Verifica que aparece el resumen

✅ **Resultado esperado:** Filtrado correcto

#### 1.4 Marcar como favorito
1. Haz click en la **estrella** del resumen
2. Verifica que la estrella se llena de color amarillo
3. Activa el filtro **"Solo favoritos"**
4. Verifica que solo aparece el resumen marcado

✅ **Resultado esperado:** Sistema de favoritos funcional

#### 1.5 Ver contenido
1. Haz click en **"Ver"** en el resumen
2. Verifica que se muestra el contenido completo
3. Verifica que el contador de repasos aumenta

✅ **Resultado esperado:** Contenido visible y contador actualizado

#### 1.6 Eliminar contenido
1. Haz click en **"Eliminar"** (icono de basura)
2. Confirma la eliminación
3. Verifica que el contenido desaparece

✅ **Resultado esperado:** Contenido eliminado

---

## ✅ TEST 2: QUIZ INTERACTIVO

### Objetivo
Verificar que puedes practicar quizzes con feedback inmediato.

### Pasos

#### 2.1 Generar un quiz
1. En el chat, escribe: **"Hazme un quiz de 5 preguntas sobre matemáticas básicas"**
2. Espera la respuesta de la IA
3. Verifica que la respuesta tiene el formato:
   ```
   **Pregunta 1:** [texto]
   A) [opción]
   B) [opción]
   C) [opción]
   D) [opción]
   **Respuesta correcta:** [letra]
   **Explicación:** [texto]
   ```

✅ **Resultado esperado:** Quiz en formato correcto

#### 2.2 Iniciar quiz interactivo
1. Busca el botón **"Practicar"** (icono de play) en la respuesta del quiz
2. Haz click en "Practicar"
3. Verifica que se abre un modal con el quiz interactivo
4. Verifica que aparece la primera pregunta

✅ **Resultado esperado:** Modal de quiz abierto

#### 2.3 Responder preguntas
1. Lee la primera pregunta
2. Selecciona una respuesta (A, B, C o D)
3. Haz click en **"Confirmar Respuesta"**
4. Verifica que aparece feedback inmediato:
   - ✅ Verde si es correcta
   - ❌ Rojo si es incorrecta
5. Lee la explicación
6. Haz click en **"Siguiente Pregunta"**
7. Repite para las 5 preguntas

✅ **Resultado esperado:** Feedback inmediato en cada pregunta

#### 2.4 Ver resultados
1. Después de la última pregunta, verifica que se muestra la pantalla de resultados
2. Verifica que aparece:
   - Score total (ej: 80%)
   - Número de correctas/incorrectas
   - Tiempo total
   - Desglose por pregunta
3. Verifica que hay botones:
   - **"Reintentar"** - Para volver a hacer el quiz
   - **"Cerrar"** - Para salir

✅ **Resultado esperado:** Pantalla de resultados completa

#### 2.5 Reintentar quiz
1. Haz click en **"Reintentar"**
2. Verifica que vuelve a la primera pregunta
3. Responde de nuevo
4. Verifica que se guarda como una nueva sesión

✅ **Resultado esperado:** Quiz reiniciado correctamente

---

## ✅ TEST 3: ANÁLISIS DE TEMAS DÉBILES

### Objetivo
Verificar que el sistema trackea tu rendimiento y te ayuda a identificar áreas de mejora.

### Pasos

#### 3.1 Completar varios quizzes
1. Completa 3 quizzes diferentes:
   - **Quiz 1:** "Quiz de matemáticas" (intenta sacar 60%)
   - **Quiz 2:** "Quiz de historia" (intenta sacar 90%)
   - **Quiz 3:** "Quiz de matemáticas" (intenta sacar 70%)

✅ **Resultado esperado:** 3 sesiones de quiz completadas

#### 3.2 Abrir análisis de temas débiles
1. Haz click en el botón **"Temas Débiles"** en el header
2. Verifica que se abre un modal con análisis
3. Verifica que aparecen los temas:
   - **Matemáticas** - Score promedio ~65% (rojo/amarillo)
   - **Historia** - Score promedio 90% (verde)

✅ **Resultado esperado:** Lista de temas con scores

#### 3.3 Verificar colores
1. Verifica que los temas con score < 70% están en **rojo**
2. Verifica que los temas con score 70-85% están en **amarillo**
3. Verifica que los temas con score > 85% están en **verde**

✅ **Resultado esperado:** Colores correctos según score

#### 3.4 Repasar tema débil
1. Busca el tema con score más bajo (ej: Matemáticas)
2. Haz click en **"Repasar Ahora"**
3. Verifica que se cierra el modal
4. Verifica que la IA genera automáticamente un nuevo quiz de repaso
5. Verifica el toast: **"Generando quiz de repaso sobre [tema]..."**

✅ **Resultado esperado:** Quiz de repaso generado automáticamente

#### 3.5 Verificar actualización de stats
1. Completa el quiz de repaso
2. Vuelve a abrir "Temas Débiles"
3. Verifica que el score del tema se actualizó
4. Verifica que el contador de intentos aumentó
5. Verifica que la fecha de último intento se actualizó

✅ **Resultado esperado:** Estadísticas actualizadas

---

## ✅ TEST 4: INTEGRACIÓN COMPLETA

### Objetivo
Verificar que todas las funcionalidades trabajan juntas correctamente.

### Pasos

#### 4.1 Flujo completo
1. Genera un quiz: **"Quiz de 5 preguntas sobre biología"**
2. **Guarda** el quiz en tu biblioteca
3. **Practica** el quiz interactivo
4. Completa el quiz con un score bajo (< 70%)
5. Abre **"Temas Débiles"**
6. Verifica que "Biología" aparece como tema débil
7. Haz click en **"Repasar Ahora"**
8. Completa el nuevo quiz con mejor score
9. Abre **"Biblioteca"**
10. Verifica que tienes 2 quizzes guardados
11. Marca uno como favorito
12. Filtra por favoritos
13. Exporta un quiz

✅ **Resultado esperado:** Todas las funcionalidades integradas correctamente

---

## ✅ TEST 5: PERSISTENCIA

### Objetivo
Verificar que los datos se guardan correctamente en localStorage.

### Pasos

#### 5.1 Guardar datos
1. Guarda 2-3 contenidos en biblioteca
2. Completa 2-3 quizzes
3. Marca algunos favoritos

#### 5.2 Recargar página
1. Recarga la página (F5)
2. Inicia sesión de nuevo
3. Abre "Biblioteca"
4. Verifica que todo el contenido guardado sigue ahí
5. Abre "Temas Débiles"
6. Verifica que las estadísticas siguen ahí

✅ **Resultado esperado:** Datos persistentes después de recargar

#### 5.3 Cerrar y abrir navegador
1. Cierra completamente el navegador
2. Abre de nuevo
3. Ve a la aplicación
4. Inicia sesión
5. Verifica que todos los datos siguen ahí

✅ **Resultado esperado:** Datos persistentes después de cerrar navegador

---

## ✅ TEST 6: RESPONSIVE

### Objetivo
Verificar que funciona en diferentes tamaños de pantalla.

### Pasos

#### 6.1 Desktop
1. Abre en pantalla completa
2. Verifica que todos los botones son visibles
3. Verifica que los modales se ven bien

✅ **Resultado esperado:** UI correcta en desktop

#### 6.2 Tablet
1. Reduce el ancho de la ventana a ~768px
2. Verifica que la UI se adapta
3. Verifica que los modales siguen siendo usables

✅ **Resultado esperado:** UI correcta en tablet

#### 6.3 Mobile
1. Abre en modo responsive (F12 > Toggle device toolbar)
2. Selecciona iPhone o Android
3. Verifica que:
   - Sidebar se oculta por defecto
   - Botones en header se adaptan
   - Modales son scrolleables
   - Quiz interactivo es usable

✅ **Resultado esperado:** UI correcta en mobile

---

## ✅ TEST 7: EDGE CASES

### Objetivo
Verificar que la app maneja casos extremos correctamente.

### Pasos

#### 7.1 Quiz sin formato correcto
1. Genera un quiz con formato incorrecto
2. Intenta hacer click en "Practicar"
3. Verifica que aparece un error: **"No se pudo parsear el quiz"**

✅ **Resultado esperado:** Error manejado correctamente

#### 7.2 Biblioteca vacía
1. Elimina todo el contenido guardado
2. Abre "Biblioteca"
3. Verifica que aparece mensaje: **"No tienes contenido guardado"**

✅ **Resultado esperado:** Mensaje de estado vacío

#### 7.3 Sin temas débiles
1. Completa quizzes con scores > 85%
2. Abre "Temas Débiles"
3. Verifica que aparece mensaje: **"¡Excelente! No tienes temas débiles"**

✅ **Resultado esperado:** Mensaje de felicitación

#### 7.4 Búsqueda sin resultados
1. En biblioteca, busca algo que no existe
2. Verifica que aparece: **"No se encontraron resultados"**

✅ **Resultado esperado:** Mensaje de búsqueda vacía

---

## 🐛 REPORTE DE BUGS

Si encuentras algún problema, documenta:

### Información del Bug
- **Descripción:** ¿Qué pasó?
- **Pasos para reproducir:** ¿Cómo llegaste ahí?
- **Resultado esperado:** ¿Qué debería pasar?
- **Resultado actual:** ¿Qué pasó en realidad?
- **Navegador:** Chrome/Firefox/Safari
- **Pantalla:** Desktop/Tablet/Mobile
- **Console errors:** Abre F12 > Console y copia errores

### Ejemplo
```
Descripción: El botón "Guardar" no aparece
Pasos: 
1. Generar resumen
2. Buscar botón de guardar
Esperado: Botón visible
Actual: No aparece
Navegador: Chrome 120
Pantalla: Desktop
Console: No errors
```

---

## ✅ CHECKLIST FINAL

Marca cada item cuando lo hayas probado:

### Sistema de Guardados
- [ ] Guardar contenido
- [ ] Abrir biblioteca
- [ ] Buscar contenido
- [ ] Filtrar por tipo
- [ ] Marcar favoritos
- [ ] Ver contenido
- [ ] Eliminar contenido
- [ ] Exportar contenido

### Quiz Interactivo
- [ ] Generar quiz
- [ ] Iniciar quiz interactivo
- [ ] Responder preguntas
- [ ] Ver feedback inmediato
- [ ] Ver explicaciones
- [ ] Ver resultados
- [ ] Reintentar quiz
- [ ] Guardar sesión

### Análisis de Temas Débiles
- [ ] Completar varios quizzes
- [ ] Abrir análisis
- [ ] Ver temas con scores
- [ ] Verificar colores
- [ ] Repasar tema débil
- [ ] Actualización de stats

### Integración
- [ ] Flujo completo
- [ ] Persistencia
- [ ] Responsive
- [ ] Edge cases

---

## 🎉 CONCLUSIÓN

Si todos los tests pasan, la integración está **100% funcional** y lista para producción.

**Próximo paso:** Desplegar a producción o continuar con mejoras adicionales.

---

**¡Buena suerte con el testing!** 🚀
