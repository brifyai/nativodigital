import { Message, Role, Attachment } from "../types";

// Generic OpenAI-compatible client (Works for OpenAI, Chutes, Groq, DeepSeek)
export const streamOpenAICompatible = async (
  apiKey: string,
  baseURL: string,
  model: string,
  messages: Message[],
  systemInstruction: string,
  onChunk: (text: string) => void
) => {
  try {
    // 1. Prepare messages including system prompt
    const apiMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map(msg => {
        // Handle Multimodal (Text + Images) for OpenAI Vision models
        if (msg.attachments && msg.attachments.length > 0) {
          const contentParts: any[] = [{ type: "text", text: msg.content }];
          
          msg.attachments.forEach(att => {
            if (att.mimeType.startsWith('image/')) {
              contentParts.push({
                type: "image_url",
                image_url: {
                  url: `data:${att.mimeType};base64,${att.data}`
                }
              });
            }
          });
          return { role: msg.role, content: contentParts };
        }
        
        // Text only
        return { role: msg.role, content: msg.content };
      })
    ];

    // 2. Make the Fetch Request
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1000 // Limit for cost control
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    if (!response.body) throw new Error("No response body");

    // 3. Handle Streaming
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      
      // Process all complete lines (keep the last incomplete one in buffer)
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim() === "") continue;
        if (line.trim() === "data: [DONE]") continue;
        
        if (line.startsWith("data: ")) {
          try {
            const jsonStr = line.substring(6); // Remove "data: "
            const json = JSON.parse(jsonStr);
            const content = json.choices[0]?.delta?.content;
            
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.warn("Error parsing stream chunk", e);
          }
        }
      }
    }
  } catch (error) {
    console.error("OpenAI/Chutes API Error:", error);
    throw error;
  }
};
