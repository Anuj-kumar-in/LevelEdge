import { api } from './api';

// Gemini API integration
export async function fetchGeminiInsights(prompt: string) {
  try {
    const result = await api.getAiInsights(prompt);
    return result;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return { response: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later." };
  }
}
