import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Clock } from 'lucide-react';

const ResourceAnalysis = ({ data }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 md:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold">Team Size</h3>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{data.required_team_size}</p>
                        <p className="text-sm text-gray-500">team members</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold">Estimated Cost</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(data.estimated_cost)}
                        </p>
                        <p className="text-sm text-gray-500">total budget</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Resource Allocation</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.resource_breakdown}>
                            <XAxis dataKey="resource_type" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="allocation" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-4 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Resource Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.resource_breakdown.map((resource, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <h4 className="font-medium">{resource.resource_type}</h4>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm">
                                    <span className="font-semibold">{resource.allocation}</span> team members
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">{resource.duration}</span> duration
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default ResourceAnalysis;