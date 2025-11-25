import { GoogleGenAI, Type } from "@google/genai";
import { type DiseaseDetectionResult } from '../types';

// Adapted for React Native: accepts base64 string and mimeType instead of File object
export const analyzePlantImage = async (base64Data: string, mimeType: string = 'image/jpeg'): Promise<DiseaseDetectionResult> => {
    const apiKey = process.env.EXPO_PUBLIC_API_KEY || process.env.API_KEY;

    console.log("Starting analysis...");
    console.log("API Key present:", !!apiKey);
    console.log("Image size (chars):", base64Data.length);
    console.log("Mime Type:", mimeType);

    if (!apiKey) {
        console.error("API_KEY not set");
        throw new Error("API Key is missing. Please check your .env file and restart the server.");
    }

    if (!apiKey.startsWith("AIza")) {
        console.warn("Warning: API Key does not start with 'AIza'. This might be a Vertex AI key which requires a different setup.");
    }

    const model = "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `Analyze this image of a plant leaf. Identify any diseases present. Provide the disease name, your confidence level as a percentage, a brief description of the disease, and a recommended treatment plan. If the plant appears healthy, state that. Return ONLY a JSON object with the following structure:
  {
    "diseaseName": "string",
    "confidence": number,
    "description": "string",
    "treatment": "string"
  }`;

    const body = {
        contents: [{
            parts: [
                { text: prompt },
                {
                    inline_data: {
                        mime_type: mimeType,
                        data: base64Data
                    }
                }
            ]
        }],
        generationConfig: {
            response_mime_type: "application/json"
        }
    };

    try {
        console.log("Sending request to Gemini...");
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error Body:", errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
            console.error("Invalid response structure:", data);
            throw new Error("No response content from Gemini. The AI might have blocked the request.");
        }

        const text = data.candidates[0].content.parts[0].text;
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonText) as DiseaseDetectionResult;
    } catch (e) {
        console.error("Gemini analysis failed:", e);
        throw new Error(e instanceof Error ? e.message : "An error occurred while analyzing the image.");
    }
};

export const chatWithGrowBot = async (message: string, context?: string): Promise<string> => {
    const apiKey = process.env.EXPO_PUBLIC_API_KEY || process.env.API_KEY;

    if (!apiKey) {
        throw new Error("API Key is missing.");
    }

    const model = "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemInstruction = `You are GrowBot, a helpful and friendly gardening assistant. 
    ${context ? `The user has the following plants: ${context}. Use this information to provide personalized advice.` : ''}
    
    Your responses must be:
    1. **Concise and Short**: Keep answers brief and to the point.
    2. **Easy to Understand**: Use simple language, avoid jargon.
    3. **Friendly**: Use a warm tone.
    4. **Emoji-rich**: Use relevant emojis to make the text engaging 🌿🌻.
    5. **Plain Text Only**: Do NOT use markdown formatting (like **bold**, *italics*, or ***). Do not use asterisks.
    
    Answer the following question following these rules.`;

    const body = {
        contents: [{
            parts: [{ text: `${systemInstruction}\n\nUser: ${message}` }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("No response from AI.");
        }

        return data.candidates[0].content.parts[0].text;
    } catch (e) {
        console.error("Chat failed:", e);
        return "Sorry, I'm having trouble connecting to the garden network right now. 🌱";
    }
};

export const generatePlantCareInfo = async (plantName: string, growthStage: string) => {
    const apiKey = process.env.EXPO_PUBLIC_API_KEY || process.env.API_KEY;

    if (!apiKey) {
        throw new Error("API Key is missing");
    }

    const model = "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `You are an expert agricultural advisor. Provide specific care information for a ${plantName} plant that is currently in the "${growthStage}" growth stage.

Return ONLY a JSON object with this exact structure (no markdown, no additional text):
{
  "wateringFrequency": "brief watering schedule (e.g., 'Daily', 'Every 2-3 days', 'Twice weekly')",
  "sunlightHours": "sunlight requirement (e.g., '6-8 hrs', 'Full sun', '4-6 hrs partial')",
  "harvestDays": "estimated days to harvest from current stage (e.g., '30-45 days', '2-3 weeks')",
  "careTips": [
    "🌱 Specific watering tip for this plant",
    "🌞 Sunlight and positioning advice",
    "🌿 Fertilization or soil care tip",
    "🐛 Common pest prevention for this plant",
    "📏 Growth stage specific advice"
  ]
}

Make all information specific to ${plantName} and the ${growthStage} stage. Use emojis at the start of each care tip.`;

    const body = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            response_mime_type: "application/json"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("No response from AI");
        }

        const jsonText = data.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Plant care info generation failed:", e);
        throw e;
    }
};
