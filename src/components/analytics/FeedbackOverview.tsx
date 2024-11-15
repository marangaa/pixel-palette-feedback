import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie } from 'recharts';
import type { FeedbackItem, SentimentDataPoint, UserSegment } from './AnalyticsDashboard';

interface FeedbackItemProps {
    item: FeedbackItem;
    type: FeedbackItem['type'];
    onAnalyze: (item: FeedbackItem) => void;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ item, type, onAnalyze }) => {
    const getPriorityColor = (priority: string | undefined): string => {
        const colors = {
            high: 'bg-red-100 text-red-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800'
        } as const;
        return colors[priority as keyof typeof colors] || colors.medium;
    };

    const getTypeIcon = (feedbackType: FeedbackItem['type']): string => {
        if (feedbackType === 'bug') return '🐛';
        if (feedbackType === 'feature') return '✨';
        return '💡';
    };

    return (
        <div
            onClick={() => onAnalyze(item)}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-purple-200"
        >
            <div className="flex items-start space-x-3">
                <span className="text-xl">{getTypeIcon(type)}</span>
                <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    {item.description && (
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getPriorityColor(item.priority || item.severity)
                        }`}>
                            {item.priority || item.severity || 'medium'}
                        </span>
                        {item.tags?.map((tag, i) => (
                            <span key={i} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-purple-600">{item.count}</span>
                <span className="text-xs text-gray-500">mentions</span>
            </div>
        </div>
    );
};

interface SentimentTrendProps {
    data: SentimentDataPoint[];
}

const SentimentTrend: React.FC<SentimentTrendProps> = ({ data }) => (
    <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="sentiment_score" stroke="#8884d8" />
                <Line yAxisId="right" type="monotone" dataKey="mention_count" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

interface UserSegmentDistributionProps {
    segments: UserSegment[];
}

const UserSegmentDistribution: React.FC<UserSegmentDistributionProps> = ({ segments }) => (
    <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={segments}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    label
                />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

interface RelatedItemsProps {
    items: FeedbackItem[];
    onSelect: (item: FeedbackItem) => void;
}

const RelatedItems: React.FC<RelatedItemsProps> = ({ items, onSelect }) => (
    <div className="space-y-2">
        {items.map((item, index) => (
            <div
                key={index}
                onClick={() => onSelect(item)}
                className="p-2 hover:bg-gray-50 rounded-md cursor-pointer flex justify-between items-center"
            >
                <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.type}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{item.count} mentions</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
            </div>
        ))}
    </div>
);

interface FeedbackOverviewProps {
    data: {
        categories: {
            feature_requests: { items: FeedbackItem[] };
            bugs: { items: FeedbackItem[] };
            improvements: { items: FeedbackItem[] };
        };
        meta: {
            sentiment_trend: SentimentDataPoint[];
            user_segments: UserSegment[];
        };
    };
    onAnalyze: (item: FeedbackItem) => void;
}

const FeedbackOverview: React.FC<FeedbackOverviewProps> = ({ data, onAnalyze }) => {
    // Combine and sort all feedback items
    const allItems = [
        ...(data.categories.feature_requests.items || []).map(item => ({
            ...item,
            type: 'feature' as const
        })),
        ...(data.categories.bugs.items || []).map(item => ({
            ...item,
            type: 'bug' as const
        })),
        ...(data.categories.improvements.items || []).map(item => ({
            ...item,
            type: 'improvement' as const
        }))
    ].sort((a, b) => b.count - a.count);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>User Feedback Overview</span>
                        <span className="text-sm font-normal text-gray-500">
                            {allItems.length} total items
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {allItems.map((item, index) => (
                            <FeedbackItem
                                key={index}
                                item={item}
                                type={item.type}
                                onAnalyze={onAnalyze}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {/* Sentiment Trends Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sentiment Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SentimentTrend data={data.meta.sentiment_trend} />
                    </CardContent>
                </Card>

                {/* User Segments Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Segments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UserSegmentDistribution segments={data.meta.user_segments} />
                        <div className="mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Segment</TableHead>
                                        <TableHead>Count</TableHead>
                                        <TableHead>Impact</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.meta.user_segments.map((segment, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{segment.name}</TableCell>
                                            <TableCell>{segment.count}</TableCell>
                                            <TableCell>
                                                <Progress
                                                    value={(segment.count / allItems.length) * 100}
                                                    className="w-24"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FeedbackOverview;