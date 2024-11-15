import React, { Suspense } from 'react';
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
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
import {
    AnimatedCard,
    ContentLoading,
    AnimatePresence,
    LoadingOverlay
} from './LoadingComponents';
import type { Recommendation } from '@/types/analysis';

interface RecommendationViewProps {
    recommendation: Recommendation;
    onUpdate?: (updates: Partial<Recommendation>) => void;
    isLoading?: boolean;
}

const MotionBadge = motion(Badge);

type DecisionType = 'proceed' | 'hold' | 'modify' | 'reject';

const getDecisionIcon = (decision: DecisionType) => {
    const icons = {
        proceed: <CheckCircle2 className="w-8 h-8 text-green-500" />,
        hold: <PauseCircle className="w-8 h-8 text-yellow-500" />,
        modify: <SwitchCamera className="w-8 h-8 text-blue-500" />,
        reject: <XCircle className="w-8 h-8 text-red-500" />
    };
    return icons[decision] || <AlertCircle className="w-8 h-8 text-gray-500" />;
};

const getDecisionColor = (decision: DecisionType) => {
    const colors = {
        proceed: 'bg-green-100 text-green-800 border-green-200',
        hold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        modify: 'bg-blue-100 text-blue-800 border-blue-200',
        reject: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[decision] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const DecisionCard: React.FC<{
    decision: DecisionType;
    confidenceLevel: number;
    isLoading?: boolean;
}> = ({ decision, confidenceLevel, isLoading }) => (
    <AnimatedCard className="md:col-span-2">
        <CardContent className="pt-6 relative">
            {isLoading && <LoadingOverlay message="Updating decision..." />}
            <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="flex items-center gap-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {getDecisionIcon(decision)}
                    </motion.div>
                    <div>
                        <motion.h3
                            className="text-xl font-semibold text-gray-900"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Recommended Decision
                        </motion.h3>
                        <div className="flex items-center gap-2 mt-1">
                            <MotionBadge
                                className={getDecisionColor(decision)}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {decision.toUpperCase()}
                            </MotionBadge>
                            <motion.span
                                className="text-sm text-gray-500"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {confidenceLevel}% confidence
                            </motion.span>
                        </div>
                    </div>
                </div>
                <motion.div
                    className="w-32"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Progress value={confidenceLevel} />
                </motion.div>
            </motion.div>
        </CardContent>
    </AnimatedCard>
);

const KeyFactorsCard: React.FC<{
    factors: string[];
    onUpdate?: (updates: any) => void;
    isLoading?: boolean;
}> = ({ factors, onUpdate, isLoading }) => (
    <AnimatedCard>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Key Decision Factors
            </CardTitle>
        </CardHeader>
        <CardContent className="relative">
            {isLoading && <LoadingOverlay message="Updating factors..." />}
            <ul className="space-y-4">
                {factors.map((factor, index) => (
                    <motion.li
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <ArrowRight className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="text-gray-600">{factor}</span>
                    </motion.li>
                ))}
            </ul>
        </CardContent>
    </AnimatedCard>
);

const NextStepsCard: React.FC<{
    steps: string[];
    onUpdate?: (updates: any) => void;
    isLoading?: boolean;
}> = ({ steps, isLoading }) => (
    <AnimatedCard>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ListChecks className="w-5 h-5" />
                Recommended Next Steps
            </CardTitle>
        </CardHeader>
        <CardContent className="relative">
            {isLoading && <LoadingOverlay message="Updating next steps..." />}
            <ul className="space-y-4">
                {steps.map((step, index) => (
                    <motion.li
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <motion.div
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-medium"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 * index }}
                        >
                            {index + 1}
                        </motion.div>
                        <span className="text-gray-600">{step}</span>
                    </motion.li>
                ))}
            </ul>
        </CardContent>
    </AnimatedCard>
);

const AlternativesCard: React.FC<{
    alternatives: string[];
    isLoading?: boolean;
}> = ({ alternatives, isLoading }) => (
    <AnimatedCard className="md:col-span-2">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <SwitchCamera className="w-5 h-5" />
                Alternative Approaches
            </CardTitle>
        </CardHeader>
        <CardContent className="relative">
            {isLoading && <LoadingOverlay message="Updating alternatives..." />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alternatives.map((alternative, index) => (
                    <motion.div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <div className="flex items-start gap-3">
                            <motion.div
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-sm font-medium border border-gray-200"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 * index }}
                            >
                                {String.fromCharCode(65 + index)}
                            </motion.div>
                            <span className="text-gray-600">{alternative}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </CardContent>
    </AnimatedCard>
);

export const RecommendationView: React.FC<RecommendationViewProps> = ({
                                                                          recommendation,
                                                                          onUpdate,
                                                                          isLoading = false
                                                                      }) => {
    if (isLoading) {
        return <ContentLoading className="min-h-[400px]" />;
    }

    return (
        <AnimatePresence>
            <div className="space-y-8">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900">Final Recommendation</h2>
                    <p className="text-gray-600">Analysis conclusion and next steps</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Suspense fallback={<ContentLoading />}>
                        <DecisionCard
                            decision={recommendation.decision}
                            confidenceLevel={recommendation.confidence_level}
                            onUpdate={updates => onUpdate?.({ ...recommendation, ...updates })}
                            isLoading={isLoading}
                        />

                        <KeyFactorsCard
                            factors={recommendation.key_factors}
                            onUpdate={updates => onUpdate?.(updates)}
                            isLoading={isLoading}
                        />

                        <NextStepsCard
                            steps={recommendation.next_steps}
                            onUpdate={updates => onUpdate?.(updates)}
                            isLoading={isLoading}
                        />

                        <AlternativesCard
                            alternatives={recommendation.alternatives}
                            onUpdate={updates => onUpdate?.(updates)}
                            isLoading={isLoading}
                        />
                    </Suspense>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default RecommendationView;