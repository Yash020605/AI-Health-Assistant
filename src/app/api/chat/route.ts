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

const geminiModel = 'gemini-3.6-flash';

/**
 * Handles POST requests for the AI chat stream.
 * Includes basic security validation to prevent excessively large prompts.
 * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<Response>} The streaming AI response or an error response.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // AI SDK v5 might send 'text' or 'parts' instead of 'content'
    const rawMessages = body.messages || [];
    const messages = rawMessages.map((m: any) => {
      let textContent = m.content || m.text || "";
      if (!textContent && m.parts && Array.isArray(m.parts)) {
        textContent = m.parts.map((p: any) => p.text || "").join("");
      }
      return {
        ...m,
        content: textContent,
      };
    });

    // Security: Input validation to prevent Denial of Wallet (DoW) attacks
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.content && lastMessage.content.length > 1000) {
        return new Response(JSON.stringify({ error: 'Prompt too long.' }), { status: 400 });
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in the environment variables.");
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = streamText({
      model: google(geminiModel),
      messages,
      system: SYSTEM_PROMPT,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("API Route Error:", error);
    return new Response(
      error.message || "An unknown error occurred during AI processing.", 
      { status: 500 }
    );
  }
}
