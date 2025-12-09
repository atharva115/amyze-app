import { GoogleGenAI } from "@google/genai";
import { ChatTopic, Message } from '../types';

const getClient = () => {
  // Check if API key is available
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateBiologicalName = async (): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Unknown Organism";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a single, creative, unique, and slightly funny biological or medical username. It should be 1 or 2 words max. Examples: 'Happy Neuron', 'Captain Mitosis', 'Dr. Amoeba', 'Vagus Nerve'. Return ONLY the name, no extra text.",
    });
    return response.text.trim().replace(/['"]/g, '');
  } catch (error) {
    console.error("Failed to generate name:", error);
    const fallbacks = ["Mystic Macrophage", "Dizzy Dendrite", "Quantum Quack", "Salty Synapse", "Happy Hormone"];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

export const getPeerReply = async (
  topic: ChatTopic,
  messages: Message[],
  peerName: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "...";

  // Convert last few messages to history for context
  const history = messages.slice(-5).map(m => `${m.senderName}: ${m.text}`).join('\n');

  const prompt = `
    You are roleplaying as a medical student named "${peerName}" in an anonymous chat room.
    The topic of the room is: "${topic}".
    
    Current conversation history:
    ${history}

    Respond to the last message as a peer. 
    Keep it casual, short (under 40 words), and relevant to the medical student lifestyle. 
    If the topic is Mental Health, be supportive but act like a student peer, not a robot.
    If the topic is Unserious, be funny or sarcastic.
    
    Return ONLY your reply text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Failed to generate reply:", error);
    return "Haha, totally.";
  }
};
