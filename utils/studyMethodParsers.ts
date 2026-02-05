// Parsers for study methods content

export interface SummarySection {
  title: string;
  content: string;
  keyPoints?: string[];
}

export interface FeynmanStep {
  step: number;
  title: string;
  content: string;
  icon: 'teach' | 'think' | 'simplify' | 'review';
}

export interface CornellNote {
  cues: string[];
  notes: string[];
  summary: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  level: number;
}

export interface MindMapData {
  centralTopic: string;
  nodes: MindMapNode[];
}

export interface ReviewSession {
  day: number;
  date: string;
  topics: string[];
  objective?: string;
  completed?: boolean;
}

export interface RecallQuestion {
  question: string;
  answer: string;
  hint?: string;
}

// Parse Summary (Resumen Fácil)
export const parseSummary = (content: string): SummarySection[] | null => {
  const sections: SummarySection[] = [];
  const lines = content.split('\n');
  
  let currentSection: SummarySection | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and separators
    if (!line || line.match(/^[━─═]+$/)) continue;
    
    // Skip the main title (RESUMEN FÁCIL: topic)
    if (line.match(/^📚?\s*\*\*RESUMEN FÁCIL:/i)) continue;
    
    // Detect section title (all caps or **TITLE** with optional emoji)
    // Matches: **¿QUÉ ES Y POR QUÉ IMPORTA?**, **CONCEPTOS CLAVE**, etc.
    const titleMatch = line.match(/^[📚🎯💡✨🔍]?\s*\*\*([A-ZÁÉÍÓÚÑ\s:?¿!¡]+)\*\*$/);
    if (titleMatch) {
      // Save previous section
      if (currentSection && (currentSection.content || (currentSection.keyPoints && currentSection.keyPoints.length > 0))) {
        sections.push(currentSection);
      }
      // Start new section
      currentSection = {
        title: titleMatch[1].trim(),
        content: '',
        keyPoints: []
      };
      continue;
    }
    
    // Detect numbered items (1. **[Concepto]** or just 1. text)
    const numberedMatch = line.match(/^\d+\.\s+\*\*(.+?)\*\*$/);
    if (numberedMatch && currentSection) {
      // This is a sub-section title, add as key point
      currentSection.keyPoints = currentSection.keyPoints || [];
      currentSection.keyPoints.push(numberedMatch[1].trim());
      continue;
    }
    
    // Detect bullet points
    if (line.match(/^[•\-\*→]\s/) || line.match(/^\d+\.\s/)) {
      if (currentSection) {
        const point = line.replace(/^[•\-\*→]\s/, '').replace(/^\d+\.\s/, '').trim();
        if (point && !point.startsWith('**')) {
          currentSection.keyPoints = currentSection.keyPoints || [];
          currentSection.keyPoints.push(point);
        }
      }
      continue;
    }
    
    // Detect sub-items with indentation (   - text)
    if (line.match(/^\s+[\-•]\s/)) {
      if (currentSection) {
        const point = line.replace(/^\s+[\-•]\s/, '').trim();
        if (point) {
          currentSection.keyPoints = currentSection.keyPoints || [];
          currentSection.keyPoints.push(point);
        }
      }
      continue;
    }
    
    // Add content to current section (skip lines that are just markdown bold)
    if (currentSection && line && !line.startsWith('**') && !line.endsWith('**')) {
      currentSection.content += (currentSection.content ? ' ' : '') + line;
    }
  }
  
  // Add last section
  if (currentSection && (currentSection.content || (currentSection.keyPoints && currentSection.keyPoints.length > 0))) {
    sections.push(currentSection);
  }
  
  console.log('📊 Summary parser - Secciones encontradas:', sections.length);
  if (sections.length > 0) {
    console.log('📋 Secciones:', sections.map(s => s.title));
  }
  
  return sections.length > 0 ? sections : null;
};

// Parse Feynman Method
export const parseFeynman = (content: string): FeynmanStep[] | null => {
  console.log('🔍 Parser Feynman iniciado');
  const steps: FeynmanStep[] = [];
  const lines = content.split('\n');
  
  let currentStep: Partial<FeynmanStep> | null = null;
  let collectingContent = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip empty lines and separators
    if (!trimmed || trimmed.match(/^[━─═]+$/)) continue;
    
    // Detect step marker - MORE FLEXIBLE
    // Format 1: **PASO 1: TÍTULO**
    // Format 2: **PASO 1** (title on next line)
    // Format 3: PASO 1 (without bold)
    const stepMatch = trimmed.match(/^\*{0,2}\s*PASO\s+(\d+)(?::\s*(.+?))?[\*]{0,2}$/i);
    if (stepMatch) {
      console.log(`✅ Detectado paso ${stepMatch[1]}: ${trimmed}`);
      
      // Save previous step
      if (currentStep && currentStep.content && currentStep.content.trim()) {
        steps.push(currentStep as FeynmanStep);
        console.log(`💾 Paso ${currentStep.step} guardado con ${currentStep.content.length} caracteres`);
      }
      
      const stepNum = parseInt(stepMatch[1]);
      let title = stepMatch[2] ? stepMatch[2].trim() : '';
      
      // If no title on same line, check next line
      if (!title && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        // Remove markdown bold markers
        title = nextLine.replace(/^\*\*|\*\*$/g, '').trim();
        console.log(`📝 Título del paso ${stepNum} en siguiente línea: ${title}`);
        i++; // Skip next line since we used it
      }
      
      // Determine icon based on step number or title
      let icon: 'teach' | 'think' | 'simplify' | 'review' = 'teach';
      const titleLower = title.toLowerCase();
      if (stepNum === 2 || titleLower.includes('identifica') || titleLower.includes('laguna') || titleLower.includes('encuentra')) {
        icon = 'think';
      } else if (stepNum === 3 || titleLower.includes('simplifica') || titleLower.includes('analogía') || titleLower.includes('usa')) {
        icon = 'simplify';
      } else if (stepNum === 4 || titleLower.includes('repasa') || titleLower.includes('revisa') || titleLower.includes('resumen')) {
        icon = 'review';
      }
      
      currentStep = { step: stepNum, title, content: '', icon };
      collectingContent = true;
      continue;
    }
    
    // Collect content for current step
    if (currentStep && collectingContent) {
      // Skip section headers and markdown bold lines
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        continue;
      }
      
      // Add content (skip bullets and clean up)
      if (trimmed && !trimmed.match(/^APRENDE EXPLICANDO/i)) {
        let contentLine = trimmed;
        // Remove bullets
        contentLine = contentLine.replace(/^[•✓✅\-\*]\s*/, '');
        // Remove markdown bold
        contentLine = contentLine.replace(/\*\*/g, '');
        
        if (contentLine.trim()) {
          currentStep.content += (currentStep.content ? '\n' : '') + contentLine;
        }
      }
    }
  }
  
  // Add last step
  if (currentStep && currentStep.content && currentStep.content.trim()) {
    steps.push(currentStep as FeynmanStep);
    console.log(`💾 Último paso ${currentStep.step} guardado con ${currentStep.content.length} caracteres`);
  }
  
  console.log(`📊 Total pasos Feynman parseados: ${steps.length}`);
  if (steps.length === 0) {
    console.warn('⚠️ No se parsearon pasos Feynman');
  } else {
    console.log('🎉 Pasos parseados:', steps.map(s => `Paso ${s.step}: ${s.title}`));
  }
  
  return steps.length > 0 ? steps : null;
};

// Parse Cornell Notes
export const parseCornell = (content: string): CornellNote | null => {
  console.log('🔍 Parser Cornell iniciado');
  const note: CornellNote = { cues: [], notes: [], summary: '' };
  const lines = content.split('\n');
  
  let currentSection: 'none' | 'cues' | 'notes' | 'summary' = 'none';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip empty lines and separators
    if (!trimmed || trimmed.match(/^[━─═]+$/)) continue;
    
    // Detect sections - MORE FLEXIBLE
    // Cues/Questions section
    if (trimmed.match(/^\*{0,2}(COLUMNA IZQUIERDA|PREGUNTAS CLAVE|PISTAS|PREGUNTAS|CUES)\*{0,2}:?/i)) {
      currentSection = 'cues';
      console.log(`📝 Sección PISTAS detectada en línea ${i}: ${trimmed}`);
      continue;
    }
    
    // Notes section
    if (trimmed.match(/^\*{0,2}(COLUMNA DERECHA|NOTAS DETALLADAS|NOTAS|NOTES)\*{0,2}:?/i)) {
      currentSection = 'notes';
      console.log(`📋 Sección NOTAS detectada en línea ${i}: ${trimmed}`);
      continue;
    }
    
    // Summary section
    if (trimmed.match(/^\*{0,2}(RESUMEN|SUMMARY)\*{0,2}(\s*\(|:)?/i)) {
      currentSection = 'summary';
      console.log(`📊 Sección RESUMEN detectada en línea ${i}: ${trimmed}`);
      continue;
    }
    
    // Skip section headers and instructions
    if (trimmed.match(/^(CÓMO USAR|TIP PRO|SISTEMA DE)/i)) {
      currentSection = 'none';
      continue;
    }
    
    // Add content to sections
    if (currentSection === 'cues') {
      // Match bullets, numbered items, or **Pregunta X:**
      const cueMatch = trimmed.match(/^(?:[•\-\*→]|\d+\.|\*{1,2}Pregunta\s+\d+:?\*{0,2})\s*(.+)/i);
      if (cueMatch) {
        let cue = cueMatch[1].trim();
        // Remove ALL markdown bold markers
        cue = cue.replace(/\*+/g, '').trim();
        if (cue && cue.length > 2) {
          note.cues.push(cue);
          console.log(`✅ Pista agregada: "${cue.substring(0, 50)}..."`);
        }
      }
    } else if (currentSection === 'notes') {
      // Match bullets, numbered items, or **Topic:**
      const noteMatch = trimmed.match(/^(?:[•\-\*→]|\d+\.|\*{1,2}[^:]+:?\*{0,2})\s*(.+)/i);
      if (noteMatch) {
        let noteText = noteMatch[1].trim();
        // Remove ALL markdown bold markers
        noteText = noteText.replace(/\*+/g, '').trim();
        if (noteText && noteText.length > 2) {
          note.notes.push(noteText);
          console.log(`✅ Nota agregada: "${noteText.substring(0, 50)}..."`);
        }
      } else if (trimmed.match(/^\*{1,2}[^*]+\*{1,2}$/)) {
        // Handle lines that are just bold headers (topic names)
        let topic = trimmed.replace(/\*+/g, '').trim();
        if (topic && topic.length > 2 && !topic.match(/^(Tema|Topic)/i)) {
          note.notes.push(topic);
          console.log(`✅ Tema agregado: "${topic}"`);
        }
      }
    } else if (currentSection === 'summary') {
      // Skip lines that are just markdown or instructions
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        continue;
      }
      if (trimmed.match(/^[━─═]+$/) || trimmed.match(/^(CÓMO USAR|TIP PRO)/i)) {
        continue;
      }
      
      // Add to summary
      let summaryText = trimmed.replace(/^[•\-\*→]\s*/, '').trim();
      summaryText = summaryText.replace(/\*+/g, '').trim();
      if (summaryText && summaryText.length > 2) {
        note.summary += (note.summary ? ' ' : '') + summaryText;
      }
    }
  }
  
  console.log(`📊 Cornell parseado: ${note.cues.length} pistas, ${note.notes.length} notas, resumen: ${note.summary.length} caracteres`);
  
  if (note.cues.length === 0 && note.notes.length === 0) {
    console.warn('⚠️ No se parsearon pistas ni notas');
    return null;
  }
  
  console.log('🎉 Cornell parseado exitosamente');
  return note;
};

// Parse Mind Map
export const parseMindMap = (content: string): MindMapData | null => {
  console.log('🔍 Parser MindMap iniciado');
  const lines = content.split('\n');
  let centralTopic = '';
  const nodes: MindMapNode[] = [];
  let nodeCounter = 0;
  
  let currentNode: MindMapNode | null = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.match(/^[━─═]+$/)) continue;
    
    // Detect central topic - support multiple formats
    const centralMatch = trimmed.match(/^\*{0,2}(TEMA CENTRAL|IDEA PRINCIPAL|DIBUJA LAS IDEAS):\*{0,2}\s*(.+)$/i);
    if (centralMatch) {
      centralTopic = centralMatch[2].trim().replace(/\*+/g, '');
      console.log(`📌 Tema central detectado: "${centralTopic}"`);
      continue;
    }
    
    // Detect main branch (RAMA or level 0)
    const branchMatch = trimmed.match(/^\*{0,2}RAMA\s+\d+:\*{0,2}\s*(.+)$/i) || 
                       (trimmed.match(/^\*\*(.+)\*\*$/) && !trimmed.match(/TEMA CENTRAL|IDEA PRINCIPAL|DIBUJA LAS IDEAS|CONEXIONES|PALABRAS CLAVE|TIP/i));
    if (branchMatch) {
      if (currentNode) {
        nodes.push(currentNode);
        console.log(`✅ Rama agregada: "${currentNode.label}" con ${currentNode.children?.length || 0} hijos`);
      }
      const label = branchMatch[1].trim().replace(/\*+/g, '');
      currentNode = {
        id: `node-${nodeCounter++}`,
        label,
        children: [],
        level: 0
      };
      console.log(`🌿 Nueva rama: "${label}"`);
      continue;
    }
    
    // Detect sub-items
    if (currentNode && trimmed.match(/^[•\-\*]\s/)) {
      let childLabel = trimmed.replace(/^[•\-\*]\s*/, '').trim();
      // Remove markdown bold
      childLabel = childLabel.replace(/\*\*/g, '').trim();
      // Remove "Sub-concepto X:" prefix
      childLabel = childLabel.replace(/^Sub-concepto\s+\d+:\s*/i, '');
      
      if (childLabel && childLabel.length > 2) {
        currentNode.children = currentNode.children || [];
        currentNode.children.push({
          id: `node-${nodeCounter++}`,
          label: childLabel,
          level: 1
        });
        console.log(`  └─ Sub-item: "${childLabel}"`);
      }
    }
  }
  
  if (currentNode) {
    nodes.push(currentNode);
    console.log(`✅ Última rama agregada: "${currentNode.label}" con ${currentNode.children?.length || 0} hijos`);
  }
  
  console.log(`📊 Total parseado: ${nodes.length} ramas, tema: "${centralTopic}"`);
  
  if (!centralTopic || nodes.length === 0) {
    console.warn('⚠️ No se detectó tema central o ramas');
    return null;
  }
  
  return { centralTopic, nodes };
};

// Parse Spaced Repetition
export const parseSpacedRepetition = (content: string): ReviewSession[] | null => {
  console.log('🔍 Parser Spaced Repetition iniciado');
  const sessions: ReviewSession[] = [];
  const lines = content.split('\n');
  
  let currentSession: Partial<ReviewSession> | null = null;
  let inQueHacerSection = false;
  let inObjetivoSection = false;
  let currentTopic = '';
  
  const saveTopic = () => {
    if (currentTopic && currentSession) {
      currentSession.topics = currentSession.topics || [];
      currentSession.topics.push(currentTopic.trim());
      console.log(`    ✓ Tema guardado: "${currentTopic.substring(0, 50)}..."`);
      currentTopic = '';
    }
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.match(/^[━─═]+$/)) continue;
    
    // Detect day marker
    const dayMatch = trimmed.match(/^\*{0,2}DÍA\s+(\d+)\s*[-–—]\s*(.+?)[\*]{0,2}$/i);
    if (dayMatch) {
      saveTopic(); // Save any pending topic
      
      // Save previous session
      if (currentSession && currentSession.day && currentSession.topics && currentSession.topics.length > 0) {
        sessions.push(currentSession as ReviewSession);
        console.log(`✅ Sesión Día ${currentSession.day} guardada con ${currentSession.topics.length} temas`);
      }
      
      const day = parseInt(dayMatch[1]);
      const date = dayMatch[2].trim().replace(/\*+/g, '').replace(/[🚀👟🏆📣⚽👑]/g, '').trim();
      currentSession = {
        day,
        date,
        topics: [],
        objective: '',
        completed: false
      };
      inQueHacerSection = false;
      inObjetivoSection = false;
      console.log(`📅 Nuevo Día ${day}: ${date}`);
      continue;
    }
    
    // Detect "QUÉ ESTUDIAR:" or "QUÉ HACER:" section
    if (trimmed.match(/\*{0,2}\s*(QUÉ ESTUDIAR|QUÉ HACER):\*{0,2}/i)) {
      saveTopic(); // Save any pending topic
      inQueHacerSection = true;
      inObjetivoSection = false;
      console.log('  📝 Entrando a sección QUÉ ESTUDIAR/HACER');
      continue;
    }
    
    // Detect "OBJETIVO:" section
    if (trimmed.match(/^\*{0,2}OBJETIVO:\*{0,2}/i)) {
      saveTopic(); // Save any pending topic
      inQueHacerSection = false;
      inObjetivoSection = true;
      console.log('  🎯 Entrando a sección OBJETIVO');
      continue;
    }
    
    // Detect end of sections
    if (trimmed.match(/^\*{0,2}(Tiempo:|MATERIAL|SEÑALES|TIPS|DATO):/i)) {
      saveTopic(); // Save any pending topic
      inQueHacerSection = false;
      inObjetivoSection = false;
      continue;
    }
    
    // Collect content from "QUÉ ESTUDIAR/HACER" section
    if (currentSession && inQueHacerSection) {
      // New bullet point - save previous and start new
      if (trimmed.match(/^[\*•✓✅\-]\s+/) || trimmed.startsWith('* ')) {
        saveTopic(); // Save previous topic
        currentTopic = trimmed.replace(/^[\*•✓✅\-]\s+/, '').replace(/\*\*/g, '').trim();
      } else if (currentTopic && trimmed) {
        // Continue current topic (multi-line)
        currentTopic += ' ' + trimmed.replace(/\*\*/g, '').trim();
      }
    }
    
    // Collect objective text
    if (currentSession && inObjetivoSection && trimmed && !trimmed.match(/^\*{0,2}OBJETIVO:\*{0,2}$/i)) {
      let objectiveText = trimmed.replace(/\*\*/g, '').trim();
      if (objectiveText && objectiveText.length > 3) {
        currentSession.objective = (currentSession.objective || '') + ' ' + objectiveText;
      }
    }
  }
  
  saveTopic(); // Save last topic
  
  // Save last session
  if (currentSession && currentSession.day && currentSession.topics && currentSession.topics.length > 0) {
    sessions.push(currentSession as ReviewSession);
    console.log(`✅ Última sesión Día ${currentSession.day} guardada con ${currentSession.topics.length} temas`);
  }
  
  console.log(`📊 TOTAL: ${sessions.length} sesiones parseadas`);
  sessions.forEach(s => console.log(`  - Día ${s.day}: ${s.topics.length} temas`));
  
  if (sessions.length === 0) {
    console.warn('⚠️ No se detectaron sesiones');
    return null;
  }
  
  return sessions;
};

// Parse Active Recall
export const parseActiveRecall = (content: string): RecallQuestion[] | null => {
  console.log('🔍 Parser Active Recall iniciado');
  console.log('📄 Contenido recibido (primeros 200 chars):', content.substring(0, 200));
  const questions: RecallQuestion[] = [];
  const lines = content.split('\n');
  console.log('📝 Total de líneas:', lines.length);
  
  let currentQuestion: Partial<RecallQuestion> | null = null;
  let currentSection: 'none' | 'question' | 'hint' | 'answer' = 'none';
  let currentLevel = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.match(/^[━─═]+$/)) continue;
    
    // Skip main title and intro
    if (trimmed.match(/^(PRACTICA RECORDAR|RECUPERACIÓN ACTIVA|RECUERDO ACTIVO|¡Hola|Aquí tienes)/i)) {
      console.log('📝 Título/intro detectado, saltando...');
      continue;
    }
    
    // Detect level headers (NIVEL 1, NIVEL 2, etc.)
    const levelMatch = trimmed.match(/^[🟢🟡🟠🔴]?\s*\*{0,2}NIVEL\s+\d+:/i);
    if (levelMatch) {
      currentLevel = trimmed;
      console.log('📊 Nivel detectado:', currentLevel);
      continue;
    }
    
    // Detect question with emoji number (1️⃣, 2️⃣, etc.) OR regular number
    // Format: 1️⃣ ¿Pregunta? OR 1. ¿Pregunta?
    const emojiQuestionMatch = trimmed.match(/^[0-9][\u{FE0F}]?[\u{20E3}]\s+(.+)$/u);
    const regularQuestionMatch = trimmed.match(/^\d+[\.\)]\s+(.+)$/);
    
    if (emojiQuestionMatch || regularQuestionMatch) {
      const questionText = emojiQuestionMatch ? emojiQuestionMatch[1] : regularQuestionMatch![1];
      console.log(`✅ Pregunta detectada en línea ${i}: "${questionText.substring(0, 50)}..."`);
      
      // Save previous question if it has both question and answer
      if (currentQuestion && currentQuestion.question && currentQuestion.answer) {
        questions.push(currentQuestion as RecallQuestion);
        console.log(`💾 Pregunta guardada`);
      }
      
      // For this format, the question IS the question, and we don't have explicit answers
      // So we'll create a question without answer for now
      currentQuestion = { 
        question: questionText.replace(/\*\*/g, '').trim(),
        answer: 'Responde esta pregunta basándote en lo que aprendiste.',
        hint: ''
      };
      
      // Check if there's a hint in parentheses
      const hintMatch = questionText.match(/\(Pista:\s*(.+?)\)/i);
      if (hintMatch) {
        currentQuestion.hint = hintMatch[1].trim();
        currentQuestion.question = questionText.replace(/\(Pista:\s*.+?\)/i, '').replace(/\*\*/g, '').trim();
      }
      
      continue;
    }
    
    // Original format detection: **PREGUNTA 1:**
    const questionMatch = trimmed.match(/^\*{0,2}PREGUNTA\s+(\d+):\*{0,2}\s*(.*)$/i);
    if (questionMatch) {
      console.log(`✅ Pregunta ${questionMatch[1]} detectada (formato original) en línea ${i}`);
      
      // Save previous question
      if (currentQuestion && currentQuestion.question && currentQuestion.answer) {
        questions.push(currentQuestion as RecallQuestion);
        console.log(`💾 Pregunta guardada`);
      }
      
      // Start new question
      currentQuestion = { question: '', answer: '', hint: '' };
      currentSection = 'question';
      
      // If question text is on same line
      if (questionMatch[2]) {
        currentQuestion.question = questionMatch[2].trim().replace(/\*\*/g, '');
        console.log(`  📝 Pregunta en misma línea: "${currentQuestion.question}"`);
      }
      continue;
    }
    
    // Detect sections (for original format)
    if (trimmed.match(/^\*{0,2}(PISTA|HINT):\*{0,2}/i)) {
      currentSection = 'hint';
      console.log('  💡 Sección PISTA detectada');
      continue;
    }
    if (trimmed.match(/^\*{0,2}(RESPUESTA|ANSWER):\*{0,2}/i)) {
      currentSection = 'answer';
      console.log('  ✓ Sección RESPUESTA detectada');
      continue;
    }
    
    // Skip instructions and tips
    if (trimmed.match(/^(CÓMO USAR|TIP|INSTRUCCIONES|Sin mirar|AUTOEVALUACIÓN|correctas)/i)) {
      currentSection = 'none';
      continue;
    }
    
    // Add content to current section (for original format)
    if (currentQuestion && trimmed && currentSection !== 'none' && currentSection !== 'question') {
      // Remove bullets and markdown
      let cleanText = trimmed.replace(/^[•\-\*→]\s*/, '').replace(/\*\*/g, '').trim();
      
      if (cleanText && cleanText.length > 2) {
        if (currentSection === 'question') {
          currentQuestion.question += (currentQuestion.question ? ' ' : '') + cleanText;
        } else if (currentSection === 'hint') {
          currentQuestion.hint += (currentQuestion.hint ? ' ' : '') + cleanText;
        } else if (currentSection === 'answer') {
          currentQuestion.answer += (currentQuestion.answer ? ' ' : '') + cleanText;
        }
      }
    }
  }
  
  // Save last question
  if (currentQuestion && currentQuestion.question) {
    // If no answer was provided, add a default one
    if (!currentQuestion.answer) {
      currentQuestion.answer = 'Responde esta pregunta basándote en lo que aprendiste.';
    }
    questions.push(currentQuestion as RecallQuestion);
    console.log(`💾 Última pregunta guardada`);
  }
  
  console.log(`📊 TOTAL: ${questions.length} preguntas parseadas`);
  
  if (questions.length === 0) {
    console.warn('⚠️ No se detectaron preguntas');
    console.warn('💡 Verifica que el contenido use el formato: **PREGUNTA 1:** o 1️⃣ pregunta');
    return null;
  }
  
  console.log('✅ Parser completado exitosamente');
  return questions;
};
