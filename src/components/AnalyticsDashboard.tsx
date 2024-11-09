'use client'
import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    TrendingUp,
    AlertCircle,
    ThumbsUp,
    Calendar,
    RefreshCcw,
    Loader2
} from 'lucide-react';
import { TimeRangeSelector } from './TimeRangeSelector';

interface FeatureRequest {
    feature: string;
    count: number;
    urgency: string;
}

interface PainPoint {
    issue: string;
    severity: string;
    frequency: string;
}

interface AggregatedInsights {
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
        power_users: {
            needs: string[];
            pain_points: string[];
            opportunities: string[];
        };
        regular_users: {
            needs: string[];
            pain_points: string[];
            opportunities: string[];
        };
        new_users: {
            needs: string[];
            pain_points: string[];
            opportunities: string[];
        };
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

interface AnalyticsData {
    meta: {
        total_conversations: number;
        time_range: {
            start: string;
            end: string;
        };
    };
    individual_analyses: any[];
    aggregated_insights: AggregatedInsights;
}

const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
        high: 'bg-red-100 text-red-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-green-100 text-green-800'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
            {priority.toUpperCase()}
        </span>
    );
};

const MetricCard = ({
                        title,
                        value,
                        icon: Icon,
                        color,
                        subtext
                    }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtext?: string;
}) => (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-2">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color.replace('text', 'bg').replace('600', '100')}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
        </div>
        {subtext && (
            <p className="text-sm text-gray-500">{subtext}</p>
        )}
    </div>
);

const FeatureLeaderboard = ({ features }: { features: FeatureRequest[] }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Feature Requests</h3>
        <div className="space-y-4">
            {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-purple-600">#{index + 1}</span>
                        <div>
                            <p className="font-medium text-gray-800">{feature.feature}</p>
                            <PriorityBadge priority={feature.urgency} />
                        </div>
                    </div>
                    <span className="text-lg font-semibold text-gray-600">{feature.count} mentions</span>
                </div>
            ))}
        </div>
    </div>
);

const Roadmap = ({ recommendations }: { recommendations: any }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Development Roadmap</h3>
        <div className="space-y-8">
            <div className="relative">
                {Object.entries(recommendations).map(([phase, items]) => (
                    <div key={phase} className="ml-4 mb-8">
                        <div className="absolute w-0.5 h-full bg-purple-200 left-0 top-0" />
                        <div className="flex items-start">
                            <div className="absolute w-3 h-3 rounded-full bg-purple-500 left-[-4px]" />
                            <div className="ml-6">
                                <h4 className="text-md font-semibold text-gray-700 mb-2">
                                    {phase.charAt(0).toUpperCase() + phase.slice(1).replace('_', ' ')}
                                </h4>
                                <ul className="list-disc list-inside space-y-2">
                                    {(items as string[]).map((item, i) => (
                                        <li key={i} className="text-gray-600">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
        <Sparkles className="w-12 h-12 text-purple-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500 text-center mb-4">
            There are no conversations to analyze in the selected time range.
        </p>
    </div>
);

const AnalyticsDashboard = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState(30); // Default to 30 days

    const fetchInsights = async (days: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/analyze-feedback?days=${days}`);
            if (!response.ok) throw new Error('Failed to fetch insights');
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Unknown error occurred');
            }
            setData(result.data);
        } catch (error) {
            console.error('Error fetching insights:', error);
            setError(error instanceof Error ? error.message : 'Failed to load insights');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights(timeRange);
    }, [timeRange]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center space-x-2">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                    <span className="text-gray-600">Analyzing feedback...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Insights</h3>
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    if (!data || !data.aggregated_insights) {
        return <EmptyState />;
    }

    const { aggregated_insights: insights, meta } = data;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Feedback Analytics</h1>
                        <p className="text-gray-600">
                            Analyzing {meta.total_conversations} conversations from the past {timeRange} days
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <TimeRangeSelector
                            value={timeRange}
                            onChange={(days) => setTimeRange(days)}
                        />
                        <button
                            onClick={() => fetchInsights(timeRange)}
                            className="flex items-center space-x-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Average Satisfaction"
                        value={`${insights.metrics.avg_satisfaction.toFixed(1)}/5.0`}
                        icon={ThumbsUp}
                        color="text-blue-600"
                        subtext="Based on user ratings"
                    />
                    <MetricCard
                        title="Feature Requests"
                        value={insights.metrics.top_features.length}
                        icon={TrendingUp}
                        color="text-purple-600"
                        subtext="Unique features requested"
                    />
                    <MetricCard
                        title="Critical Issues"
                        value={insights.metrics.top_pain_points.length}
                        icon={AlertCircle}
                        color="text-red-600"
                        subtext="High priority issues"
                    />
                    <MetricCard
                        title="Total Conversations"
                        value={meta.total_conversations}
                        icon={Calendar}
                        color="text-green-600"
                        subtext={`Last ${timeRange} days`}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FeatureLeaderboard features={insights.metrics.top_features} />
                    <Roadmap recommendations={insights.recommendations} />

                    {/* Priority Matrix */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Feature Priority Matrix</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-700">High Impact, Easy</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                    {insights.feature_priorities.high_impact_easy.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-700">High Impact, Hard</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                    {insights.feature_priorities.high_impact_hard.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Emerging Trends */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Emerging Trends</h3>
                        <div className="space-y-4">
                            {insights.trends.patterns.map((trend, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-purple-500" />
                                    <span className="text-gray-700">{trend}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;