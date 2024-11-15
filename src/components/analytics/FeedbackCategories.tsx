import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Bug,
    Lightbulb,
    MessageSquare,
    PlusSquare,
    ZapIcon,
    ThumbsUp,
    XCircle
} from 'lucide-react';
import type { CategoryKey } from '@/types/feedback';

export const categories = {
    feature_requests: {
        icon: PlusSquare,
        title: "Feature Requests",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        description: "New functionality requested by users"
    },
    bugs: {
        icon: Bug,
        title: "Bugs",
        color: "text-red-600",
        bgColor: "bg-red-100",
        description: "Issues and problems reported"
    },
    improvements: {
        icon: Lightbulb,
        title: "Improvements",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        description: "Suggestions for existing features"
    },
    performance: {
        icon: ZapIcon,
        title: "Performance",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        description: "Speed and optimization feedback"
    },
    praise: {
        icon: ThumbsUp,
        title: "Praise",
        color: "text-green-600",
        bgColor: "bg-green-100",
        description: "Positive feedback and compliments"
    },
    issues: {
        icon: XCircle,
        title: "Issues",
        color: "text-red-600",
        bgColor: "bg-red-100",
        description: "Problems and concerns"
    },
    general_feedback: {
        icon: MessageSquare,
        title: "General Feedback",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        description: "Miscellaneous comments and suggestions"
    }
} as const;

interface NavigationButtonProps {
    onClick: () => void;
    direction: 'left' | 'right';
    className?: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ onClick, direction, className = '' }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
        aria-label={direction === 'left' ? 'Previous category' : 'Next category'}
    >
        {direction === 'left' ? (
            <ChevronLeft className="w-6 h-6 text-gray-600" />
        ) : (
            <ChevronRight className="w-6 h-6 text-gray-600" />
        )}
    </button>
);

interface CategoryButtonProps {
    category: CategoryKey;
    isSelected: boolean;
    onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, isSelected, onClick }) => {
    const categoryInfo = categories[category];
    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg transition-colors ${
                isSelected
                    ? `${categoryInfo.bgColor} ${categoryInfo.color}`
                    : 'hover:bg-gray-100'
            }`}
            aria-label={categoryInfo.title}
            title={categoryInfo.description}
        >
            {React.createElement(categoryInfo.icon, {
                className: 'w-5 h-5'
            })}
        </button>
    );
};

interface FeedbackNavigationProps {
    currentCategory: CategoryKey;
    onCategoryChange: (category: CategoryKey | 'prev' | 'next') => void;
}

export const FeedbackNavigation: React.FC<FeedbackNavigationProps> = ({
                                                                          currentCategory,
                                                                          onCategoryChange
                                                                      }) => {
    return (
        <div className="flex items-center justify-between space-x-4">
            <NavigationButton
                onClick={() => onCategoryChange('prev')}
                direction="left"
            />

            <div className="flex items-center space-x-2">
                {(Object.keys(categories) as CategoryKey[]).map((key) => (
                    <CategoryButton
                        key={key}
                        category={key}
                        isSelected={currentCategory === key}
                        onClick={() => onCategoryChange(key)}
                    />
                ))}
            </div>

            <NavigationButton
                onClick={() => onCategoryChange('next')}
                direction="right"
            />
        </div>
    );
};