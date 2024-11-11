// app/api/roadmap/items/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const roadmapId = url.searchParams.get('roadmapId');
        const status = url.searchParams.get('status');
        const timeframe = url.searchParams.get('timeframe');
        const type = url.searchParams.get('type');

        if (!roadmapId) {
            return NextResponse.json({
                success: false,
                error: 'Roadmap ID is required'
            }, { status: 400 });
        }

        const items = await prisma.roadmapItem.findMany({
            where: {
                roadmapId,
                ...(status && { status }),
                ...(timeframe && { timeframe }),
                ...(type && { type })
            },
            include: {
                milestones: true,
                analysis: true,
                feedback: true,
                resources: true,
                dependencies: {
                    include: {
                        target: {
                            select: {
                                id: true,
                                title: true,
                                status: true
                            }
                        }
                    }
                },
                dependents: {
                    include: {
                        source: {
                            select: {
                                id: true,
                                title: true,
                                status: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: items
        });

    } catch (error) {
        console.error('Error fetching roadmap items:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch roadmap items',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate required fields
        if (!body.roadmapId || !body.title || !body.type) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields'
            }, { status: 400 });
        }

        // Create item with all related data in a transaction
        const item = await prisma.$transaction(async (tx) => {
            // Create the main item
            const newItem = await tx.roadmapItem.create({
                data: {
                    roadmapId: body.roadmapId,
                    branchId: body.branchId,
                    title: body.title,
                    description: body.description || '',
                    type: body.type,
                    timeframe: body.timeframe || 'current',
                    priority: body.priority || 'medium',
                    status: body.status || 'planned',
                    effort: body.effort || 0,
                    assignedTeam: body.assignedTeam
                }
            });

            // Create milestones if provided
            if (body.milestones?.length) {
                await tx.milestone.createMany({
                    data: body.milestones.map((milestone: any) => ({
                        ...milestone,
                        itemId: newItem.id
                    }))
                });
            }

            // Create analysis if provided
            if (body.analysis) {
                await tx.itemAnalysis.create({
                    data: {
                        itemId: newItem.id,
                        ...body.analysis
                    }
                });
            }

            // Create feedback if provided
            if (body.feedback) {
                await tx.itemFeedback.create({
                    data: {
                        itemId: newItem.id,
                        ...body.feedback
                    }
                });
            }

            // Create resource allocations if provided
            if (body.resources?.length) {
                await tx.resourceAllocation.createMany({
                    data: body.resources.map((resource: any) => ({
                        ...resource,
                        itemId: newItem.id
                    }))
                });
            }

            // Create dependencies if provided
            if (body.dependencies?.length) {
                await tx.itemDependency.createMany({
                    data: body.dependencies.map((dep: any) => ({
                        sourceId: newItem.id,
                        targetId: dep.targetId,
                        type: dep.type || 'blocks'
                    }))
                });
            }

            // Return the complete item with all relations
            return tx.roadmapItem.findUnique({
                where: { id: newItem.id },
                include: {
                    milestones: true,
                    analysis: true,
                    feedback: true,
                    resources: true,
                    dependencies: {
                        include: { target: true }
                    }
                }
            });
        });

        return NextResponse.json({
            success: true,
            data: item
        });

    } catch (error) {
        console.error('Error creating roadmap item:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create roadmap item',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();

        if (!body.id) {
            return NextResponse.json({
                success: false,
                error: 'Item ID is required'
            }, { status: 400 });
        }

        // Update item and related data in a transaction
        const item = await prisma.$transaction(async (tx) => {
            // Update main item
            const updatedItem = await tx.roadmapItem.update({
                where: { id: body.id },
                data: {
                    title: body.title,
                    description: body.description,
                    type: body.type,
                    timeframe: body.timeframe,
                    priority: body.priority,
                    status: body.status,
                    effort: body.effort,
                    assignedTeam: body.assignedTeam,
                    branchId: body.branchId
                }
            });

            // Update milestones if provided
            if (body.milestones) {
                // Delete existing milestones
                await tx.milestone.deleteMany({
                    where: { itemId: body.id }
                });
                // Create new milestones
                await tx.milestone.createMany({
                    data: body.milestones.map((milestone: any) => ({
                        ...milestone,
                        itemId: body.id
                    }))
                });
            }

            // Update analysis if provided
            if (body.analysis) {
                await tx.itemAnalysis.upsert({
                    where: { itemId: body.id },
                    create: {
                        itemId: body.id,
                        ...body.analysis
                    },
                    update: body.analysis
                });
            }

            // Update feedback if provided
            if (body.feedback) {
                await tx.itemFeedback.upsert({
                    where: { itemId: body.id },
                    create: {
                        itemId: body.id,
                        ...body.feedback
                    },
                    update: body.feedback
                });
            }

            // Update resource allocations if provided
            if (body.resources) {
                await tx.resourceAllocation.deleteMany({
                    where: { itemId: body.id }
                });
                await tx.resourceAllocation.createMany({
                    data: body.resources.map((resource: any) => ({
                        ...resource,
                        itemId: body.id
                    }))
                });
            }

            // Update dependencies if provided
            if (body.dependencies) {
                await tx.itemDependency.deleteMany({
                    where: { sourceId: body.id }
                });
                await tx.itemDependency.createMany({
                    data: body.dependencies.map((dep: any) => ({
                        sourceId: body.id,
                        targetId: dep.targetId,
                        type: dep.type || 'blocks'
                    }))
                });
            }

            // Return updated item with all relations
            return tx.roadmapItem.findUnique({
                where: { id: body.id },
                include: {
                    milestones: true,
                    analysis: true,
                    feedback: true,
                    resources: true,
                    dependencies: {
                        include: { target: true }
                    }
                }
            });
        });

        return NextResponse.json({
            success: true,
            data: item
        });

    } catch (error) {
        console.error('Error updating roadmap item:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update roadmap item',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                success: false,
                error: 'Item ID is required'
            }, { status: 400 });
        }

        // Delete item and all related data in a transaction
        await prisma.$transaction([
            prisma.milestone.deleteMany({ where: { itemId: id } }),
            prisma.itemAnalysis.delete({ where: { itemId: id } }),
            prisma.itemFeedback.delete({ where: { itemId: id } }),
            prisma.resourceAllocation.deleteMany({ where: { itemId: id } }),
            prisma.itemDependency.deleteMany({
                where: {
                    OR: [
                        { sourceId: id },
                        { targetId: id }
                    ]
                }
            }),
            prisma.roadmapItem.delete({ where: { id } })
        ]);

        return NextResponse.json({
            success: true,
            data: { id }
        });

    } catch (error) {
        console.error('Error deleting roadmap item:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to delete roadmap item',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}