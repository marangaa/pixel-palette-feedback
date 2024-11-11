import React from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { RoadmapFilter } from '@/types/roadmap';

interface RoadmapFiltersProps {
    filters: RoadmapFilter;
    onChange: (filters: RoadmapFilter) => void;
}

export const RoadmapFilters: React.FC<RoadmapFiltersProps> = ({
                                                                  filters,
                                                                  onChange
                                                              }) => {
    const timeframes = ['current', 'next', 'future', 'completed'];
    const priorities = ['critical', 'high', 'medium', 'low'];
    const statuses = ['planned', 'in-progress', 'blocked', 'completed', 'cancelled'];

    const [open, setOpen] = React.useState(false);

    const handleTimeframeToggle = (timeframe: string) => {
        const newTimeframes = filters.timeframes.includes(timeframe)
            ? filters.timeframes.filter(t => t !== timeframe)
            : [...filters.timeframes, timeframe];
        onChange({ ...filters, timeframes: newTimeframes });
    };

    const handlePriorityToggle = (priority: string) => {
        const newPriorities = filters.priorities.includes(priority)
            ? filters.priorities.filter(p => p !== priority)
            : [...filters.priorities, priority];
        onChange({ ...filters, priorities: newPriorities });
    };

    const handleStatusToggle = (status: string) => {
        const newStatuses = filters.status.includes(status)
            ? filters.status.filter(s => s !== status)
            : [...filters.status, status];
        onChange({ ...filters, status: newStatuses });
    };

    return (
        <div className="space-y-4 p-4">
            {/* Teams Filter */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Teams</label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {filters.teams?.length
                                ? `${filters.teams.length} teams selected`
                                : "Select teams..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Search teams..." />
                            <CommandEmpty>No teams found.</CommandEmpty>
                            <CommandGroup>
                                {['Team A', 'Team B', 'Team C'].map((team) => (
                                    <CommandItem
                                        key={team}
                                        onSelect={() => {
                                            const newTeams = filters.teams?.includes(team)
                                                ? filters.teams.filter(t => t !== team)
                                                : [...(filters.teams || []), team];
                                            onChange({ ...filters, teams: newTeams });
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                filters.teams?.includes(team)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {team}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <Separator />

            {/* Timeframes */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Timeframes</label>
                <div className="flex flex-wrap gap-2">
                    {timeframes.map((timeframe) => (
                        <Badge
                            key={timeframe}
                            variant={filters.timeframes.includes(timeframe) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleTimeframeToggle(timeframe)}
                        >
                            {timeframe}
                        </Badge>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Priorities */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Priorities</label>
                <div className="flex flex-wrap gap-2">
                    {priorities.map((priority) => (
                        <Badge
                            key={priority}
                            variant={filters.priorities.includes(priority) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handlePriorityToggle(priority)}
                        >
                            {priority}
                        </Badge>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                        <Badge
                            key={status}
                            variant={filters.status.includes(status) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleStatusToggle(status)}
                        >
                            {status}
                        </Badge>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Feasibility Range */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Feasibility Range</label>
                <Slider
                    defaultValue={filters.feasibilityRange || [0, 100]}
                    max={100}
                    step={1}
                    onValueChange={(values) =>
                        onChange({ ...filters, feasibilityRange: values as [number, number] })
                    }
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{filters.feasibilityRange?.[0] || 0}%</span>
                    <span>{filters.feasibilityRange?.[1] || 100}%</span>
                </div>
            </div>

            {/* Analysis & Feedback Toggles */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Has Analysis</label>
                    <Switch
                        checked={filters.hasAnalysis || false}
                        onCheckedChange={(checked) =>
                            onChange({ ...filters, hasAnalysis: checked })
                        }
                    />
                </div>
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Has Feedback</label>
                    <Switch
                        checked={filters.hasFeedback || false}
                        onCheckedChange={(checked) =>
                            onChange({ ...filters, hasFeedback: checked })
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default RoadmapFilters;