import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Save conversation request body:', JSON.stringify(body, null, 2));

        // Validate required fields
        if (!body.messages || !Array.isArray(body.messages)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid messages data'
            }, { status: 400 });
        }

        // Ensure extractedData is present and valid
        if (!body.extractedData || typeof body.extractedData !== 'object') {
            return NextResponse.json({
                success: false,
                error: 'Missing or invalid extracted data'
            }, { status: 400 });
        }

        // Generate IDs if not provided
        const sessionId = crypto.randomUUID();
        const userId = body.extractedData?.contact?.value || crypto.randomUUID();

        // Ensure the data structure matches Prisma schema
        const conversationData = {
            userId,
            sessionId,
            messages: {
                create: body.messages
            },
            extractedData: {
                create: {
                    satisfaction: body.extractedData.satisfaction ?? 0,
                    pain_points: body.extractedData.pain_points ?? [],
                    feature_requests: body.extractedData.feature_requests ?? [],
                    contact: {
                        create: {
                            method: body.extractedData.contact?.method ?? null,
                            value: body.extractedData.contact?.value ?? null
                        }
                    },
                    sentiment: body.extractedData.sentiment ?? 'neutral',
                    key_themes: body.extractedData.key_themes ?? []
                }
            },
            timestamp: new Date()
        };

        const saved = await prisma.conversation.create({
            data: conversationData
        });

        return NextResponse.json({
            success: true,
            id: saved.id,
            userId,
            sessionId
        });

    } catch (error) {
        console.error('Error saving conversation:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to save conversation',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}