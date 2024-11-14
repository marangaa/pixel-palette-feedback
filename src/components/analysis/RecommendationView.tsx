import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    CheckCircle2,
    XCircle,
    PauseCircle,
    AlertCircle,
    ArrowRight,
    ListChecks,
    BarChart3,
    SwitchCamera
} from 'lucide-react';
import type { Recommendation } from '@/types/detailed-analysis';

interface RecommendationViewProps {
    recommendation: Recommendation;
    onUpdate?: (updates: Partial<Recommendation>) => void;
}

type DecisionType = 'proceed' | 'hold' | 'modify' | 'reject';

const getDecisionIcon = (decision: DecisionType) => {
    switch (decision) {
        case 'proceed':
            return <CheckCircle2 className="w-8 h-8 text-green-500" />;
        case 'hold':
            return <PauseCircle className="w-8 h-8 text-yellow-500" />;
        case 'modify':
            return <SwitchCamera className="w-8 h-8 text-blue-500" />;
        case 'reject':
            return <XCircle className="w-8 h-8 text-red-500" />;
        default:
            return <AlertCircle className="w-8 h-8 text-gray-500" />;
    }
};

const getDecisionColor = (decision: DecisionType) => {
    switch (decision) {
        case 'proceed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'hold':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'modify':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'reject':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

interface DecisionCardProps {
    decision: DecisionType;
    confidenceLevel: number;
    onUpdate?: (updates: { decision: DecisionType } | { confidence_level: number }) => void;
}

const DecisionCard: React.FC<DecisionCardProps> = ({
                                                       decision,
                                                       confidenceLevel,
                                                       onUpdate
                                                   }) => (
    <Card className="md:col-span-2">
        <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    {getDecisionIcon(decision)}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Recommended Decision
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDecisionColor(decision)}>
                                {decision.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-500">
                                {confidenceLevel}% confidence
                            </span>
                        </div>
                    </div>
                </div>
                <Progress
                    value={confidenceLevel}
                    className="w-32"
                />
            </div>
        </CardContent>
    </Card>
);

interface KeyFactorsCardProps {
    factors: string[];
    onUpdate?: (updates: { key_factors: string[] }) => void;
}

const KeyFactorsCard: React.FC<KeyFactorsCardProps> = ({ factors, onUpdate }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Key Decision Factors
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {factors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="text-gray-600">{factor}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);

interface NextStepsCardProps {
    steps: string[];
    onUpdate?: (updates: { next_steps: string[] }) => void;
}

const NextStepsCard: React.FC<NextStepsCardProps> = ({ steps, onUpdate }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ListChecks className="w-5 h-5" />
                Recommended Next Steps
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-medium">
                            {index + 1}
                        </div>
                        <span className="text-gray-600">{step}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);

interface AlternativesCardProps {
    alternatives: string[];
    onUpdate?: (updates: { alternatives: string[] }) => void;
}

const AlternativesCard: React.FC<AlternativesCardProps> = ({ alternatives, onUpdate }) => (
    <Card className="md:col-span-2">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <SwitchCamera className="w-5 h-5" />
                Alternative Approaches
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alternatives.map((alternative, index) => (
                    <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-sm font-medium border border-gray-200">
                                {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-gray-600">{alternative}</span>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

export const RecommendationView: React.FC<RecommendationViewProps> = ({
                                                                          recommendation,
                                                                          onUpdate
                                                                      }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Final Recommendation</h2>
                <p className="text-gray-600">Analysis conclusion and next steps</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DecisionCard
                    decision={recommendation.decision}
                    confidenceLevel={recommendation.confidence_level}
                    onUpdate={updates => onUpdate?.({ ...recommendation, ...updates })}
                />

                <KeyFactorsCard
                    factors={recommendation.key_factors}
                    onUpdate={updates => onUpdate?.(updates)}
                />

                <NextStepsCard
                    steps={recommendation.next_steps}
                    onUpdate={updates => onUpdate?.(updates)}
                />

                <AlternativesCard
                    alternatives={recommendation.alternatives}
                    onUpdate={updates => onUpdate?.(updates)}
                />
            </div>
        </div>
    );
};

export default RecommendationView;