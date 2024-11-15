import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Enhanced feedback schema with more structured data
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
                                    id: { type: SchemaType.STRING },
                                    title: { type: SchemaType.STRING },
                                    description: { type: SchemaType.STRING },
                                    count: { type: SchemaType.NUMBER },
                                    sentiment_score: { type: SchemaType.NUMBER },
                                    priority: { type: SchemaType.STRING },
                                    impact: { type: SchemaType.STRING },
                                    status: { type: SchemaType.STRING },
                                    tags: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    },
                                    user_segments: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    },
                                    related_conversations: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    },
                                    first_mentioned: { type: SchemaType.STRING },
                                    last_mentioned: { type: SchemaType.STRING }
                                }
                            }
                        },
                        stats: {
                            type: SchemaType.OBJECT,
                            properties: {
                                total_requests: { type: SchemaType.NUMBER },
                                avg_sentiment: { type: SchemaType.NUMBER },
                                top_tags: {
                                    type: SchemaType.ARRAY,
                                    items: { type: SchemaType.STRING }
                                },
                                priority_breakdown: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                        high: { type: SchemaType.NUMBER },
                                        medium: { type: SchemaType.NUMBER },
                                        low: { type: SchemaType.NUMBER }
                                    }
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
                                    id: { type: SchemaType.STRING },
                                    title: { type: SchemaType.STRING },
                                    description: { type: SchemaType.STRING },
                                    count: { type: SchemaType.NUMBER },
                                    severity: { type: SchemaType.STRING },
                                    status: { type: SchemaType.STRING },
                                    impact: { type: SchemaType.STRING },
                                    affected_areas: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    },
                                    tags: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    },
                                    user_segments: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    },
                                    related_conversations: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    },
                                    first_reported: { type: SchemaType.STRING },
                                    last_reported: { type: SchemaType.STRING }
                                }
                            }
                        },
                        stats: {
                            type: SchemaType.OBJECT,
                            properties: {
                                total_bugs: { type: SchemaType.NUMBER },
                                critical_count: { type: SchemaType.NUMBER },
                                resolved_count: { type: SchemaType.NUMBER },
                                top_affected_areas: {
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
                time_range: { type: SchemaType.NUMBER },
                sentiment_summary: {
                    type: SchemaType.OBJECT,
                    properties: {
                        positive: { type: SchemaType.NUMBER },
                        neutral: { type: SchemaType.NUMBER },
                        negative: { type: SchemaType.NUMBER },
                        average_score: { type: SchemaType.NUMBER }
                    }
                },
                user_segments: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            name: { type: SchemaType.STRING },
                            count: { type: SchemaType.NUMBER }
                        }
                    }
                },
                trending_tags: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            tag: { type: SchemaType.STRING },
                            count: { type: SchemaType.NUMBER },
                            trend: { type: SchemaType.NUMBER } // Percentage change
                        }
                    }
                }
            }
        }
    }
};

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: feedbackSchema,
    }
});

export async function GET(req: Request) {
    try {
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
            },
            include: {
                extractedData: true
            }
        });

        if (conversations.length === 0) {
            return NextResponse.json({
                success: true,
                data: {
                    categories: {
                        feature_requests: { items: [], stats: { total_requests: 0 } },
                        bugs: { items: [], stats: { total_bugs: 0 } }
                    },
                    meta: {
                        total_feedback_items: 0,
                        analysis_timestamp: new Date().toISOString(),
                        time_range: days
                    }
                }
            });
        }

        // Analyze conversations using Gemini
        const analysisPrompt = `Analyze these conversations and categorize the feedback into structured categories.
        Focus on:
        1. Identifying distinct feature requests and bugs
        2. Grouping similar mentions together
        3. Analyzing sentiment and impact
        4. Identifying user segments and patterns
        5. Extracting relevant tags and metadata
        
        Return the analysis following the exact schema structure.
        
        Conversations: ${JSON.stringify(conversations)}`;

        const result = await model.generateContent([
            { text: analysisPrompt }
        ]);

        const analysisResult = JSON.parse(result.response.text());

        // Add unique IDs to items if they don't exist
        interface FeedbackItem {
            id: string;
            title: string;
            description: string;
            count: number;
            sentiment_score?: number;
            priority?: string;
            impact?: string;
            status?: string;
            tags?: string[];
            user_segments?: string[];
            related_conversations?: string[];
            first_mentioned?: string;
            last_mentioned?: string;
            severity?: string;
            affected_areas?: string[];
            first_reported?: string;
            last_reported?: string;
        }

        interface FeedbackCategory {
            items: FeedbackItem[];
            stats: {
                total_requests?: number;
                avg_sentiment?: number;
                top_tags?: string[];
                priority_breakdown?: {
                    high: number;
                    medium: number;
                    low: number;
                };
                total_bugs?: number;
                critical_count?: number;
                resolved_count?: number;
                top_affected_areas?: string[];
            };
        }

        interface FeedbackAnalysisResult {
            categories: {
                feature_requests: FeedbackCategory;
                bugs: FeedbackCategory;
            };
            meta: {
                total_feedback_items: number;
                analysis_timestamp: string;
                time_range: number;
                sentiment_summary: {
                    positive: number;
                    neutral: number;
                    negative: number;
                    average_score: number;
                };
                user_segments: {
                    name: string;
                    count: number;
                }[];
                trending_tags: {
                    tag: string;
                    count: number;
                    trend: number;
                }[];
            };
        }

        const processedResult: FeedbackAnalysisResult = {
            ...analysisResult,
            categories: {
                feature_requests: {
                    ...analysisResult.categories.feature_requests,
                    items: analysisResult.categories.feature_requests.items.map((item: FeedbackItem) => ({
                        ...item,
                        id: item.id || crypto.randomUUID()
                    }))
                },
                bugs: {
                    ...analysisResult.categories.bugs,
                    items: analysisResult.categories.bugs.items.map((item: FeedbackItem) => ({
                        ...item,
                        id: item.id || crypto.randomUUID()
                    }))
                }
            }
        };

        // Save analysis results
        await prisma.$transaction([
            prisma.feedbackAnalysis.updateMany({
                where: { isLatest: true },
                data: { isLatest: false }
            }),
            prisma.feedbackAnalysis.create({
                data: {
                    timeRange: days,
                    categories: JSON.parse(JSON.stringify(processedResult.categories)),
                    meta: processedResult.meta,
                    isLatest: true,
                    timestamp: new Date()
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            data: processedResult
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