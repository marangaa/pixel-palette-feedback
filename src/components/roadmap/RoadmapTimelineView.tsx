import React, { useState } from 'react';
import { motion } from "framer-motion";
import {
    GitBranch,
    Users,
    Timer,
    BarChart,
    MessageSquare
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import type {
    RoadmapTimeline,
    RoadmapView,
    RoadmapFilter,
    RoadmapItem,
    RoadmapBranch
} from '@/types/roadmap';

// Create a client-side only version of TimelineItem
const TimelineItem = dynamic(() => Promise.resolve(({
                                                        item,
                                                        onBranchCreate,
                                                        showAnalysis = true,
                                                        showFeedback = true
                                                    }: TimelineItemProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const getStatusColor = (status: string) => {
        const colors = {
            'planned': 'bg-blue-100 text-blue-800',
            'in-progress': 'bg-yellow-100 text-yellow-800',
            'blocked': 'bg-red-100 text-red-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-gray-100 text-gray-800'
        };
        return colors[status as keyof typeof colors] || colors.planned;
    };

    const getPriorityColor = (priority: string) => {
        const colors = {
            'critical': 'bg-red-100 text-red-800',
            'high': 'bg-orange-100 text-orange-800',
            'medium': 'bg-yellow-100 text-yellow-800',
            'low': 'bg-green-100 text-green-800'
        };
        return colors[priority as keyof typeof colors] || colors.medium;
    };

    const handleNavigate = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        // Use window.location instead of router for client-side navigation
        window.location.href = `/analysis?itemId=${item.id}`;
    };

    return (
        <motion.div
            className="relative bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleNavigate}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="absolute top-2 right-2 flex gap-2">
                {onBranchCreate && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onBranchCreate(item.id);
                        }}
                        className={`transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <GitBranch className="w-4 h-4" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNavigate}
                    className={`transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                >
                    <BarChart className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
                <Badge className={getStatusColor(item.status)}>
                    {item.status}
                </Badge>
                <Badge className={getPriorityColor(item.priority)}>
                    {item.priority}
                </Badge>
                {item.assignedTeam && (
                    <Badge variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        {item.assignedTeam}
                    </Badge>
                )}
            </div>

            {showAnalysis && item.analysis && (
                <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Feasibility</span>
                        <Progress value={item.analysis.feasibility} className="w-32" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Impact</span>
                        <Progress value={item.analysis.impact} className="w-32" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Risk</span>
                        <Progress value={item.analysis.risk} className="w-32" />
                    </div>
                </div>
            )}

            {showFeedback && item.feedbackData && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {item.feedbackData.requestCount} requests
                    </div>
                    <div className="flex items-center">
                        <BarChart className="w-4 h-4 mr-1" />
                        {item.feedbackData.avgSentiment.toFixed(1)} sentiment
                    </div>
                </div>
            )}

            {item.dependencies.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Timer className="w-4 h-4" />
                        <span>Dependencies: {item.dependencies.join(', ')}</span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}), { ssr: false }); // Disable server-side rendering for this component

interface TimelineItemProps {
    item: RoadmapItem;
    onBranchCreate?: (itemId: string) => void;
    showAnalysis?: boolean;
    showFeedback?: boolean;
}

// Rest of the components remain the same...
interface TimelineBranchProps {
    branch: RoadmapBranch;
    level: number;
    onBranchCreate?: (itemId: string) => void;
    showAnalysis?: boolean;
    showFeedback?: boolean;
}

const TimelineBranch: React.FC<TimelineBranchProps> = ({
                                                           branch,
                                                           level,
                                                           onBranchCreate,
                                                           showAnalysis,
                                                           showFeedback
                                                       }) => {
    return (
        <div className={`pl-${level * 8}`}>
            <div className="relative">
                <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                            <GitBranch className="w-4 h-4 text-purple-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">{branch.title}</h4>
                        <Badge variant="outline">
                            {branch.probability}% probable
                        </Badge>
                    </div>
                    <div className="space-y-4">
                        {branch.items.map((item) => (
                            <TimelineItem
                                key={item.id}
                                item={item}
                                onBranchCreate={onBranchCreate}
                                showAnalysis={showAnalysis}
                                showFeedback={showFeedback}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface RoadmapTimelineViewProps {
    data: RoadmapTimeline;
    view: RoadmapView;
    filters: RoadmapFilter;
    onUpdateItem: (itemId: string, updates: any) => void;
    onCreateBranch: (itemId: string, branchData: any) => void;
}

export const RoadmapTimelineView: React.FC<RoadmapTimelineViewProps> = ({
                                                                            data,
                                                                            view,
                                                                            filters,
                                                                            onUpdateItem,
                                                                            onCreateBranch
                                                                        }) => {
    const [selectedQuarter, setSelectedQuarter] = useState<string>('Q1 2024');

    const quarters = React.useMemo(() => {
        const defaultQuarter = {
            mainBranch: [],
            alternativeBranches: []
        };

        if (!data || !data.quarters) {
            return {
                'Q1 2024': defaultQuarter,
                'Q2 2024': defaultQuarter,
                'Q3 2024': defaultQuarter,
                'Q4 2024': defaultQuarter
            };
        }

        return data.quarters;
    }, [data]);

    const handleBranchCreate = (itemId: string) => {
        const item = quarters[selectedQuarter]?.mainBranch?.find(i => i.id === itemId);
        if (!item) return;

        onCreateBranch(itemId, {
            title: `Alternative to ${item.title}`,
            description: `Alternative approach for ${item.title}`,
            probability: 50,
            items: []
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex gap-2">
                {Object.keys(quarters).map((quarter) => (
                    <Button
                        key={quarter}
                        variant={quarter === selectedQuarter ? 'default' : 'outline'}
                        onClick={() => setSelectedQuarter(quarter)}
                    >
                        {quarter}
                    </Button>
                ))}
            </div>

            <div className="space-y-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Main Track</h3>
                    {quarters[selectedQuarter]?.mainBranch?.map((item) => (
                        <TimelineItem
                            key={item.id}
                            item={item}
                            onBranchCreate={handleBranchCreate}
                            showAnalysis={view.showAnalysis}
                            showFeedback={view.showFeedback}
                        />
                    ))}
                </div>

                {quarters[selectedQuarter]?.alternativeBranches?.map((branch) => (
                    <TimelineBranch
                        key={branch.id}
                        branch={branch}
                        level={1}
                        onBranchCreate={handleBranchCreate}
                        showAnalysis={view.showAnalysis}
                        showFeedback={view.showFeedback}
                    />
                ))}
            </div>
        </div>
    );
};