-- ============================================
-- ESQUEMA DE BASE DE DATOS PARA NATIVODIGITAL
-- Supabase PostgreSQL Schema
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLA: users (Perfiles de usuario)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  rut TEXT UNIQUE,
  grade TEXT NOT NULL CHECK (grade IN ('primaria', 'secundaria', 'universidad', 'autodidacta')),
  specific_grade TEXT,
  avatar_id TEXT NOT NULL DEFAULT '1',
  custom_instruction TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para users
CREATE INDEX idx_users_auth_id ON public.users(auth_id);
CREATE INDEX idx_users_email ON public.users(email);

-- ============================================
-- TABLA: chat_sessions (Sesiones de chat)
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nueva Conversación',
  model_id TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('gemini', 'openai', 'chutes')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para chat_sessions
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_updated_at ON public.chat_sessions(updated_at DESC);

-- ============================================
-- TABLA: messages (Mensajes de chat)
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'model', 'system')),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  grounding_sources JSONB DEFAULT '[]'::jsonb,
  is_error BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para messages
CREATE INDEX idx_messages_session_id ON public.messages(session_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- ============================================
-- TABLA: saved_content (Contenido guardado)
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('flashcards', 'quiz', 'summary', 'notes', 'plan', 'other')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  topic TEXT NOT NULL,
  subject TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  review_count INTEGER DEFAULT 0,
  last_reviewed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para saved_content
CREATE INDEX idx_saved_content_user_id ON public.saved_content(user_id);
CREATE INDEX idx_saved_content_type ON public.saved_content(type);
CREATE INDEX idx_saved_content_is_favorite ON public.saved_content(is_favorite);
CREATE INDEX idx_saved_content_tags ON public.saved_content USING GIN(tags);
CREATE INDEX idx_saved_content_created_at ON public.saved_content(created_at DESC);

-- ============================================
-- TABLA: topic_performance (Rendimiento por tema)
-- ============================================
CREATE TABLE IF NOT EXISTS public.topic_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  subject TEXT NOT NULL,
  attempts INTEGER DEFAULT 0,
  successes INTEGER DEFAULT 0,
  failures INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0.00,
  needs_review BOOLEAN DEFAULT FALSE,
  last_attempt TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic, subject)
);

-- Índices para topic_performance
CREATE INDEX idx_topic_performance_user_id ON public.topic_performance(user_id);
CREATE INDEX idx_topic_performance_needs_review ON public.topic_performance(needs_review);
CREATE INDEX idx_topic_performance_average_score ON public.topic_performance(average_score);

-- ============================================
-- TABLA: quiz_sessions (Sesiones de quiz)
-- ============================================
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  questions JSONB NOT NULL,
  current_question_index INTEGER DEFAULT 0,
  answers JSONB DEFAULT '[]'::jsonb,
  score INTEGER DEFAULT 0,
  time_per_question INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Índices para quiz_sessions
CREATE INDEX idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX idx_quiz_sessions_completed_at ON public.quiz_sessions(completed_at);

-- ============================================
-- TABLA: shared_conversations (Conversaciones compartidas)
-- ============================================
CREATE TABLE IF NOT EXISTS public.shared_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_id TEXT UNIQUE NOT NULL,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para shared_conversations
CREATE INDEX idx_shared_conversations_share_id ON public.shared_conversations(share_id);
CREATE INDEX idx_shared_conversations_session_id ON public.shared_conversations(session_id);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_content_updated_at
  BEFORE UPDATE ON public.saved_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_performance_updated_at
  BEFORE UPDATE ON public.topic_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_conversations ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = auth_id);

-- Políticas para chat_sessions
CREATE POLICY "Users can view own sessions"
  ON public.chat_sessions FOR SELECT
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can create own sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own sessions"
  ON public.chat_sessions FOR UPDATE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own sessions"
  ON public.chat_sessions FOR DELETE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Políticas para messages
CREATE POLICY "Users can view messages from own sessions"
  ON public.messages FOR SELECT
  USING (session_id IN (
    SELECT id FROM public.chat_sessions 
    WHERE user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  ));

CREATE POLICY "Users can create messages in own sessions"
  ON public.messages FOR INSERT
  WITH CHECK (session_id IN (
    SELECT id FROM public.chat_sessions 
    WHERE user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  ));

CREATE POLICY "Users can delete messages from own sessions"
  ON public.messages FOR DELETE
  USING (session_id IN (
    SELECT id FROM public.chat_sessions 
    WHERE user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  ));

-- Políticas para saved_content
CREATE POLICY "Users can view own saved content"
  ON public.saved_content FOR SELECT
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can create own saved content"
  ON public.saved_content FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own saved content"
  ON public.saved_content FOR UPDATE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own saved content"
  ON public.saved_content FOR DELETE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Políticas para topic_performance
CREATE POLICY "Users can view own topic performance"
  ON public.topic_performance FOR SELECT
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can create own topic performance"
  ON public.topic_performance FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own topic performance"
  ON public.topic_performance FOR UPDATE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Políticas para quiz_sessions
CREATE POLICY "Users can view own quiz sessions"
  ON public.quiz_sessions FOR SELECT
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can create own quiz sessions"
  ON public.quiz_sessions FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own quiz sessions"
  ON public.quiz_sessions FOR UPDATE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Políticas para shared_conversations
CREATE POLICY "Anyone can view shared conversations"
  ON public.shared_conversations FOR SELECT
  USING (true);

CREATE POLICY "Users can create own shared conversations"
  ON public.shared_conversations FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own shared conversations"
  ON public.shared_conversations FOR UPDATE
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Función para obtener temas débiles de un usuario
CREATE OR REPLACE FUNCTION get_weak_topics(p_user_id UUID, p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
  topic TEXT,
  subject TEXT,
  average_score DECIMAL,
  attempts INTEGER,
  last_attempt TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tp.topic,
    tp.subject,
    tp.average_score,
    tp.attempts,
    tp.last_attempt
  FROM public.topic_performance tp
  WHERE tp.user_id = p_user_id
    AND tp.needs_review = TRUE
    AND tp.attempts >= 2
  ORDER BY tp.average_score ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para limpiar sesiones antiguas (más de 90 días)
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.chat_sessions
  WHERE updated_at < NOW() - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DATOS INICIALES (OPCIONAL)
-- ============================================

-- Puedes agregar datos de ejemplo aquí si lo necesitas

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================

COMMENT ON TABLE public.users IS 'Perfiles de usuario de la aplicación';
COMMENT ON TABLE public.chat_sessions IS 'Sesiones de conversación con el AI';
COMMENT ON TABLE public.messages IS 'Mensajes individuales dentro de las sesiones';
COMMENT ON TABLE public.saved_content IS 'Contenido guardado por los usuarios (flashcards, resúmenes, etc.)';
COMMENT ON TABLE public.topic_performance IS 'Seguimiento del rendimiento por tema y materia';
COMMENT ON TABLE public.quiz_sessions IS 'Sesiones de quiz interactivos';
COMMENT ON TABLE public.shared_conversations IS 'Conversaciones compartidas públicamente';
