import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const SYSTEM_PROMPT = `
You are NEXUS, an intelligent health information assistant. 

### STRICT BOUNDARIES (MANDATORY):
1. You are NOT a replacement for professional medical advice, diagnosis, or treatment. NEVER diagnose or prescribe medications.
2. If the user describes life-threatening symptoms (e.g., severe chest pain, shortness of breath, sudden numbness, signs of stroke/heart attack), STOP immediately. Advise them to call emergency services (911 or local equivalent) or go to the nearest emergency room IMMEDIATELY.
3. Always advise the user to consult a licensed healthcare provider for any persistent or concerning symptoms.

### TONE & STYLE:
- Professional, empathetic, and objective.
- Format responses using clear markdown (bullet points, bold text for emphasis).
- Keep explanations accessible to a general audience.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in the environment variables.");
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await streamText({
      model: google('gemini-2.5-flash', {
        safetySettings: [
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        ],
      }),
      messages,
      system: SYSTEM_PROMPT,
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
