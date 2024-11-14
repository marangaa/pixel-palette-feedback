import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketAnalysis } from '@/types/detailed-analysis';

interface MarketAnalysisViewProps {
    analysis: MarketAnalysis;
    onUpdate?: (updates: Partial<MarketAnalysis>) => void;
}

interface MarketStatCardProps {
    title: string;
    value: number;
    total: number;
    description: string;
    onUpdate?: (value: number) => void;
}

const MarketStatCard: React.FC<MarketStatCardProps> = ({
                                                           title,
                                                           value,
                                                           total,
                                                           description,
                                                           onUpdate
                                                       }) => {
    const percentage = ((value / total) * 100).toFixed(1);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                >
                    <path d="M12 2v20M2 12h20" />
                </svg>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                    {percentage}% - {description}
                </p>
            </CardContent>
        </Card>
    );
};

interface CompetitorTableProps {
    competitors: MarketAnalysis['competition']['direct_competitors'];
    onUpdate?: (updates: typeof competitors) => void;
}

const CompetitorTable: React.FC<CompetitorTableProps> = ({ competitors, onUpdate }) => (
    <Table>
        <TableCaption>Direct Competitors Analysis</TableCaption>
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
                    <TableCell className="font-medium">{competitor.name}</TableCell>
                    <TableCell>{competitor.market_share}%</TableCell>
                    <TableCell>
                        <ul className="list-disc list-inside">
                            {competitor.key_features.map((feature, i) => (
                                <li key={i} className="text-sm">{feature}</li>
                            ))}
                        </ul>
                    </TableCell>
                    <TableCell>
                        <ul className="list-disc list-inside">
                            {competitor.strengths.map((strength, i) => (
                                <li key={i} className="text-sm">{strength}</li>
                            ))}
                        </ul>
                    </TableCell>
                    <TableCell>
                        <ul className="list-disc list-inside">
                            {competitor.weaknesses.map((weakness, i) => (
                                <li key={i} className="text-sm">{weakness}</li>
                            ))}
                        </ul>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

interface TrendSectionProps {
    trends: MarketAnalysis['trends'];
    onUpdate?: (updates: Partial<MarketAnalysis['trends']>) => void;
}

const TrendSection: React.FC<TrendSectionProps> = ({ trends, onUpdate }) => (
    <div className="grid grid-cols-3 gap-4">
        <Card>
            <CardHeader>
                <CardTitle>Growing Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside space-y-2">
                    {trends.growing.map((trend, index) => (
                        <li key={index} className="text-sm text-green-600">{trend}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Emerging Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside space-y-2">
                    {trends.emerging.map((trend, index) => (
                        <li key={index} className="text-sm text-blue-600">{trend}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Declining Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside space-y-2">
                    {trends.declining.map((trend, index) => (
                        <li key={index} className="text-sm text-red-600">{trend}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    </div>
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

    const marketSize = analysis.market_size;
    const totalMarket = marketSize.total_addressable;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-3 gap-4">
                <MarketStatCard
                    title="Total Addressable Market"
                    value={marketSize.total_addressable}
                    total={totalMarket}
                    description="Total potential market size"
                    onUpdate={value => onUpdate?.({
                        market_size: { ...marketSize, total_addressable: value }
                    })}
                />
                <MarketStatCard
                    title="Serviceable Market"
                    value={marketSize.serviceable}
                    total={totalMarket}
                    description="Market we can serve"
                    onUpdate={value => onUpdate?.({
                        market_size: { ...marketSize, serviceable: value }
                    })}
                />
                <MarketStatCard
                    title="Current Reach"
                    value={marketSize.current_reach}
                    total={totalMarket}
                    description="Our current market share"
                    onUpdate={value => onUpdate?.({
                        market_size: { ...marketSize, current_reach: value }
                    })}
                />
            </div>

            {analysis.competition.direct_competitors.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Market Share Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={analysis.competition.direct_competitors}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="market_share" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {analysis.competition.direct_competitors.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Competitive Analysis</h3>
                    <CompetitorTable
                        competitors={analysis.competition.direct_competitors}
                        onUpdate={competitors => onUpdate?.({
                            competition: {
                                ...analysis.competition,
                                direct_competitors: competitors
                            }
                        })}
                    />
                </div>
            )}

            <div className="space-y-6">
                <h3 className="text-lg font-semibold">Market Trends</h3>
                <TrendSection
                    trends={analysis.trends}
                    onUpdate={trends => onUpdate?.({ trends })}
                />
            </div>
        </div>
    );
};

export default MarketAnalysisView;