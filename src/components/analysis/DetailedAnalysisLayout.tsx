import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketAnalysisView } from './MarketAnalysisView';
import { TeamPerspectivesView } from './TeamPerspectivesView';
import { ImplementationRisksView } from './ImplementationRisksView';
import { UserImpactView } from './UserImpactView';
import { ResourceRequirementsView } from './ResourceRequirementsView';
import { RecommendationView } from './RecommendationView';
import { DetailedAnalysisLayoutProps } from '@/types/analysis';

const DetailedAnalysisLayout: React.FC<DetailedAnalysisLayoutProps> = ({
                                                                           analysis,
                                                                           isLoading,
                                                                           onUpdateAnalysis
                                                                       }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Detailed Analysis</h1>
                    <p className="mt-2 text-gray-600">
                        Comprehensive analysis of feature requests and feedback
                    </p>
                </div>

                <Tabs defaultValue="market" className="space-y-4">
                    <TabsList className="grid grid-cols-6 gap-4 bg-white p-1 rounded-lg">
                        <TabsTrigger value="market">Market</TabsTrigger>
                        <TabsTrigger value="team">Team</TabsTrigger>
                        <TabsTrigger value="risks">Implementation</TabsTrigger>
                        <TabsTrigger value="impact">Impact</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                        <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
                    </TabsList>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <TabsContent value="market">
                            <MarketAnalysisView
                                analysis={analysis.market_analysis}
                                onUpdate={updates => onUpdateAnalysis?.('market_analysis', updates)}
                            />
                        </TabsContent>

                        <TabsContent value="team">
                            <TeamPerspectivesView
                                perspectives={analysis.team_perspectives}
                                onUpdate={updates => onUpdateAnalysis?.('team_perspectives', updates)}
                            />
                        </TabsContent>

                        <TabsContent value="risks">
                            <ImplementationRisksView
                                risks={analysis.implementation_risks}
                                onUpdate={updates => onUpdateAnalysis?.('implementation_risks', updates)}
                            />
                        </TabsContent>

                        <TabsContent value="impact">
                            <UserImpactView
                                impact={analysis.user_impact}
                                onUpdate={updates => onUpdateAnalysis?.('user_impact', updates)}
                            />
                        </TabsContent>

                        <TabsContent value="resources">
                            <ResourceRequirementsView
                                requirements={analysis.resource_requirements}
                                onUpdate={updates => onUpdateAnalysis?.('resource_requirements', updates)}
                            />
                        </TabsContent>

                        <TabsContent value="recommendation">
                            <RecommendationView
                                recommendation={analysis.recommendation}
                                onUpdate={updates => onUpdateAnalysis?.('recommendation', updates)}
                            />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default DetailedAnalysisLayout;