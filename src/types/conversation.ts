export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
}

export interface Contact {
    method: 'email' | 'phone' | null;
    value: string | null;
}

export interface ExtractedData {
    satisfaction: number;
    pain_points: string[];
    feature_requests: string[];
    contact: Contact;
    sentiment: 'positive' | 'neutral' | 'negative';
    key_themes: string[];
}

export interface ConversationAnalysis {
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

export interface SaveConversationRequest {
    messages: ChatMessage[];
    extractedData: ExtractedData;
    analysis?: ConversationAnalysis;
}

export interface SaveConversationResponse {
    success: boolean;
    id?: string;
    userId?: string;
    sessionId?: string;
    error?: string;
    details?: string;
}