import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import SummaryMetrics from './SummaryMetrics';
import { FeedbackNavigation, CategoryView, categories } from './feedback';
import type { ApiResponse, FeedbackAnalysis, CategoryData } from '@/types/feedback';

const EmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
        <Sparkles className="w-12 h-12 text-purple-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500 text-center mb-4">
            There are no conversations to analyze in the selected time range.
        </p>
    </div>
);

interface PriorityBadgeProps {
    priority?: string;
    type?: 'severity' | 'priority';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, type = 'priority' }) => {
    if (!priority) return null;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            priority === 'high' ? 'bg-red-100 text-red-800' :
                priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
        }`}>
            {`${type === 'severity' ? 'Severity' : 'Priority'}: ${priority.toUpperCase()}`}
        </span>
    );
};

const FeatureRequestCard: React.FC<{ item: any }> = ({ item }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div>
            <p className="font-medium text-gray-800">{item.title}</p>
            <div className="flex space-x-2 mt-1">
                <PriorityBadge priority={item.priority} />
            </div>
        </div>
        <span className="text-sm font-medium text-gray-600">
            {item.count} mentions
        </span>
    </div>
);

const BugReportCard: React.FC<{ item: any }> = ({ item }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div>
            <p className="font-medium text-gray-800">{item.title}</p>
            <div className="flex space-x-2 mt-1">
                <PriorityBadge priority={item.severity} type="severity" />
                {item.status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'active' ? 'bg-red-100 text-red-800' :
                            item.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                    }`}>
                        {item.status}
                    </span>
                )}
            </div>
        </div>
        <span className="text-sm font-medium text-gray-600">
            {item.count} reports
        </span>
    </div>
);

const AnalyticsDashboard: React.FC = () => {
    const [data, setData] = useState<FeedbackAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState(30);
    const [currentCategory, setCurrentCategory] = useState<keyof CategoryData>('feature_requests');
    const [view, setView] = useState<'overview' | 'category'>('overview');

    const fetchInsights = async (days: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/analyze-feedback?days=${days}`);
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

    const handleCategoryChange = (newCategory: keyof CategoryData | 'prev' | 'next') => {
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

    if (!data) {
        return <EmptyState />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
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

                {view === 'overview' ? (
                    <>
                        <SummaryMetrics
                            timeRange={timeRange}
                            data={data}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                            {/* Feature Requests Overview */}
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                    Top Feature Requests
                                </h3>
                                <div className="space-y-4">
                                    {data.categories.feature_requests.items.slice(0, 5).map((item, index) => (
                                        <FeatureRequestCard key={index} item={item} />
                                    ))}
                                </div>
                            </div>

                            {/* Bug Reports Overview */}
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                    Active Bug Reports
                                </h3>
                                <div className="space-y-4">
                                    {data.categories.bugs.items
                                        .filter(bug => bug.status === 'active')
                                        .slice(0, 5)
                                        .map((item, index) => (
                                            <BugReportCard key={index} item={item} />
                                        ))}
                                </div>
                            </div>
                        </div>
                    </>
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