import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const MarketAnalysis = ({ data }) => {
    const marketSizeData = [
        { name: 'Current Reach', value: data.market_size.current_reach },
        { name: 'Potential Growth', value: data.market_size.serviceable - data.market_size.current_reach },
        { name: 'Future Opportunity', value: data.market_size.total_addressable - data.market_size.serviceable }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    const competitorData = data.competition.direct_competitors.map(comp => ({
        name: comp.name,
        share: comp.market_share
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Market Size Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={marketSizeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {marketSizeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Market Share by Competitor</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={competitorData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="share" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-4 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Market Trends</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <h4 className="font-medium text-green-600 mb-2">Growing Trends</h4>
                        <ul className="list-disc pl-4">
                            {data.trends.growing.map((trend, index) => (
                                <li key={index} className="mb-1">{trend}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-blue-600 mb-2">Emerging Trends</h4>
                        <ul className="list-disc pl-4">
                            {data.trends.emerging.map((trend, index) => (
                                <li key={index} className="mb-1">{trend}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-red-600 mb-2">Declining Trends</h4>
                        <ul className="list-disc pl-4">
                            {data.trends.declining.map((trend, index) => (
                                <li key={index} className="mb-1">{trend}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MarketAnalysis;