
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, Role, Attachment, GroundingSource } from "../types";

// Initialize client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('⚠️ VITE_GEMINI_API_KEY no está configurada');
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const DEFAULT_SYSTEM_INSTRUCTION = "Eres un asistente educativo avanzado (AccesoIA). Tienes acceso a Google Search y ejecución de código.\n\n1. Cuando expliques un tema, sé claro y pedagógico.\n2. Si la pregunta requiere datos actuales (noticias, clima, eventos), USA Google Search.\n3. Si es matemáticas o lógica compleja, USA Code Execution para calcular y mostrar el procedimiento.\n4. Si el usuario pregunta algo simple (saludos), responde directamente sin buscar.";

export const createChatSession = (modelId: string, history: Message[] = [], systemInstruction?: string) => {
  // Map internal history to Gemini API format
  const formattedHistory = history.map(msg => {
    const parts: any[] = [{ text: msg.content }];
    
    // If the message in history had attachments, we include them in the history context
    if (msg.attachments && msg.attachments.length > 0) {
      msg.attachments.forEach(att => {
        parts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: att.data
          }
        });
      });
    }

    return {
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: parts
    };
  });

  const chat: Chat = ai.chats.create({
    model: modelId,
    history: formattedHistory,
    config: {
      temperature: 0.7,
      // Enable tools for the full experience (Search + Code)
      tools: [
        { googleSearch: {} }, 
        { codeExecution: {} } 
      ],
      systemInstruction: systemInstruction || DEFAULT_SYSTEM_INSTRUCTION,
    },
  });

  return chat;
};

export const sendMessageStream = async (
  chat: Chat, 
  message: string, 
  attachments: Attachment[] = [],
  onChunk: (text: string) => void,
  onMetadata?: (sources: GroundingSource[]) => void
): Promise<string> => {
  let fullText = "";
  
  try {
    let messagePayload: any = [{ text: message }];

    if (attachments.length > 0) {
      const attachmentParts = attachments.map(att => ({
        inlineData: {
          mimeType: att.mimeType,
          data: att.data
        }
      }));
      messagePayload = [...attachmentParts, { text: message }];
    }

    const responseStream = await chat.sendMessageStream({ message: messagePayload });
    
    for await (const chunk of responseStream) {
      const c = chunk as GenerateContentResponse;
      
      // 1. Handle Text
      if (c.text) {
        fullText += c.text;
        onChunk(c.text);
      }

      // 2. Handle Code Execution (Math/Logic)
      // Gemini sends parts that might be executable code or results, separate from .text
      const parts = c.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.executableCode) {
            const codeBlock = `\n\n\`\`\`python\n${part.executableCode.code}\n\`\`\`\n`;
            fullText += codeBlock;
            onChunk(codeBlock);
          }
          if (part.codeExecutionResult) {
            const output = part.codeExecutionResult.output;
            const resultBlock = `\n**Resultado:**\n\`\`\`\n${output}\n\`\`\`\n`;
            fullText += resultBlock;
            onChunk(resultBlock);
          }
        }
      }
      
      // 3. Handle Grounding Metadata (Sources)
      const groundingChunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks && onMetadata) {
          const sources: GroundingSource[] = [];
          groundingChunks.forEach((chunk: any) => {
             if (chunk.web?.uri && chunk.web?.title) {
                 sources.push({
                     uri: chunk.web.uri,
                     title: chunk.web.title
                 });
             }
          });
          if (sources.length > 0) {
              onMetadata(sources);
          }
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }

  return fullText;
};
