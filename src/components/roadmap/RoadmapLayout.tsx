import React, { useState } from 'react';
import {
    CalendarDays,
    GitBranch,
    LayoutGrid,
    LineChart,
    Filter,
    SlidersHorizontal,
    Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoadmapTimeline, RoadmapView, RoadmapFilter } from '@/types/roadmap';
import { RoadmapTimelineView } from './RoadmapTimelineView';
import { RoadmapKanbanView } from './RoadmapKanbanView';
import { RoadmapGraphView } from './RoadmapGraphView';
import { RoadmapCalendarView } from './RoadmapCalendarView';
import { RoadmapFilters } from './RoadmapFilters';
import { ResourcePanel } from './ResourcePanel';

interface RoadmapLayoutProps {
    data: RoadmapTimeline;
    onUpdateItem: (itemId: string, updates: any) => void;
    onCreateBranch: (itemId: string, branchData: any) => void;
    onUpdateResource: (resourceId: string, updates: any) => void;
}

export const RoadmapLayout: React.FC<RoadmapLayoutProps> = ({
                                                                data,
                                                                onUpdateItem,
                                                                onCreateBranch,
                                                                onUpdateResource
                                                            }) => {
    const [view, setView] = useState<RoadmapView>({
        type: 'timeline',
        showDependencies: true,
        showResources: true,
        showAnalysis: true,
        showFeedback: true
    });

    const [filters, setFilters] = useState<RoadmapFilter>({
        timeframes: ['current', 'next', 'future'],
        priorities: ['critical', 'high', 'medium', 'low'],
        status: ['planned', 'in-progress', 'blocked', 'completed']
    });

    const [showResourcePanel, setShowResourcePanel] = useState(false);

    const viewComponents = {
        timeline: RoadmapTimelineView,
        kanban: RoadmapKanbanView,
        graph: RoadmapGraphView,
        calendar: RoadmapCalendarView
    };

    const CurrentViewComponent = viewComponents[view.type];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-8xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Product Roadmap</h1>
                        <p className="text-gray-600">Interactive roadmap with feasibility analysis</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowResourcePanel(!showResourcePanel)}
                        >
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Resources
                        </Button>

                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filters
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-72">
                                <RoadmapFilters
                                    filters={filters}
                                    onChange={setFilters}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex bg-white rounded-lg border p-1">
                            <Button
                                variant={view.type === 'timeline' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setView({ ...view, type: 'timeline' })}
                            >
                                <LineChart className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={view.type === 'kanban' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setView({ ...view, type: 'kanban' })}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={view.type === 'graph' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setView({ ...view, type: 'graph' })}
                            >
                                <GitBranch className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={view.type === 'calendar' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setView({ ...view, type: 'calendar' })}
                            >
                                <CalendarDays className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-6">
                    {/* Resource Panel */}
                    {showResourcePanel && (
                        <div className="w-80 shrink-0">
                            <ResourcePanel
                                resources={data.resources}
                                onUpdate={onUpdateResource}
                            />
                        </div>
                    )}

                    {/* Main View */}
                    <div className="flex-1 bg-white rounded-lg shadow-sm border p-6">
                        <CurrentViewComponent
                            data={data}
                            view={view}
                            filters={filters}
                            onUpdateItem={onUpdateItem}
                            onCreateBranch={onCreateBranch}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadmapLayout;