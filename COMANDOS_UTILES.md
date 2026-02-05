# 🛠️ COMANDOS ÚTILES - DESARROLLO Y TESTING

**Referencia rápida de comandos para trabajar con las mejoras**

---

## 🚀 COMANDOS BÁSICOS

### Desarrollo
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de build
npm run preview
```

---

## 🧪 TESTING Y DEBUGGING

### Ver datos guardados en localStorage
```bash
# En la consola del navegador (F12)

# Ver contenido guardado
console.log(JSON.parse(localStorage.getItem('nativo_saved_content')));

# Ver sesiones de quiz
console.log(JSON.parse(localStorage.getItem('nativo_quiz_sessions')));

# Ver rendimiento por tema
console.log(JSON.parse(localStorage.getItem('nativo_topic_performance')));

# Ver todo
console.log({
  saved: JSON.parse(localStorage.getItem('nativo_saved_content')),
  sessions: JSON.parse(localStorage.getItem('nativo_quiz_sessions')),
  performance: JSON.parse(localStorage.getItem('nativo_topic_performance'))
});
```

### Limpiar datos
```bash
# En la consola del navegador (F12)

# Limpiar contenido guardado
localStorage.removeItem('nativo_saved_content');

# Limpiar sesiones de quiz
localStorage.removeItem('nativo_quiz_sessions');

# Limpiar rendimiento por tema
localStorage.removeItem('nativo_topic_performance');

# Limpiar todo
localStorage.clear();
```

### Agregar datos de prueba
```bash
# En la consola del navegador (F12)

// Agregar contenido de prueba
const testContent = [{
  id: crypto.randomUUID(),
  type: 'summary',
  title: 'Test Resumen',
  content: 'Contenido de prueba',
  topic: 'Test',
  subject: 'Testing',
  createdAt: Date.now(),
  reviewCount: 0,
  isFavorite: false,
  tags: ['test']
}];
localStorage.setItem('nativo_saved_content', JSON.stringify(testContent));

// Agregar sesión de quiz de prueba
const testSession = [{
  id: crypto.randomUUID(),
  title: 'Test Quiz',
  topic: 'Matemáticas',
  subject: 'Matemáticas',
  questions: [],
  score: 60,
  correctCount: 3,
  totalQuestions: 5,
  completedAt: Date.now()
}];
localStorage.setItem('nativo_quiz_sessions', JSON.stringify(testSession));
```

---

## 📊 ANÁLISIS DE CÓDIGO

### Buscar en archivos
```bash
# Buscar uso de SavedContentContext
grep -r "useSavedContent" src/

# Buscar componentes que usan quiz
grep -r "InteractiveQuiz" src/

# Buscar todos los imports de Material UI
grep -r "@mui/icons-material" src/

# Buscar uso de localStorage
grep -r "localStorage" src/
```

### Contar líneas de código
```bash
# Contar líneas en componentes nuevos
wc -l src/components/SavedContentLibrary.tsx
wc -l src/components/InteractiveQuiz.tsx
wc -l src/components/QuizResults.tsx
wc -l src/components/WeakTopicsAnalysis.tsx

# Total de líneas en nuevos componentes
wc -l src/components/SavedContentLibrary.tsx src/components/InteractiveQuiz.tsx src/components/QuizResults.tsx src/components/WeakTopicsAnalysis.tsx

# Contar líneas en contexts
wc -l src/contexts/SavedContentContext.tsx

# Contar líneas en utils
wc -l src/utils/quizParser.ts
```

---

## 🔍 VERIFICACIÓN DE INTEGRACIÓN

### Verificar imports en App.tsx
```bash
# Ver imports de nuevos componentes
grep "import.*SavedContentLibrary" src/App.tsx
grep "import.*InteractiveQuiz" src/App.tsx
grep "import.*QuizResults" src/App.tsx
grep "import.*WeakTopicsAnalysis" src/App.tsx

# Ver imports de hooks
grep "import.*useSavedContent" src/App.tsx

# Ver imports de utilidades
grep "import.*quizParser" src/App.tsx
```

### Verificar estados en App.tsx
```bash
# Ver estados relacionados con las mejoras
grep "showSavedContent" src/App.tsx
grep "showInteractiveQuiz" src/App.tsx
grep "showQuizResults" src/App.tsx
grep "showWeakTopics" src/App.tsx
grep "currentQuiz" src/App.tsx
```

### Verificar funciones en App.tsx
```bash
# Ver funciones helper
grep "handleSaveContent" src/App.tsx
grep "handleStartInteractiveQuiz" src/App.tsx
grep "handleReviewWeakTopic" src/App.tsx
```

---

## 📦 GESTIÓN DE DEPENDENCIAS

### Ver dependencias instaladas
```bash
# Ver todas las dependencias
npm list

# Ver dependencias de Material UI
npm list @mui/material @mui/icons-material

# Ver dependencias de React
npm list react react-dom

# Ver versión de TypeScript
npm list typescript
```

### Actualizar dependencias (si es necesario)
```bash
# Actualizar todas las dependencias
npm update

# Actualizar dependencia específica
npm update @mui/material
npm update @mui/icons-material
```

---

## 🐛 DEBUGGING

### Ver errores de compilación
```bash
# Compilar y ver errores detallados
npm run build 2>&1 | tee build.log

# Ver solo errores
npm run build 2>&1 | grep "error"

# Ver solo warnings
npm run build 2>&1 | grep "warning"
```

### Verificar tipos TypeScript
```bash
# Verificar tipos sin compilar
npx tsc --noEmit

# Verificar tipos en archivo específico
npx tsc --noEmit src/App.tsx
npx tsc --noEmit src/contexts/SavedContentContext.tsx
```

### Linter (si está configurado)
```bash
# Ejecutar ESLint
npm run lint

# Ejecutar ESLint y auto-fix
npm run lint -- --fix
```

---

## 📝 DOCUMENTACIÓN

### Ver documentación creada
```bash
# Listar todos los archivos .md
ls -la *.md

# Ver documentación de mejoras
cat README_MEJORAS_CRITICAS.md
cat INTEGRACION_COMPLETADA.md
cat GUIA_TESTING.md

# Buscar en documentación
grep -r "Sistema de Guardados" *.md
grep -r "Quiz Interactivo" *.md
grep -r "Temas Débiles" *.md
```

### Generar documentación de tipos
```bash
# Ver tipos definidos
grep "interface" src/types.ts
grep "type" src/types.ts

# Ver tipos de SavedContent
grep -A 10 "interface SavedContent" src/types.ts

# Ver tipos de QuizQuestion
grep -A 10 "interface QuizQuestion" src/types.ts
```

---

## 🎨 DESARROLLO

### Crear nuevo componente (template)
```bash
# Crear archivo
touch src/components/NuevoComponente.tsx

# Template básico
cat > src/components/NuevoComponente.tsx << 'EOF'
import React from 'react';

interface NuevoComponenteProps {
  // Props aquí
}

const NuevoComponente: React.FC<NuevoComponenteProps> = ({ }) => {
  return (
    <div>
      {/* Contenido aquí */}
    </div>
  );
};

export default NuevoComponente;
EOF
```

### Crear nuevo context (template)
```bash
# Crear archivo
touch src/contexts/NuevoContext.tsx

# Template básico
cat > src/contexts/NuevoContext.tsx << 'EOF'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NuevoContextType {
  // Tipos aquí
}

const NuevoContext = createContext<NuevoContextType | undefined>(undefined);

export const NuevoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado y lógica aquí
  
  return (
    <NuevoContext.Provider value={{}}>
      {children}
    </NuevoContext.Provider>
  );
};

export const useNuevo = () => {
  const context = useContext(NuevoContext);
  if (context === undefined) {
    throw new Error('useNuevo must be used within a NuevoProvider');
  }
  return context;
};
EOF
```

---

## 🔄 GIT (si usas control de versiones)

### Commits sugeridos
```bash
# Commit de nuevos archivos
git add src/contexts/SavedContentContext.tsx
git add src/components/SavedContentLibrary.tsx
git add src/components/InteractiveQuiz.tsx
git add src/components/QuizResults.tsx
git add src/components/WeakTopicsAnalysis.tsx
git add src/utils/quizParser.ts
git commit -m "feat: add 3 critical improvements for students"

# Commit de archivos modificados
git add src/App.tsx
git add src/types.ts
git add src/contexts/AppProviders.tsx
git add src/components/MessageBubble.tsx
git add src/components/Sidebar.tsx
git commit -m "feat: integrate saved content, interactive quiz, and weak topics analysis"

# Commit de documentación
git add *.md
git commit -m "docs: add comprehensive documentation for new features"

# Push
git push origin main
```

### Ver cambios
```bash
# Ver archivos modificados
git status

# Ver diferencias
git diff src/App.tsx
git diff src/components/MessageBubble.tsx

# Ver historial
git log --oneline
```

---

## 📊 ANÁLISIS DE BUNDLE

### Ver tamaño de archivos compilados
```bash
# Compilar primero
npm run build

# Ver tamaño de archivos
ls -lh dist/assets/*.js

# Ver tamaño total
du -sh dist/

# Ver archivos más grandes
ls -lhS dist/assets/*.js | head -10
```

### Analizar bundle (si tienes rollup-plugin-visualizer)
```bash
# Instalar plugin
npm install --save-dev rollup-plugin-visualizer

# Agregar a vite.config.ts y compilar
npm run build

# Abrir stats.html
open stats.html
```

---

## 🧹 LIMPIEZA

### Limpiar archivos temporales
```bash
# Limpiar node_modules
rm -rf node_modules

# Limpiar dist
rm -rf dist

# Limpiar cache
rm -rf .vite

# Reinstalar
npm install
```

### Limpiar archivos de backup
```bash
# Eliminar backups de App.tsx (si existen)
rm App.tsx.backup
rm App.tsx.backup2

# Eliminar archivos temporales
rm *.log
rm *.tmp
```

---

## 🎯 TESTING AUTOMATIZADO (si configuras)

### Jest (si lo instalas)
```bash
# Instalar Jest
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm test -- --coverage

# Ejecutar test específico
npm test SavedContentLibrary.test.tsx
```

### Cypress (si lo instalas)
```bash
# Instalar Cypress
npm install --save-dev cypress

# Abrir Cypress
npx cypress open

# Ejecutar tests
npx cypress run
```

---

## 📱 TESTING RESPONSIVE

### Abrir en diferentes dispositivos
```bash
# Obtener IP local
ifconfig | grep "inet " | grep -v 127.0.0.1

# Ejecutar dev server
npm run dev

# Abrir en móvil
# http://[TU_IP]:5173
```

### Simular dispositivos en Chrome
```bash
# 1. Abrir DevTools (F12)
# 2. Toggle device toolbar (Ctrl+Shift+M)
# 3. Seleccionar dispositivo
```

---

## 🔐 SEGURIDAD

### Verificar vulnerabilidades
```bash
# Auditar dependencias
npm audit

# Auditar y auto-fix
npm audit fix

# Ver reporte detallado
npm audit --json
```

---

## 📈 PERFORMANCE

### Medir tiempo de compilación
```bash
# Compilar con tiempo
time npm run build

# Compilar con análisis
npm run build -- --profile
```

### Medir tamaño de localStorage
```bash
# En la consola del navegador (F12)

// Ver tamaño en bytes
const size = new Blob(Object.values(localStorage)).size;
console.log(`localStorage size: ${size} bytes`);

// Ver tamaño en KB
console.log(`localStorage size: ${(size / 1024).toFixed(2)} KB`);

// Ver tamaño por key
Object.keys(localStorage).forEach(key => {
  const size = new Blob([localStorage.getItem(key)]).size;
  console.log(`${key}: ${(size / 1024).toFixed(2)} KB`);
});
```

---

## 🎉 COMANDOS DE CELEBRACIÓN

### Cuando todo funciona
```bash
# Ver estadísticas del proyecto
echo "📊 Estadísticas del Proyecto"
echo "Archivos TypeScript:"
find src -name "*.tsx" -o -name "*.ts" | wc -l
echo "Líneas de código:"
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | tail -1
echo "Componentes:"
find src/components -name "*.tsx" | wc -l
echo "Contexts:"
find src/contexts -name "*.tsx" | wc -l

# Mensaje de éxito
echo "✅ ¡Todo listo para transformar la educación!"
```

---

## 📝 NOTAS

### Comandos más usados durante desarrollo
```bash
npm run dev          # Desarrollo
npm run build        # Compilar
F12                  # DevTools
Ctrl+Shift+M         # Toggle device toolbar
Ctrl+R               # Recargar página
Ctrl+Shift+R         # Recargar sin cache
```

### Atajos de teclado en la app
```bash
Ctrl+N               # Nuevo chat
Ctrl+/               # Enfocar input
Ctrl+H               # Abrir ayuda
Ctrl+B               # Toggle sidebar
```

---

**¡Comandos listos para usar!** 🛠️
