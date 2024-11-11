import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { TeamPerspective } from '@/types/detailed-analysis';

interface TeamMemberCardProps {
    perspective: TeamPerspective;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ perspective }) => {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarFallback>
                        {perspective.role.split(' ').map(word => word[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <CardTitle className="text-lg">{perspective.role}</CardTitle>
                    <div className="flex items-center gap-2">
                        <Progress value={perspective.confidence_level * 100} className="w-24" />
                        <span className="text-sm text-gray-600">
                            {Math.round(perspective.confidence_level * 100)}% confidence
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Concerns */}
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Concerns</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {perspective.concerns.map((concern, index) => (
                                <li key={index} className="text-sm text-gray-600">{concern}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Priorities */}
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Priorities</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {perspective.priorities.map((priority, index) => (
                                <li key={index} className="text-sm text-gray-600">{priority}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Expertise Areas */}
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Expertise Areas</h4>
                        <div className="flex flex-wrap gap-2">
                            {perspective.expertise_areas.map((area, index) => (
                                <Badge key={index} variant="secondary">
                                    {area}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Estimated Effort */}
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Estimated Effort</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Timeline</p>
                                    <p className="font-medium">{perspective.estimated_effort.time}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Required Resources</p>
                                    <ul className="list-disc list-inside">
                                        {perspective.estimated_effort.resources.map((resource, index) => (
                                            <li key={index} className="text-sm">{resource}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Constraints */}
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Constraints</h4>
                        <div className="flex flex-wrap gap-2">
                            {perspective.constraints.map((constraint, index) => (
                                <Badge key={index} variant="destructive">
                                    {constraint}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

interface TeamPerspectivesViewProps {
    perspectives: TeamPerspective[];
    onUpdateFeedback?: (feedback: any) => void;
}

export const TeamPerspectivesView: React.FC<TeamPerspectivesViewProps> = ({
                                                                              perspectives,
                                                                              onUpdateFeedback
                                                                          }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Team Perspectives</h2>
                <p className="text-gray-600">Analysis from different team roles and specialties</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {perspectives.map((perspective, index) => (
                    <TeamMemberCard key={index} perspective={perspective} />
                ))}
            </div>
        </div>
    );
};

export default TeamPerspectivesView;