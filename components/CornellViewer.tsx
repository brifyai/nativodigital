import React, { useState } from 'react';
import {
  Note as NoteIcon,
  QuestionMark as QuestionIcon,
  Summarize as SummaryIcon,
  CheckCircle as CheckIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Lightbulb as LightbulbIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';

interface CornellNote {
  cues: string[];
  notes: string[];
  summary: string;
}

interface CornellViewerProps {
  note: CornellNote;
  title?: string;
  topic?: string;
}

const CornellViewer: React.FC<CornellViewerProps> = ({ note, title, topic }) => {
  const [checkedCues, setCheckedCues] = useState<Set<number>>(new Set());
  const [userNotes, setUserNotes] = useState<Record<number, string>>({});
  const [editingCue, setEditingCue] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const totalCues = note.cues.length;
  const checkedCount = checkedCues.size;
  const progress = (checkedCount / totalCues) * 100;
  const allChecked = checkedCount === totalCues;

  const toggleCue = (index: number) => {
    const newChecked = new Set(checkedCues);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedCues(newChecked);
  };

  const startEditing = (index: number) => {
    setEditingCue(index);
    setCurrentNote(userNotes[index] || '');
  };

  const saveNote = () => {
    if (editingCue !== null && currentNote.trim()) {
      setUserNotes({ ...userNotes, [editingCue]: currentNote });
      toggleCue(editingCue);
    }
    setEditingCue(null);
    setCurrentNote('');
  };

  const cancelEditing = () => {
    setEditingCue(null);
    setCurrentNote('');
  };

  return (
    <div className="w-full p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 shadow-xl">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-primary flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
            <NoteIcon className="text-white" sx={{ fontSize: 20 }} />
          </div>
          <span>{title || 'Apuntes Organizados'}</span>
        </h3>
        {topic && (
          <p className="text-xs text-secondary ml-10">Tema: {topic}</p>
        )}

        {/* Progress Bar */}
        <div className="space-y-1 mt-3">
          <div className="flex justify-between text-xs">
            <span className="text-secondary font-medium">Progreso</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {checkedCount} de {totalCues} pistas
            </span>
          </div>
          <div className="h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cornell Layout - Horizontal */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-amber-300 dark:border-amber-700 overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left: Cues */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b md:border-b-0 md:border-r-2 border-amber-300 dark:border-amber-700">
            <div className="flex items-center gap-2 mb-3">
              <QuestionIcon className="text-amber-600 dark:text-amber-400" sx={{ fontSize: 18 }} />
              <h4 className="font-bold text-xs text-amber-900 dark:text-amber-100 uppercase">Pistas</h4>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {note.cues.map((cue, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg border transition-all ${
                    checkedCues.has(index)
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600'
                      : 'bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => toggleCue(index)}
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        checkedCues.has(index)
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-br from-amber-400 to-orange-400 text-white'
                      }`}
                    >
                      {checkedCues.has(index) ? '✓' : index + 1}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug mb-1 ${
                        checkedCues.has(index) ? 'text-green-700 dark:text-green-300 line-through' : 'text-primary'
                      }`}>
                        {cue}
                      </p>
                      
                      {userNotes[index] && (
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 italic truncate">
                          ✏️ {userNotes[index]}
                        </div>
                      )}
                      
                      {!checkedCues.has(index) && (
                        <button
                          onClick={() => startEditing(index)}
                          className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-medium mt-0.5"
                        >
                          {userNotes[index] ? '✏️ Editar' : '✏️ Responder'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Notes */}
          <div className="p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <NoteIcon className="text-blue-600 dark:text-blue-400" sx={{ fontSize: 18 }} />
              <h4 className="font-bold text-xs text-blue-900 dark:text-blue-100 uppercase">Notas</h4>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {note.notes.map((noteItem, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30"
                >
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-[10px]">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-xs text-primary leading-snug">{noteItem}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="border-t-2 border-amber-300 dark:border-amber-700">
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="w-full p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <SummaryIcon className="text-green-600 dark:text-green-400" sx={{ fontSize: 18 }} />
              <h4 className="font-bold text-xs text-green-900 dark:text-green-100 uppercase">Resumen</h4>
            </div>
            <span className="text-lg text-green-600 dark:text-green-400 transition-transform duration-300" style={{ transform: showSummary ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {showSummary && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-t border-green-200 dark:border-green-700">
              <p className="text-xs text-primary leading-relaxed">{note.summary}</p>
            </div>
          )}
        </div>
      </div>

      {/* Editing Modal */}
      {editingCue !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-80 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-primary flex items-center gap-1">
                <EditIcon className="text-amber-600" sx={{ fontSize: 16 }} />
                Responde
              </h4>
              <button onClick={cancelEditing} className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <CloseIcon sx={{ fontSize: 18 }} className="text-gray-500" />
              </button>
            </div>

            <div className="mb-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-700">
              <p className="text-[11px] text-primary leading-snug">{note.cues[editingCue]}</p>
            </div>

            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="w-full h-20 p-2 border border-amber-300 dark:border-amber-700 rounded resize-none focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white text-xs mb-2"
              autoFocus
            />

            <div className="flex gap-2">
              <button
                onClick={cancelEditing}
                className="flex-1 py-1.5 px-3 rounded font-semibold text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={saveNote}
                disabled={!currentNote.trim()}
                className={`flex-1 py-1.5 px-3 rounded font-semibold text-xs flex items-center justify-center gap-1 ${
                  currentNote.trim()
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <SaveIcon sx={{ fontSize: 14 }} />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion */}
      {allChecked && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 via-green-100 to-blue-100 dark:from-yellow-900/30 dark:via-green-900/30 dark:to-blue-900/30 rounded-xl border-2 border-yellow-400 dark:border-yellow-600 shadow-lg">
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <TrophyIcon sx={{ fontSize: 24 }} className="text-white" />
              </div>
            </div>
            <h4 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">
              🎉 ¡Excelente! 🎉
            </h4>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              Completaste todas las pistas
              {Object.keys(userNotes).length > 0 && ` y respondiste ${Object.keys(userNotes).length} 📝`}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 p-3 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg border border-amber-300 dark:border-amber-700">
        <p className="text-[10px] text-amber-900 dark:text-amber-100 leading-relaxed">
          <strong>Cómo usar:</strong> Lee cada pista, intenta responderla, luego verifica con las notas. Al final revisa el resumen.
        </p>
      </div>
    </div>
  );
};

export default CornellViewer;
