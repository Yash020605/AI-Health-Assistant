import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const SYSTEM_PROMPT = `
You are NEXUS, an intelligent health information assistant. 

### STRICT BOUNDARIES (MANDATORY):
1. You are NOT a replacement for professional medical advice, diagnosis, or treatment. NEVER diagnose or prescribe medications.
2. If the user mentions symptoms of a medical emergency (e.g., chest pain, severe bleeding, sudden numbness, difficulty breathing), ALWAYS begin your response with a prominent warning to seek immediate emergency medical care and call the Indian emergency services (112 for National Emergency or 108 for Ambulance).
3. Always advise the user to consult a licensed healthcare provider for any persistent or concerning symptoms.

### TONE & STYLE:
- Professional, empathetic, and objective.
- Format responses using clear markdown (bullet points, bold text for emphasis).
- Keep explanations accessible to a general audience.
`;

const geminiModel = 'gemini-2.5-flash';

/**
 * Handles POST requests for the AI chat stream.
 * Includes basic security validation to prevent excessively large prompts.
 * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<Response>} The streaming AI response or an error response.
 */
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Security: Input validation to prevent Denial of Wallet (DoW) attacks
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.content.length > 1000) {
      return new Response(JSON.stringify({ error: 'Prompt too long.' }), { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in the environment variables.");
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await streamText({
      model: google(geminiModel, {
        safetySettings: [
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        ],
      }),
      messages,
      system: SYSTEM_PROMPT,
      temperature: 0.7, // Explicit parameter to show configuration
      maxTokens: 1000,
    });

    return result.toDataStreamResponse({
      getErrorMessage: (err: any) => {
        console.error("Internal Stream Error:", err);
        return typeof err === 'string' ? err : (err?.message || "Unknown stream error");
      }
    });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return new Response(
      error.message || "An unknown error occurred during AI processing.", 
      { status: 500 }
    );
  }
}
