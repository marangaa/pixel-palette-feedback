// app/api/roadmap/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Get the active roadmap with all related data
        const roadmap = await prisma.roadmap.findFirst({
            where: {
                isActive: true
            },
            include: {
                branches: {
                    include: {
                        items: {
                            include: {
                                milestones: true,
                                analysis: true,
                                feedback: true,
                                resources: true,
                                dependencies: {
                                    include: {
                                        target: true
                                    }
                                }
                            }
                        },
                        childBranches: true
                    }
                },
                items: {
                    include: {
                        milestones: true,
                        analysis: true,
                        feedback: true,
                        resources: true,
                        dependencies: {
                            include: {
                                target: true
                            }
                        }
                    }
                }
            }
        });

        if (!roadmap) {
            return NextResponse.json({
                success: true,
                data: null
            });
        }

        return NextResponse.json({
            success: true,
            data: roadmap
        });

    } catch (error) {
        console.error('Error fetching roadmap:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch roadmap'
        }, { status: 500 });
    }
}