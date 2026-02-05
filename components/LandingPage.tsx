
import React from 'react';
import {
  AutoAwesome as SparklesIcon,
  Bolt as ZapIcon,
  Language as GlobeIcon,
  Shield as ShieldCheckIcon,
  School as GraduationCapIcon,
  ArrowForward as ArrowRightIcon,
  Psychology as BrainIcon,
  Code as CodeIcon,
  MenuBook as BookOpenIcon,
  People as UsersIcon,
  LightMode as SunIcon,
  DarkMode as MoonIcon,
  CheckCircle as CheckCircle2Icon,
  ChatBubbleOutline as MessageSquareIcon,
  PlayArrow as PlayIcon,
  Star as StarIcon,
  Calculate as CalculatorIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';

interface LandingPageProps {
  onStart: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, toggleTheme, isDarkMode }) => {
  return (
    <div className="min-h-screen w-full bg-background text-primary font-sans selection:bg-accent selection:text-white overflow-x-hidden transition-colors duration-300">
      
      {/* Background Pattern - Modern Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-accent/20 opacity-20 blur-[100px]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <SparklesIcon sx={{ fontSize: 18 }} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">Nativo Digital</span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
             <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-secondary hover:text-primary hover:bg-surface transition-colors"
                title={isDarkMode ? "Modo Claro" : "Modo Oscuro"}
             >
                {isDarkMode ? <SunIcon sx={{ fontSize: 20 }} /> : <MoonIcon sx={{ fontSize: 20 }} />}
             </button>
             <button 
                onClick={onStart}
                className="bg-primary hover:opacity-90 text-background px-4 md:px-6 py-2 rounded-full font-medium text-sm transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
             >
                Entrar
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border text-xs font-semibold text-accent mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm hover:shadow-md transition-all cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            IA Educativa Gratuita v2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 text-primary leading-[1.1]">
            El futuro de tu <br />
            <span className="gradient-text">aprendizaje es hoy.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Nativo Digital es tu tutor personal de IA. Sin costo, sin barreras. 
            Domina cualquier materia con explicaciones adaptadas a ti.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 mb-16">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:opacity-90 text-background rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <ZapIcon sx={{ fontSize: 20 }} className="fill-current" /> Empezar ahora
            </button>
            <a 
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-surface/50 hover:bg-surface border border-border backdrop-blur-sm text-primary rounded-2xl font-medium text-lg transition-all flex items-center justify-center gap-2 hover:border-secondary"
            >
              Descubrir más <ArrowRightIcon sx={{ fontSize: 20 }} />
            </a>
          </div>

          {/* UI Mockup / Visual Anchor */}
          <div className="relative max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            {/* Glow behind */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20"></div>
            
            <div className="relative bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
               {/* Fake Browser Bar */}
               <div className="bg-surfaceHighlight/50 border-b border-border h-10 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                  </div>
                  <div className="mx-auto bg-surface/50 h-6 w-1/3 rounded-md flex items-center justify-center text-[10px] text-secondary">nativodigital.app</div>
               </div>
               
               {/* Mock Content */}
               <div className="p-6 md:p-8 flex flex-col gap-4 text-left">
                  {/* User Message */}
                  <div className="flex justify-end">
                     <div className="bg-primary text-background px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                        Explícame la Teoría de la Relatividad como si tuviera 10 años 🚀
                     </div>
                  </div>

                  {/* AI Message with Skeleton Loader we made before */}
                  <div className="flex gap-4 max-w-[90%]">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex-shrink-0 p-0.5">
                        <div className="w-full h-full bg-surface rounded-full flex items-center justify-center">
                           <SparklesIcon sx={{ fontSize: 14 }} className="text-accent" />
                        </div>
                     </div>
                     <div className="flex-1 space-y-3">
                        <div className="text-primary font-medium text-sm">Nativo Digital</div>
                        <div className="bg-surfaceHighlight/50 p-4 rounded-2xl rounded-tl-sm border border-border">
                           <p className="text-primary mb-3 leading-relaxed">¡Claro! Imagina que el espacio es como una cama elástica gigante... 🌌🛌</p>
                           <div className="h-2 w-3/4 bg-border/50 rounded-full animate-pulse mb-2"></div>
                           <div className="h-2 w-1/2 bg-border/50 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex gap-2">
                           <div className="px-2 py-1 bg-surface border border-border rounded-md text-[10px] text-secondary flex items-center gap-1"><GlobeIcon sx={{ fontSize: 10 }}/> Fuente: NASA</div>
                           <div className="px-2 py-1 bg-surface border border-border rounded-md text-[10px] text-secondary flex items-center gap-1"><BookOpenIcon sx={{ fontSize: 10 }}/> Física Básica</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats / Trusted By */}
      <section className="py-10 border-y border-border bg-surface/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div>
               <div className="text-3xl font-bold text-primary mb-1">100%</div>
               <div className="text-sm text-secondary font-medium uppercase tracking-wider">Gratuito</div>
            </div>
            <div>
               <div className="text-3xl font-bold text-primary mb-1">24/7</div>
               <div className="text-sm text-secondary font-medium uppercase tracking-wider">Disponible</div>
            </div>
            <div>
               <div className="text-3xl font-bold text-primary mb-1">Multi</div>
               <div className="text-sm text-secondary font-medium uppercase tracking-wider">Lenguaje</div>
            </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-16 px-4 bg-background relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 text-primary">Todo lo que necesitas para aprobar</h2>
            <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto">Herramientas profesionales simplificadas para estudiantes de todos los niveles.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            
            {/* Feature 1 - Large Left */}
            <div className="md:col-span-2 bg-gradient-to-br from-surface via-surface to-accent/5 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-border hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 relative overflow-hidden group cursor-pointer">
               {/* Animated gradient background */}
               <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
               
               <div className="relative z-10 flex flex-col">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl md:rounded-2xl flex items-center justify-center text-accent mb-4 md:mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-accent/20">
                     <BrainIcon sx={{ fontSize: 28 }} className="md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-primary group-hover:text-accent transition-colors duration-300">Tutoría Adaptativa</h3>
                  <p className="text-secondary text-sm md:text-base leading-relaxed mb-5">
                     Nativo Digital no solo responde, te enseña. Detecta si estás en primaria, secundaria o universidad y ajusta el lenguaje, los ejemplos y la profundidad de la respuesta automáticamente.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                     <span className="px-3 py-1.5 bg-surfaceHighlight/80 backdrop-blur-sm rounded-full text-xs font-semibold text-primary border border-border/50 group-hover:border-accent/30 transition-colors">Matemáticas</span>
                     <span className="px-3 py-1.5 bg-surfaceHighlight/80 backdrop-blur-sm rounded-full text-xs font-semibold text-primary border border-border/50 group-hover:border-accent/30 transition-colors">Historia</span>
                     <span className="px-3 py-1.5 bg-surfaceHighlight/80 backdrop-blur-sm rounded-full text-xs font-semibold text-primary border border-border/50 group-hover:border-accent/30 transition-colors">Ciencias</span>
                     <span className="px-3 py-1.5 bg-surfaceHighlight/80 backdrop-blur-sm rounded-full text-xs font-semibold text-primary border border-border/50 group-hover:border-accent/30 transition-colors">Literatura</span>
                  </div>
               </div>
            </div>

            {/* Feature 2 - Top Right */}
            <div className="bg-gradient-to-br from-surface to-purple-500/5 rounded-2xl md:rounded-3xl p-6 md:p-7 border border-border hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 group cursor-pointer relative overflow-hidden">
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               
               <div className="relative z-10">
                  <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-purple-500/20">
                     <GlobeIcon sx={{ fontSize: 24 }} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2.5 text-primary group-hover:text-purple-500 transition-colors duration-300">Datos en Tiempo Real</h3>
                  <p className="text-secondary text-sm leading-relaxed">
                     Conectado a Google Search. Pregunta sobre noticias actuales, clima o eventos recientes.
                  </p>
               </div>
            </div>

            {/* Feature 3 - Bottom Left */}
            <div className="bg-gradient-to-br from-surface to-green-500/5 rounded-2xl md:rounded-3xl p-6 md:p-7 border border-border hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500 group cursor-pointer relative overflow-hidden">
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               
               <div className="relative z-10">
                  <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-lg shadow-green-500/20">
                     <CodeIcon sx={{ fontSize: 24 }} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2.5 text-primary group-hover:text-green-500 transition-colors duration-300">Ejecución de Código</h3>
                  <p className="text-secondary text-sm leading-relaxed">
                     Nativo Digital escribe y ejecuta Python para resolver ecuaciones complejas y graficar datos al instante.
                  </p>
               </div>
            </div>

            {/* Feature 4 - Bottom Middle */}
            <div className="bg-gradient-to-br from-surface to-blue-500/5 rounded-2xl md:rounded-3xl p-6 md:p-7 border border-border hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 group cursor-pointer relative overflow-hidden">
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               
               <div className="relative z-10">
                  <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-blue-500/20">
                     <CalculatorIcon sx={{ fontSize: 24 }} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2.5 text-primary group-hover:text-blue-500 transition-colors duration-300">Resolución Paso a Paso</h3>
                  <p className="text-secondary text-sm leading-relaxed">
                     No solo te da la respuesta. Te explica cada paso del proceso para que realmente aprendas.
                  </p>
               </div>
            </div>

            {/* Feature 5 - Bottom Right */}
            <div className="bg-gradient-to-br from-surface to-orange-500/5 rounded-2xl md:rounded-3xl p-6 md:p-7 border border-border hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 group cursor-pointer relative overflow-hidden">
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               
               <div className="relative z-10">
                  <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 shadow-lg shadow-orange-500/20">
                     <CameraIcon sx={{ fontSize: 24 }} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2.5 text-primary group-hover:text-orange-500 transition-colors duration-300">Análisis de Imágenes</h3>
                  <p className="text-secondary text-sm leading-relaxed">
                     Toma una foto de tu tarea o problema y obtén ayuda instantánea con explicaciones detalladas.
                  </p>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Social Mission Section (Updated) */}
      <section className="py-24 px-4 border-t border-border bg-surface/30 relative overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 order-2 md:order-1">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-6">
                  <UsersIcon sx={{ fontSize: 12 }} />
                  MISIÓN SOCIAL
               </div>
               <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary tracking-tight">Tecnología para <br />cerrar brechas.</h2>
               <p className="text-lg text-secondary mb-8 leading-relaxed">
                  Creemos que el acceso a la inteligencia artificial no debe ser un lujo de pocos. Nativo Digital está optimizada para funcionar rápido, gastar pocos datos y ser completamente gratuita para estudiantes de escasos recursos en Latinoamérica.
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
                     <ShieldCheckIcon className="text-green-500 flex-shrink-0" sx={{ fontSize: 24 }} />
                     <div>
                        <div className="font-bold text-primary">100% Gratuito</div>
                        <div className="text-xs text-secondary">Sin costos ocultos</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
                     <ShieldCheckIcon className="text-green-500 flex-shrink-0" sx={{ fontSize: 24 }} />
                     <div>
                        <div className="font-bold text-primary">Privacidad Total</div>
                        <div className="text-xs text-secondary">Tus datos son tuyos</div>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="flex-1 order-1 md:order-2 flex justify-center relative">
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 rounded-full blur-[80px]"></div>
                
                <div className="relative bg-surface p-8 rounded-3xl border border-border shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 max-w-sm w-full">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                             🐶
                          </div>
                          <div>
                             <div className="font-bold text-primary">Alumno Curioso</div>
                             <div className="text-xs text-secondary">Estudiante de Primaria</div>
                          </div>
                       </div>
                       <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Online</div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="bg-surfaceHighlight p-4 rounded-2xl rounded-tl-none">
                          <p className="text-sm text-primary font-medium">¿Por qué el cielo es azul? 🤔</p>
                       </div>
                       
                       <div className="bg-surface border border-border p-4 rounded-2xl rounded-tr-none relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surfaceHighlight/50 to-transparent animate-pulse"></div>
                           <div className="flex items-center gap-2 mb-3">
                                <SparklesIcon sx={{ fontSize: 16 }} className="text-accent animate-spin-slow" />
                                <span className="text-xs font-bold text-accent">Analizando luz solar...</span>
                           </div>
                           <div className="space-y-2">
                                <div className="h-2 bg-secondary/20 rounded-full w-full"></div>
                                <div className="h-2 bg-secondary/20 rounded-full w-5/6"></div>
                                <div className="h-2 bg-secondary/20 rounded-full w-4/6"></div>
                           </div>
                       </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
         <div className="max-w-5xl mx-auto bg-primary rounded-3xl p-8 md:p-16 text-center text-background relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-in fade-in"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">¿Listo para mejorar tus notas?</h2>
            <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto relative z-10">
               Únete a la comunidad de estudiantes que están revolucionando su forma de aprender. Es gratis y fácil.
            </p>
            <button 
               onClick={onStart}
               className="bg-background text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg relative z-10"
            >
               Comenzar Gratis
            </button>
            <div className="mt-6 text-sm opacity-70 relative z-10">No se requiere tarjeta de crédito</div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
            <div className="p-2 bg-surface rounded-lg border border-border">
               <GraduationCapIcon sx={{ fontSize: 24 }} className="text-primary"/>
            </div>
            <span className="font-bold text-xl text-primary">Nativo Digital</span>
        </div>
        <div className="flex justify-center gap-6 mb-8 text-secondary">
           <a href="#" className="hover:text-primary transition-colors">Sobre Nosotros</a>
           <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
           <a href="#" className="hover:text-primary transition-colors">Términos</a>
           <a href="#" className="hover:text-primary transition-colors">Contacto</a>
        </div>
        <p className="text-secondary text-sm">© 2025 Proyecto de Acceso Educativo. Desarrollado con ❤️ para los estudiantes.</p>
      </footer>

    </div>
  );
};

export default LandingPage;
