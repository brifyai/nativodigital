import React, { useState } from 'react';
import {
  Close as CloseIcon,
  Share as Share2Icon,
  Link as Link2Icon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Download as DownloadIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import { ChatSession } from '../types';

interface ShareDialogProps {
  session: ChatSession;
  onClose: () => void;
  onShare: (shareId: string) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ session, onClose, onShare }) => {
  const [copied, setCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [shareId] = useState(() => {
    // Generate a unique share ID
    return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });

  const shareUrl = `${window.location.origin}/shared/${shareId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleShare = () => {
    // Save to localStorage for demo purposes
    // In production, this would be an API call
    const sharedConversations = JSON.parse(localStorage.getItem('nativo_shared') || '{}');
    sharedConversations[shareId] = {
      session,
      createdAt: Date.now(),
      views: 0
    };
    localStorage.setItem('nativo_shared', JSON.stringify(sharedConversations));
    
    setIsShared(true);
    onShare(shareId);
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: session.title,
          text: `Mira esta conversación de Nativo Digital sobre: ${session.title}`,
          url: shareUrl
        });
      } catch (err) {
        console.error('Error al compartir:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="bg-accent/20 p-2 rounded-lg text-accent">
              <Share2Icon sx={{ fontSize: 24 }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary">Compartir Conversación</h3>
              <p className="text-xs text-secondary">Comparte tu aprendizaje con otros</p>
            </div>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary p-1 hover:bg-surfaceHighlight rounded-full transition-colors">
            <CloseIcon sx={{ fontSize: 24 }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Session Preview */}
          <div className="bg-surfaceHighlight rounded-xl p-4 border border-border">
            <h4 className="font-bold text-primary mb-2">{session.title}</h4>
            <div className="flex items-center gap-4 text-xs text-secondary">
              <span>{session.messages.length} mensajes</span>
              <span>•</span>
              <span>{new Date(session.updatedAt).toLocaleDateString('es-ES')}</span>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            {!isShared ? (
              <button
                onClick={handleShare}
                className="w-full bg-primary hover:opacity-90 text-background py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Link2Icon sx={{ fontSize: 20 }} />
                Generar Enlace para Compartir
              </button>
            ) : (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                <CheckIcon sx={{ fontSize: 24 }} className="text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-green-500">¡Enlace generado!</p>
                  <p className="text-xs text-secondary">Ahora puedes copiar y compartir el enlace</p>
                </div>
              </div>
            )}

            {/* Link Display */}
            <div className="bg-background border border-border rounded-xl p-4 flex items-center gap-3">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-secondary outline-none"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-surfaceHighlight rounded-lg text-secondary hover:text-primary transition-colors"
                title="Copiar enlace"
              >
                {copied ? <CheckIcon sx={{ fontSize: 18 }} className="text-green-500" /> : <CopyIcon sx={{ fontSize: 18 }} />}
              </button>
            </div>

            {/* Native Share (Mobile) */}
            {navigator.share && isShared && (
              <button
                onClick={handleShareNative}
                className="w-full bg-surfaceHighlight hover:bg-border text-primary py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Share2Icon sx={{ fontSize: 18 }} />
                Compartir con...
              </button>
            )}
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h5 className="font-bold text-primary text-sm mb-2 flex items-center gap-2">
              ℹ️ Información Importante
            </h5>
            <ul className="text-xs text-secondary space-y-1 list-disc list-inside">
              <li>El enlace es público y cualquiera puede verlo</li>
              <li>La conversación se guarda de forma anónima</li>
              <li>No se comparte información personal</li>
              <li>Puedes revocar el acceso en cualquier momento</li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-surfaceHighlight hover:bg-border text-primary rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                handleShare();
                handleCopyLink();
              }}
              className="flex-1 py-3 bg-accent hover:opacity-90 text-white rounded-xl font-bold transition-all"
            >
              Copiar y Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;
