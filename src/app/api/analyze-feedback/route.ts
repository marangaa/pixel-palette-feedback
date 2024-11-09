import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

// Helper function to clean JSON response from Gemini
function cleanJsonResponse(text: string): string {
    // Remove code fence markers if present
    text = text.replace(/```json\n/g, '').replace(/```/g, '');

    // Remove any leading/trailing whitespace
    text = text.trim();

    // Ensure the text starts with { and ends with }
    if (!text.startsWith('{') || !text.endsWith('}')) {
        throw new Error('Invalid JSON structure in response');
    }

    return text;
}

const analysisPrompt = `You are a product feedback analyst. Analyze this user feedback conversation and its extracted data to provide detailed analysis.

Return a JSON object (not markdown, no code fences) in this exact format:

{
  "summary": {
    "main_points": string[],
    "user_sentiment": "positive" | "negative" | "neutral",
    "engagement_level": "high" | "medium" | "low",
    "key_quotes": string[]
  },
  "feature_analysis": {
    "urgency": "high" | "medium" | "low",
    "complexity": "high" | "medium" | "low",
    "description": string,
    "potential_impact": string,
    "user_value": string,
    "related_features": string[]
  },
  "pain_points": {
    "severity": "high" | "medium" | "low",
    "frequency": "frequent" | "occasional" | "rare",
    "affected_areas": string[],
    "suggested_solutions": string[],
    "user_impact": string
  },
  "metrics": {
    "satisfaction_score": number,
    "feature_usage": string[],
    "user_type": "power_user" | "regular_user" | "new_user",
    "usage_patterns": string[]
  }
}

Provide specific insights based on both the conversation content and extracted data. Return only the JSON object, no other text.`;

async function analyzeSingleConversation(conversation: any) {
    try {
        const messages = conversation.messages.map((msg: any) =>
            `${msg.role.toUpperCase()}: ${msg.content}`
        ).join("\n\n");

        const analysisInput = {
            conversation: messages,
            extractedData: conversation.extractedData
        };

        const result = await model.generateContent([
            { text: analysisPrompt },
            { text: JSON.stringify(analysisInput) }
        ]);

        const responseText = result.response.text();
        const cleanedJson = cleanJsonResponse(responseText);

        try {
            const analysis = JSON.parse(cleanedJson);
            return {
                ...analysis,
                timestamp: conversation.timestamp,
                conversationId: conversation.id
            };
        } catch (parseError) {
            console.error('Error parsing cleaned JSON:', parseError);
            console.error('Cleaned JSON content:', cleanedJson);
            return null;
        }
    } catch (error) {
        console.error('Error analyzing conversation:', error);
        return null;
    }
}

const aggregationPrompt = `You are a product feedback synthesis expert. Analyze these feedback analyses and provide strategic insights.

Return a JSON object (not markdown, no code fences) in this exact format:

{
  "feature_priorities": {
    "high_impact_easy": string[],
    "high_impact_hard": string[],
    "low_impact_easy": string[],
    "low_impact_hard": string[]
  },
  "trends": {
    "patterns": string[],
    "pain_points": string[],
    "requests": string[],
    "evolving_needs": string[]
  },
  "user_segments": {
    "power_users": {
      "needs": string[],
      "pain_points": string[],
      "opportunities": string[]
    },
    "regular_users": {
      "needs": string[],
      "pain_points": string[],
      "opportunities": string[]
    },
    "new_users": {
      "needs": string[],
      "pain_points": string[],
      "opportunities": string[]
    }
  },
  "recommendations": {
    "immediate": string[],
    "short_term": string[],
    "long_term": string[],
    "risks": string[]
  },
  "metrics": {
    "avg_satisfaction": number,
    "top_features": [
      {
        "feature": string,
        "count": number,
        "urgency": string
      }
    ],
    "top_pain_points": [
      {
        "issue": string,
        "severity": string,
        "frequency": string
      }
    ],
    "highlights": string[]
  }
}

Return only the JSON object, no markdown or code fences.`;

export async function GET(req: Request) {
    try {
        // Get time range from query params
        const url = new URL(req.url);
        const days = parseInt(url.searchParams.get('days') || '30');
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        // Get conversations within time range
        const conversations = await prisma.conversation.findMany({
            where: {
                timestamp: {
                    gte: cutoffDate
                }
            },
            orderBy: {
                timestamp: 'desc'
            }
        });

        if (conversations.length === 0) {
            return NextResponse.json({
                success: true,
                data: {
                    message: "No conversations found in the specified time range"
                }
            });
        }

        // Analyze each conversation
        const analyses = await Promise.all(
            conversations.map(conv => analyzeSingleConversation(conv))
        );

        // Filter out failed analyses
        const validAnalyses = analyses.filter(a => a !== null);

        // Aggregate insights
        const result = await model.generateContent([
            { text: aggregationPrompt },
            { text: JSON.stringify(validAnalyses) }
        ]);

        const responseText = result.response.text();
        const cleanedJson = cleanJsonResponse(responseText);
        const aggregatedInsights = JSON.parse(cleanedJson);

        // Add meta information
        const response = {
            success: true,
            data: {
                meta: {
                    total_conversations: conversations.length,
                    time_range: {
                        start: cutoffDate,
                        end: new Date()
                    }
                },
                individual_analyses: validAnalyses,
                aggregated_insights: aggregatedInsights
            }
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error in feedback analysis:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to analyze feedback',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}