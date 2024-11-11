import React, { useState } from 'react';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    parseISO,
    isWithinInterval
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Milestone,
    Clock,
    AlertCircle,
    CheckCircle,
    GitBranch
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { RoadmapTimeline, RoadmapItem, Milestone as MilestoneType } from '@/types/roadmap';

interface CalendarHeaderProps {
    currentDate: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    view: 'month' | 'timeline';
    onViewChange: (view: 'month' | 'timeline') => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
                                                           currentDate,
                                                           onPreviousMonth,
                                                           onNextMonth,
                                                           view,
                                                           onViewChange
                                                       }) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center bg-white rounded-lg border p-1">
                <Button
                    variant={view === 'month' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onViewChange('month')}
                >
                    <CalendarIcon className="w-4 h-4" />
                </Button>
                <Button
                    variant={view === 'timeline' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onViewChange('timeline')}
                >
                    <GitBranch className="w-4 h-4" />
                </Button>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={onPreviousMonth}>
                <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onNextMonth}>
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    </div>
);

interface CalendarItemProps {
    item: RoadmapItem;
    showAnalysis?: boolean;
}

const CalendarItem: React.FC<CalendarItemProps> = ({ item, showAnalysis }) => {
    const getStatusColor = (status: string) => {
        const colors = {
            'planned': 'bg-blue-100 text-blue-800 border-blue-200',
            'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'blocked': 'bg-red-100 text-red-800 border-red-200',
            'completed': 'bg-green-100 text-green-800 border-green-200',
            'cancelled': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[status as keyof typeof colors] || colors.planned;
    };

    return (
        <div className={`p-2 rounded-md ${getStatusColor(item.status)} mb-1 cursor-pointer
            hover:shadow-sm transition-shadow`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    {item.milestones.length > 0 && (
                        <div className="flex items-center gap-1 mt-1 text-xs">
                            <Milestone className="w-3 h-3" />
                            {item.milestones.length} milestones
                        </div>
                    )}
                </div>
                {showAnalysis && item.analysis && (
                    <div className="flex items-center gap-1">
                        {item.analysis.risk > 70 && (
                            <AlertCircle className="w-3 h-3 text-red-500" />
                        )}
                        {item.status === 'completed' && (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

interface CalendarDayProps {
    date: Date;
    currentMonth: Date;
    items: RoadmapItem[];
    milestones: MilestoneType[];
    showAnalysis?: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
                                                     date,
                                                     currentMonth,
                                                     items,
                                                     milestones,
                                                     showAnalysis
                                                 }) => {
    const dayClasses = `min-h-[120px] p-2 border-r border-b relative ${
        !isSameMonth(date, currentMonth) ? 'bg-gray-50' : ''
    } ${isToday(date) ? 'bg-blue-50' : ''}`;

    return (
        <div className={dayClasses}>
            <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${
                    !isSameMonth(date, currentMonth) ? 'text-gray-400' : 'text-gray-900'
                }`}>
                    {format(date, 'd')}
                </span>
                {milestones.length > 0 && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Milestone className="w-4 h-4 text-purple-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <ul className="text-xs space-y-1">
                                    {milestones.map((milestone, index) => (
                                        <li key={index}>{milestone.title}</li>
                                    ))}
                                </ul>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            <div className="space-y-1">
                {items.map((item, index) => (
                    <CalendarItem
                        key={index}
                        item={item}
                        showAnalysis={showAnalysis}
                    />
                ))}
            </div>
        </div>
    );
};

interface TimelineViewProps {
    items: RoadmapItem[];
    startDate: Date;
    endDate: Date;
    showAnalysis?: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({
                                                       items,
                                                       startDate,
                                                       endDate,
                                                       showAnalysis
                                                   }) => {
    const weeks = eachDayOfInterval({ start: startDate, end: endDate })
        .filter((date) => date.getDay() === 0);

    return (
        <div className="relative">
            {/* Timeline Header */}
            <div className="flex border-b sticky top-0 bg-white z-10">
                <div className="w-48 p-4 border-r">
                    <h3 className="font-medium text-gray-900">Items</h3>
                </div>
                <div className="flex-1 flex">
                    {weeks.map((week, index) => (
                        <div
                            key={index}
                            className="flex-1 p-4 text-center border-r text-sm text-gray-600"
                        >
                            {format(week, 'MMM d')}
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline Content */}
            <div className="divide-y">
                {items.map((item, itemIndex) => (
                    <div key={item.id} className="flex">
                        <div className="w-48 p-4 border-r">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <Badge variant="outline" className="mt-1">
                                {item.status}
                            </Badge>
                        </div>
                        <div className="flex-1 flex relative">
                            {weeks.map((week, weekIndex) => (
                                <div
                                    key={weekIndex}
                                    className="flex-1 border-r p-2"
                                />
                            ))}
                            {/* Item Timeline Bar */}
                            <motion.div
                                className={`absolute h-6 rounded-full ${
                                    item.status === 'completed' ? 'bg-green-200' :
                                        item.status === 'in-progress' ? 'bg-yellow-200' :
                                            'bg-blue-200'
                                }`}
                                style={{
                                    left: '0%',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '80%' // Calculate based on dates
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: '80%' }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface RoadmapCalendarViewProps {
    data: RoadmapTimeline;
    showAnalysis?: boolean;
}

export const RoadmapCalendarView: React.FC<RoadmapCalendarViewProps> = ({
                                                                            data,
                                                                            showAnalysis = true
                                                                        }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'timeline'>('month');

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Organize items by date
    const getItemsForDate = (date: Date) => {
        return Object.values(data.quarters)
            .flatMap(quarter => [
                ...quarter.mainBranch,
                ...quarter.alternativeBranches.flatMap(branch => branch.items)
            ])
            .filter(item => {
                // Check if the item's timeline includes this date
                return true; // Implement actual date checking logic
            });
    };

    // Get milestones for date
    const getMilestonesForDate = (date: Date) => {
        return Object.values(data.quarters)
            .flatMap(quarter => quarter.mainBranch)
            .flatMap(item => item.milestones)
            .filter(milestone => isSameDay(parseISO(milestone.startDate), date));
    };

    return (
        <div className="bg-white rounded-lg p-6">
            <CalendarHeader
                currentDate={currentDate}
                onPreviousMonth={() => setCurrentDate(addMonths(currentDate, -1))}
                onNextMonth={() => setCurrentDate(addMonths(currentDate, 1))}
                view={view}
                onViewChange={setView}
            />

            <AnimatePresence mode="wait">
                {view === 'month' ? (
                    <motion.div
                        key="month"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="grid grid-cols-7 gap-0 border-l border-t">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="p-2 text-sm font-medium text-gray-900 border-r border-b">
                                    {day}
                                </div>
                            ))}
                            {days.map((day, dayIdx) => (
                                <CalendarDay
                                    key={day.toISOString()}
                                    date={day}
                                    currentMonth={currentDate}
                                    items={getItemsForDate(day)}
                                    milestones={getMilestonesForDate(day)}
                                    showAnalysis={showAnalysis}
                                />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="timeline"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="border rounded-lg"
                    >
                        <TimelineView
                            items={Object.values(data.quarters)
                                .flatMap(quarter => quarter.mainBranch)}
                            startDate={startDate}
                            endDate={endDate}
                            showAnalysis={showAnalysis}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoadmapCalendarView;