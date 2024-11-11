'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AnalysisDashboard from './simulated/AnalysisDashboard';

// Import the simulated data (you can move this to a separate file)
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
            growing: ["AI Integration", "Mobile-First Solutions", "Real-time Analytics"],
            emerging: ["Voice Interface", "Blockchain Integration", "Edge Computing"],
            declining: ["On-premise Solutions", "Manual Data Entry", "Batch Processing"]
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

export default function AnalysisPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [analysisData, setAnalysisData] = useState<any>(null);

    useEffect(() => {
        // Simulate loading delay for a more realistic feel
        const loadData = async () => {
            try {
                setIsLoading(true);
                // Add a small delay to simulate data loading
                await new Promise(resolve => setTimeout(resolve, 800));
                setAnalysisData(simulatedAnalysis);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="p-4 space-y-4">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {analysisData && <AnalysisDashboard data={analysisData} />}
        </div>
    );
}