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
import type { DetailedAnalysis } from '@/types/detailed-analysis';

interface RecommendationProps {
    recommendation: DetailedAnalysis['recommendation'];
    onUpdateFeedback?: (feedback: any) => void;
}

const getDecisionIcon = (decision: string) => {
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

const getDecisionColor = (decision: string) => {
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

export const RecommendationView: React.FC<RecommendationProps> = ({
                                                                      recommendation,
                                                                      onUpdateFeedback
                                                                  }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Final Recommendation</h2>
                <p className="text-gray-600">Analysis conclusion and next steps</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Decision Card */}
                <Card className="md:col-span-2">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                {getDecisionIcon(recommendation.decision)}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Recommended Decision
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className={getDecisionColor(recommendation.decision)}>
                                            {recommendation.decision.toUpperCase()}
                                        </Badge>
                                        <span className="text-sm text-gray-500">
                                            {recommendation.confidence_level}% confidence
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Progress
                                value={recommendation.confidence_level}
                                className="w-32"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Key Factors */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Key Decision Factors
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {recommendation.key_factors.map((factor, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <ArrowRight className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <span className="text-gray-600">{factor}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ListChecks className="w-5 h-5" />
                            Recommended Next Steps
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {recommendation.next_steps.map((step, index) => (
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

                {/* Alternatives */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <SwitchCamera className="w-5 h-5" />
                            Alternative Approaches
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recommendation.alternatives.map((alternative, index) => (
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
            </div>
        </div>
    );
};

export default RecommendationView;