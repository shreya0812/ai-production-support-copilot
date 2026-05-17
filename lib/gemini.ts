import { GoogleGenAI } from "@google/genai";

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable.");
}

const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
});

export async function createEmbedding(text: string): Promise<number[]> {
  const cleanedText = text.trim();

  if (!cleanedText) {
    throw new Error("Cannot create embedding for empty text.");
  }

  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: cleanedText,
    config: {
      outputDimensionality: 768,
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding || embedding.length === 0) {
    throw new Error("Gemini did not return an embedding.");
  }

  return embedding;
}