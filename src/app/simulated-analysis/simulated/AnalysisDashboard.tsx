import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartBar, Users, Cog, TrendingUp, Brain, CheckCircle } from 'lucide-react';

// Import our simulated data
const simulatedAnalysis = {
    marketAnalysis: {
        market_size: {
            total_addressable: 5000000,
            serviceable: 2000000,
            current_reach: 500000
        },
        competition: {
            direct_competitors: [
                {
                    name: "CompetitorA",
                    market_share: 35,
                    key_features: ["Advanced Analytics", "Cloud Integration", "24/7 Support"],
                    strengths: ["Market Leader", "Strong Brand", "Innovation"],
                    weaknesses: ["High Price Point", "Complex UI", "Limited Customization"]
                },
                {
                    name: "CompetitorB",
                    market_share: 25,
                    key_features: ["Basic Analytics", "Local Hosting", "Email Support"],
                    strengths: ["Affordable", "Simple UI", "Good Documentation"],
                    weaknesses: ["Limited Features", "Slow Updates", "Poor Scale"]
                },
                {
                    name: "CompetitorC",
                    market_share: 15,
                    key_features: ["Custom Solutions", "API Access", "Premium Support"],
                    strengths: ["Flexibility", "Good Integration", "Enterprise Focus"],
                    weaknesses: ["Small Team", "Limited Market Presence", "High Cost"]
                }
            ]
        },
        trends: {
            growing: [
                "AI Integration",
                "Mobile-First Solutions",
                "Real-time Analytics"
            ],
            emerging: [
                "Voice Interface",
                "Blockchain Integration",
                "Edge Computing"
            ],
            declining: [
                "On-premise Solutions",
                "Manual Data Entry",
                "Batch Processing"
            ]
        }
    },
    teamPerspectives: [
        {
            team: "Engineering",
            sentiment: 0.8,
            concerns: [
                "Technical Debt",
                "Integration Complexity",
                "Scalability Challenges"
            ],
            suggestions: [
                "Modular Architecture",
                "Progressive Implementation",
                "Enhanced Testing Framework"
            ]
        },
        {
            team: "Product",
            sentiment: 0.9,
            concerns: [
                "Feature Overlap",
                "User Learning Curve",
                "Market Timing"
            ],
            suggestions: [
                "Phased Rollout",
                "Enhanced Documentation",
                "User Research Focus"
            ]
        },
        {
            team: "Sales",
            sentiment: 0.75,
            concerns: [
                "Pricing Strategy",
                "Competitive Position",
                "Sales Cycle Length"
            ],
            suggestions: [
                "Value-based Pricing",
                "Feature Comparison Tool",
                "POC Program"
            ]
        }
    ],
    implementation: {
        technical_requirements: [
            "Cloud Infrastructure",
            "API Gateway",
            "Machine Learning Pipeline",
            "Data Storage Solution",
            "Security Framework"
        ],
        dependencies: [
            "Cloud Provider Services",
            "Third-party APIs",
            "ML Models",
            "Database Clusters"
        ],
        risks: [
            "Technical Integration Complexity",
            "Data Privacy Compliance",
            "Performance at Scale",
            "Security Vulnerabilities"
        ],
        timeline_estimate: "6 months",
        complexity_score: 7.5
    },
    userImpact: {
        benefits: [
            "Improved Productivity",
            "Better Decision Making",
            "Reduced Manual Work",
            "Enhanced Insights"
        ],
        potential_issues: [
            "Learning Curve",
            "Initial Setup Time",
            "Data Migration Needs"
        ],
        user_segments_affected: [
            "Enterprise Clients",
            "Small Business Users",
            "Technical Teams",
            "Business Analysts"
        ],
        expected_satisfaction_score: 8.2
    },
    resourceAnalysis: {
        required_team_size: 12,
        estimated_cost: 750000,
        resource_breakdown: [
            {
                resource_type: "Frontend Engineers",
                allocation: 3,
                duration: "6 months"
            },
            {
                resource_type: "Backend Engineers",
                allocation: 4,
                duration: "6 months"
            },
            {
                resource_type: "DevOps",
                allocation: 2,
                duration: "4 months"
            },
            {
                resource_type: "Product Manager",
                allocation: 1,
                duration: "6 months"
            },
            {
                resource_type: "UX Designer",
                allocation: 2,
                duration: "3 months"
            }
        ]
    },
    recommendation: {
        proceed: true,
        priority_score: 8.5,
        rationale: [
            "Strong Market Opportunity",
            "Positive Team Alignment",
            "Manageable Technical Complexity",
            "High Expected ROI"
        ],
        next_steps: [
            "Form Core Team",
            "Create Detailed Technical Design",
            "Begin Stakeholder Engagement",
            "Set Up Development Environment"
        ]
    }
};

import MarketAnalysis from './MarketAnalysis';
import TeamPerspectives from './TeamPerspectives';
import ImplementationDetails from './ImplementationDetails';
import UserImpact from './UserImpact';
import ResourceAnalysis from './ResourceAnalysis';
import Recommendation from './Recommendation';

const AnalysisDashboard = () => {
    const [activeTab, setActiveTab] = useState('market');

    return (
        <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Product Analysis Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-6 gap-4 mb-8">
                            <TabsTrigger value="market" className="flex items-center gap-2">
                                <ChartBar className="w-4 h-4" />
                                Market
                            </TabsTrigger>
                            <TabsTrigger value="team" className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Team
                            </TabsTrigger>
                            <TabsTrigger value="implementation" className="flex items-center gap-2">
                                <Cog className="w-4 h-4" />
                                Implementation
                            </TabsTrigger>
                            <TabsTrigger value="impact" className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Impact
                            </TabsTrigger>
                            <TabsTrigger value="resources" className="flex items-center gap-2">
                                <Brain className="w-4 h-4" />
                                Resources
                            </TabsTrigger>
                            <TabsTrigger value="recommendation" className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Recommendation
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="market" className="mt-4">
                            <MarketAnalysis data={simulatedAnalysis.marketAnalysis} />
                        </TabsContent>

                        <TabsContent value="team" className="mt-4">
                            <TeamPerspectives data={simulatedAnalysis.teamPerspectives} />
                        </TabsContent>

                        <TabsContent value="implementation" className="mt-4">
                            <ImplementationDetails data={simulatedAnalysis.implementation} />
                        </TabsContent>

                        <TabsContent value="impact" className="mt-4">
                            <UserImpact data={simulatedAnalysis.userImpact} />
                        </TabsContent>

                        <TabsContent value="resources" className="mt-4">
                            <ResourceAnalysis data={simulatedAnalysis.resourceAnalysis} />
                        </TabsContent>

                        <TabsContent value="recommendation" className="mt-4">
                            <Recommendation data={simulatedAnalysis.recommendation} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalysisDashboard;