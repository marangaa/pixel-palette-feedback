import React from 'react';
import { Users, AlertCircle, Rocket, Clock } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ResourceAllocation } from '@/types/roadmap';
import {cn} from "@/lib/utils";

interface ResourcePanelProps {
    resources: ResourceAllocation[];
    onUpdate?: (resourceId: string, updates: any) => void;
}

interface TeamUtilization {
    teamId: string;
    totalAllocation: number;
    overallocated: boolean;
    allocations: ResourceAllocation[];
}

const ResourceCard: React.FC<{ utilization: TeamUtilization }> = ({ utilization }) => {
    // Sort allocations by start date
    const sortedAllocations = [...utilization.allocations].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return (
        <Card className={cn(
            "hover:shadow-md transition-shadow",
            utilization.overallocated && "border-red-200"
        )}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {utilization.teamId}
                    </CardTitle>
                    {utilization.overallocated && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Team is overallocated</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                        <span>Total Allocation</span>
                        <span className={cn(
                            "font-medium",
                            utilization.overallocated ? "text-red-600" : "text-green-600"
                        )}>
                            {utilization.totalAllocation}%
                        </span>
                    </div>
                    <Progress
                        value={utilization.totalAllocation}
                        className={cn(
                            utilization.overallocated && "bg-red-100"
                        )}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {sortedAllocations.map((allocation) => (
                        <div
                            key={allocation.id}
                            className="bg-gray-50 p-3 rounded-lg space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Rocket className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-sm">
                                        {allocation.item.title}
                                    </span>
                                </div>
                                <Badge variant="outline">
                                    {allocation.item.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>
                                    {new Date(allocation.startDate).toLocaleDateString()} -
                                    {new Date(allocation.endDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <Progress
                                    value={allocation.allocation}
                                    className="flex-1 mr-2"
                                />
                                <span className="text-xs font-medium">
                                    {allocation.allocation}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export const ResourcePanel: React.FC<ResourcePanelProps> = ({
                                                                resources,
                                                                onUpdate
                                                            }) => {
    // Calculate team utilization
    const teamUtilization = React.useMemo(() => {
        const utilization = resources.reduce<Record<string, TeamUtilization>>((acc, resource) => {
            if (!acc[resource.teamId]) {
                acc[resource.teamId] = {
                    teamId: resource.teamId,
                    totalAllocation: 0,
                    overallocated: false,
                    allocations: []
                };
            }

            acc[resource.teamId].totalAllocation += resource.allocation;
            acc[resource.teamId].overallocated = acc[resource.teamId].totalAllocation > 100;
            acc[resource.teamId].allocations.push(resource);

            return acc;
        }, {});

        return Object.values(utilization);
    }, [resources]);

    // Get overall statistics
    const stats = React.useMemo(() => {
        return {
            totalTeams: teamUtilization.length,
            overallocatedTeams: teamUtilization.filter(t => t.overallocated).length,
            averageUtilization: teamUtilization.reduce((sum, team) =>
                sum + team.totalAllocation, 0) / teamUtilization.length
        };
    }, [teamUtilization]);

    return (
        <div className="bg-white rounded-lg border p-4 w-full space-y-6">
            <div>
                <h2 className="text-lg font-semibold mb-4">Resource Allocation</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                                {stats.averageUtilization.toFixed(1)}%
                            </div>
                            <p className="text-sm text-gray-500">Average Utilization</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-red-600">
                                {stats.overallocatedTeams}
                            </div>
                            <p className="text-sm text-gray-500">Overallocated Teams</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="space-y-4">
                {teamUtilization.map((team) => (
                    <ResourceCard key={team.teamId} utilization={team} />
                ))}
            </div>

            {teamUtilization.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No resource allocations found
                </div>
            )}
        </div>
    );
};

export default ResourcePanel;