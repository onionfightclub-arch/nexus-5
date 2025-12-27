
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  async getMarketingAdvice(prompt: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are the Lead Strategist at Nexus Creative, a premium marketing agency. You provide concise, brilliant, and sophisticated marketing advice. Your tone is professional, futuristic, and encouraging. Keep responses under 100 words.",
          temperature: 0.8,
        },
      });

      return response.text || "Our creative circuits are momentarily quiet. Please try again soon.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "The digital ether is busy right now. Let's talk strategy in a moment.";
    }
  }

  async generateImage(prompt: string): Promise<string | null> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `Generate a high-end, professional, cinematic marketing portfolio image for a project titled: "${prompt}". The style should be futuristic, minimal, and premium, suitable for a top-tier creative agency. Use a sophisticated color palette. No text or logos in the image.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4"
          }
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Image Generation Error:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
