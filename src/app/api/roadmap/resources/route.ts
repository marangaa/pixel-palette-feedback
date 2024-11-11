import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isWithinInterval, parseISO } from 'date-fns';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const itemId = url.searchParams.get('itemId');
        const teamId = url.searchParams.get('teamId');
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');

        const where: any = {};

        if (itemId) where.itemId = itemId;
        if (teamId) where.teamId = teamId;
        if (startDate && endDate) {
            where.OR = [
                {
                    startDate: {
                        gte: parseISO(startDate),
                        lte: parseISO(endDate)
                    }
                },
                {
                    endDate: {
                        gte: parseISO(startDate),
                        lte: parseISO(endDate)
                    }
                }
            ];
        }

        const allocations = await prisma.resourceAllocation.findMany({
            where,
            include: {
                item: {
                    select: {
                        title: true,
                        status: true,
                        priority: true
                    }
                }
            }
        });

        // Calculate team capacity utilization
        if (teamId && startDate && endDate) {
            const overlappingAllocations = allocations.filter(allocation =>
                isWithinInterval(parseISO(startDate), {
                    start: allocation.startDate,
                    end: allocation.endDate
                }) ||
                isWithinInterval(parseISO(endDate), {
                    start: allocation.startDate,
                    end: allocation.endDate
                })
            );

            const utilization = overlappingAllocations.reduce((total, allocation) =>
                total + allocation.allocation, 0);

            return NextResponse.json({
                success: true,
                data: {
                    allocations,
                    utilization,
                    remainingCapacity: 100 - utilization
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: allocations
        });

    } catch (error) {
        console.error('Error fetching resource allocations:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch resource allocations',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate required fields
        if (!body.itemId || !body.teamId || !body.allocation || !body.startDate || !body.endDate) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields'
            }, { status: 400 });
        }

        // Check for existing allocations and capacity
        const existingAllocations = await prisma.resourceAllocation.findMany({
            where: {
                teamId: body.teamId,
                OR: [
                    {
                        startDate: {
                            lte: new Date(body.endDate),
                            gte: new Date(body.startDate)
                        }
                    },
                    {
                        endDate: {
                            lte: new Date(body.endDate),
                            gte: new Date(body.startDate)
                        }
                    }
                ]
            }
        });

        const totalAllocation = existingAllocations.reduce((sum, allocation) =>
            sum + allocation.allocation, 0) + body.allocation;

        if (totalAllocation > 100) {
            return NextResponse.json({
                success: false,
                error: 'Team capacity exceeded for the specified period',
                details: {
                    currentAllocation: totalAllocation - body.allocation,
                    requestedAllocation: body.allocation,
                    remainingCapacity: 100 - (totalAllocation - body.allocation)
                }
            }, { status: 400 });
        }

        const allocation = await prisma.resourceAllocation.create({
            data: {
                itemId: body.itemId,
                teamId: body.teamId,
                allocation: body.allocation,
                capacity: body.capacity || 100,
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate)
            },
            include: {
                item: {
                    select: {
                        title: true,
                        status: true,
                        priority: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: allocation
        });

    } catch (error) {
        console.error('Error creating resource allocation:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create resource allocation',
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
                error: 'Allocation ID is required'
            }, { status: 400 });
        }

        // Check capacity if allocation is being updated
        if (body.allocation || body.startDate || body.endDate) {
            const currentAllocation = await prisma.resourceAllocation.findUnique({
                where: { id: body.id }
            });

            if (!currentAllocation) {
                return NextResponse.json({
                    success: false,
                    error: 'Allocation not found'
                }, { status: 404 });
            }

            const existingAllocations = await prisma.resourceAllocation.findMany({
                where: {
                    teamId: currentAllocation.teamId,
                    id: { not: body.id },
                    OR: [
                        {
                            startDate: {
                                lte: body.endDate ? new Date(body.endDate) : currentAllocation.endDate,
                                gte: body.startDate ? new Date(body.startDate) : currentAllocation.startDate
                            }
                        },
                        {
                            endDate: {
                                lte: body.endDate ? new Date(body.endDate) : currentAllocation.endDate,
                                gte: body.startDate ? new Date(body.startDate) : currentAllocation.startDate
                            }
                        }
                    ]
                }
            });

            const totalAllocation = existingAllocations.reduce((sum, allocation) =>
                sum + allocation.allocation, 0) + (body.allocation || currentAllocation.allocation);

            if (totalAllocation > 100) {
                return NextResponse.json({
                    success: false,
                    error: 'Team capacity exceeded for the specified period',
                    details: {
                        currentAllocation: totalAllocation - (body.allocation || currentAllocation.allocation),
                        requestedAllocation: body.allocation || currentAllocation.allocation,
                        remainingCapacity: 100 - (totalAllocation - (body.allocation || currentAllocation.allocation))
                    }
                }, { status: 400 });
            }
        }

        const allocation = await prisma.resourceAllocation.update({
            where: { id: body.id },
            data: {
                allocation: body.allocation,
                capacity: body.capacity,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined
            },
            include: {
                item: {
                    select: {
                        title: true,
                        status: true,
                        priority: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: allocation
        });

    } catch (error) {
        console.error('Error updating resource allocation:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update resource allocation',
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
                error: 'Allocation ID is required'
            }, { status: 400 });
        }

        await prisma.resourceAllocation.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            data: { id }
        });

    } catch (error) {
        console.error('Error deleting resource allocation:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to delete resource allocation',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}