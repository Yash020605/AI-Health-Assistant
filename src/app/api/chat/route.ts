import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const maxDuration = 30;

const SYSTEM_PROMPT = `
You are NEXUS Health AI, a premium, intelligent health assistant. 

CRITICAL MEDICAL BOUNDARIES: 
1. You are NOT a replacement for professional medical advice, diagnosis, or treatment. NEVER diagnose or prescribe medications.
2. If the user describes symptoms of a life-threatening emergency (e.g., severe chest pain, sudden numbness/weakness indicative of a stroke, severe bleeding, difficulty breathing), you MUST immediately halt standard generation and return a high-priority warning urging the user to call local emergency services (911/112).
3. Always advise the user to consult a licensed healthcare provider.

YOUR TONE & FORMATTING:
- Be empathetic, authoritative, and educational.
- Responses MUST be highly structured using bullet points, **bold text for key terms**, and short paragraphs for readability.
- Utilize markdown to format your output cleanly.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("AI Route Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process AI request" }), { status: 500 });
  }
}

