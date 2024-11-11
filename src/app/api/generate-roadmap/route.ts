import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
export async function POST(req: Request) {
    try {
        // First, get the latest feedback analysis
        const feedbackAnalysis = await prisma.feedbackAnalysis.findFirst({
            where: {
                isLatest: true
            },
            orderBy: {
                timestamp: 'desc'
            }
        });

        if (!feedbackAnalysis) {
            throw new Error('No feedback analysis found. Please analyze customer feedback first.');
        }

        const { companyContext } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 8192,
            }
        });

        // Create an integrated prompt that considers both company plans and customer feedback
        const prompt = `As a strategic product consultant, create an integrated product roadmap that combines company strategy with customer feedback analysis.

        Customer Feedback Analysis:
        ${JSON.stringify(feedbackAnalysis.categories, null, 2)}

        Company Context:
        ${JSON.stringify(companyContext, null, 2)}

        Create a roadmap that:
        1. Prioritizes highly requested features from customers
        2. Addresses critical issues and bugs
        3. Aligns with company strategic goals
        4. Balances quick wins with long-term initiatives

        Include both company-planned features and customer-requested features.
        Categorize items appropriately (feature, bug, improvement).
        Set priorities based on both business value and customer demand.

        Return a JSON that combines both sources:
        {
          "mainBranch": [
            {
              "title": "string",
              "description": "string",
              "type": "feature|bug|improvement",
              "timeframe": "current|next|future",
              "priority": "critical|high|medium|low",
              "source": "company_planned|customer_feedback",
              "customerDemand": number, // 0-100
              "effort": number,
              "assignedTeam": "string",
              "milestones": [...],
              "analysis": {
                "feasibility": number,
                "impact": number,
                "risk": number,
                "resources": {
                  "required": number,
                  "available": number
                }
              }
            }
          ],
          "alternativeBranches": [...]
        }`;

        const result = await model.generateContent([{ text: prompt }]);
        let roadmapData;

        try {
            const cleanedText = result.response.text()
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
            roadmapData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            throw new Error('Failed to parse AI response');
        }

        // Process feature requests from feedback
        const featureRequests = feedbackAnalysis.categories.feature_requests.items;
        const bugs = feedbackAnalysis.categories.bugs.items;
        const improvements = feedbackAnalysis.categories.improvements.items;

        // Add customer-requested items to main branch
        const customerItems = [
            ...featureRequests.map((fr: any) => ({
                type: 'feature',
                title: fr.title,
                description: fr.description,
                timeframe: fr.priority === 'high' ? 'current' : 'next',
                priority: fr.priority,
                source: 'customer_feedback',
                customerDemand: fr.count,
                effort: 10, // Default effort
                assignedTeam: 'Engineering', // Default team
                milestones: [
                    {
                        title: 'Requirements Analysis',
                        description: 'Analyze and document requirements',
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                        status: 'planned'
                    }
                ]
            })),
            ...bugs.map((bug: any) => ({
                type: 'bug',
                title: bug.title,
                description: bug.description,
                timeframe: bug.severity === 'high' ? 'current' : 'next',
                priority: bug.severity,
                source: 'customer_feedback',
                customerDemand: bug.count,
                effort: 5,
                assignedTeam: 'Engineering'
            })),
            ...improvements.map((imp: any) => ({
                type: 'improvement',
                title: imp.title,
                description: imp.description,
                timeframe: 'next',
                priority: imp.impact === 'high' ? 'high' : 'medium',
                source: 'customer_feedback',
                customerDemand: imp.count,
                effort: 8,
                assignedTeam: 'Engineering'
            }))
        ];

        // Merge company planned items with customer requested items
        const allItems = [
            ...roadmapData.mainBranch,
            ...customerItems
        ];

        // Sort items by priority and customer demand
        const sortedItems = allItems.sort((a, b) => {
            const priorityScore = (p: string) =>
                p === 'critical' ? 4 :
                    p === 'high' ? 3 :
                        p === 'medium' ? 2 : 1;

            const aScore = priorityScore(a.priority) * 10 + (a.customerDemand || 0) / 10;
            const bScore = priorityScore(b.priority) * 10 + (b.customerDemand || 0) / 10;
            return bScore - aScore;
        });

        // Create the integrated roadmap
        const roadmap = await prisma.roadmap.create({
            data: {
                name: "Integrated Roadmap 2024",
                description: "Combined company strategy and customer feedback",
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
                            description: 'Integrated development path',
                            probability: 100,
                            items: {
                                create: sortedItems.map((item: any) => ({
                                    type: item.type,
                                    title: item.title,
                                    description: item.description,
                                    timeframe: item.timeframe,
                                    priority: item.priority,
                                    status: 'planned',
                                    effort: item.effort,
                                    assignedTeam: item.assignedTeam,
                                    ...(item.milestones && {
                                        milestones: {
                                            create: item.milestones.map((m: any) => ({
                                                title: m.title,
                                                description: m.description,
                                                progress: 0,
                                                status: m.status || 'planned',
                                                startDate: new Date(m.startDate),
                                                endDate: new Date(m.endDate)
                                            }))
                                        }
                                    }),
                                    feedback: item.source === 'customer_feedback' ? {
                                        create: {
                                            requestCount: item.customerDemand || 0,
                                            avgSentiment: 0.7,
                                            userSegments: ['All Users'],
                                            keyThemes: [item.type]
                                        }
                                    } : undefined,
                                    analysis: {
                                        create: {
                                            feasibility: item.analysis?.feasibility || 70,
                                            impact: item.analysis?.impact || 80,
                                            risk: item.analysis?.risk || 30,
                                            resources: item.analysis?.resources || {
                                                required: 2,
                                                available: 3
                                            }
                                        }
                                    }
                                }))
                            }
                        },
                        ...(roadmapData.alternativeBranches || []).map((branch: any) => ({
                            type: 'alternative',
                            title: branch.title,
                            description: branch.description,
                            probability: branch.probability || 50,
                            items: {
                                create: (branch.items || []).map((item: any) => ({
                                    type: item.type || 'feature',
                                    title: item.title,
                                    description: item.description,
                                    timeframe: item.timeframe || 'future',
                                    priority: item.priority || 'medium',
                                    status: 'planned',
                                    effort: item.effort || 10
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
                                feedback: true
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
        console.error('Error generating roadmap:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to generate roadmap',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}