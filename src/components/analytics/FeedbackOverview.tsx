import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie } from 'recharts';
import type { FeedbackAnalysis, FeedbackItem, SentimentDataPoint, UserSegment } from '@/types/feedback';

interface FeedbackItemProps {
    item: FeedbackItem;
    onAnalyze: (item: FeedbackItem) => void;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ item, onAnalyze }) => {
    const getPriorityColor = (priority: string | undefined): string => {
        const colors = {
            high: 'bg-red-100 text-red-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800'
        } as const;
        return colors[priority as keyof typeof colors] || colors.medium;
    };

    const getTypeIcon = (type: FeedbackItem['type']): string => {
        const icons = {
            bug: '🐛',
            feature: '✨',
            improvement: '💡',
            performance: '⚡',
            praise: '❤️',
            issue: '⚠️',
            general: '💭'
        };
        return icons[type] || '💭';
    };

    return (
        <div
            onClick={() => onAnalyze(item)}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-purple-200"
        >
            <div className="flex items-start space-x-3">
                <span className="text-xl">{getTypeIcon(item.type)}</span>
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
                        {item.status && (
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                                {item.status}
                            </span>
                        )}
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

interface FeedbackOverviewProps {
    data: FeedbackAnalysis;
    onAnalyze: (item: FeedbackItem) => void;
}

const FeedbackOverview: React.FC<FeedbackOverviewProps> = ({ data, onAnalyze }) => {
    // Helper function to map category items with type
    const mapCategoryItems = (
        items: FeedbackItem[],
        type: FeedbackItem['type']
    ): FeedbackItem[] => items.map(item => ({ ...item, type }));

    // Combine and sort all feedback items
    const allItems = [
        ...mapCategoryItems(data.categories.feature_requests.items, 'feature'),
        ...mapCategoryItems(data.categories.bugs.items, 'bug'),
        ...mapCategoryItems(data.categories.improvements.items, 'improvement'),
        ...mapCategoryItems(data.categories.performance.items, 'performance'),
        ...mapCategoryItems(data.categories.praise.items, 'praise'),
        ...mapCategoryItems(data.categories.issues.items, 'issue'),
        ...mapCategoryItems(data.categories.general_feedback.items, 'general')
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
                        {allItems.map((item) => (
                            <FeedbackItem
                                key={item.id}
                                item={item}
                                onAnalyze={onAnalyze}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Sentiment Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.meta.sentiment_trend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="period" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="sentiment_score" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="mention_count" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>User Segments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.meta.user_segments}
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
                                                    value={(segment.count / Math.max(1, allItems.length)) * 100}
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