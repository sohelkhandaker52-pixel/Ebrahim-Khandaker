
import { GoogleGenAI } from "@google/genai";

export const sendMessageToAssistant = async (message: string) => {
  try {
    // Correct initialization: Always use new GoogleGenAI({apiKey: process.env.API_KEY})
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `You are 'EKS courier AI Assistant', a helpful assistant for a courier management system in Bangladesh. 
        You help users with shipping advice, address formatting, polite customer communication templates in Bengali, 
        and general logistics knowledge. Keep your tone professional, helpful, and predominantly in Bengali unless English is clearer.
        If asked about the system: it supports parcel tracking, balance calculation (1% charge), and Excel exports.`,
        temperature: 0.7,
      },
    });

    // Access the text property directly from the response
    return response.text || "Sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "দুঃখিত, বর্তমানে আমার সিস্টেমে সমস্যা হচ্ছে। দয়া করে পরে চেষ্টা করুন।";
  }
};
