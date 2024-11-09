export interface Message {
    role: 'assistant' | 'user';
    content: string;
}

export interface ProcessingMessage {
    type: 'loading' | 'processing';
    content: string;
}

export interface ExtractedData {
    satisfaction: number;
    pain_points: string[];
    feature_requests: string[];
    contact: {
        method: string | null;
        value: string | null;
    };
    sentiment: string;
    key_themes: string[];
}

export interface Analysis {
    shouldEnd: boolean;
    reason: 'user_request' | 'complete_information' | 'continue';
    missingElements: string[];
    nextQuestion: string | null;
    collectedInfo: {
        hasRating: boolean;
        hasContactPreference: boolean;
        hasFeedback: boolean;
        hasFeatureRequests: boolean;
        userWantsToEnd: boolean;
    };
}

export interface ChatResponse {
    response: string;
    isComplete: boolean;
    analysis: Analysis;
}