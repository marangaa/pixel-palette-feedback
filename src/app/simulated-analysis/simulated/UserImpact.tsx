import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ThumbsUp, AlertCircle, Users, Star } from 'lucide-react';

const UserImpact = ({ data }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold">Benefits</h3>
                </div>
                <ul className="space-y-2">
                    {data.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-semibold">Potential Issues</h3>
                </div>
                <ul className="space-y-2">
                    {data.potential_issues.map((issue, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span>{issue}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">Affected User Segments</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {data.user_segments_affected.map((segment, index) => (
                        <div key={index} className="bg-blue-50 rounded-lg p-2 text-sm">
                            {segment}
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold">Expected Satisfaction</h3>
                </div>
                <div className="space-y-4">
                    <div className="text-3xl font-bold text-yellow-500">
                        {data.expected_satisfaction_score.toFixed(1)}/10
                    </div>
                    <div className="space-y-2">
                        <Progress value={data.expected_satisfaction_score * 10} className="w-full" />
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Low</span>
                            <span>High</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UserImpact;