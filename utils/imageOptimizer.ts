// Image optimization utilities
const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB
const MAX_DIMENSION = 1920; // Max width/height
const QUALITY = 0.8; // JPEG quality

export interface OptimizedImage {
  data: string; // base64
  mimeType: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
}

export const optimizeImage = async (file: File): Promise<OptimizedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = (height / width) * MAX_DIMENSION;
              width = MAX_DIMENSION;
            } else {
              width = (width / height) * MAX_DIMENSION;
              height = MAX_DIMENSION;
            }
          }
          
          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG for better compression
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', QUALITY);
          const base64Data = optimizedDataUrl.split(',')[1];
          
          // Calculate sizes
          const originalSize = file.size;
          const optimizedSize = Math.ceil((base64Data.length * 3) / 4); // Approximate base64 size
          
          resolve({
            data: base64Data,
            mimeType: 'image/jpeg',
            originalSize,
            optimizedSize,
            compressionRatio: originalSize / optimizedSize
          });
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'El archivo debe ser una imagen' };
  }
  
  // Check file size (10MB max before optimization)
  const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_UPLOAD_SIZE) {
    return { valid: false, error: 'La imagen es demasiado grande (máx. 10MB)' };
  }
  
  return { valid: true };
};

export const getImageDimensions = (base64: string, mimeType: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = `data:${mimeType};base64,${base64}`;
  });
};
