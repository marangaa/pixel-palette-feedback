import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const feedbackSchema = {
    type: SchemaType.OBJECT,
    properties: {
        categories: {
            type: SchemaType.OBJECT,
            properties: {
                feature_requests: {
                    type: SchemaType.OBJECT,
                    properties: {
                        items: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    title: { type: SchemaType.STRING },
                                    description: { type: SchemaType.STRING },
                                    count: { type: SchemaType.NUMBER },
                                    sentiment: { type: SchemaType.STRING },
                                    tags: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    },
                                    priority: { type: SchemaType.STRING },
                                    impact: { type: SchemaType.STRING }
                                }
                            }
                        },
                        stats: {
                            type: SchemaType.OBJECT,
                            properties: {
                                total_mentions: { type: SchemaType.NUMBER },
                                avg_sentiment: { type: SchemaType.NUMBER },
                                top_tags: {
                                    type: SchemaType.ARRAY,
                                    items: { type: SchemaType.STRING }
                                }
                            }
                        }
                    }
                },
                bugs: {
                    type: SchemaType.OBJECT,
                    properties: {
                        items: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    title: { type: SchemaType.STRING },
                                    description: { type: SchemaType.STRING },
                                    count: { type: SchemaType.NUMBER },
                                    severity: { type: SchemaType.STRING },
                                    status: { type: SchemaType.STRING },
                                    impact: { type: SchemaType.STRING },
                                    tags: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    }
                                }
                            }
                        },
                        stats: {
                            type: SchemaType.OBJECT,
                            properties: {
                                total_bugs: { type: SchemaType.NUMBER },
                                critical_count: { type: SchemaType.NUMBER },
                                top_affected_areas: {
                                    type: SchemaType.ARRAY,
                                    items: { type: SchemaType.STRING }
                                }
                            }
                        }
                    }
                },
                improvements: {
                    type: SchemaType.OBJECT,
                    properties: {
                        items: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    title: { type: SchemaType.STRING },
                                    description: { type: SchemaType.STRING },
                                    count: { type: SchemaType.NUMBER },
                                    type: { type: SchemaType.STRING },
                                    impact: { type: SchemaType.STRING },
                                    tags: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    }
                                }
                            }
                        },
                        stats: {
                            type: SchemaType.OBJECT,
                            properties: {
                                total_suggestions: { type: SchemaType.NUMBER },
                                top_areas: {
                                    type: SchemaType.ARRAY,
                                    items: { type: SchemaType.STRING }
                                }
                            }
                        }
                    }
                }
            }
        },
        meta: {
            type: SchemaType.OBJECT,
            properties: {
                total_feedback_items: { type: SchemaType.NUMBER },
                analysis_timestamp: { type: SchemaType.STRING },
                top_overall_tags: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                },
                sentiment_summary: {
                    type: SchemaType.OBJECT,
                    properties: {
                        positive: { type: SchemaType.NUMBER },
                        negative: { type: SchemaType.NUMBER },
                        neutral: { type: SchemaType.NUMBER }
                    }
                }
            }
        }
    }
};

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: feedbackSchema,
    }
});

const analysisPrompt = `You are a product feedback analyst. Analyze these conversations and categorize the feedback into distinct categories.
Consider the following aspects:
- Feature requests: New functionality users want
- Bugs: Issues and problems reported
- Improvements: Suggestions for existing features
- User sentiment and satisfaction
- Common patterns and trends

Analyze the input thoroughly and return the analysis following the specified JSON schema.`;

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const days = parseInt(url.searchParams.get('days') || '30');
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        // Check for existing analysis
        const existingAnalysis = await prisma.feedbackAnalysis.findFirst({
            where: {
                timeRange: days,
                isLatest: true,
                timestamp: {
                    gte: cutoffDate
                }
            },
            orderBy: {
                timestamp: 'desc'
            }
        });

        if (existingAnalysis) {
            return NextResponse.json({
                success: true,
                data: {
                    categories: existingAnalysis.categories,
                    insights: existingAnalysis.insights,
                    stats: existingAnalysis.stats,
                    meta: {
                        timestamp: existingAnalysis.timestamp,
                        timeRange: existingAnalysis.timeRange
                    }
                }
            });
        }

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

        // Analyze conversations using Gemini
        const result = await model.generateContent([
            { text: analysisPrompt },
            { text: JSON.stringify(conversations) }
        ]);

        const analysisResult = JSON.parse(result.response.text());

        // Save analysis results
        await prisma.$transaction([
            // Update previous latest analysis
            prisma.feedbackAnalysis.updateMany({
                where: { isLatest: true },
                data: { isLatest: false }
            }),
            // Create new analysis
            prisma.feedbackAnalysis.create({
                data: {
                    timeRange: days,
                    categories: analysisResult.categories,
                    insights: {}, // Add additional insights if needed
                    stats: analysisResult.meta,
                    meta: analysisResult.meta,
                    isLatest: true
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            data: analysisResult
        });

    } catch (error) {
        console.error('Error in feedback analysis:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to analyze feedback',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}