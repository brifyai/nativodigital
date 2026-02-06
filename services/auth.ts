import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any;
}

/**
 * Registrar nuevo usuario con email y contraseña
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  profile: Omit<UserProfile, 'email' | 'password'>
): Promise<AuthResponse> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase no está configurado' };
  }

  try {
    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: profile.name,
          avatar_id: profile.avatarId,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No se pudo crear el usuario');

    // 2. Crear perfil en la tabla users
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        name: profile.name,
        email: email,
        grade: profile.grade,
        specific_grade: profile.specificGrade,
        avatar_id: profile.avatarId,
      });

    if (profileError) throw profileError;

    return { success: true, user: authData.user };
  } catch (error: any) {
    console.error('Error en signUpWithEmail:', error);
    return { 
      success: false, 
      error: error.message || 'Error al registrar usuario' 
    };
  }
};

/**
 * Registrar nuevo usuario con RUT y contraseña
 * (Usa email generado: rut@nativodigital.local)
 */
export const signUpWithRut = async (
  rut: string,
  password: string,
  profile: Omit<UserProfile, 'rut' | 'password'>
): Promise<AuthResponse> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase no está configurado' };
  }

  try {
    // Generar email temporal desde RUT
    const cleanRut = rut.replace(/[^0-9kK]/g, '');
    const tempEmail = `${cleanRut}@nativodigital.local`;

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: tempEmail,
      password,
      options: {
        data: {
          name: profile.name,
          avatar_id: profile.avatarId,
          rut: rut,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No se pudo crear el usuario');

    // 2. Crear perfil en la tabla users
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        name: profile.name,
        rut: rut,
        grade: profile.grade,
        specific_grade: profile.specificGrade,
        avatar_id: profile.avatarId,
      });

    if (profileError) throw profileError;

    return { success: true, user: authData.user };
  } catch (error: any) {
    console.error('Error en signUpWithRut:', error);
    return { 
      success: false, 
      error: error.message || 'Error al registrar usuario' 
    };
  }
};

/**
 * Iniciar sesión con email y contraseña
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase no está configurado' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No se pudo iniciar sesión');

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Error en signInWithEmail:', error);
    return { 
      success: false, 
      error: error.message || 'Email o contraseña incorrectos' 
    };
  }
};

/**
 * Iniciar sesión con RUT y contraseña
 */
export const signInWithRut = async (
  rut: string,
  password: string
): Promise<AuthResponse> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase no está configurado' };
  }

  try {
    // Generar email temporal desde RUT
    const cleanRut = rut.replace(/[^0-9kK]/g, '');
    const tempEmail = `${cleanRut}@nativodigital.local`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: tempEmail,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No se pudo iniciar sesión');

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Error en signInWithRut:', error);
    return { 
      success: false, 
      error: error.message || 'RUT o contraseña incorrectos' 
    };
  }
};

/**
 * Cerrar sesión
 */
export const signOut = async (): Promise<AuthResponse> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase no está configurado' };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error en signOut:', error);
    return { 
      success: false, 
      error: error.message || 'Error al cerrar sesión' 
    };
  }
};

/**
 * Obtener perfil del usuario actual
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (error) throw error;
    if (!profile) return null;

    return {
      name: profile.name,
      email: profile.email,
      rut: profile.rut,
      grade: profile.grade,
      specificGrade: profile.specific_grade,
      avatarId: profile.avatar_id,
    };
  } catch (error: any) {
    console.error('Error en getUserProfile:', error);
    return null;
  }
};

/**
 * Recuperar contraseña
 */
export const resetPassword = async (email: string): Promise<AuthResponse> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase no está configurado' };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    return { 
      success: true, 
      error: 'Se envió un email con instrucciones para recuperar tu contraseña' 
    };
  } catch (error: any) {
    console.error('Error en resetPassword:', error);
    return { 
      success: false, 
      error: error.message || 'Error al enviar email de recuperación' 
    };
  }
};

/**
 * Actualizar contraseña
 */
export const updatePassword = async (newPassword: string): Promise<AuthResponse> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase no está configurado' };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error en updatePassword:', error);
    return { 
      success: false, 
      error: error.message || 'Error al actualizar contraseña' 
    };
  }
};

/**
 * Obtener sesión actual
 */
export const getSession = async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error en getSession:', error);
    return null;
  }
};

/**
 * Escuchar cambios en la autenticación
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  if (!isSupabaseConfigured()) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  return supabase.auth.onAuthStateChange(callback);
};
