
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create initial roadmap
    const roadmap = await prisma.roadmap.create({
        data: {
            name: "Product Roadmap 2024",
            description: "Main product roadmap for 2024",
            version: "1.0",
            isActive: true,
            constraints: {
                maxParallelItems: 5,
                resourceCap: 100,
                priorityThresholds: {
                    critical: 90,
                    high: 70,
                    medium: 40,
                    low: 0
                }
            }
        }
    });

    // Create main branch
    const mainBranch = await prisma.roadmapBranch.create({
        data: {
            roadmapId: roadmap.id,
            type: 'main',
            title: 'Main Development Track',
            description: 'Primary development path',
            probability: 100
        }
    });

    // Create some initial roadmap items
    const items = await Promise.all([
        prisma.roadmapItem.create({
            data: {
                roadmapId: roadmap.id,
                branchId: mainBranch.id,
                type: 'feature',
                title: 'Advanced Analytics Dashboard',
                description: 'Implement advanced analytics capabilities with customizable dashboards',
                timeframe: 'current',
                priority: 'high',
                status: 'in-progress',
                effort: 13,
                assignedTeam: 'Engineering',
                milestones: {
                    create: [
                        {
                            title: 'Design Phase',
                            description: 'Complete UI/UX design',
                            startDate: new Date(),
                            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                            progress: 60,
                            status: 'in-progress'
                        }
                    ]
                },
                analysis: {
                    create: {
                        feasibility: 85,
                        impact: 90,
                        risk: 40,
                        resources: {
                            required: 3,
                            available: 4
                        }
                    }
                },
                feedback: {
                    create: {
                        requestCount: 15,
                        avgSentiment: 0.8,
                        userSegments: ['Enterprise', 'Mid-Market'],
                        keyThemes: ['Performance', 'Customization']
                    }
                }
            }
        }),
        prisma.roadmapItem.create({
            data: {
                roadmapId: roadmap.id,
                branchId: mainBranch.id,
                type: 'feature',
                title: 'Mobile App Integration',
                description: 'Develop mobile application with core features',
                timeframe: 'next',
                priority: 'high',
                status: 'planned',
                effort: 21,
                assignedTeam: 'Mobile',
                milestones: {
                    create: [
                        {
                            title: 'Requirements Gathering',
                            description: 'Document requirements and user stories',
                            startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                            endDate: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000),
                            progress: 0,
                            status: 'planned'
                        }
                    ]
                }
            }
        })
    ]);

    // Create dependencies between items
    await prisma.itemDependency.create({
        data: {
            sourceId: items[1].id,
            targetId: items[0].id,
            type: 'requires'
        }
    });

    // Create resource allocations
    await Promise.all(items.map(item =>
        prisma.resourceAllocation.create({
            data: {
                itemId: item.id,
                teamId: item.assignedTeam!,
                allocation: 50,
                capacity: 100,
                startDate: new Date(),
                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
            }
        })
    ));

    // Create detailed analysis for the first item
    const detailedAnalysis = await prisma.detailedAnalysis.create({
        data: {
            itemId: items[0].id,
            marketAnalysis: {
                create: {
                    marketSize: {
                        total_addressable: 1000000,
                        serviceable: 500000,
                        current_reach: 100000
                    },
                    competition: {
                        direct_competitors: [
                            { name: "Competitor A", market_share: 30 },
                            { name: "Competitor B", market_share: 20 }
                        ],
                        indirect_competitors: [
                            { name: "Alternative X", overlap: "partial" }
                        ]
                    },
                    trends: {
                        growing: ["AI Integration", "Real-time Analytics"],
                        declining: ["Legacy Systems"],
                        emerging: ["Edge Computing"]
                    },
                    opportunities: ["Enterprise Expansion", "API Ecosystem"],
                    risks: ["Market Saturation", "Technical Debt"]
                }
            },
            teamPerspectives: {
                create: [
                    {
                        role: "Engineering Lead",
                        concerns: ["Technical Complexity", "Timeline Risk"],
                        priorities: ["Scalability", "Performance"],
                        constraints: ["Team Capacity", "Technical Debt"],
                        expertiseAreas: ["Backend", "Cloud Infrastructure"],
                        confidenceLevel: 0.8,
                        estimatedEffort: {
                            time: "3 months",
                            resources: ["Senior Engineers", "DevOps"],
                            dependencies: ["API Gateway", "Data Pipeline"]
                        }
                    }
                ]
            },
            implementation: {
                create: {
                    technical: {
                        complexity: "high",
                        uncertain_areas: ["Data Migration", "Scale Testing"],
                        required_expertise: ["Cloud", "Analytics", "Backend"],
                        roadblocks: ["Legacy Integration"]
                    },
                    business: {
                        cost_estimate: {
                            min: 100000,
                            max: 150000,
                            currency: "USD"
                        },
                        revenue_impact: {
                            estimate: 500000,
                            confidence: 0.7
                        },
                        opportunity_cost: ["Delayed Mobile Features"]
                    },
                    timeline: {
                        estimated_duration: "4 months",
                        milestones: ["Design", "Development", "Testing"],
                        risks: ["Resource Availability"]
                    },
                    dependencies: {
                        technical: ["API Gateway"],
                        business: ["Customer Feedback"],
                        external: ["Third-party Services"]
                    }
                }
            },
            userImpact: {
                create: {
                    segmentsAffected: [{
                        segment: "Enterprise",
                        impact_level: "high",
                        benefits: ["Better Insights", "Faster Decisions"],
                        drawbacks: ["Learning Curve"]
                    }],
                    adoptionPrediction: {
                        rate: 0.7,
                        factors: {
                            driving: ["Feature Demand", "Competitive Pressure"],
                            hindering: ["Change Management", "Training Needs"]
                        }
                    },
                    feedbackAnalysis: {
                        positive_indicators: ["Feature Requests", "Beta Interest"],
                        concerns: ["Complexity", "Migration"],
                        requested_modifications: ["Simpler UI", "More Templates"]
                    }
                }
            },
            resourceAnalysis: {
                create: {
                    teamsInvolved: [{
                        team: "Engineering",
                        required_time: "3 months",
                        key_skills: ["Backend", "Analytics"]
                    }],
                    infrastructure: {
                        new_requirements: ["Additional Servers", "Data Pipeline"],
                        upgrades_needed: ["Database Cluster"],
                        estimated_costs: 50000
                    },
                    training: {
                        required_skills: ["Data Analysis", "Dashboard Creation"],
                        training_time: "2 weeks",
                        materials_needed: ["Documentation", "Video Tutorials"]
                    }
                }
            },
            recommendation: {
                create: {
                    decision: "proceed",
                    confidenceLevel: 0.85,
                    keyFactors: [
                        "High Customer Demand",
                        "Strategic Alignment",
                        "Technical Feasibility"
                    ],
                    nextSteps: [
                        "Finalize Design",
                        "Resource Allocation",
                        "Timeline Planning"
                    ],
                    alternatives: [
                        "Phased Approach",
                        "Third-party Integration"
                    ],
                    risks: [
                        "Resource Constraints",
                        "Technical Complexity"
                    ]
                }
            }
        }
    });

    console.log('Seed data created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });