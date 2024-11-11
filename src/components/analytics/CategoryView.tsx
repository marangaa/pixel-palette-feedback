import React from 'react';
import { categories } from './FeedbackCategories';
import { CategoryData } from '@/types/feedback';

interface CategoryViewProps {
    category: keyof typeof categories;
    data?: CategoryData[keyof CategoryData];
}

const TagList: React.FC<{ tags?: string[] }> = ({ tags }) => {
    if (!tags?.length) return null;

    return (
        <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
};

const StatusBadge: React.FC<{
    label: string;
    type: 'priority' | 'severity' | 'status' | 'sentiment';
    value?: string;
}> = ({ label, type, value }) => {
    if (!value) return null;

    const getColorClass = () => {
        if (value === 'high' || value === 'active' || value === 'negative') {
            return 'bg-red-100 text-red-800';
        }
        if (value === 'medium' || value === 'investigating' || value === 'neutral') {
            return 'bg-yellow-100 text-yellow-800';
        }
        return 'bg-green-100 text-green-800';
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass()}`}>
            {type === 'sentiment' ? value : `${label}: ${value.toUpperCase()}`}
        </span>
    );
};

const EmptyCategory: React.FC<{ category: keyof typeof categories }> = ({ category }) => {
    const categoryInfo = categories[category];
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
                {React.createElement(categoryInfo.icon, {
                    className: `w-6 h-6 ${categoryInfo.color}`
                })}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {categoryInfo.title}
                    </h3>
                    <p className="text-sm text-gray-600">{categoryInfo.description}</p>
                </div>
            </div>
            <div className="text-center py-8">
                <p className="text-gray-500">No data available for this category</p>
            </div>
        </div>
    );
};

export const CategoryView: React.FC<CategoryViewProps> = ({ category, data }) => {
    const categoryInfo = categories[category];

    // Handle case where data is undefined
    if (!data?.items) {
        return <EmptyCategory category={category} />;
    }

    const renderBadges = (item: any) => {
        return (
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">
                    {item.count || 0} mentions
                </span>
                <StatusBadge
                    label="Sentiment"
                    type="sentiment"
                    value={item.sentiment}
                />
                <StatusBadge
                    label="Priority"
                    type="priority"
                    value={item.priority}
                />
                <StatusBadge
                    label="Severity"
                    type="severity"
                    value={item.severity}
                />
                <StatusBadge
                    label="Status"
                    type="status"
                    value={item.status}
                />
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    {React.createElement(categoryInfo.icon, {
                        className: `w-6 h-6 ${categoryInfo.color}`
                    })}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {categoryInfo.title}
                        </h3>
                        <p className="text-sm text-gray-600">{categoryInfo.description}</p>
                    </div>
                </div>

                {data.stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                        {Object.entries(data.stats)
                            .filter(([_, value]) => !Array.isArray(value)) // Filter out array values like tags
                            .map(([key, value]) => (
                                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 capitalize">
                                        {key.split('_').join(' ')}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {typeof value === 'number' && !Number.isInteger(value)
                                            ? value.toFixed(1)
                                            : value}
                                    </p>
                                </div>
                            ))}
                    </div>
                )}

                <div className="space-y-4">
                    {data.items.map((item, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-gray-800">{item.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                </div>
                                {renderBadges(item)}
                            </div>
                            <TagList tags={item.tags} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryView;