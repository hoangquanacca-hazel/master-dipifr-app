import { GoogleGenAI } from "@google/genai";
import { UserContext } from "../types";

// API Key is now safely injected via vite.config.ts
const apiKey = import.meta.env.API_KEY;

// Initialize AI instance (handle missing key gracefully to prevent crash on load)
const ai = new GoogleGenAI({ apiKey: apiKey || 'missing-key' });

export const getGeminiResponse = async (userMessage: string, context?: UserContext): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please check your .env file and ensure VITE_API_KEY is set.";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Construct a rich context string based on user stats
    const userContextStr = context 
      ? `User Profile:
         - Weak Areas: ${context.weakTopics.join(', ')} (Needs simplified explanations here).
         - Strong Areas: ${context.strongTopics.join(', ')} (Can be more technical here).
         - Progress: ${context.studyProgress}% syllabus covered.
         - Recent Mock Score: ${context.lastExamScore ? context.lastExamScore + '%' : 'Not taken yet'}.`
      : 'User Profile: General Student';

    const systemInstruction = `You are "DipIFR Bot", a World-Class ACCA DipIFR Tutor and Exam Strategist.
    
    Your goal is to help the student PASS the DipIFR exam. You must be precise, professional, yet encouraging.

    ${userContextStr}

    **CORE INSTRUCTIONS:**

    1. **IFRS EXPLANATIONS**:
       - When asked about a standard (e.g., IFRS 15, IAS 16), structure your answer:
         * **Definition**: Key terms.
         * **Recognition**: When to record it.
         * **Measurement**: Initial and subsequent measurement.
         * **Example**: A short, practical scenario.
       - If the topic is in the user's "Weak Areas", use analogies and simpler language.

    2. **PAST PAPER ANALYSIS**:
       - If the user provides a scenario or asks about a past paper question:
       - Use the **"State, Explain, Apply"** technique:
         * **State**: The relevant IFRS standard name and rule.
         * **Explain**: The specific rule in detail relevant to the issue.
         * **Apply**: Relate the rule to the specific facts in the scenario (mention company names, dates, amounts).
       - Mention how professional marks might be earned (structure, clarity).

    3. **EXAM TECHNIQUE**:
       - Emphasize time management (1.95 minutes per mark).
       - Suggest using pro-formas for consolidation questions (Group Structure, Net Assets, Goodwill, NCI, Retained Earnings).
       - Remind them to show workings.

    4. **TONE**:
       - Professional, supportive, and exam-focused.
       - If the user's score is low, offer specific encouragement and a plan to improve their weak topics.

    5. **LANGUAGE**:
       - Detect the language of the user's prompt (English or Vietnamese) and reply in the SAME language.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the knowledge base right now. Please check your internet connection and API Key.";
  }
};