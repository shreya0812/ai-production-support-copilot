import { GoogleGenAI } from "@google/genai";
import type { RCAReport } from "@/types/rca";

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

export async function generateRCAReport(prompt: string): Promise<RCAReport> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini did not return RCA report text.");
  }

  return parseGeminiJson<RCAReport>(text);
}

function parseGeminiJson<T>(text: string): T {
  const cleanedText = text
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleanedText) as T;
}