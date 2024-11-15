import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    AnimatedCard,
    ContentLoading,
    AnimatePresence,
    LoadingOverlay
} from './LoadingComponents';
import type { ImplementationRisk } from '@/types/analysis';

interface ImplementationRisksViewProps {
    risks: ImplementationRisk;
    onUpdate?: (updates: Partial<ImplementationRisk>) => void;
    isLoading?: boolean;
}

const MotionBadge = motion(Badge);

const TimelineItem: React.FC<{
    milestone: {
        name: string;
        duration: string;
        dependencies: string[];
    };
    index: number;
}> = ({ milestone, index }) => (
    <motion.div
        className="relative pl-8 pb-8 last:pb-0"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 * index }}
    >
        <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200">
            <motion.div
                className="absolute top-0 left-[-3px] w-2 h-2 rounded-full bg-purple-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 * index }}
            />
        </div>
        <div>
            <motion.h4
                className="font-medium text-gray-800"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 * index }}
            >
                {milestone.name}
            </motion.h4>
            <motion.p
                className="text-sm text-gray-600 mt-1"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 * index }}
            >
                Duration: {milestone.duration}
            </motion.p>
            {milestone.dependencies.length > 0 && (
                <motion.div
                    className="mt-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 * index }}
                >
                    <p className="text-xs text-gray-500">Dependencies:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {milestone.dependencies.map((dep, i) => (
                            <MotionBadge
                                key={i}
                                variant="outline"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 * i }}
                            >
                                {dep}
                            </MotionBadge>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    </motion.div>
);

const TimelineRisksSection: React.FC<{
    timeline: ImplementationRisk['timeline'];
    isLoading?: boolean;
}> = ({ timeline, isLoading }) => (
    <AnimatedCard>
        <CardContent className="space-y-4 relative">
            {isLoading && <LoadingOverlay message="Updating timeline analysis..." />}

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2">Estimated Duration</h4>
                <p className="text-sm text-gray-600">{timeline.estimated_duration}</p>
            </motion.div>

            <motion.div
                className="space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Milestones</h4>
                <div className="space-y-4">
                    {timeline.key_milestones.map((milestone, index) => (
                        <TimelineItem
                            key={index}
                            milestone={milestone}
                            index={index}
                        />
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Factors</h4>
                <ul className="list-disc list-inside space-y-1">
                    {timeline.risks.map((risk, index) => (
                        <motion.li
                            key={index}
                            className="text-sm text-gray-600"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            {risk}
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </CardContent>
    </AnimatedCard>
);

const TechnicalRisksSection: React.FC<{
    technical: ImplementationRisk['technical'];
    onUpdate?: (updates: Partial<ImplementationRisk['technical']>) => void;
    isLoading?: boolean;
}> = ({ technical, onUpdate, isLoading }) => (
    <AnimatedCard>
        <CardContent className="space-y-4 relative">
            {isLoading && <LoadingOverlay message="Updating technical analysis..." />}

            <motion.div
                className="flex items-center justify-between"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <span className="text-sm text-gray-600">Complexity Level</span>
                <MotionBadge
                    variant={technical.complexity === 'high' ? 'destructive' :
                        technical.complexity === 'medium' ? 'secondary' : 'default'}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {technical.complexity.toUpperCase()}
                </MotionBadge>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uncertain Areas</h4>
                <ul className="list-disc list-inside space-y-1">
                    {technical.uncertain_areas.map((area, index) => (
                        <motion.li
                            key={index}
                            className="text-sm text-gray-600"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            {area}
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2">Required Expertise</h4>
                <div className="flex flex-wrap gap-2">
                    {technical.required_expertise.map((expertise, index) => (
                        <MotionBadge
                            key={index}
                            variant="secondary"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            {expertise}
                        </MotionBadge>
                    ))}
                </div>
            </motion.div>
        </CardContent>
    </AnimatedCard>
);

const BusinessRisksSection: React.FC<{
    business: ImplementationRisk['business'];
    onUpdate?: (updates: Partial<ImplementationRisk['business']>) => void;
    isLoading?: boolean;
}> = ({ business, isLoading }) => (
    <AnimatedCard>
        <CardContent className="space-y-4 relative">
            {isLoading && <LoadingOverlay message="Updating business analysis..." />}

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2">Cost Estimate</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                    <motion.p
                        className="text-sm text-gray-600"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {business.cost_estimate.currency}
                        {business.cost_estimate.min.toLocaleString()} -
                        {business.cost_estimate.max.toLocaleString()}
                    </motion.p>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2">Revenue Impact</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                    <motion.p
                        className="text-sm text-gray-600"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Estimated: {business.revenue_impact.estimate.toLocaleString()}
                    </motion.p>
                    <motion.p
                        className="text-xs text-gray-500 mt-1"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Confidence: {business.revenue_impact.confidence}%
                    </motion.p>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2">Opportunity Cost</h4>
                <ul className="list-disc list-inside space-y-1">
                    {business.opportunity_cost.map((cost, index) => (
                        <motion.li
                            key={index}
                            className="text-sm text-gray-600"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            {cost}
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </CardContent>
    </AnimatedCard>
);

export const ImplementationRisksView: React.FC<ImplementationRisksViewProps> = ({
                                                                                    risks,
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
                    <h2 className="text-2xl font-bold text-gray-900">Implementation Risks</h2>
                    <p className="text-gray-600">Analysis of potential risks and challenges</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Suspense fallback={<ContentLoading />}>
                        <Card>
                            <CardHeader className="flex flex-row items-center space-x-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <CardTitle>Technical Risks</CardTitle>
                            </CardHeader>
                            <TechnicalRisksSection
                                technical={risks.technical}
                                onUpdate={(updates: Partial<ImplementationRisk['technical']>) => onUpdate?.({
                                    technical: { ...risks.technical, ...updates }
                                })}
                            />
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center space-x-2">
                                <DollarSign className="h-5 w-5 text-blue-500" />
                                <CardTitle>Business Risks</CardTitle>
                            </CardHeader>
                            <BusinessRisksSection
                                business={risks.business}
                                onUpdate={updates => onUpdate?.({
                                    business: { ...risks.business, ...updates }
                                })}
                            />
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center space-x-2">
                                <Clock className="h-5 w-5 text-yellow-500" />
                                <CardTitle>Timeline Risks</CardTitle>
                            </CardHeader>
                            <TimelineRisksSection
                                timeline={risks.timeline}
                                onUpdate={updates => onUpdate?.({
                                    timeline: { ...risks.timeline, ...updates }
                                })}
                            />
                        </Card>
                    </Suspense>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default ImplementationRisksView;