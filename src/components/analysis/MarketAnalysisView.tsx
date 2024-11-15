import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie
} from 'recharts';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketAnalysis } from '@/types/detailed-analysis';

interface MarketAnalysisViewProps {
    analysis: MarketAnalysis;
    onUpdate?: (updates: Partial<MarketAnalysis>) => void;
}

const MarketOverview: React.FC<{ marketSize: MarketAnalysis['market_size'] }> = ({ marketSize }) => {
    const data = [
        {
            name: 'Total Market',
            value: marketSize.total_addressable,
            color: '#8884d8'
        },
        {
            name: 'Serviceable',
            value: marketSize.serviceable,
            color: '#82ca9d'
        },
        {
            name: 'Current',
            value: marketSize.current_reach,
            color: '#ffc658'
        }
    ];

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Market Size Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {data.map((item, index) => (
                        <div key={index} className="text-center">
                            <h4 className="text-sm font-medium text-gray-500">{item.name}</h4>
                            <p className="text-2xl font-bold" style={{ color: item.color }}>
                                {item.value.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const CompetitorAnalysis: React.FC<{
    competitors: MarketAnalysis['competition']['direct_competitors']
}> = ({ competitors }) => (
    <Card className="col-span-3">
        <CardHeader>
            <CardTitle>Competitor Analysis</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={competitors}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="market_share" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Competitor</TableHead>
                            <TableHead>Market Share</TableHead>
                            <TableHead>Key Features</TableHead>
                            <TableHead>Strengths</TableHead>
                            <TableHead>Weaknesses</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {competitors.map((competitor, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    {competitor.name}
                                </TableCell>
                                <TableCell>
                                    {competitor.market_share}%
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {competitor.key_features.map((feature, i) => (
                                            <Badge key={i} variant="outline">
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <ul className="list-disc list-inside space-y-1">
                                        {competitor.strengths.map((strength, i) => (
                                            <li key={i} className="text-sm">{strength}</li>
                                        ))}
                                    </ul>
                                </TableCell>
                                <TableCell>
                                    <ul className="list-disc list-inside space-y-1">
                                        {competitor.weaknesses.map((weakness, i) => (
                                            <li key={i} className="text-sm">{weakness}</li>
                                        ))}
                                    </ul>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
);

const TrendAnalysis: React.FC<{ trends: MarketAnalysis['trends'] }> = ({ trends }) => (
    <Card className="col-span-3">
        <CardHeader>
            <CardTitle>Market Trends</CardTitle>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="growing" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="growing">Growing</TabsTrigger>
                    <TabsTrigger value="emerging">Emerging</TabsTrigger>
                    <TabsTrigger value="declining">Declining</TabsTrigger>
                </TabsList>
                <TabsContent value="growing">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {trends.growing.map((trend, index) => (
                            <Card key={index}>
                                <CardContent className="pt-6">
                                    <Badge className="bg-green-100 text-green-800 mb-2">Growing</Badge>
                                    <p className="font-medium">{trend}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="emerging">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {trends.emerging.map((trend, index) => (
                            <Card key={index}>
                                <CardContent className="pt-6">
                                    <Badge className="bg-blue-100 text-blue-800 mb-2">Emerging</Badge>
                                    <p className="font-medium">{trend}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="declining">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {trends.declining.map((trend, index) => (
                            <Card key={index}>
                                <CardContent className="pt-6">
                                    <Badge className="bg-red-100 text-red-800 mb-2">Declining</Badge>
                                    <p className="font-medium">{trend}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
);

export const MarketAnalysisView: React.FC<MarketAnalysisViewProps> = ({
                                                                          analysis,
                                                                          onUpdate
                                                                      }) => {
    if (!analysis) {
        return (
            <div className="p-4 text-center">
                <p className="text-gray-500">Market analysis data is not available.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-6">
            <MarketOverview marketSize={analysis.market_size} />
            <CompetitorAnalysis competitors={analysis.competition.direct_competitors} />
            <TrendAnalysis trends={analysis.trends} />
        </div>
    );
};

export default MarketAnalysisView;