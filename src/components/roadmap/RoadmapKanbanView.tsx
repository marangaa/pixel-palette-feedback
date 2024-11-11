import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart,
    Users,
    GitBranch,
    MessageSquare,
    ChevronDown,
    ChevronUp,
    MoreHorizontal
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RoadmapTimeline, RoadmapItem, Status } from '@/types/roadmap';

interface KanbanItemProps {
    item: RoadmapItem;
    index: number;
    showAnalysis?: boolean;
    showFeedback?: boolean;
}

const KanbanItem: React.FC<KanbanItemProps> = ({
                                                   item,
                                                   index,
                                                   showAnalysis = true,
                                                   showFeedback = true
                                               }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const getPriorityColor = (priority: string) => {
        const colors = {
            'critical': 'bg-red-100 text-red-800',
            'high': 'bg-orange-100 text-orange-800',
            'medium': 'bg-yellow-100 text-yellow-800',
            'low': 'bg-green-100 text-green-800'
        };
        return colors[priority as keyof typeof colors] || colors.medium;
    };

    return (
        <Draggable draggableId={item.id} index={index}>
            {(provided, snapshot) => (
                <motion.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white rounded-lg shadow-sm border p-4 mb-3 
                        ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            {item.branches && item.branches.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                    <GitBranch className="w-3 h-3" />
                                    {item.branches.length} alternative paths
                                </div>
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Create Branch</DropdownMenuItem>
                                <DropdownMenuItem>View Analysis</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                        </Badge>
                        {item.assignedTeam && (
                            <Badge variant="outline">
                                <Users className="w-3 h-3 mr-1" />
                                {item.assignedTeam}
                            </Badge>
                        )}
                        {item.effort > 0 && (
                            <Badge variant="outline">
                                {item.effort} points
                            </Badge>
                        )}
                    </div>

                    {showAnalysis && item.analysis && (
                        <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-20 text-gray-500">Feasibility</span>
                                <Progress value={item.analysis.feasibility} className="flex-1" />
                                <span className="text-gray-600">{item.analysis.feasibility}%</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-20 text-gray-500">Impact</span>
                                <Progress value={item.analysis.impact} className="flex-1" />
                                <span className="text-gray-600">{item.analysis.impact}%</span>
                            </div>
                        </div>
                    )}

                    {showFeedback && item.feedbackData && (
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                {item.feedbackData.requestCount}
                            </div>
                            <div className="flex items-center">
                                <BarChart className="w-3 h-3 mr-1" />
                                {item.feedbackData.avgSentiment.toFixed(1)}
                            </div>
                        </div>
                    )}

                    {item.dependencies.length > 0 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-1 text-xs text-gray-500 mt-3 hover:text-gray-700"
                        >
                            {isExpanded ? (
                                <ChevronUp className="w-3 h-3" />
                            ) : (
                                <ChevronDown className="w-3 h-3" />
                            )}
                            {item.dependencies.length} dependencies
                        </button>
                    )}

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-2 pt-2 border-t"
                            >
                                <ul className="space-y-1">
                                    {item.dependencies.map((dep, idx) => (
                                        <li key={idx} className="text-xs text-gray-600">
                                            • {dep}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </Draggable>
    );
};

interface KanbanColumnProps {
    title: string;
    items: RoadmapItem[];
    status: Status;
    showAnalysis?: boolean;
    showFeedback?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
                                                       title,
                                                       items,
                                                       status,
                                                       showAnalysis,
                                                       showFeedback
                                                   }) => {
    const getColumnColor = (status: Status) => {
        const colors = {
            'planned': 'border-blue-200',
            'in-progress': 'border-yellow-200',
            'blocked': 'border-red-200',
            'completed': 'border-green-200',
            'cancelled': 'border-gray-200'
        };
        return colors[status];
    };

    return (
        <div className={`flex-1 min-w-[300px] max-w-[400px] bg-gray-50 rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{title}</h3>
                <Badge variant="secondary">{items.length}</Badge>
            </div>

            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] transition-colors ${
                            snapshot.isDraggingOver ? 'bg-gray-100' : ''
                        }`}
                    >
                        <AnimatePresence>
                            {items.map((item, index) => (
                                <KanbanItem
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    showAnalysis={showAnalysis}
                                    showFeedback={showFeedback}
                                />
                            ))}
                        </AnimatePresence>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

interface RoadmapKanbanViewProps {
    data: RoadmapTimeline;
    showAnalysis?: boolean;
    showFeedback?: boolean;
    onUpdateItem: (itemId: string, updates: any) => void;
}

export const RoadmapKanbanView: React.FC<RoadmapKanbanViewProps> = ({
                                                                        data,
                                                                        showAnalysis = true,
                                                                        showFeedback = true,
                                                                        onUpdateItem
                                                                    }) => {
    // Organize items by status
    const organizedItems = React.useMemo(() => {
        const result: Record<Status, RoadmapItem[]> = {
            planned: [],
            'in-progress': [],
            blocked: [],
            completed: [],
            cancelled: []
        };

        Object.values(data.quarters).forEach(quarter => {
            quarter.mainBranch.forEach(item => {
                result[item.status].push(item);
            });
            quarter.alternativeBranches.forEach(branch => {
                branch.items.forEach(item => {
                    result[item.status].push(item);
                });
            });
        });

        return result;
    }, [data]);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const itemId = result.draggableId;
        const newStatus = result.destination.droppableId as Status;

        onUpdateItem(itemId, { status: newStatus });
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4">
                <KanbanColumn
                    title="Planned"
                    items={organizedItems.planned}
                    status="planned"
                    showAnalysis={showAnalysis}
                    showFeedback={showFeedback}
                />
                <KanbanColumn
                    title="In Progress"
                    items={organizedItems['in-progress']}
                    status="in-progress"
                    showAnalysis={showAnalysis}
                    showFeedback={showFeedback}
                />
                <KanbanColumn
                    title="Blocked"
                    items={organizedItems.blocked}
                    status="blocked"
                    showAnalysis={showAnalysis}
                    showFeedback={showFeedback}
                />
                <KanbanColumn
                    title="Completed"
                    items={organizedItems.completed}
                    status="completed"
                    showAnalysis={showAnalysis}
                    showFeedback={showFeedback}
                />
            </div>
        </DragDropContext>
    );
};

export default RoadmapKanbanView;