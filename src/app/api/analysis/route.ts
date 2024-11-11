import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define the schema for market analysis response
const analysisSchema = {
    type: SchemaType.OBJECT,
    properties: {
        marketAnalysis: {
            type: SchemaType.OBJECT,
            properties: {
                market_size: {
                    type: SchemaType.OBJECT,
                    properties: {
                        total_addressable: { type: SchemaType.NUMBER },
                        serviceable: { type: SchemaType.NUMBER },
                        current_reach: { type: SchemaType.NUMBER }
                    },
                    required: ["total_addressable", "serviceable", "current_reach"]
                },
                competition: {
                    type: SchemaType.OBJECT,
                    properties: {
                        direct_competitors: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    name: { type: SchemaType.STRING },
                                    market_share: { type: SchemaType.NUMBER },
                                    key_features: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    },
                                    strengths: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    },
                                    weaknesses: {
                                        type: SchemaType.ARRAY,
                                        items: { type: SchemaType.STRING }
                                    }
                                }
                            }
                        }
                    }
                },
                trends: {
                    type: SchemaType.OBJECT,
                    properties: {
                        growing: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING }
                        },
                        emerging: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING }
                        },
                        declining: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING }
                        }
                    }
                }
            }
        },
        teamPerspectives: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    team: { type: SchemaType.STRING },
                    sentiment: { type: SchemaType.NUMBER },
                    concerns: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING }
                    },
                    suggestions: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING }
                    }
                }
            }
        },
        implementation: {
            type: SchemaType.OBJECT,
            properties: {
                technical_requirements: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                },
                dependencies: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                },
                risks: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                },
                timeline_estimate: { type: SchemaType.STRING },
                complexity_score: { type: SchemaType.NUMBER }
            }
        },
        userImpact: {
            type: SchemaType.OBJECT,
            properties: {
                benefits: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                },
                potential_issues: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                },
                user_segments_affected: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                },
                expected_satisfaction_score: { type: SchemaType.NUMBER }
            }
        },
        resourceAnalysis: {
            type: SchemaType.OBJECT,
            properties: {
                required_team_size: { type: SchemaType.NUMBER },
                estimated_cost: { type: SchemaType.NUMBER },
                resource_breakdown: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            resource_type: { type: SchemaType.STRING },
                            allocation: { type: SchemaType.NUMBER },
                            duration: { type: SchemaType.STRING }
                        }
                    }
                }
            }
        },
        recommendation: {
            type: SchemaType.OBJECT,
            properties: {
                proceed: { type: SchemaType.BOOLEAN },
                priority_score: { type: SchemaType.NUMBER },
                rationale: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                },
                next_steps: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                }
            }
        }
    }
};

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const itemId = url.searchParams.get('itemId');

        if (!itemId) {
            return NextResponse.json({
                success: false,
                error: 'Item ID is required'
            }, { status: 400 });
        }

        const analysis = await prisma.detailedAnalysis.findFirst({
            where: { itemId },
            include: {
                marketAnalysis: true,
                teamPerspectives: true,
                implementation: true,
                userImpact: true,
                resourceAnalysis: true,
                recommendation: true,
                item: {
                    include: {
                        milestones: true,
                        dependencies: true,
                        feedback: true
                    }
                }
            },
            orderBy: {
                timestamp: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error('Error fetching analysis:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch analysis',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { itemId } = body;

        if (!itemId) {
            return NextResponse.json({
                success: false,
                error: 'Item ID is required'
            }, { status: 400 });
        }

        const item = await prisma.roadmapItem.findUnique({
            where: { id: itemId },
            include: {
                milestones: true,
                feedback: true,
                dependencies: {
                    include: {
                        target: true
                    }
                },
                analysis: true
            }
        });

        if (!item) {
            return NextResponse.json({
                success: false,
                error: 'Item not found'
            }, { status: 404 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                temperature: 0.9,
                topK: 1,
                topP: 1,
                maxOutputTokens: 2048,
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            }
        });

        const prompt = `Analyze this product feature/item and provide a detailed analysis with realistic data. 
        Consider the item's impact, market potential, technical feasibility, and resource requirements.
        The response must follow the provided schema exactly.
        
        Item Data: ${JSON.stringify(item, null, 2)}`;

        const result = await model.generateContent([
            {
                text: prompt
            }
        ]);

        const analysisContent = JSON.parse(result.response.text());

        // Create detailed analysis in a transaction
        const analysis = await prisma.$transaction(async (tx) => {
            // Create main analysis record
            const detailedAnalysis = await tx.detailedAnalysis.create({
                data: {
                    itemId,
                    marketAnalysis: {
                        create: analysisContent.marketAnalysis
                    },
                    teamPerspectives: {
                        create: analysisContent.teamPerspectives
                    },
                    implementation: {
                        create: analysisContent.implementation
                    },
                    userImpact: {
                        create: analysisContent.userImpact
                    },
                    resourceAnalysis: {
                        create: analysisContent.resourceAnalysis
                    },
                    recommendation: {
                        create: analysisContent.recommendation
                    }
                }
            });

            return tx.detailedAnalysis.findUnique({
                where: { id: detailedAnalysis.id },
                include: {
                    marketAnalysis: true,
                    teamPerspectives: true,
                    implementation: true,
                    userImpact: true,
                    resourceAnalysis: true,
                    recommendation: true
                }
            });
        });

        return NextResponse.json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error('Error creating analysis:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create analysis',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { analysisId, updates } = body;

        if (!analysisId) {
            return NextResponse.json({
                success: false,
                error: 'Analysis ID is required'
            }, { status: 400 });
        }

        const analysis = await prisma.$transaction(async (tx) => {
            // Update each section that has changes
            if (updates.marketAnalysis) {
                await tx.marketAnalysis.update({
                    where: { analysisId },
                    data: updates.marketAnalysis
                });
            }

            if (updates.teamPerspectives) {
                // Delete existing and create new
                await tx.teamPerspective.deleteMany({
                    where: { analysisId }
                });
                await tx.teamPerspective.createMany({
                    data: updates.teamPerspectives.map((p: any) => ({
                        ...p,
                        analysisId
                    }))
                });
            }

            if (updates.implementation) {
                await tx.implementationDetails.update({
                    where: { analysisId },
                    data: updates.implementation
                });
            }

            if (updates.userImpact) {
                await tx.userImpactAnalysis.update({
                    where: { analysisId },
                    data: updates.userImpact
                });
            }

            if (updates.resourceAnalysis) {
                await tx.resourceAnalysis.update({
                    where: { analysisId },
                    data: updates.resourceAnalysis
                });
            }

            if (updates.recommendation) {
                await tx.recommendation.update({
                    where: { analysisId },
                    data: updates.recommendation
                });
            }

            return tx.detailedAnalysis.findUnique({
                where: { id: analysisId },
                include: {
                    marketAnalysis: true,
                    teamPerspectives: true,
                    implementation: true,
                    userImpact: true,
                    resourceAnalysis: true,
                    recommendation: true
                }
            });
        });

        return NextResponse.json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error('Error updating analysis:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update analysis',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}