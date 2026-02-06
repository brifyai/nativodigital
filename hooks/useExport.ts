/**
 * Custom hook para manejar la exportación de datos
 * Soporta exportación a JSON, Markdown y texto plano
 */

import { ChatSession, Role } from '../types';

interface UseExportReturn {
  handleExportData: (
    sessions: ChatSession[],
    onToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  ) => void;
  handleExportMarkdown: (
    currentSessionId: string | null,
    sessions: ChatSession[],
    onToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  ) => void;
  handleExportText: (
    currentSessionId: string | null,
    sessions: ChatSession[],
    onToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  ) => void;
}

export const useExport = (): UseExportReturn => {
  /**
   * Exporta todas las sesiones a JSON
   */
  const handleExportData = (
    sessions: ChatSession[],
    onToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  ) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `nativo_digital_historial_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    onToast('Historial exportado correctamente', 'success');
  };

  /**
   * Exporta la sesión actual a Markdown
   */
  const handleExportMarkdown = (
    currentSessionId: string | null,
    sessions: ChatSession[],
    onToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  ) => {
    if (!currentSessionId) {
      onToast('No hay conversación activa para exportar', 'warning');
      return;
    }
    
    const session = sessions.find(s => s.id === currentSessionId);
    if (!session) return;

    let markdown = `# ${session.title}\n\n`;
    markdown += `*Exportado el ${new Date().toLocaleString('es-ES')}*\n\n---\n\n`;

    session.messages.forEach(msg => {
      const role = msg.role === Role.USER ? '👤 **Usuario**' : '🤖 **Nativo Digital**';
      markdown += `### ${role}\n\n${msg.content}\n\n`;
      
      if (msg.groundingSources && msg.groundingSources.length > 0) {
        markdown += `**Fuentes:**\n`;
        msg.groundingSources.forEach(source => {
          markdown += `- [${source.title}](${source.uri})\n`;
        });
        markdown += `\n`;
      }
      
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast('Conversación exportada a Markdown', 'success');
  };

  /**
   * Exporta la sesión actual a texto plano
   */
  const handleExportText = (
    currentSessionId: string | null,
    sessions: ChatSession[],
    onToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  ) => {
    if (!currentSessionId) {
      onToast('No hay conversación activa para exportar', 'warning');
      return;
    }
    
    const session = sessions.find(s => s.id === currentSessionId);
    if (!session) return;

    let text = `${session.title}\n`;
    text += `Exportado el ${new Date().toLocaleString('es-ES')}\n`;
    text += `${'='.repeat(60)}\n\n`;

    session.messages.forEach(msg => {
      const role = msg.role === Role.USER ? 'USUARIO' : 'NATIVO DIGITAL';
      text += `[${role}]\n${msg.content}\n\n`;
      
      if (msg.groundingSources && msg.groundingSources.length > 0) {
        text += `Fuentes:\n`;
        msg.groundingSources.forEach(source => {
          text += `- ${source.title}: ${source.uri}\n`;
        });
        text += `\n`;
      }
      
      text += `${'-'.repeat(60)}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast('Conversación exportada a texto', 'success');
  };

  return {
    handleExportData,
    handleExportMarkdown,
    handleExportText
  };
};
