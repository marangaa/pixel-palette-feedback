import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, DollarSign, Clock } from 'lucide-react';
import type { ImplementationRisk } from '@/types/detailed-analysis';

interface ImplementationRisksViewProps {
    risks: ImplementationRisk;
    onUpdate?: (updates: Partial<ImplementationRisk>) => void;
}

type Milestone = {
    name: string;
    duration: string;
    dependencies: string[];
};

interface TimelineItemProps {
    milestone: Milestone;
    onUpdate?: (updates: Partial<Milestone>) => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ milestone, onUpdate }) => (
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

interface TimelineRisksSectionProps {
    timeline: ImplementationRisk['timeline'];
    onUpdate?: (updates: Partial<ImplementationRisk['timeline']>) => void;
}

const TimelineRisksSection: React.FC<TimelineRisksSectionProps> = ({ timeline, onUpdate }) => (
    <div className="space-y-4">
        <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Estimated Duration</h4>
            <p className="text-sm text-gray-600">{timeline.estimated_duration}</p>
        </div>

        <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Milestones</h4>
            <div className="space-y-4">
                {timeline.key_milestones.map((milestone, index) => (
                    <TimelineItem
                        key={index}
                        milestone={milestone}
                        onUpdate={updates => {
                            if (onUpdate) {
                                const newMilestones = [...timeline.key_milestones];
                                newMilestones[index] = { ...milestone, ...updates };
                                onUpdate({ key_milestones: newMilestones });
                            }
                        }}
                    />
                ))}
            </div>
        </div>

        <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Factors</h4>
            <ul className="list-disc list-inside space-y-1">
                {timeline.risks.map((risk, index) => (
                    <li key={index} className="text-sm text-gray-600">{risk}</li>
                ))}
            </ul>
        </div>
    </div>
);

interface TechnicalRisksSectionProps {
    technical: ImplementationRisk['technical'];
    onUpdate?: (updates: Partial<ImplementationRisk['technical']>) => void;
}

const TechnicalRisksSection: React.FC<TechnicalRisksSectionProps> = ({ technical, onUpdate }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Complexity Level</span>
            <Badge variant={technical.complexity === 'high' ? 'destructive' :
                technical.complexity === 'medium' ? 'secondary' : 'default'}>
                {technical.complexity.toUpperCase()}
            </Badge>
        </div>

        <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Uncertain Areas</h4>
            <ul className="list-disc list-inside space-y-1">
                {technical.uncertain_areas.map((area, index) => (
                    <li key={index} className="text-sm text-gray-600">{area}</li>
                ))}
            </ul>
        </div>

        <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Required Expertise</h4>
            <div className="flex flex-wrap gap-2">
                {technical.required_expertise.map((expertise, index) => (
                    <Badge key={index} variant="secondary">
                        {expertise}
                    </Badge>
                ))}
            </div>
        </div>
    </div>
);

interface BusinessRisksSectionProps {
    business: ImplementationRisk['business'];
    onUpdate?: (updates: Partial<ImplementationRisk['business']>) => void;
}

const BusinessRisksSection: React.FC<BusinessRisksSectionProps> = ({ business, onUpdate }) => (
    <div className="space-y-4">
        <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Cost Estimate</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                    {business.cost_estimate.currency}
                    {business.cost_estimate.min.toLocaleString()} -
                    {business.cost_estimate.max.toLocaleString()}
                </p>
            </div>
        </div>

        <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Revenue Impact</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                    Estimated: {business.revenue_impact.estimate.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Confidence: {business.revenue_impact.confidence}%
                </p>
            </div>
        </div>

        <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Opportunity Cost</h4>
            <ul className="list-disc list-inside space-y-1">
                {business.opportunity_cost.map((cost, index) => (
                    <li key={index} className="text-sm text-gray-600">{cost}</li>
                ))}
            </ul>
        </div>
    </div>
);

export const ImplementationRisksView: React.FC<ImplementationRisksViewProps> = ({ risks, onUpdate }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Implementation Risks</h2>
                <p className="text-gray-600">Analysis of potential risks and challenges</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <CardTitle>Technical Risks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TechnicalRisksSection
                            technical={risks.technical}
                            onUpdate={updates => onUpdate?.({
                                technical: { ...risks.technical, ...updates }
                            })}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-blue-500" />
                        <CardTitle>Business Risks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BusinessRisksSection
                            business={risks.business}
                            onUpdate={updates => onUpdate?.({
                                business: { ...risks.business, ...updates }
                            })}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center space-x-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <CardTitle>Timeline Risks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TimelineRisksSection
                            timeline={risks.timeline}
                            onUpdate={updates => onUpdate?.({
                                timeline: { ...risks.timeline, ...updates }
                            })}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ImplementationRisksView;