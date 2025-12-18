import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CVData } from "../types";

/**
 * Professional rewrite of resume bullet points or descriptions
 */
export const enhanceText = async (text: string, context?: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are an expert career coach and resume writer.
      Rewrite the following text to be more professional, action-oriented, and impactful for a resume.
      Keep it concise and result-driven. Do not add conversational filler.
      
      Original text: "${text}"
      ${context ? `Context: ${context}` : ''}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini Service Error (enhanceText):", error);
    throw error;
  }
};

/**
 * Generates a professional summary based on profile data
 */
export const generateSummary = async (jobTitle: string, skills: string[], experience: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Write a professional resume summary (max 3-4 sentences) for a ${jobTitle}.
      Highlight these skills: ${skills.join(', ')}.
      Brief experience context: ${experience}.
      The tone should be professional and confident.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Service Error (generateSummary):", error);
    throw error;
  }
};

/**
 * Suggests keywords and skills for a specific job title
 */
export const suggestSkills = async (jobTitle: string): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `List 5-7 key technical and soft skills for a ${jobTitle}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Gemini Service Error (suggestSkills):", error);
    return [];
  }
};

/**
 * Compares CV against a job description for ATS optimization
 */
export const analyzeJobMatch = async (cvText: string, jobDescription: string): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are an ATS (Applicant Tracking System) and Career Expert.
      Analyze the provided CV Content against the Job Description.
      
      Job Description: "${jobDescription.slice(0, 2000)}"
      CV Content: "${cvText.slice(0, 2000)}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: 'Compatibility score from 0 to 100',
            },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Top 5 missing critical keywords',
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 specific actionable tips',
            },
          },
          required: ['score', 'missingKeywords', 'improvements'],
        },
      },
    });

    const text = response.text;
    return text ? JSON.parse(text) : { score: 0, missingKeywords: [], improvements: [] };
  } catch (error) {
    console.error("Gemini Service Error (analyzeJobMatch):", error);
    throw error;
  }
};

/**
 * Rewrites CV components to better match a specific job description
 */
export const tailorCV = async (currentData: CVData, jobDescription: string): Promise<{ summary: string; experience: { id: string; description: string }[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const simplifiedExperience = currentData.experience.map(e => ({ 
    id: e.id, 
    role: e.role, 
    company: e.company, 
    description: e.description 
  }));

  try {
    const prompt = `
      You are a Resume Writer Expert. Tailor the CV content to match the Job Description.
      1. Rewrite the summary to align with the job's tone and requirements.
      2. Rewrite each experience entry description to emphasize relevant skills.
      
      Job Description: "${jobDescription.slice(0, 1500)}"
      Current CV Data: ${JSON.stringify({ 
        summary: currentData.personalInfo.summary, 
        experience: simplifiedExperience 
      })}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'The tailored professional summary',
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['id', 'description'],
              },
            },
          },
          required: ['summary', 'experience'],
        },
      },
    });

    const text = response.text;
    return text ? JSON.parse(text) : { summary: currentData.personalInfo.summary, experience: [] };
  } catch (error) {
    console.error("Gemini Service Error (tailorCV):", error);
    throw error;
  }
};