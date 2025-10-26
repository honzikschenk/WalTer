import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, projectContext } = await request.json();

    // Use the current model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build context from project details
    const contextPrompt = `You are an AI assistant helping with electronics/maker projects.

Project Details:
- Name: ${projectContext.name}
- Description: ${projectContext.description}
- Goals: ${projectContext.goals}
- Available Components: ${projectContext.components.join(', ')}

User Question: ${message}

Provide helpful, practical advice for completing this project using the available components. Be specific and technical when appropriate.`;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}