// app/api/roadmap/dependencies/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const itemId = url.searchParams.get('itemId');
        const type = url.searchParams.get('type');

        if (!itemId) {
            return NextResponse.json({
                success: false,
                error: 'Item ID is required'
            }, { status: 400 });
        }

        // Get both dependencies and dependents
        const [dependencies, dependents] = await Promise.all([
            prisma.itemDependency.findMany({
                where: {
                    sourceId: itemId,
                    ...(type && { type })
                },
                include: {
                    target: {
                        include: {
                            milestones: true,
                            analysis: true
                        }
                    }
                }
            }),
            prisma.itemDependency.findMany({
                where: {
                    targetId: itemId,
                    ...(type && { type })
                },
                include: {
                    source: {
                        include: {
                            milestones: true,
                            analysis: true
                        }
                    }
                }
            })
        ]);

        // Check for circular dependencies
        const circularDependencies = await findCircularDependencies(itemId);

        return NextResponse.json({
            success: true,
            data: {
                dependencies,
                dependents,
                hasCircularDependencies: circularDependencies.length > 0,
                circularPaths: circularDependencies
            }
        });

    } catch (error) {
        console.error('Error fetching dependencies:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch dependencies',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate required fields
        if (!body.sourceId || !body.targetId) {
            return NextResponse.json({
                success: false,
                error: 'Source and target IDs are required'
            }, { status: 400 });
        }

        // Check if dependency already exists
        const existingDependency = await prisma.itemDependency.findFirst({
            where: {
                sourceId: body.sourceId,
                targetId: body.targetId
            }
        });

        if (existingDependency) {
            return NextResponse.json({
                success: false,
                error: 'Dependency already exists'
            }, { status: 400 });
        }

        // Check if this would create a circular dependency
        const wouldCreateCycle = await checkDependencyCycle(body.sourceId, body.targetId);
        if (wouldCreateCycle) {
            return NextResponse.json({
                success: false,
                error: 'Cannot create circular dependency'
            }, { status: 400 });
        }

        const dependency = await prisma.itemDependency.create({
            data: {
                sourceId: body.sourceId,
                targetId: body.targetId,
                type: body.type || 'blocks'
            },
            include: {
                source: {
                    select: {
                        title: true,
                        status: true
                    }
                },
                target: {
                    select: {
                        title: true,
                        status: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: dependency
        });

    } catch (error) {
        console.error('Error creating dependency:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create dependency',
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
                error: 'Dependency ID is required'
            }, { status: 400 });
        }

        const dependency = await prisma.itemDependency.update({
            where: { id: body.id },
            data: {
                type: body.type
            },
            include: {
                source: {
                    select: {
                        title: true,
                        status: true
                    }
                },
                target: {
                    select: {
                        title: true,
                        status: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: dependency
        });

    } catch (error) {
        console.error('Error updating dependency:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update dependency',
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
                error: 'Dependency ID is required'
            }, { status: 400 });
        }

        await prisma.itemDependency.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            data: { id }
        });

    } catch (error) {
        console.error('Error deleting dependency:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to delete dependency',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Helper function to check for circular dependencies
async function checkDependencyCycle(sourceId: string, targetId: string): Promise<boolean> {
    const visited = new Set<string>();
    const stack = new Set<string>();

    async function dfs(currentId: string): Promise<boolean> {
        if (stack.has(currentId)) return true;
        if (visited.has(currentId)) return false;

        visited.add(currentId);
        stack.add(currentId);

        const dependencies = await prisma.itemDependency.findMany({
            where: { sourceId: currentId },
            select: { targetId: true }
        });

        for (const dep of dependencies) {
            if (dep.targetId === sourceId) return true;
            if (await dfs(dep.targetId)) return true;
        }

        stack.delete(currentId);
        return false;
    }

    return dfs(targetId);
}

// Helper function to find all circular dependency paths
async function findCircularDependencies(itemId: string): Promise<string[][]> {
    const paths: string[][] = [];
    const visited = new Set<string>();
    const stack: string[] = [];

    async function dfs(currentId: string): Promise<void> {
        if (stack.includes(currentId)) {
            const cycleStart = stack.indexOf(currentId);
            paths.push(stack.slice(cycleStart).concat(currentId));
            return;
        }

        if (visited.has(currentId)) return;

        visited.add(currentId);
        stack.push(currentId);

        const dependencies = await prisma.itemDependency.findMany({
            where: { sourceId: currentId },
            select: { targetId: true }
        });

        for (const dep of dependencies) {
            await dfs(dep.targetId);
        }

        stack.pop();
    }

    await dfs(itemId);
    return paths;
}