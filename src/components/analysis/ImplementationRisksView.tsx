import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, DollarSign, Clock } from 'lucide-react';
import type { ImplementationRisk } from '@/types/detailed-analysis';

const RiskLevelBadge: React.FC<{ level: string }> = ({ level }) => {
    const colors = {
        high: 'bg-red-100 text-red-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-green-100 text-green-800'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level as keyof typeof colors]}`}>
            {level.toUpperCase()}
        </span>
    );
};

interface RiskSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const RiskSection: React.FC<RiskSectionProps> = ({ title, icon, children }) => (
    <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
            {icon}
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

interface TimelineItemProps {
    milestone: {
        name: string;
        duration: string;
        dependencies: string[];
    };
}

const TimelineItem: React.FC<TimelineItemProps> = ({ milestone }) => (
    <div className="relative pl-8 pb-8 last:pb-0">
        <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200">
            <div className="absolute top-0 left-[-3px] w-2 h-2 rounded-full bg-purple-500" />
        </div>
        <div>
            <h4 className="font-medium text-gray-800">{milestone.name}</h4>
            <p className="text-sm text-gray-600 mt-1">Duration: {milestone.duration}</p>
            {milestone.dependencies.length > 0 && (
                <div className="mt-2">
                    <p className="text-xs text-gray-500">Dependencies:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {milestone.dependencies.map((dep, index) => (
                            <Badge key={index} variant="outline">
                                {dep}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
);

export const ImplementationRisksView: React.FC<{ risks: ImplementationRisk }> = ({ risks }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Implementation Risks</h2>
                <p className="text-gray-600">Analysis of potential risks and challenges</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Technical Risks */}
                <RiskSection
                    title="Technical Risks"
                    icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Complexity Level</span>
                            <RiskLevelBadge level={risks.technical.complexity} />
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Uncertain Areas</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {risks.technical.uncertain_areas.map((area, index) => (
                                    <li key={index} className="text-sm text-gray-600">{area}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Required Expertise</h4>
                            <div className="flex flex-wrap gap-2">
                                {risks.technical.required_expertise.map((expertise, index) => (
                                    <Badge key={index} variant="secondary">
                                        {expertise}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </RiskSection>

                {/* Business Risks */}
                <RiskSection
                    title="Business Risks"
                    icon={<DollarSign className="h-5 w-5 text-blue-500" />}
                >
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Cost Estimate</h4>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    {risks.business.cost_estimate.currency}
                                    {risks.business.cost_estimate.min.toLocaleString()} -
                                    {risks.business.cost_estimate.max.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Revenue Impact</h4>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    Estimated: {risks.business.revenue_impact.estimate.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Confidence: {risks.business.revenue_impact.confidence}%
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Opportunity Cost</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {risks.business.opportunity_cost.map((cost, index) => (
                                    <li key={index} className="text-sm text-gray-600">{cost}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </RiskSection>

                {/* Timeline Risks */}
                <RiskSection
                    title="Timeline Risks"
                    icon={<Clock className="h-5 w-5 text-yellow-500" />}
                >
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Estimated Duration</h4>
                            <p className="text-sm text-gray-600">{risks.timeline.estimated_duration}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Milestones</h4>
                            <div className="space-y-4">
                                {risks.timeline.key_milestones.map((milestone, index) => (
                                    <TimelineItem key={index} milestone={milestone} />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Factors</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {risks.timeline.risks.map((risk, index) => (
                                    <li key={index} className="text-sm text-gray-600">{risk}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </RiskSection>
            </div>
        </div>
    );
};

export default ImplementationRisksView;