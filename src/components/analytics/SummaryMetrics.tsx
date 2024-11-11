import React from 'react';
import { ThumbsUp, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import type { FeedbackAnalysis } from '@/types/feedback';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    subtext?: string;
}

interface SummaryMetricsProps {
    data: FeedbackAnalysis;
    timeRange: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
                                                   title,
                                                   value,
                                                   icon: Icon,
                                                   color,
                                                   subtext
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

const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ data, timeRange }) => {
    // Calculate sentiment percentage safely
    const calculateSentimentPercentage = () => {
        const sentiment = data.meta.sentiment_summary;
        if (!sentiment) return 0;

        const total = (sentiment.positive || 0) +
            (sentiment.negative || 0) +
            (sentiment.neutral || 0);

        if (total === 0) return 0;
        return ((sentiment.positive || 0) / total) * 100;
    };

    const getFeatureRequestCount = () => {
        try {
            return data.categories.feature_requests?.stats?.total_mentions || 0;
        } catch {
            return 0;
        }
    };

    const getBugCount = () => {
        try {
            return {
                total: data.categories.bugs?.stats?.total_bugs || 0,
                critical: data.categories.bugs?.stats?.critical_count || 0
            };
        } catch {
            return { total: 0, critical: 0 };
        }
    };

    const sentimentPercentage = calculateSentimentPercentage();
    const featureRequests = getFeatureRequestCount();
    const bugs = getBugCount();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
                title="User Sentiment"
                value={`${sentimentPercentage.toFixed(1)}%`}
                icon={ThumbsUp}
                color="text-blue-600"
                subtext="Positive feedback"
            />
            <MetricCard
                title="Feature Requests"
                value={featureRequests}
                icon={TrendingUp}
                color="text-purple-600"
                subtext="Total requests"
            />
            <MetricCard
                title="Active Issues"
                value={bugs.total}
                icon={AlertCircle}
                color="text-red-600"
                subtext={`${bugs.critical} critical`}
            />
            <MetricCard
                title="Total Items"
                value={data.meta.total_feedback_items || 0}
                icon={Calendar}
                color="text-green-600"
                subtext={`Last ${timeRange} days`}
            />
        </div>
    );
};

export default SummaryMetrics;