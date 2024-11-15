import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import SummaryMetrics from './SummaryMetrics';
import { FeedbackNavigation, CategoryView, categories } from './feedback';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ApiResponse, FeedbackAnalysis, CategoryData } from '@/types/feedback';
import { useRouter } from 'next/navigation';
import FeedbackOverview from './FeedbackOverview';

// Types
export interface FeedbackItem {
    id: string;
    title: string;
    description?: string;
    count: number;
    priority?: 'high' | 'medium' | 'low';
    severity?: 'high' | 'medium' | 'low';
    tags?: string[];
    type: 'feature' | 'bug' | 'improvement';
    status?: 'active' | 'investigating' | 'resolved';
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

type EmptyStateProps = object

type LoadingStateProps = object

interface ErrorStateProps {
    error: string;
}
const EmptyState: React.FC<EmptyStateProps> = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
        <Sparkles className="w-12 h-12 text-purple-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500 text-center mb-4">
            There are no conversations to analyze in the selected time range.
        </p>
    </div>
);

const LoadingState: React.FC<LoadingStateProps> = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-gray-600">Analyzing feedback...</span>
        </div>
    </div>
);

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
    <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
    </Alert>
);

const AnalyticsDashboard: React.FC = () => {
    const router = useRouter();
    const [data, setData] = useState<FeedbackAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState(30);
    const [currentCategory, setCurrentCategory] = useState<keyof CategoryData>('feature_requests');
    const [view, setView] = useState<'overview' | 'category'>('overview');

    const fetchInsights = async (days: number): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/analytics?days=${days}`);
            if (!response.ok) throw new Error('Failed to fetch insights');
            const result = await response.json() as ApiResponse;
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

    const handleAnalyze = (item: FeedbackItem): void => {
        router.push(`/analysis/${item.id}`);
    };

    const handleCategoryChange = (newCategory: keyof CategoryData | 'prev' | 'next'): void => {
        if (newCategory === 'prev' || newCategory === 'next') {
            const categoryKeys = Object.keys(categories) as Array<keyof CategoryData>;
            const currentIndex = categoryKeys.indexOf(currentCategory);
            let newIndex;

            if (newCategory === 'prev') {
                newIndex = currentIndex === 0 ? categoryKeys.length - 1 : currentIndex - 1;
            } else {
                newIndex = currentIndex === categoryKeys.length - 1 ? 0 : currentIndex + 1;
            }

            setCurrentCategory(categoryKeys[newIndex]);
        } else {
            setCurrentCategory(newCategory);
        }
    };

    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (!data) return <EmptyState />;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <DashboardHeader
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                    totalConversations={data.meta.total_feedback_items}
                    onRefresh={() => fetchInsights(timeRange)}
                />

                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setView(view === 'overview' ? 'category' : 'overview')}
                        className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                        {view === 'overview' ? 'View Categories' : 'View Overview'}
                    </button>
                    {view === 'category' && (
                        <FeedbackNavigation
                            currentCategory={currentCategory}
                            onCategoryChange={handleCategoryChange}
                        />
                    )}
                </div>

                <SummaryMetrics
                    timeRange={timeRange}
                    data={data}
                />

                {view === 'overview' ? (
                    <FeedbackOverview
                        data={data}
                        onAnalyze={handleAnalyze}
                    />
                ) : (
                    <CategoryView
                        category={currentCategory}
                        data={data.categories[currentCategory]}
                    />
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;