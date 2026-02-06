/**
 * Custom hook para manejar la carga y validación de archivos
 * Incluye optimización de imágenes y validación de tipos de archivo
 */

import { useState } from 'react';
import { Attachment } from '../types';
import { validateFile } from '../utils/sanitizer';
import { optimizeImage, validateImageFile } from '../utils/imageOptimizer';

interface UseFileHandlingReturn {
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>, onToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void) => Promise<void>;
  removeAttachment: (index: number) => void;
  clearAttachments: () => void;
}

export const useFileHandling = (): UseFileHandlingReturn => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = Array.from(e.target.files);
      const newAttachments: Attachment[] = [];

      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          onToast(validation.error || 'Archivo inválido', 'error');
          continue;
        }

        try {
          if (file.type.startsWith('image/')) {
            const imageValidation = validateImageFile(file);
            if (!imageValidation.valid) {
              onToast(imageValidation.error || 'Imagen inválida', 'error');
              continue;
            }

            onToast('Optimizando imagen...', 'info');
            const optimized = await optimizeImage(file);
            
            newAttachments.push({
              mimeType: optimized.mimeType,
              data: optimized.data,
              name: file.name
            });
            
            if (optimized.compressionRatio > 1.5) {
              onToast(
                `Imagen optimizada: ${(optimized.compressionRatio).toFixed(1)}x más pequeña`, 
                'success'
              );
            }
          } else {
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
              reader.onload = (e) => {
                const result = e.target?.result as string;
                const base64 = result.split(',')[1];
                resolve(base64);
              };
            });
            reader.readAsDataURL(file);
            const base64 = await base64Promise;
            
            newAttachments.push({
              mimeType: file.type,
              data: base64,
              name: file.name
            });
          }
        } catch (error) {
          console.error('Error processing file:', error);
          onToast('Error al procesar el archivo', 'error');
        }
      }
      
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const clearAttachments = () => {
    setAttachments([]);
  };

  return {
    attachments,
    setAttachments,
    handleFileSelect,
    removeAttachment,
    clearAttachments
  };
};
