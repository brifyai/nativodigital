# 🗄️ Configuración de Supabase para NativoDigital

## 📋 Resumen

Este documento explica cómo configurar la base de datos Supabase para la aplicación NativoDigital.

## 🎯 Tablas Creadas

El esquema incluye las siguientes tablas:

1. **users** - Perfiles de usuario
2. **chat_sessions** - Sesiones de conversación
3. **messages** - Mensajes individuales
4. **saved_content** - Contenido guardado (flashcards, resúmenes, etc.)
5. **topic_performance** - Rendimiento por tema
6. **quiz_sessions** - Sesiones de quiz
7. **shared_conversations** - Conversaciones compartidas

## 🚀 Instalación

### Opción 1: Desde el Dashboard de Supabase (Recomendado)

1. **Accede a tu proyecto en Supabase**
   - Ve a https://app.supabase.com
   - O accede a tu instancia self-hosted en Easypanel

2. **Abre el SQL Editor**
   - En el menú lateral, busca "SQL Editor"
   - Haz clic en "New Query"

3. **Copia y pega el contenido del archivo `supabase-schema.sql`**
   - Abre el archivo `supabase-schema.sql`
   - Copia TODO el contenido
   - Pégalo en el editor SQL

4. **Ejecuta el script**
   - Haz clic en "Run" o presiona `Ctrl+Enter`
   - Espera a que termine (puede tomar 10-20 segundos)

5. **Verifica la instalación**
   - Ve a "Table Editor" en el menú lateral
   - Deberías ver todas las tablas creadas

### Opción 2: Desde la CLI de Supabase

```bash
# Si tienes Supabase CLI instalado
supabase db reset
supabase db push
```

### Opción 3: Desde psql (Para self-hosted)

```bash
# Conecta a tu base de datos PostgreSQL
psql -h localhost -U postgres -d postgres

# Ejecuta el script
\i supabase-schema.sql
```

## 🔑 Obtener las Credenciales

### Para Supabase Cloud:

1. Ve a tu proyecto en https://app.supabase.com
2. Haz clic en "Settings" → "API"
3. Copia:
   - **Project URL** → Esta es tu `REACT_APP_SUPABASE_URL`
   - **anon public** key → Esta es tu `REACT_APP_SUPABASE_ANON_KEY`

### Para Supabase Self-Hosted (Easypanel):

1. **Encuentra la URL de Kong**
   - En Easypanel, ve a tu proyecto de Supabase
   - Busca el servicio "Kong" (API Gateway)
   - Copia la URL pública (ejemplo: `https://supabase-kong-xxx.dsb9vm.easypanel.host`)

2. **Obtén el ANON_KEY**
   - En las variables de entorno de Supabase, busca `ANON_KEY`
   - O usa la clave por defecto (solo para desarrollo):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
   ```

## ⚙️ Configurar Variables de Entorno

### En Easypanel (para tu app React):

Agrega estas variables de entorno en tu proyecto de NativoDigital:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://[URL-DE-KONG]
REACT_APP_SUPABASE_ANON_KEY=[TU-ANON-KEY]

# Gemini API (ya la tienes)
GEMINI_API_KEY=AIzaSyAbQdCufDhxiBcfFEukPN9octCGB1E1_tk
```

### En desarrollo local (.env.local):

```bash
REACT_APP_SUPABASE_URL=http://localhost:8000
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
GEMINI_API_KEY=AIzaSyAbQdCufDhxiBcfFEukPN9octCGB1E1_tk
```

## 🔒 Seguridad (Row Level Security)

El esquema incluye políticas de seguridad RLS que garantizan:

- ✅ Los usuarios solo pueden ver sus propios datos
- ✅ Los usuarios solo pueden modificar sus propios datos
- ✅ Las conversaciones compartidas son públicas (solo lectura)
- ✅ Protección automática contra accesos no autorizados

## 📊 Funciones Útiles

El esquema incluye funciones SQL útiles:

### 1. Obtener temas débiles de un usuario

```sql
SELECT * FROM get_weak_topics('user-uuid-here', 5);
```

### 2. Limpiar sesiones antiguas (más de 90 días)

```sql
SELECT cleanup_old_sessions();
```

## 🧪 Verificar la Instalación

Ejecuta estas consultas para verificar que todo funciona:

```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Contar registros en cada tabla
SELECT 
  'users' as table_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'chat_sessions', COUNT(*) FROM public.chat_sessions
UNION ALL
SELECT 'messages', COUNT(*) FROM public.messages
UNION ALL
SELECT 'saved_content', COUNT(*) FROM public.saved_content
UNION ALL
SELECT 'topic_performance', COUNT(*) FROM public.topic_performance
UNION ALL
SELECT 'quiz_sessions', COUNT(*) FROM public.quiz_sessions
UNION ALL
SELECT 'shared_conversations', COUNT(*) FROM public.shared_conversations;
```

## ⚠️ IMPORTANTE: ¿Realmente necesitas Supabase?

Según tu configuración actual:

- ❌ **NO usarás login de Google**
- ✅ **Solo usarás la API de Gemini**
- ❓ **No hay autenticación de usuarios**

### Si NO necesitas autenticación:

La app puede funcionar perfectamente **SIN Supabase**, usando solo localStorage (como está ahora). Esto es más simple y no requiere configuración adicional.

### Si SÍ quieres usar Supabase:

Tendrás que:
1. Implementar autenticación (email/password o social login)
2. Migrar el código de localStorage a Supabase
3. Configurar las variables de entorno

## 🔄 Migración desde localStorage

Si decides usar Supabase, necesitarás modificar estos archivos:

- `contexts/SavedContentContext.tsx` - Cambiar localStorage por Supabase
- `contexts/ChatContext.tsx` - Guardar sesiones en Supabase
- `contexts/AuthContext.tsx` - Usar Supabase Auth
- `utils/storage.ts` - Crear funciones para Supabase

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Soporte

Si tienes problemas:

1. Verifica que las tablas se crearon correctamente
2. Revisa los logs de Supabase
3. Verifica las variables de entorno
4. Asegúrate de que Kong esté corriendo (para self-hosted)
