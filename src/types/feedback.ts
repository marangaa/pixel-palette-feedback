export type FeedbackType =
    | 'feature'
    | 'bug'
    | 'improvement'
    | 'performance'
    | 'praise'
    | 'issue'
    | 'general';

export interface FeedbackItem {
    id: string;
    title: string;
    description?: string;
    count: number;
    priority?: 'high' | 'medium' | 'low';
    severity?: 'high' | 'medium' | 'low';
    tags?: string[];
    type: FeedbackType;
    status?: 'active' | 'investigating' | 'resolved';
    sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface SentimentDataPoint {
    period: string;
    sentiment_score: number;
    mention_count: number;
}

export interface UserSegment {
    name: string;
    count: number;
    impact?: number;
}

export interface CategoryStats {
    total_items: number;
    avg_sentiment?: number;
    top_tags?: string[];
    priority_breakdown?: {
        high: number;
        medium: number;
        low: number;
    };
}

export interface CategoryData {
    items: FeedbackItem[];
    stats: CategoryStats;
}

// This matches the categories object in FeedbackCategories.tsx
export type CategoryKey =
    | 'feature_requests'
    | 'bugs'
    | 'improvements'
    | 'performance'
    | 'praise'
    | 'issues'
    | 'general_feedback';

export type FeedbackCategories = Record<CategoryKey, CategoryData>;

export interface FeedbackAnalysis {
    categories: FeedbackCategories;
    meta: {
        total_feedback_items: number;
        analysis_timestamp: string;
        time_range: number;
        sentiment_trend: SentimentDataPoint[];
        user_segments: UserSegment[];
        sentiment_summary: {
            positive: number;
            neutral: number;
            negative: number;
            average_score: number;
        };
    };
}

export interface ApiResponse {
    success: boolean;
    data?: FeedbackAnalysis;
    error?: string;
}