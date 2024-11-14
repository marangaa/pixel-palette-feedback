import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Users,
    Server,
    GraduationCap,
    Clock,
    DollarSign,
    BookOpen
} from 'lucide-react';
import type { ResourceRequirements } from '@/types/detailed-analysis';

interface ResourceRequirementsViewProps {
    requirements: ResourceRequirements;
    onUpdate?: (updates: Partial<ResourceRequirements>) => void;
}

interface TeamAllocationCardProps {
    team: ResourceRequirements['teams_involved'][0];
    onUpdate?: (updates: Partial<typeof team>) => void;
}

const TeamAllocationCard: React.FC<TeamAllocationCardProps> = ({ team, onUpdate }) => {
    // Convert time string to approximate hours for progress bar
    const getTimeProgress = (timeStr: string) => {
        const hours = timeStr.toLowerCase().includes('week')
            ? parseInt(timeStr) * 40
            : parseInt(timeStr);
        return Math.min((hours / 160) * 100, 100); // Max at 4 weeks (160 hours)
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-medium text-gray-900">{team.team}</h3>
                        <p className="text-sm text-gray-500">{team.required_time}</p>
                    </div>
                    <Users className="w-5 h-5 text-gray-400" />
                </div>

                <Progress value={getTimeProgress(team.required_time)} className="mb-4" />

                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {team.key_skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

interface InfrastructureRequirementsProps {
    infrastructure: ResourceRequirements['infrastructure'];
    onUpdate?: (updates: Partial<typeof infrastructure>) => void;
}

const InfrastructureRequirements: React.FC<InfrastructureRequirementsProps> = ({
                                                                                   infrastructure,
                                                                                   onUpdate
                                                                               }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Infrastructure Requirements
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Estimated Costs
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                        ${infrastructure.estimated_costs.toLocaleString()}
                    </p>
                </div>
            </div>

            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">New Requirements</h4>
                <ul className="list-disc list-inside space-y-1">
                    {infrastructure.new_requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600">{req}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Needed Upgrades</h4>
                <ul className="list-disc list-inside space-y-1">
                    {infrastructure.upgrades_needed.map((upgrade, index) => (
                        <li key={index} className="text-sm text-gray-600">{upgrade}</li>
                    ))}
                </ul>
            </div>
        </CardContent>
    </Card>
);

interface TrainingRequirementsProps {
    training: ResourceRequirements['training'];
    onUpdate?: (updates: Partial<typeof training>) => void;
}

const TrainingRequirements: React.FC<TrainingRequirementsProps> = ({ training, onUpdate }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Training Requirements
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Training Duration
                </h4>
                <p className="text-lg font-semibold text-gray-900">{training.training_time}</p>
            </div>

            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                    {training.required_skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                            {skill}
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Training Materials</h4>
                <ul className="list-disc list-inside space-y-1">
                    {training.materials_needed.map((material, index) => (
                        <li key={index} className="text-sm text-gray-600">{material}</li>
                    ))}
                </ul>
            </div>
        </CardContent>
    </Card>
);

export const ResourceRequirementsView: React.FC<ResourceRequirementsViewProps> = ({
                                                                                      requirements,
                                                                                      onUpdate
                                                                                  }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Resource Requirements</h2>
                <p className="text-gray-600">Overview of needed resources and allocations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {requirements.teams_involved.map((team, index) => (
                    <TeamAllocationCard
                        key={index}
                        team={team}
                        onUpdate={updates => {
                            if (onUpdate) {
                                const newTeams = [...requirements.teams_involved];
                                newTeams[index] = { ...team, ...updates };
                                onUpdate({ teams_involved: newTeams });
                            }
                        }}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfrastructureRequirements
                    infrastructure={requirements.infrastructure}
                    onUpdate={updates => onUpdate?.({
                        infrastructure: { ...requirements.infrastructure, ...updates }
                    })}
                />
                <TrainingRequirements
                    training={requirements.training}
                    onUpdate={updates => onUpdate?.({
                        training: { ...requirements.training, ...updates }
                    })}
                />
            </div>
        </div>
    );
};

export default ResourceRequirementsView;