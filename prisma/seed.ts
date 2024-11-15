const  PrismaClient = require("@prisma/client");
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ConversationData {
    userId: string;
    sessionId: string;
    messages: any[];
    extractedData: {
        satisfaction: number;
        pain_points: string[];
        feature_requests: string[];
        contact: { method: string; value: string } | null;
        sentiment: string;
        key_themes: string[];
    };
    analysis: {
        shouldEnd: boolean;
        reason: string;
        missingElements: string[];
        nextQuestion: string | null;
        collectedInfo: any;
    };
}

async function generateConversationData(count: number): Promise<ConversationData[]> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Generate ${count} realistic product feedback conversations for a SaaS task management tool. 
  Each conversation should include:
  1. User ID and session ID
  2. Array of messages between user and assistant
  3. Extracted data including satisfaction rating, pain points, feature requests
  4. Analysis of conversation completion
  Make it varied and realistic, with different sentiments and themes.
  Return as JSON array.`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
}

async function generateFeedbackAnalysis() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Generate a comprehensive feedback analysis for a SaaS task management tool.
  Include:
  1. Feature requests with detailed stats
  2. Bug reports with severity and status
  3. Improvement suggestions
  4. User segments and trending tags
  Make it realistic with varied priorities and impacts.
  Return as JSON matching the schema structure provided.`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
}

async function main() {
    try {
        console.log('Starting seed...');

        // Generate and save conversations with related data
        const conversations = await generateConversationData(10);

        for (const conv of conversations) {
            // Create conversation with all related data
            await prisma.conversation.create({
                data: {
                    userId: conv.userId,
                    sessionId: conv.sessionId,
                    messages: conv.messages,
                    extractedData: {
                        create: {
                            satisfaction: conv.extractedData.satisfaction,
                            painPoints: conv.extractedData.pain_points,
                            featureRequests: conv.extractedData.feature_requests,
                            contact: conv.extractedData.contact || "",
                            sentiment: conv.extractedData.sentiment,
                            keyThemes: conv.extractedData.key_themes
                        }
                    },
                    analysisResults: {
                        create: {
                            shouldEnd: conv.analysis.shouldEnd,
                            reason: conv.analysis.reason,
                            missingElements: conv.analysis.missingElements,
                            nextQuestion: conv.analysis.nextQuestion,
                            collectedInfo: conv.analysis.collectedInfo
                        }
                    }
                }
            });
        }

        // Generate and save feedback analysis
        const feedbackAnalysis = await generateFeedbackAnalysis();

        // Create feedback analysis records
        await prisma.feedbackAnalysis.create({
            data: {
                timeRange: 30,
                categories: feedbackAnalysis.categories,
                meta: feedbackAnalysis.meta,
                insights: feedbackAnalysis.insights || {},
                stats: feedbackAnalysis.stats || {},
                isLatest: true
            }
        });

        console.log('Seed completed successfully');
    } catch (error) {
        console.error('Error during seed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();