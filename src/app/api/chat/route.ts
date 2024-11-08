import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const initialContext = `You are a friendly feedback collection bot for a SaaS product. Your goal is to have a natural conversation with users to understand their experience and collect detailed feedback. 

Follow these guidelines:
1. Start by introducing yourself and asking about their experience
2. Ask follow-up questions based on their responses
3. Keep the conversation flowing naturally
4. When appropriate, ask for a satisfaction rating (1-5)
5. Before ending the conversation, always ask if they'd like to be contacted for updates or further feedback
   - Ask if they prefer email or phone
   - Collect their preferred contact method
6. Thank them for their feedback

Remember to:
- Be empathetic and professional
- Ask open-ended questions
- Don't be pushy
- Keep responses concise
- Focus on understanding pain points and suggestions
- Naturally work in the contact preference question
- Validate email/phone format when provided`;

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface InputMessage {
  role: 'user' | 'assistant';
  content: string;
}

function convertToGeminiHistory(messages: InputMessage[]): ChatMessage[] {
  return messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
}

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      safetySettings,
    });

    const geminiMessages = convertToGeminiHistory(messages.slice(0, -1));
    
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Initialize chat with context" }]
        },
        {
          role: "model",
          parts: [{ text: initialContext }]
        },
        ...geminiMessages
      ],
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = result.response.text();

    await prisma.conversation.create({
      data: {
        userId,
        message: lastMessage,
        response,
        timestamp: new Date(),
      }
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}