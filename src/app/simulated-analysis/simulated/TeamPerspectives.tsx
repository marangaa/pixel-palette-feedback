import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, AlertCircle, Lightbulb } from 'lucide-react';

const TeamPerspectives = ({ data }) => {
    const sentimentData = data.map(team => ({
        name: team.team,
        sentiment: team.sentiment * 100
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Team Sentiment</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sentimentData}>
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="sentiment" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {data.map((team, index) => (
                <Card key={index} className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5" />
                        <h3 className="text-lg font-semibold">{team.team} Team</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                <h4 className="font-medium">Concerns</h4>
                            </div>
                            <ul className="list-disc pl-4">
                                {team.concerns.map((concern, idx) => (
                                    <li key={idx} className="mb-1 text-sm">{concern}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-blue-500" />
                                <h4 className="font-medium">Suggestions</h4>
                            </div>
                            <ul className="list-disc pl-4">
                                {team.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="mb-1 text-sm">{suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default TeamPerspectives;