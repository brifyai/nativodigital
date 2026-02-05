<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Nativo Digital - Tu Tutor de IA Gratuito

Plataforma educativa impulsada por IA que adapta las explicaciones a tu nivel educativo. 100% gratuita y diseñada para estudiantes de Latinoamérica.

## 🚀 Características

- ✅ **Tutoría Adaptativa**: Se ajusta a primaria, secundaria, universidad o autodidacta
- ✅ **Google Search Integrado**: Datos en tiempo real
- ✅ **Ejecución de Código Python**: Resuelve matemáticas complejas
- ✅ **Análisis de Imágenes**: Sube fotos de tu tarea
- ✅ **Entrada por Voz**: Practica idiomas o pregunta hablando
- ✅ **Exportación**: Guarda conversaciones en Markdown, TXT o JSON
- ✅ **Modo Oscuro/Claro**: Cuida tus ojos
- ✅ **100% Gratuito**: Sin costos ocultos

## 📋 Requisitos Previos

- **Node.js** (v18 o superior)
- **API Key de Google Gemini** (gratuita)

## 🔑 Obtener tu API Key de Gemini (GRATIS)

1. Ve a [Google AI Studio](https://aistudio.google.com/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia tu API key

**Nota**: La API de Gemini tiene un tier gratuito generoso. No necesitas tarjeta de crédito.

## ⚙️ Instalación

1. **Clona el repositorio**
   ```bash
   git clone <tu-repo>
   cd nativo-digital
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura tu API Key**
   
   Abre el archivo `.env.local` y reemplaza `PLACEHOLDER_API_KEY` con tu API key:
   
   ```env
   GEMINI_API_KEY=tu_api_key_aqui
   ```

4. **Inicia la aplicación**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   
   Ve a [http://localhost:3000](http://localhost:3000)

## 🎯 Uso

1. **Crea tu perfil**: Elige tu avatar y nivel educativo
2. **Haz preguntas**: Escribe, habla o sube imágenes
3. **Aprende**: Recibe explicaciones adaptadas a tu nivel
4. **Exporta**: Guarda tus conversaciones para estudiar después

## 🛠️ Funcionalidades Implementadas

### ✅ Botones de Acción
- **Copiar**: Copia respuestas al portapapeles
- **Like/Dislike**: Da feedback sobre las respuestas
- **Regenerar**: Vuelve a generar la última respuesta
- **Stop**: Detén la generación en cualquier momento

### ✅ Manejo de Errores
- Mensajes claros cuando falta la API key
- Detección de límites de uso
- Reintentos automáticos en errores de red
- Indicadores visuales de estado

### ✅ Exportación/Importación
- Exporta conversaciones a **Markdown** (con formato)
- Exporta conversaciones a **Texto plano**
- Exporta todo el historial a **JSON**
- Importa conversaciones desde JSON

### ✅ Notificaciones
- Sistema de toasts para feedback visual
- Confirmaciones de acciones exitosas
- Alertas de errores claras

## 🔧 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Previsualiza la build de producción
```

## 🐛 Solución de Problemas

### Error: "API Key inválida"
- Verifica que copiaste la API key completa
- Asegúrate de que el archivo `.env.local` esté en la raíz del proyecto
- Reinicia el servidor después de cambiar la API key

### Error: "Límite de uso alcanzado"
- Espera unos minutos antes de volver a intentar
- La API gratuita tiene límites por minuto

### La app no carga
- Verifica que Node.js esté instalado: `node --version`
- Borra `node_modules` y reinstala: `rm -rf node_modules && npm install`
- Limpia el caché del navegador

## 📱 Compatibilidad

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Móviles (iOS/Android)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🌟 Misión Social

Nativo Digital nació para democratizar el acceso a la educación con IA en Latinoamérica. Creemos que todos los estudiantes, sin importar sus recursos económicos, merecen acceso a herramientas educativas de calidad.

---

**Desarrollado con ❤️ para los estudiantes**

View your app in AI Studio: https://ai.studio/apps/temp/1
