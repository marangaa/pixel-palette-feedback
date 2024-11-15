import React, { Suspense } from 'react';
import {
    AnimatedCard,
    ContentLoading,
    AnimatePresence,
    LoadingOverlay
} from './LoadingComponents';
import {
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import { Users, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import type { UserImpact } from '@/types/analysis';

// Interfaces
interface UserImpactViewProps {
    impact: UserImpact;
    onUpdate?: (updates: Partial<UserImpact>) => void;
    isLoading?: boolean;
}

interface SegmentCardProps {
    segment: UserImpact['segments_affected'][0];
    onUpdate?: (updates: Partial<UserImpact['segments_affected'][0]>) => void;
}

interface AdoptionInsightsProps {
    adoption: UserImpact['adoption_prediction'];
    onUpdate?: (updates: Partial<UserImpact['adoption_prediction']>) => void;
    isLoading?: boolean;
}

interface FeedbackAnalysisProps {
    feedback: UserImpact['feedback_analysis'];
    onUpdate?: (updates: Partial<UserImpact['feedback_analysis']>) => void;
    isLoading?: boolean;
}

// Utility Component for Impact Level
const ImpactLevelBadge: React.FC<{ level: 'high' | 'medium' | 'low' }> = ({ level }) => {
    const colors = {
        high: 'bg-red-100 text-red-800 border-red-200',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        low: 'bg-green-100 text-green-800 border-green-200'
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>
            {level.toUpperCase()}
        </span>
    );
};

// Segment Card with Loading Animation
const SegmentCard: React.FC<SegmentCardProps> = ({ segment }) => (
    <AnimatedCard>
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{segment.segment}</CardTitle>
                <ImpactLevelBadge level={segment.impact_level} />
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {/* Benefits */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                        Benefits
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                        {segment.benefits.map((benefit, index) => (
                            <li key={index} className="text-sm text-gray-600">{benefit}</li>
                        ))}
                    </ul>
                </div>
                {/* Drawbacks */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <ThumbsDown className="w-4 h-4 text-red-500" />
                        Drawbacks
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                        {segment.drawbacks.map((drawback, index) => (
                            <li key={index} className="text-sm text-gray-600">{drawback}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </CardContent>
    </AnimatedCard>
);

// Adoption Insights with Radar Chart and Loading State
const AdoptionInsights: React.FC<AdoptionInsightsProps> = ({ adoption, onUpdate, isLoading }) => {
    const radarData = [
        { subject: 'Adoption Rate', A: adoption.rate * 100 },
        ...adoption.factors.driving.map(factor => ({
            subject: factor.length > 15 ? `${factor.slice(0, 15)}...` : factor,
            A: Math.random() * 100
        }))
    ];

    return (
        <AnimatedCard>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Adoption Prediction
                </CardTitle>
            </CardHeader>
            <CardContent className="relative">
                {isLoading && <LoadingOverlay message="Updating adoption data..." />}
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={90} data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <Radar name="Adoption Factors" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </AnimatedCard>
    );
};

// Feedback Analysis with Loading State
const FeedbackAnalysis: React.FC<FeedbackAnalysisProps> = ({ feedback, onUpdate, isLoading }) => (
    <AnimatedCard>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Feedback Analysis
            </CardTitle>
        </CardHeader>
        <CardContent className="relative">
            {isLoading && <LoadingOverlay message="Analyzing feedback..." />}
            {/* Feedback Details */}
            <div className="space-y-6">
                {/* Positive Indicators */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Positive Indicators</h4>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <ul className="list-disc list-inside space-y-1">
                            {feedback.positive_indicators.map((indicator, index) => (
                                <li key={index} className="text-sm text-green-700">{indicator}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* User Concerns */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">User Concerns</h4>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <ul className="list-disc list-inside space-y-1">
                            {feedback.concerns.map((concern, index) => (
                                <li key={index} className="text-sm text-red-700">{concern}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </CardContent>
    </AnimatedCard>
);

// Main UserImpactView Component
export const UserImpactView: React.FC<UserImpactViewProps> = ({ impact, onUpdate, isLoading = false }) => {
    if (isLoading) {
        return <ContentLoading className="min-h-[400px]" />;
    }

    return (
        <AnimatePresence>
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">User Impact Analysis</h2>
                    <p className="text-gray-600">Understanding how this change affects our users</p>
                </div>

                {/* Segments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Suspense fallback={<ContentLoading />}>
                        {impact.segments_affected.map((segment, index) => (
                            <SegmentCard
                                key={index}
                                segment={segment}
                                onUpdate={updates => {
                                    if (onUpdate) {
                                        const newSegments = [...impact.segments_affected];
                                        newSegments[index] = { ...segment, ...updates };
                                        onUpdate({ segments_affected: newSegments });
                                    }
                                }}
                            />
                        ))}
                    </Suspense>
                </div>

                {/* Insights and Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Suspense fallback={<ContentLoading />}>
                        <AdoptionInsights
                            adoption={impact.adoption_prediction}
                            onUpdate={updates => onUpdate?.({
                                adoption_prediction: { ...impact.adoption_prediction, ...updates }
                            })}
                        />
                    </Suspense>

                    <Suspense fallback={<ContentLoading />}>
                        <FeedbackAnalysis
                            feedback={impact.feedback_analysis}
                            onUpdate={updates => onUpdate?.({
                                feedback_analysis: { ...impact.feedback_analysis, ...updates }
                            })}
                        />
                    </Suspense>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default UserImpactView;
