// app/api/roadmap/create/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        // 1. Get latest feedback analysis
        const feedbackAnalysis = await prisma.feedbackAnalysis.findFirst({
            where: { isLatest: true },
            orderBy: { timestamp: 'desc' }
        });

        if (!feedbackAnalysis) {
            throw new Error('No feedback analysis found');
        }

        // 2. Generate roadmap using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const systemPrompt = `Create a strategic product roadmap based on customer feedback and business goals.

Key Information:
${JSON.stringify(feedbackAnalysis.categories, null, 2)}

Key Statistics:
${JSON.stringify(feedbackAnalysis.stats, null, 2)}

Create a structured JSON response with:
1. Main development track items
2. Alternative approaches where relevant
3. Clear prioritization
4. Resource allocation
5. Dependencies

Format:
{
  "mainTrack": [{
    "title": string,
    "description": string,
    "type": "feature" | "bug" | "improvement",
    "priority": "critical" | "high" | "medium" | "low",
    "timeframe": "current" | "next" | "future",
    "effort": number,
    "customerDemand": number,
    "assignedTeam": string
  }],
  "alternatives": [{
    "title": string,
    "description": string,
    "probability": number,
    "items": [/* same structure as main track */]
  }]
}`;

        const result = await model.generateContent(systemPrompt);
        let roadmapStructure;

        try {
            const cleanedText = result.response.text()
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            roadmapStructure = JSON.parse(cleanedText);
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            throw new Error('Failed to generate roadmap structure');
        }

        // 3. Create roadmap in database
        const roadmap = await prisma.roadmap.create({
            data: {
                name: "Integrated Roadmap 2024",
                description: "Generated from customer feedback and business goals",
                version: "1.0",
                isActive: true,
                constraints: {
                    maxParallelItems: 5,
                    resourceCap: 100,
                    priorityThresholds: {
                        critical: 90,
                        high: 70,
                        medium: 40,
                        low: 0
                    }
                },
                branches: {
                    create: [
                        {
                            type: 'main',
                            title: 'Main Development Track',
                            description: 'Primary development path',
                            probability: 100,
                            items: {
                                create: roadmapStructure.mainTrack.map((item: any) => ({
                                    type: item.type,
                                    title: item.title,
                                    description: item.description,
                                    timeframe: item.timeframe,
                                    priority: item.priority,
                                    status: 'planned',
                                    effort: item.effort,
                                    assignedTeam: item.assignedTeam,
                                    feedback: {
                                        create: {
                                            requestCount: item.customerDemand || 0,
                                            avgSentiment: 0.7,
                                            userSegments: ['All Users'],
                                            keyThemes: [item.type]
                                        }
                                    }
                                }))
                            }
                        },
                        ...(roadmapStructure.alternatives || []).map((branch: any) => ({
                            type: 'alternative',
                            title: branch.title,
                            description: branch.description,
                            probability: branch.probability,
                            items: {
                                create: (branch.items || []).map((item: any) => ({
                                    type: item.type,
                                    title: item.title,
                                    description: item.description,
                                    timeframe: item.timeframe || 'future',
                                    priority: item.priority || 'medium',
                                    status: 'planned',
                                    effort: item.effort,
                                    assignedTeam: item.assignedTeam
                                }))
                            }
                        }))
                    ]
                }
            },
            include: {
                branches: {
                    include: {
                        items: {
                            include: {
                                milestones: true,
                                analysis: true,
                                feedback: true,
                                resources: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: roadmap
        });

    } catch (error) {
        console.error('Error creating roadmap:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create roadmap',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}