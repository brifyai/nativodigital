# 🚀 Configuración de Producción - NativoDigital

## 📋 Variables de Entorno para Easypanel

Configura estas variables en tu proyecto de NativoDigital en Easypanel:

```bash
# Node Environment
NODE_ENV=production
REACT_APP_ENVIRONMENT=production

# Puerto (interno del contenedor)
PORT=80

# CORS
CORS_ALLOW_ALL=true

# Gemini API
GEMINI_API_KEY=AIzaSyAbQdCufDhxiBcfFEukPN9octCGB1E1_tk

# Supabase (Producción)
REACT_APP_SUPABASE_URL=https://nativodigital-nativodigitalbdv2.dsb9vm.easypanel.host
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
```

## 🌐 URLs del Proyecto

### Aplicación React
- **URL Easypanel**: https://nativodigital-nativodigitalweb.dsb9vm.easypanel.host
- **Dominio personalizado**: https://deploy.brifyai.com

### Supabase
- **Kong API Gateway**: https://nativodigital-nativodigitalbdv2.dsb9vm.easypanel.host
- **Studio/Dashboard**: (busca el servicio "studio" en Easypanel)

## 📝 Pasos para Aplicar Configuración

### 1. Actualizar Variables en Easypanel

1. Ve a tu proyecto **NativoDigital** en Easypanel
2. Busca la sección **"Environment Variables"**
3. Agrega o actualiza las variables de arriba
4. Guarda los cambios
5. Easypanel reconstruirá automáticamente

### 2. Aplicar Esquema SQL en Supabase

1. Ve a tu proyecto **Supabase** en Easypanel
2. Busca el servicio **"Studio"** y abre su URL
3. Ve a **"SQL Editor"**
4. Copia todo el contenido de `supabase-schema.sql`
5. Pégalo y haz clic en **"Run"**
6. Verifica que las tablas se crearon en **"Table Editor"**

### 3. Verificar Conexión

Una vez aplicadas las variables, verifica:

```bash
# Prueba la API de Supabase
curl https://nativodigital-nativodigitalbdv2.dsb9vm.easypanel.host/rest/v1/

# Debería devolver información sobre la API REST
```

## 🔧 Desarrollo Local

Para desarrollo local, usa `.env.local`:

```bash
GEMINI_API_KEY=AIzaSyAbQdCufDhxiBcfFEukPN9octCGB1E1_tk
REACT_APP_SUPABASE_URL=http://localhost:8000
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
```

## 🔐 Seguridad

### Claves Públicas (OK para compartir):
- ✅ `REACT_APP_SUPABASE_URL` - URL pública del API
- ✅ `REACT_APP_SUPABASE_ANON_KEY` - Clave anónima (protegida por RLS)

### Claves Privadas (NUNCA compartir):
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Clave de servicio (bypass RLS)
- ❌ `GEMINI_API_KEY` - API key de Gemini (aunque está en el código)

## 📊 Monitoreo

### Health Checks
- **App**: https://nativodigital-nativodigitalweb.dsb9vm.easypanel.host/health
- **Supabase**: https://nativodigital-nativodigitalbdv2.dsb9vm.easypanel.host/rest/v1/

### Logs
- Ve a Easypanel → Tu proyecto → Logs
- Filtra por servicio (web, kong, db, etc.)

## 🐛 Troubleshooting

### Error: "Failed to fetch"
- Verifica que la URL de Supabase sea correcta
- Verifica que Kong esté corriendo en Easypanel
- Revisa los logs de Kong

### Error: "Invalid API key"
- Verifica que el ANON_KEY sea correcto
- Verifica que las tablas tengan RLS habilitado
- Revisa las políticas de seguridad

### Error: "CORS"
- Verifica que `CORS_ALLOW_ALL=true` esté configurado
- Revisa la configuración de Kong en Supabase

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Easypanel Docs](https://easypanel.io/docs)
