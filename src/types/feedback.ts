
export type Priority = 'high' | 'medium' | 'low';
export type Sentiment = 'positive' | 'negative' | 'neutral';
export type Status = 'active' | 'investigating' | 'resolved';

export interface BaseItem {
    title: string;
    description: string;
    count: number;
    tags?: string[];
}

export interface FeatureRequest extends BaseItem {
    priority: Priority;
    sentiment: Sentiment;
    impact: Priority;
}

export interface BugReport extends BaseItem {
    severity: Priority;
    status: Status;
    impact: string;
}

export interface Improvement extends BaseItem {
    type: 'ui' | 'performance' | 'workflow' | 'other';
    impact: string;
}

export interface PerformanceIssue extends BaseItem {
    severity: Priority;
    impact: string;
    area: string;
}

export interface PraiseFeedback extends BaseItem {
    sentiment: Sentiment;
    feature: string;
}

export interface IssueReport extends BaseItem {
    severity: Priority;
    status: Status;
}

export interface GeneralFeedback extends BaseItem {
    sentiment: Sentiment;
}

export interface CategoryStats {
    feature_requests: {
        total_mentions: number;
        avg_sentiment: number;
        top_tags: string[];
    };
    bugs: {
        total_bugs: number;
        critical_count: number;
        top_affected_areas: string[];
    };
    improvements: {
        total_suggestions: number;
        top_areas: string[];
    };
    performance: {
        total_issues: number;
        avg_severity: number;
        top_areas: string[];
    };
    praise: {
        total_praise: number;
        top_features: string[];
    };
    issues: {
        total_issues: number;
        open_issues: number;
        critical_count: number;
    };
    general_feedback: {
        total_comments: number;
        sentiment_distribution: {
            positive: number;
            negative: number;
            neutral: number;
        };
    };
}

export interface CategoryData {
    feature_requests: {
        items: FeatureRequest[];
        stats: CategoryStats['feature_requests'];
    };
    bugs: {
        items: BugReport[];
        stats: CategoryStats['bugs'];
    };
    improvements: {
        items: Improvement[];
        stats: CategoryStats['improvements'];
    };
    performance: {
        items: PerformanceIssue[];
        stats: CategoryStats['performance'];
    };
    praise: {
        items: PraiseFeedback[];
        stats: CategoryStats['praise'];
    };
    issues: {
        items: IssueReport[];
        stats: CategoryStats['issues'];
    };
    general_feedback: {
        items: GeneralFeedback[];
        stats: CategoryStats['general_feedback'];
    };
}

export interface FeedbackMeta {
    total_feedback_items: number;
    analysis_timestamp: string;
    top_overall_tags: string[];
    sentiment_summary: {
        positive: number;
        negative: number;
        neutral: number;
    };
}

export interface FeedbackAnalysis {
    categories: CategoryData;
    meta: FeedbackMeta;
}

export interface ApiResponse {
    success: boolean;
    data: FeedbackAnalysis;
    error?: string;
}