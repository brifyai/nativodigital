# 🔐 Autenticación con Supabase - NativoDigital

## ✅ Características Implementadas

### 1. Validación de Credenciales contra Base de Datos
- ✅ Los usuarios se registran en Supabase Auth
- ✅ Las contraseñas se hashean automáticamente
- ✅ Validación de email/RUT y contraseña en cada login

### 2. Autenticación Real
- ✅ Usa Supabase Auth (no es simulación)
- ✅ Tokens JWT para sesiones seguras
- ✅ Refresh tokens automáticos
- ✅ Protección contra accesos no autorizados

### 3. Sincronización entre Dispositivos
- ✅ Los datos se guardan en Supabase (nube)
- ✅ Accede desde cualquier dispositivo
- ✅ Sesión persistente automática

### 4. Recuperación de Contraseña
- ✅ Botón "¿Olvidaste tu contraseña?" en login
- ✅ Envía email con link de recuperación
- ✅ Proceso seguro con tokens temporales

### 5. Datos Persistentes en la Nube
- ✅ Perfil de usuario en tabla `users`
- ✅ Conversaciones en tabla `chat_sessions`
- ✅ Contenido guardado en tabla `saved_content`
- ✅ Rendimiento por tema en tabla `topic_performance`

## 📋 Flujo de Autenticación

### Registro (Sign Up)

```typescript
// Con Email
signUpWithEmail(email, password, profile)
  → Crea usuario en Supabase Auth
  → Crea perfil en tabla users
  → Retorna sesión activa

// Con RUT
signUpWithRut(rut, password, profile)
  → Genera email temporal: {rut}@nativodigital.local
  → Crea usuario en Supabase Auth
  → Guarda RUT en perfil
  → Retorna sesión activa
```

### Login (Sign In)

```typescript
// Con Email
signInWithEmail(email, password)
  → Valida credenciales en Supabase
  → Retorna sesión con JWT
  → AuthContext carga perfil automáticamente

// Con RUT
signInWithRut(rut, password)
  → Convierte RUT a email temporal
  → Valida credenciales en Supabase
  → Retorna sesión con JWT
```

### Recuperación de Contraseña

```typescript
resetPassword(email)
  → Envía email con link mágico
  → Usuario hace clic en link
  → Redirige a /reset-password
  → Usuario ingresa nueva contraseña
  → updatePassword(newPassword)
```

## 🔧 Configuración

### Variables de Entorno Requeridas

```bash
# Desarrollo Local (.env.local)
REACT_APP_SUPABASE_URL=http://localhost:8000
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Producción (Easypanel)
REACT_APP_SUPABASE_URL=https://nativodigital-nativodigitalbdv2.dsb9vm.easypanel.host
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Aplicar Esquema SQL

1. Abre Supabase Studio en Easypanel
2. Ve a SQL Editor
3. Copia el contenido de `supabase-schema.sql`
4. Ejecuta el script
5. Verifica que las tablas se crearon correctamente

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Login.tsx     │  ← Formulario de login/registro
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ services/auth.ts│  ← Funciones de autenticación
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ lib/supabase.ts │  ← Cliente de Supabase
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Supabase Auth  │  ← Servicio de autenticación
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PostgreSQL DB  │  ← Base de datos
└─────────────────┘
```

## 📊 Tablas Utilizadas

### `auth.users` (Supabase Auth)
- Gestiona autenticación
- Almacena emails y contraseñas hasheadas
- Genera tokens JWT

### `public.users` (Nuestra tabla)
- `auth_id` → Referencia a auth.users
- `name`, `email`, `rut`
- `grade`, `specific_grade`
- `avatar_id`
- `custom_instruction`

### Row Level Security (RLS)
- ✅ Los usuarios solo ven sus propios datos
- ✅ Políticas automáticas basadas en `auth.uid()`
- ✅ Protección contra accesos no autorizados

## 🔄 Modo Fallback (Sin Supabase)

Si Supabase no está configurado, la app funciona en modo local:

```typescript
if (!isSupabaseConfigured()) {
  // Guardar en localStorage
  localStorage.setItem('nativo_user', JSON.stringify(profile));
  // No hay sincronización entre dispositivos
  // No hay validación de credenciales
}
```

## 🧪 Pruebas

### Probar Registro

1. Ve a la app
2. Haz clic en "Registrarse"
3. Completa el formulario en 3 pasos
4. Verifica que se crea el usuario en Supabase

### Probar Login

1. Cierra sesión
2. Ingresa email/RUT y contraseña
3. Verifica que inicia sesión correctamente
4. Verifica que carga el perfil desde Supabase

### Probar Recuperación de Contraseña

1. En login, ingresa tu email
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Revisa tu email
4. Haz clic en el link
5. Ingresa nueva contraseña

### Probar Sincronización

1. Inicia sesión en un dispositivo
2. Crea una conversación
3. Inicia sesión en otro dispositivo
4. Verifica que aparece la conversación

## 🐛 Troubleshooting

### Error: "Supabase no está configurado"
- Verifica que `REACT_APP_SUPABASE_URL` esté configurada
- Verifica que `REACT_APP_SUPABASE_ANON_KEY` esté configurada
- Reconstruye la app en Easypanel

### Error: "Email o contraseña incorrectos"
- Verifica que el usuario existe en Supabase
- Verifica que la contraseña sea correcta (mínimo 6 caracteres)
- Revisa los logs de Supabase

### Error: "No se pudo crear el usuario"
- Verifica que el esquema SQL esté aplicado
- Verifica que las políticas RLS estén activas
- Revisa los logs de Supabase

### Error: "Failed to fetch"
- Verifica que Kong esté corriendo en Easypanel
- Verifica que la URL de Supabase sea correcta
- Verifica que no haya problemas de CORS

## 📚 Recursos

- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/auth-signup)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🔐 Seguridad

### Buenas Prácticas Implementadas

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT con expiración
- ✅ Refresh tokens automáticos
- ✅ Row Level Security (RLS)
- ✅ Validación de inputs
- ✅ Sanitización de datos
- ✅ HTTPS en producción

### Recomendaciones Adicionales

- 🔒 Habilitar 2FA en Supabase (opcional)
- 🔒 Configurar rate limiting
- 🔒 Monitorear intentos de login fallidos
- 🔒 Implementar CAPTCHA para registro (opcional)

## 📝 Próximos Pasos

- [ ] Implementar página de reset password
- [ ] Agregar verificación de email
- [ ] Implementar login con Google (opcional)
- [ ] Agregar 2FA (opcional)
- [ ] Implementar rate limiting
- [ ] Agregar logs de auditoría
