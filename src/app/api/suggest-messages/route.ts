import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';


if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing in .env file");
}

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Static prompt
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by ||. These questions are for an anonymous social messaging platform like qooh.me, and should target a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. Example format: What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy? Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    const result = await streamText({
      model: openai('gpt-3.5-turbo-instruct'), 
      messages: [{ role: 'user', content: prompt }],
    });
    return result.toDataStreamResponse();

  } catch (error: any) {
    // Error handling
    if (error.name === 'APIError') {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, headers, status, message }, { status });
    } else {
      console.error("An unexpected error:", error);
      return NextResponse.json({
        success: false,
        message: "Internal server error",
      }, { status: 500 });
    }
  }
}
