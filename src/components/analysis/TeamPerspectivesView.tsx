import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { TeamPerspective } from '@/types/analysis';

interface TeamPerspectivesViewProps {
    perspectives: TeamPerspective[];
    onUpdate?: (updates: TeamPerspective[]) => void;
}

const SentimentOverview: React.FC<{ perspectives: TeamPerspective[] }> = ({ perspectives }) => {
    const data = perspectives.map(p => ({
        team: p.team,
        sentiment: p.sentiment * 100 // Convert to percentage
    }));

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Team Sentiment Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="team" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip
                                formatter={(value: number) => `${value.toFixed(1)}%`}
                            />
                            <Bar
                                dataKey="sentiment"
                                fill="#8884d8"
                                label={{ position: 'top', formatter: (value: number) => `${value.toFixed(1)}%` }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

const TeamMemberCard: React.FC<{
    perspective: TeamPerspective;
    onUpdate?: (updates: Partial<TeamPerspective>) => void;
}> = ({ perspective, onUpdate }) => {
    const getInitials = (team: string) =>
        team.split(' ').map(word => word[0].toUpperCase()).join('');

    return (
        <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
                <Avatar className="h-12 w-12">
                    <AvatarFallback>{getInitials(perspective.team)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle>{perspective.team}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                        <Progress
                            value={perspective.sentiment * 100}
                            className="w-24"
                        />
                        <span className="text-sm text-gray-500">
                            {(perspective.sentiment * 100).toFixed(1)}% positive
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Concerns Section */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Concerns</h4>
                        <ul className="space-y-2">
                            {perspective.concerns.map((concern, i) => (
                                <li key={i} className="flex items-start space-x-2">
                                    <span className="text-red-500">•</span>
                                    <span className="text-sm text-gray-600">{concern}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Suggestions Section */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Suggestions</h4>
                        <ul className="space-y-2">
                            {perspective.suggestions.map((suggestion, i) => (
                                <li key={i} className="flex items-start space-x-2">
                                    <span className="text-green-500">•</span>
                                    <span className="text-sm text-gray-600">{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Additional Insights */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Primary Focus Areas</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {perspective.suggestions.map((suggestion, i) => (
                                        <Badge key={i} variant="secondary">
                                            {suggestion}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const TeamPerspectivesView: React.FC<TeamPerspectivesViewProps> = ({
                                                                              perspectives,
                                                                              onUpdate
                                                                          }) => {
    if (!perspectives || perspectives.length === 0) {
        return (
            <div className="p-4 text-center">
                <p className="text-gray-500">No team perspectives available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <SentimentOverview perspectives={perspectives} />
                <Card>
                    <CardHeader>
                        <CardTitle>Overall Team Alignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Common Concerns</h4>
                                <div className="mt-2">
                                    {perspectives.reduce((acc, p) => [...acc, ...p.concerns], [] as string[])
                                        .reduce<Record<string, number>>((acc, concern) => {
                                            acc[concern] = (acc[concern] || 0) + 1;
                                            return acc;
                                        }, {})
                                        .entries()
                                        .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
                                        .slice(0, 5)
                                        .map(([concern, count]: [string, number], i: number) => (
                                            <div key={i} className="flex items-center justify-between py-1">
                                                <span className="text-sm">{concern}</span>
                                                <Badge variant="secondary">{count}</Badge>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {perspectives.map((perspective, index) => (
                    <TeamMemberCard
                        key={index}
                        perspective={perspective}
                        onUpdate={updates => {
                            if (onUpdate) {
                                const newPerspectives = [...perspectives];
                                newPerspectives[index] = { ...perspective, ...updates };
                                onUpdate(newPerspectives);
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default TeamPerspectivesView;