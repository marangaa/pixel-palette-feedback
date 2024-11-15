import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const extractionSchema = {
    type: SchemaType.OBJECT,
    properties: {
        satisfaction: {
            type: SchemaType.NUMBER,
            description: "Satisfaction rating (1-5)",
            nullable: false
        },
        pain_points: {
            type: SchemaType.ARRAY,
            description: "List of problems or challenges mentioned",
            items: {
                type: SchemaType.STRING
            },
            nullable: false
        },
        feature_requests: {
            type: SchemaType.ARRAY,
            description: "List of requested features or improvements",
            items: {
                type: SchemaType.STRING
            },
            nullable: false
        },
        contact_method: {
            type: SchemaType.STRING,
            description: "Preferred contact method (email/phone/none)",
            enum: ["email", "phone", "none"],
            nullable: false
        },
        contact_value: {
            type: SchemaType.STRING,
            description: "Contact information value",
            nullable: true
        },
        sentiment: {
            type: SchemaType.STRING,
            description: "Overall sentiment of feedback",
            enum: ["positive", "neutral", "negative"],
            nullable: false
        },
        key_themes: {
            type: SchemaType.ARRAY,
            description: "Main topics discussed",
            items: {
                type: SchemaType.STRING
            },
            nullable: false
        }
    },
    required: [
        "satisfaction",
        "pain_points",
        "feature_requests",
        "contact_method",
        "contact_value",
        "sentiment",
        "key_themes"
    ]
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Received request body:', JSON.stringify(body, null, 2));

        if (!body.messages || !Array.isArray(body.messages)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid messages data'
                },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                temperature: 0.7,
                responseMimeType: "application/json",
                responseSchema: extractionSchema,
            },
        });

        const conversation = body.messages
            .map((msg: { role: string; content: string }) => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join("\n\n");

        console.log('Processing conversation:', conversation);

        const prompt = `Analyze this conversation and extract key information about the user's feedback.
Consider:
- Look for explicit or implied satisfaction ratings
- Identify problems and challenges mentioned
- Extract feature requests and suggestions
- Note any contact information provided (defaulting to "none" if not provided)
- Analyze overall sentiment
- Identify main themes discussed

Return the structured data following the schema exactly.`;

        const result = await model.generateContent([
            { text: prompt },
            { text: conversation }
        ]);

        const extractedData = JSON.parse(result.response.text());
        console.log('Raw extracted data:', JSON.stringify(extractedData, null, 2));

        // Transform the data to match the expected format for saving
        const transformedData = {
            satisfaction: extractedData.satisfaction || 0,
            pain_points: extractedData.pain_points || [],
            feature_requests: extractedData.feature_requests || [],
            contact: {
                method: extractedData.contact_method === "none" ? null : extractedData.contact_method,
                value: extractedData.contact_value || null
            },
            sentiment: extractedData.sentiment || "neutral",
            key_themes: extractedData.key_themes || []
        };

        console.log('Transformed data:', JSON.stringify(transformedData, null, 2));

        return NextResponse.json({
            success: true,
            data: transformedData
        });

    } catch (error) {
        console.error('Error extracting data:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to extract data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}