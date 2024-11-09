export interface FeatureRequest {
    feature: string;
    count: number;
    urgency: 'high' | 'medium' | 'low';
}

export interface PainPoint {
    issue: string;
    severity: 'high' | 'medium' | 'low';
    frequency: 'frequent' | 'occasional' | 'rare';
}

export interface UserSegment {
    needs: string[];
    pain_points: string[];
    opportunities: string[];
}

export interface AggregatedInsights {
    feature_priorities: {
        high_impact_easy: string[];
        high_impact_hard: string[];
        low_impact_easy: string[];
        low_impact_hard: string[];
    };
    trends: {
        patterns: string[];
        pain_points: string[];
        requests: string[];
        evolving_needs: string[];
    };
    user_segments: {
        power_users: UserSegment;
        regular_users: UserSegment;
        new_users: UserSegment;
    };
    recommendations: {
        immediate: string[];
        short_term: string[];
        long_term: string[];
        risks: string[];
    };
    metrics: {
        avg_satisfaction: number;
        top_features: FeatureRequest[];
        top_pain_points: PainPoint[];
        highlights: string[];
    };
}

export interface AnalyticsData {
    meta: {
        total_conversations: number;
        time_range: {
            start: string;
            end: string;
        };
    };
    individual_analyses: Array<{
        summary: {
            main_points: string[];
            user_sentiment: 'positive' | 'negative' | 'neutral';
            engagement_level: 'high' | 'medium' | 'low';
            key_quotes: string[];
        };
        feature_analysis: {
            urgency: 'high' | 'medium' | 'low';
            complexity: 'high' | 'medium' | 'low';
            description: string;
            potential_impact: string;
            user_value: string;
            related_features: string[];
        };
        pain_points: {
            severity: 'high' | 'medium' | 'low';
            frequency: 'frequent' | 'occasional' | 'rare';
            affected_areas: string[];
            suggested_solutions: string[];
            user_impact: string;
        };
        metrics: {
            satisfaction_score: number;
            feature_usage: string[];
            user_type: 'power_user' | 'regular_user' | 'new_user';
            usage_patterns: string[];
        };
        timestamp: string;
        conversationId: string;
    }>;
    aggregated_insights: AggregatedInsights;
}