/**
 * Componente InputArea
 * Área de entrada de mensajes con soporte para texto, archivos y voz
 */

import React, { useRef } from 'react';
import {
  Send as SendIcon,
  Mic as MicIcon,
  Image as ImageIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
  StopCircle as StopIcon,
} from '@mui/icons-material';
import { Attachment } from '../types';

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  attachments: Attachment[];
  isListening: boolean;
  isLoading: boolean;
  isMobile: boolean;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (index: number) => void;
  onToggleListening: () => void;
  onStopGeneration: () => void;
}

export default function InputArea({
  input,
  setInput,
  attachments,
  isListening,
  isLoading,
  isMobile,
  onSend,
  onKeyDown,
  onFileSelect,
  onRemoveAttachment,
  onToggleListening,
  onStopGeneration
}: InputAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`absolute left-0 right-0 bg-background/95 backdrop-blur-sm pt-4 ${isMobile ? 'bottom-16 pb-4 px-3' : 'bottom-0 pb-6 px-4'}`}>
      <div className={`w-full relative ${isMobile ? 'max-w-full' : 'max-w-3xl mx-auto'}`}>
        <div className="bg-surface rounded-3xl flex flex-col border border-border focus-within:border-secondary transition-colors shadow-lg">
          
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="px-6 pt-4 flex gap-3 overflow-x-auto">
              {attachments.map((file, idx) => (
                <div key={idx} className="relative group/attachment flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg border border-border overflow-hidden bg-background flex items-center justify-center">
                    {file.mimeType.startsWith('image/') ? (
                      <img 
                        src={`data:${file.mimeType};base64,${file.data}`} 
                        className="w-full h-full object-cover opacity-80" 
                        alt="Preview"
                      />
                    ) : (
                      <FileIcon sx={{ fontSize: 24 }} className="text-secondary"/>
                    )}
                  </div>
                  <button 
                    onClick={() => onRemoveAttachment(idx)} 
                    className="absolute -top-1.5 -right-1.5 bg-secondary rounded-full p-0.5 text-background hover:bg-red-500"
                  >
                    <CloseIcon sx={{ fontSize: 12 }} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Textarea */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={isListening ? "Escuchando..." : "Escribe, sube una foto de tu tarea o pregunta..."}
            className="w-full bg-transparent text-primary placeholder-secondary px-6 py-4 outline-none resize-none min-h-[60px] max-h-[200px]"
            rows={1}
            aria-label="Campo de entrada de mensaje"
            maxLength={4000}
          />
          
          {/* Character Counter */}
          {input.length > 0 && (
            <div className="px-6 pb-2 flex items-center justify-between">
              <div className={`text-xs ${input.length > 3500 ? 'text-orange-500' : 'text-secondary'}`}>
                {input.length} / 4000 caracteres
              </div>
              {input.length > 3500 && (
                <div className="text-xs text-orange-500">⚠️ Cerca del límite</div>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-between items-center px-4 pb-3">
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept="image/*,application/pdf,text/*" 
                onChange={onFileSelect}
                aria-label="Seleccionar archivos para adjuntar"
              />
              <button 
                onClick={triggerFileUpload} 
                className="p-2 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-full transition-colors" 
                title="Adjuntar archivo"
                aria-label="Adjuntar archivo"
              >
                <AttachFileIcon sx={{ fontSize: 20 }} />
              </button>
              <button 
                onClick={triggerFileUpload} 
                className="p-2 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-full transition-colors" 
                title="Subir imagen"
                aria-label="Subir imagen"
              >
                <ImageIcon sx={{ fontSize: 20 }} />
              </button>
              <button 
                onClick={onToggleListening} 
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-secondary hover:text-primary hover:bg-surfaceHighlight'}`} 
                title="Usar micrófono"
                aria-label={isListening ? "Detener grabación de voz" : "Iniciar grabación de voz"}
              >
                {isListening ? <StopIcon sx={{ fontSize: 20 }} /> : <MicIcon sx={{ fontSize: 20 }} />}
              </button>
            </div>
            
            {/* Send/Stop Button */}
            {isLoading ? (
              <button 
                onClick={onStopGeneration}
                className="p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
                title="Detener generación"
                aria-label="Detener generación de respuesta"
              >
                <StopIcon sx={{ fontSize: 18 }} />
              </button>
            ) : (
              <button 
                onClick={onSend} 
                disabled={(!input.trim() && attachments.length === 0)} 
                className={`p-2 rounded-full transition-all duration-200 ${(input.trim() || attachments.length > 0) ? 'bg-primary text-background hover:opacity-90' : 'bg-surfaceHighlight text-secondary cursor-not-allowed'}`}
                title="Enviar mensaje"
                aria-label="Enviar mensaje"
              >
                <SendIcon sx={{ fontSize: 18 }} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
