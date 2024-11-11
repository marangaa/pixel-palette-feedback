import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle, Box, GitBranch } from 'lucide-react';

const ImplementationDetails = ({ data }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Box className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">Technical Requirements</h3>
                </div>
                <ul className="space-y-2">
                    {data.technical_requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{req}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <GitBranch className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-semibold">Dependencies</h3>
                </div>
                <ul className="space-y-2">
                    {data.dependencies.map((dep, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>{dep}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-semibold">Risk Assessment</h3>
                </div>
                <ul className="space-y-2">
                    {data.risks.map((risk, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span>{risk}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card className="p-4">
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-green-500" />
                            <h3 className="text-lg font-semibold">Timeline</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{data.timeline_estimate}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Complexity Score</h3>
                        <div className="space-y-2">
                            <Progress value={data.complexity_score * 10} className="w-full" />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Low</span>
                                <span>{data.complexity_score} / 10</span>
                                <span>High</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ImplementationDetails;