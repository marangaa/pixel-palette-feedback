import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { parentItemId, roadmapId, ...branchData } = body;

        if (!roadmapId) {
            return NextResponse.json({
                success: false,
                error: 'Roadmap ID is required'
            }, { status: 400 });
        }

        // Create branch with safe defaults
        const branch = await prisma.roadmapBranch.create({
            data: {
                type: 'alternative',
                title: branchData.title || 'Alternative Branch',
                description: branchData.description || 'Alternative approach',
                probability: branchData.probability || 50,
                roadmapId,
                items: {
                    create: (branchData.items || []).map((item: any) => ({
                        type: item.type || 'feature',
                        title: item.title || 'New Feature',
                        description: item.description || 'Description pending',
                        timeframe: item.timeframe || 'future',
                        priority: item.priority || 'medium',
                        status: 'planned',
                        effort: item.effort || 10,
                        roadmapId
                    }))
                }
            },
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
        });

        return NextResponse.json({
            success: true,
            data: branch
        });

    } catch (error) {
        console.error('Error creating branch:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create branch'
        }, { status: 500 });
    }
}