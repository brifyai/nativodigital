import React, { useState } from 'react';
import { UserProfile } from '../types';
import { signUpWithEmail, signUpWithRut, signInWithEmail, signInWithRut, resetPassword } from '../services/auth';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  AutoAwesome as SparklesIcon,
  School as GraduationCapIcon,
  ArrowForward as ArrowRightIcon,
  Person as UserIcon,
  MenuBook as BookOpenIcon,
  SchoolOutlined as SchoolIcon,
  Psychology as BrainCircuitIcon,
  LightMode as SunIcon,
  DarkMode as MoonIcon,
  Check as CheckIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as EyeIcon,
  VisibilityOff as EyeOffIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';

interface LoginProps {
  onLogin: (profile: UserProfile) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const AVATARS = [
  '🐶', '🐱', '🦊', '🐨', '🦁', '🐯',
  '🐸', '🦉', '🦋', '🦕', '🚀', '⭐',
  '🎨', '⚽', '🎮', '🎧', '🤖', '👾'
];

const GRADE_OPTIONS = {
  primaria: [
    '1° Básico', '2° Básico', '3° Básico', '4° Básico',
    '5° Básico', '6° Básico', '7° Básico', '8° Básico'
  ],
  secundaria: [
    '1° Medio', '2° Medio', '3° Medio', '4° Medio'
  ],
  universidad: [
    '1° Año', '2° Año', '3° Año', '4° Año', '5° Año', '6° Año'
  ],
  autodidacta: []
};

const Login: React.FC<LoginProps> = ({ onLogin, toggleTheme, isDarkMode }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<UserProfile['grade']>('secundaria');
  const [specificGrade, setSpecificGrade] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[16]); // Robot default
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Format RUT as user types
  const formatRut = (value: string) => {
    const cleaned = value.replace(/[^0-9kK]/g, '');
    if (cleaned.length <= 1) return cleaned;
    
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    
    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted}-${dv}`;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setRut(formatted);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateRut = (rut: string) => {
    const cleaned = rut.replace(/[^0-9kK]/g, '');
    return cleaned.length >= 8;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const identifier = email || rut;
    
    if (!identifier) {
      setError('Ingresa tu email o RUT');
      return;
    }

    if (email && !validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    if (rut && !validateRut(rut)) {
      setError('RUT inválido');
      return;
    }

    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Si Supabase está configurado, usar autenticación real
    if (isSupabaseConfigured()) {
      const result = email 
        ? await signInWithEmail(email, password)
        : await signInWithRut(rut, password);

      if (!result.success) {
        setError(result.error || 'Error al iniciar sesión');
        return;
      }

      // El AuthContext manejará la carga del perfil automáticamente
      return;
    }

    // Fallback: modo local (sin Supabase)
    if (!name.trim()) {
      setError('Ingresa tu nombre');
      return;
    }

    onLogin({
      name: name.trim(),
      grade: grade,
      specificGrade: specificGrade || undefined,
      avatarId: selectedAvatar,
      email: email || undefined,
      rut: rut || undefined,
      password: password
    });
  };

  const handleNext = () => {
    setError('');
    
    if (step === 1) {
      const identifier = email || rut;
      
      if (!identifier) {
        setError('Ingresa tu email o RUT');
        return;
      }

      if (email && !validateEmail(email)) {
        setError('Email inválido');
        return;
      }

      if (rut && !validateRut(rut)) {
        setError('RUT inválido');
        return;
      }

      if (!password || password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      setStep(2);
    } else if (step === 2) {
      if (!name.trim()) {
        setError('Ingresa tu nombre');
        return;
      }
      setStep(3);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Ingresa tu nombre');
      return;
    }

    // Si Supabase está configurado, usar registro real
    if (isSupabaseConfigured()) {
      const profile = {
        name: name.trim(),
        grade,
        specificGrade: specificGrade || undefined,
        avatarId: selectedAvatar,
      };

      const result = email
        ? await signUpWithEmail(email, password, profile)
        : await signUpWithRut(rut, password, profile);

      if (!result.success) {
        setError(result.error || 'Error al registrar usuario');
        return;
      }

      // El AuthContext manejará la carga del perfil automáticamente
      return;
    }

    // Fallback: modo local (sin Supabase)
    onLogin({
      name: name.trim(),
      grade,
      specificGrade: specificGrade || undefined,
      avatarId: selectedAvatar,
      email: email || undefined,
      rut: rut || undefined,
      password: password
    });
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute left-0 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-slow"></div>
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full text-secondary hover:text-primary hover:bg-surface transition-colors z-50 bg-background/50 backdrop-blur-md border border-border"
        title="Cambiar tema"
      >
        {isDarkMode ? <SunIcon sx={{ fontSize: 20 }} /> : <MoonIcon sx={{ fontSize: 20 }} />}
      </button>

      <div className="max-w-lg w-full relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 bg-surface border border-border rounded-2xl mb-4 shadow-sm">
             <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
               <SparklesIcon sx={{ fontSize: 18 }} className="text-white" />
             </div>
             <span className="text-xl font-bold text-primary tracking-tight">Nativo Digital</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            {mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}
          </h1>
          <p className="text-secondary">
            {mode === 'login' ? 'Accede a tu espacio de aprendizaje' : 'Configura tu perfil para empezar'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Progress Bar (only for register) */}
          {mode === 'register' && (
            <div className="absolute top-0 left-0 w-full h-1 bg-border">
               <div 
                 className="h-full bg-accent transition-all duration-500 ease-out"
                 style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
               ></div>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-surfaceHighlight rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setStep(1);
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                mode === 'login'
                  ? 'bg-primary text-background shadow-md'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setStep(1);
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                mode === 'register'
                  ? 'bg-primary text-background shadow-md'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
              
              {/* Email or RUT */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-secondary ml-1">Email o RUT</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors">
                    {email ? <EmailIcon sx={{ fontSize: 20 }} /> : <BadgeIcon sx={{ fontSize: 20 }} />}
                  </div>
                  <input 
                    type="text"
                    value={email || rut}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.includes('@') || !value.match(/[0-9]/)) {
                        setEmail(value);
                        setRut('');
                      } else {
                        setRut(value);
                        setEmail('');
                        handleRutChange(e);
                      }
                    }}
                    placeholder="correo@ejemplo.com o 12.345.678-9"
                    className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-lg text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-secondary/50 shadow-sm"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-secondary ml-1">Contraseña</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors">
                    <LockIcon sx={{ fontSize: 20 }} />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-12 text-lg text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-secondary/50 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOffIcon sx={{ fontSize: 20 }} /> : <EyeIcon sx={{ fontSize: 20 }} />}
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-secondary ml-1">Nombre</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors">
                    <UserIcon sx={{ fontSize: 20 }} />
                  </div>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-lg text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-secondary/50 shadow-sm"
                  />
                </div>
              </div>

              {/* Avatar Selection (compact) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-secondary ml-1">Avatar</label>
                <div className="grid grid-cols-9 gap-2">
                  {AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(emoji)}
                      className={`aspect-square flex items-center justify-center rounded-lg text-xl transition-all duration-200 ${
                        selectedAvatar === emoji 
                        ? 'bg-accent text-white scale-110 shadow-lg ring-2 ring-accent ring-offset-1 ring-offset-surface' 
                        : 'bg-surfaceHighlight hover:bg-border hover:scale-105'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade Selection (compact) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-secondary ml-1">Nivel</label>
                <select
                  value={grade}
                  onChange={(e) => {
                    setGrade(e.target.value as any);
                    setSpecificGrade(''); // Reset specific grade when level changes
                  }}
                  className="w-full bg-background border border-border rounded-xl py-4 px-4 text-lg text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all shadow-sm"
                >
                  <option value="primaria">Primaria (6-12 años)</option>
                  <option value="secundaria">Secundaria (12-18 años)</option>
                  <option value="universidad">Universidad</option>
                  <option value="autodidacta">Autodidacta</option>
                </select>
              </div>

              {/* Specific Grade Selection */}
              {GRADE_OPTIONS[grade].length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-secondary ml-1">Curso</label>
                  <select
                    value={specificGrade}
                    onChange={(e) => setSpecificGrade(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl py-4 px-4 text-lg text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all shadow-sm"
                  >
                    <option value="">Selecciona tu curso</option>
                    {GRADE_OPTIONS[grade].map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-4 bg-primary text-background rounded-xl font-bold text-lg hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 mt-6"
              >
                <SparklesIcon sx={{ fontSize: 20 }} />
                Entrar
              </button>

              {/* Forgot Password */}
              {isSupabaseConfigured() && email && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!validateEmail(email)) {
                      setError('Ingresa un email válido primero');
                      return;
                    }
                    const result = await resetPassword(email);
                    if (result.success) {
                      setError('✅ ' + result.error); // result.error contiene el mensaje de éxito
                    } else {
                      setError(result.error || 'Error al enviar email');
                    }
                  }}
                  className="w-full text-center text-sm text-secondary hover:text-primary transition-colors mt-2"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              
              {/* Step 1: Credentials */}
              {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
                  
                  {/* Email or RUT */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-secondary ml-1">Email o RUT</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors">
                        {email ? <EmailIcon sx={{ fontSize: 20 }} /> : <BadgeIcon sx={{ fontSize: 20 }} />}
                      </div>
                      <input 
                        type="text"
                        value={email || rut}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.includes('@') || !value.match(/[0-9]/)) {
                            setEmail(value);
                            setRut('');
                          } else {
                            setRut(value);
                            setEmail('');
                            handleRutChange(e);
                          }
                        }}
                        placeholder="correo@ejemplo.com o 12.345.678-9"
                        className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-lg text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-secondary/50 shadow-sm"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-secondary ml-1">Contraseña</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors">
                        <LockIcon sx={{ fontSize: 20 }} />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-12 text-lg text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-secondary/50 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOffIcon sx={{ fontSize: 20 }} /> : <EyeIcon sx={{ fontSize: 20 }} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleNext}
                    className="w-full py-4 bg-primary text-background rounded-xl font-bold text-lg hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 mt-6"
                  >
                    Siguiente paso <ArrowRightIcon sx={{ fontSize: 20 }} />
                  </button>
                </div>
              )}

              {/* Step 2: Profile */}
              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
                  
                  {/* Avatar Selection */}
                  <div>
                     <label className="block text-sm font-medium text-secondary mb-4 text-center">Elige tu avatar</label>
                     <div className="grid grid-cols-6 gap-3">
                        {AVATARS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setSelectedAvatar(emoji)}
                            className={`aspect-square flex items-center justify-center rounded-xl text-2xl transition-all duration-200 ${
                              selectedAvatar === emoji 
                              ? 'bg-accent text-white scale-110 shadow-lg ring-2 ring-accent ring-offset-2 ring-offset-surface' 
                              : 'bg-surfaceHighlight hover:bg-border hover:scale-105'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2">
                     <label className="block text-sm font-medium text-secondary ml-1">¿Cómo te llamas?</label>
                     <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors">
                         <UserIcon sx={{ fontSize: 20 }} />
                      </div>
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Escribe tu nombre..."
                        className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-lg text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-secondary/50 shadow-sm"
                      />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleNext}
                    className="w-full py-4 bg-primary text-background rounded-xl font-bold text-lg hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Siguiente paso <ArrowRightIcon sx={{ fontSize: 20 }} />
                  </button>
                </div>
              )}

              {/* Step 3: Grade Selection */}
              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
                  
                  {/* Review */}
                  <div className="flex items-center gap-3 p-3 bg-surfaceHighlight/50 rounded-xl border border-border/50 cursor-pointer hover:bg-surfaceHighlight transition-colors" onClick={() => setStep(2)}>
                     <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-xl shadow-sm border border-border">
                        {selectedAvatar}
                     </div>
                     <div className="flex-1">
                        <div className="text-xs text-secondary font-medium">Estudiante</div>
                        <div className="text-sm font-bold text-primary">{name}</div>
                     </div>
                     <div className="text-xs text-accent font-medium px-3 py-1 bg-accent/10 rounded-full">Editar</div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold text-primary mb-1">Selecciona tu nivel</h2>
                    <p className="text-sm text-secondary">Para personalizar tus respuestas</p>
                  </div>

                  {/* Grade Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'primaria', icon: BookOpenIcon, label: 'Primaria', desc: '6-12 años', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500' },
                      { id: 'secundaria', icon: SchoolIcon, label: 'Secundaria', desc: '12-18 años', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500' },
                      { id: 'universidad', icon: GraduationCapIcon, label: 'Universidad', desc: 'Superior', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500' },
                      { id: 'autodidacta', icon: BrainCircuitIcon, label: 'Autodidacta', desc: 'Libre', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500' }
                    ].map((option) => (
                      <label 
                        key={option.id}
                        className={`relative cursor-pointer border rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] ${
                          grade === option.id 
                          ? `${option.bg} ${option.border} ring-1 ${option.border.replace('border', 'ring')}` 
                          : 'bg-background border-border hover:border-secondary'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="grade" 
                          value={option.id} 
                          checked={grade === option.id} 
                          onChange={() => {
                            setGrade(option.id as any);
                            setSpecificGrade(''); // Reset specific grade when level changes
                          }} 
                          className="hidden" 
                        />
                        
                        {grade === option.id && (
                          <div className={`absolute top-3 right-3 w-5 h-5 rounded-full ${option.bg.replace('/10', '')} flex items-center justify-center`}>
                             <CheckIcon sx={{ fontSize: 12 }} className="text-white" strokeWidth={3} />
                          </div>
                        )}

                        <div className={`w-10 h-10 rounded-xl ${option.bg} ${option.color} flex items-center justify-center mb-3`}>
                          <option.icon sx={{ fontSize: 20 }} />
                        </div>
                        <div className="font-bold text-primary text-sm">{option.label}</div>
                        <div className="text-xs text-secondary mt-0.5">{option.desc}</div>
                      </label>
                    ))}
                  </div>

                  {/* Specific Grade Selection */}
                  {GRADE_OPTIONS[grade].length > 0 && (
                    <div className="space-y-2 animate-in slide-in-from-bottom fade-in duration-300">
                      <label className="block text-sm font-medium text-secondary ml-1">¿En qué curso estás?</label>
                      <select
                        value={specificGrade}
                        onChange={(e) => setSpecificGrade(e.target.value)}
                        className="w-full bg-background border-2 border-border rounded-xl py-4 px-4 text-lg text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all shadow-sm"
                      >
                        <option value="">Selecciona tu curso</option>
                        {GRADE_OPTIONS[grade].map((course) => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-4 bg-primary text-background rounded-xl font-bold text-lg hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
                  >
                    <SparklesIcon sx={{ fontSize: 20 }} className="text-yellow-300 fill-yellow-300" />
                    Comenzar Aventura
                  </button>
                </div>
              )}

            </form>
          )}
        </div>
        
        <p className="text-center text-xs text-secondary mt-8 opacity-60">
          Al entrar aceptas aprender mucho y divertirte.<br/>
          Nativo Digital v2.0 - Acceso Educativo Libre
        </p>
      </div>
    </div>
  );
};

export default Login;
