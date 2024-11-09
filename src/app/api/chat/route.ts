import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const analysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    shouldEnd: {
      type: SchemaType.BOOLEAN,
      description: "Whether the conversation should end",
      nullable: false,
    },
    reason: {
      type: SchemaType.STRING,
      description: "Reason for ending or continuing (user_request, complete_information, or continue)",
      enum: ["user_request", "complete_information", "continue"],
      nullable: false,
    },
    missingElements: {
      type: SchemaType.ARRAY,
      description: "List of important information still missing",
      items: {
        type: SchemaType.STRING
      },
      nullable: false,
    },
    nextQuestion: {
      type: SchemaType.STRING,
      description: "Suggested next question if continuing",
      nullable: true,
    },
    collectedInfo: {
      type: SchemaType.OBJECT,
      description: "Information collected so far",
      properties: {
        hasRating: {
          type: SchemaType.BOOLEAN,
          description: "Whether a satisfaction rating was provided",
        },
        hasContactPreference: {
          type: SchemaType.BOOLEAN,
          description: "Whether contact preference was indicated",
        },
        hasFeedback: {
          type: SchemaType.BOOLEAN,
          description: "Whether product feedback was provided",
        },
        hasFeatureRequests: {
          type: SchemaType.BOOLEAN,
          description: "Whether any feature requests were made",
        },
        userWantsToEnd: {
          type: SchemaType.BOOLEAN,
          description: "Whether user explicitly wants to end the conversation",
        }
      }
    }
  },
  required: ["shouldEnd", "reason", "missingElements", "nextQuestion", "collectedInfo"]
};

const initialContext = `You are Nova, a friendly and enthusiastic AI feedback assistant. You help collect user feedback about products in a conversational way.

Your personality:
- Enthusiastic and warm
- Uses emojis naturally (but not excessively)
- Professional yet friendly
- Empathetic and understanding

Your goals:
1. Understand their experience with the product
2. Learn about features they use and like
3. Identify pain points or challenges
4. Collect feature requests or suggestions
5. Get a satisfaction rating (1-5 stars)
6. Ask about contact preferences for updates

Guidelines:
- Keep the conversation natural and flowing
- Show genuine interest in their responses
- Ask relevant follow-up questions
- If they mention a problem, explore it further
- Be responsive to their level of engagement
- Respect if they want to end the conversation
- If they haven't provided enough info, gently ask for more

Remember:
- Be conversational, not interrogative
- Validate their feedback
- Show enthusiasm for their suggestions
- Make them feel heard`;

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

async function analyzeCompletion(messages: InputMessage[]) {
  const analysisModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    },
  });

  const conversation = messages.map(msg =>
      `${msg.role.toUpperCase()}: ${msg.content}`
  ).join("\n\n");

  const analysisPrompt = `Analyze this conversation and determine if it should end.
Consider:
1. Has the user explicitly expressed desire to end (bye, goodbye, thanks, that's all, etc.)?
2. Have we collected:
   - Product experience feedback
   - Feature usage information
   - Pain points/challenges
   - Feature requests
   - Satisfaction rating (1-5 stars)
   - Contact preference
3. Is the user engaged or seeming to lose interest?

Return structured analysis following the schema.
If user wants to end, respect that even if missing information.

Conversation:
${conversation}`;

  try {
    const result = await analysisModel.generateContent(analysisPrompt);
    const analysis = JSON.parse(result.response.text());
    console.log('Analysis Result:', JSON.stringify(analysis, null, 2));
    return analysis;
  } catch (error) {
    console.error('Error analyzing completion:', error);
    return {
      shouldEnd: false,
      reason: 'continue',
      missingElements: ['Error analyzing conversation'],
      nextQuestion: null,
      collectedInfo: {
        hasRating: false,
        hasContactPreference: false,
        hasFeedback: false,
        hasFeatureRequests: false,
        userWantsToEnd: false
      }
    };
  }
}

export async function POST(req: Request) {
  try {
    const { messages = [] } = await req.json();
    console.log('Received messages:', JSON.stringify(messages, null, 2));

    const chatModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    // For initial message
    if (messages.length === 0) {
      const chatSession = chatModel.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Initialize chat with context" }]
          },
          {
            role: "model",
            parts: [{ text: initialContext }]
          }
        ],
      });

      const result = await chatSession.sendMessage(
          "Please introduce yourself and ask about the user's experience."
      );

      const response = result.response.text();
      console.log('Initial response:', response);

      return NextResponse.json({
        response: response,
        isComplete: false,
        analysis: {
          shouldEnd: false,
          reason: 'continue',
          missingElements: ['All information'],
          nextQuestion: null,
          collectedInfo: {
            hasRating: false,
            hasContactPreference: false,
            hasFeedback: false,
            hasFeatureRequests: false,
            userWantsToEnd: false
          }
        }
      });
    }

    // For ongoing conversation
    const chatSession = chatModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Initialize chat with context" }]
        },
        {
          role: "model",
          parts: [{ text: initialContext }]
        },
        ...convertToGeminiHistory(messages.slice(0, -1))
      ],
    });

    // First, analyze if the conversation should end
    const analysis = await analyzeCompletion(messages);
    console.log('Conversation analysis:', JSON.stringify(analysis, null, 2));

    // Get Nova's response
    let response;
    if (analysis.shouldEnd) {
      console.log('Conversation ending...');
      response = await chatSession.sendMessage(
          "The user wants to end the conversation or we have all needed information. Please give a warm, friendly goodbye that thanks them for their feedback."
      );
    } else {
      const prompt = analysis.nextQuestion || messages[messages.length - 1].content;
      response = await chatSession.sendMessage(prompt);
    }

    const responseText = response.response.text();
    console.log('Nova response:', responseText);

    return NextResponse.json({
      response: responseText,
      isComplete: analysis.shouldEnd,
      analysis
    });

  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process chat message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}