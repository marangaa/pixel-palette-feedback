import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ArrowRight, Star } from 'lucide-react';

const Recommendation = ({ data }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            <Card className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        {data.proceed ? (
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        ) : (
                            <XCircle className="w-8 h-8 text-red-500" />
                        )}
                        <h3 className="text-xl font-semibold">
                            {data.proceed ? 'Recommended to Proceed' : 'Not Recommended'}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-lg font-semibold">
              Priority: {data.priority_score}/10
            </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <ArrowRight className="w-5 h-5 text-blue-500" />
                            Key Rationale
                        </h4>
                        <ul className="space-y-2 pl-6">
                            {data.rationale.map((reason, index) => (
                                <li key={index} className="list-disc text-gray-700">
                                    {reason}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <ArrowRight className="w-5 h-5 text-green-500" />
                            Recommended Next Steps
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.next_steps.map((step, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                                        {index + 1}
                                    </div>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Priority Level</h4>
                        <div className="space-y-2">
                            <Progress value={data.priority_score * 10} className="w-full" />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Low Priority</span>
                                <span>High Priority</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Recommendation;