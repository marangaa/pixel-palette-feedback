import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Users,
    Server,
    GraduationCap,
    Clock,
    DollarSign,
    BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    AnimatedCard,
    ContentLoading,
    AnimatePresence,
    LoadingOverlay
} from './LoadingComponents';
import type { ResourceRequirements } from '@/types/analysis';

interface ResourceRequirementsViewProps {
    requirements: ResourceRequirements;
    onUpdate?: (updates: Partial<ResourceRequirements>) => void;
    isLoading?: boolean;
}

const MotionBadge = motion(Badge);

const TeamAllocationCard: React.FC<{
    team: ResourceRequirements['teams_involved'][0];
    onUpdate?: (updates: Partial<typeof team>) => void;
    isLoading?: boolean;
}> = ({ team, onUpdate, isLoading }) => {
    const getTimeProgress = (timeStr: string) => {
        const hours = timeStr.toLowerCase().includes('week')
            ? parseInt(timeStr) * 40
            : parseInt(timeStr);
        return Math.min((hours / 160) * 100, 100);
    };

    return (
        <AnimatedCard>
            <CardContent className="pt-6 relative">
                {isLoading && <LoadingOverlay message="Updating team allocation..." />}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <motion.h3
                            className="font-medium text-gray-900"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            {team.team}
                        </motion.h3>
                        <motion.p
                            className="text-sm text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {team.required_time}
                        </motion.p>
                    </div>
                    <Users className="w-5 h-5 text-gray-400" />
                </div>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Progress value={getTimeProgress(team.required_time)} className="mb-4" />
                </motion.div>

                <motion.div
                    className="space-y-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h4 className="text-sm font-medium text-gray-700">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {team.key_skills.map((skill, index) => (
                            <MotionBadge
                                key={index}
                                variant="secondary"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                {skill}
                            </MotionBadge>
                        ))}
                    </div>
                </motion.div>
            </CardContent>
        </AnimatedCard>
    );
};

const InfrastructureRequirements: React.FC<{
    infrastructure: ResourceRequirements['infrastructure'];
    onUpdate?: (updates: Partial<typeof infrastructure>) => void;
    isLoading?: boolean;
}> = ({ infrastructure, onUpdate, isLoading }) => (
    <AnimatedCard>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Infrastructure Requirements
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
            {isLoading && <LoadingOverlay message="Updating infrastructure data..." />}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Estimated Costs
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <motion.p
                        className="text-2xl font-bold text-gray-900"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        ${infrastructure.estimated_costs.toLocaleString()}
                    </motion.p>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2">New Requirements</h4>
                <ul className="list-disc list-inside space-y-1">
                    {infrastructure.new_requirements.map((req, index) => (
                        <motion.li
                            key={index}
                            className="text-sm text-gray-600"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            {req}
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2">Needed Upgrades</h4>
                <ul className="list-disc list-inside space-y-1">
                    {infrastructure.upgrades_needed.map((upgrade, index) => (
                        <motion.li
                            key={index}
                            className="text-sm text-gray-600"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            {upgrade}
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </CardContent>
    </AnimatedCard>
);

const TrainingRequirements: React.FC<{
    training: ResourceRequirements['training'];
    onUpdate?: (updates: Partial<typeof training>) => void;
    isLoading?: boolean;
}> = ({ training, onUpdate, isLoading }) => (
    <AnimatedCard>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Training Requirements
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
            {isLoading && <LoadingOverlay message="Updating training data..." />}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Training Duration
                </h4>
                <p className="text-lg font-semibold text-gray-900">{training.training_time}</p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                    {training.required_skills.map((skill, index) => (
                        <MotionBadge
                            key={index}
                            variant="outline"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            {skill}
                        </MotionBadge>
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h4 className="text-sm font-medium text-gray-700 mb-2">Training Materials</h4>
                <ul className="list-disc list-inside space-y-1">
                    {training.materials_needed.map((material, index) => (
                        <motion.li
                            key={index}
                            className="text-sm text-gray-600"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            {material}
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </CardContent>
    </AnimatedCard>
);

export const ResourceRequirementsView: React.FC<ResourceRequirementsViewProps> = ({
                                                                                      requirements,
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
                    <h2 className="text-2xl font-bold text-gray-900">Resource Requirements</h2>
                    <p className="text-gray-600">Overview of needed resources and allocations</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Suspense fallback={<ContentLoading />}>
                        {requirements.teams_involved.map((team, index) => (
                            <TeamAllocationCard
                                key={index}
                                team={team}
                                onUpdate={updates => {
                                    if (onUpdate) {
                                        const newTeams = [...requirements.teams_involved];
                                        newTeams[index] = { ...team, ...updates };
                                        onUpdate({ teams_involved: newTeams });
                                    }
                                }}
                            />
                        ))}
                    </Suspense>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Suspense fallback={<ContentLoading />}>
                        <InfrastructureRequirements
                            infrastructure={requirements.infrastructure}
                            onUpdate={updates => onUpdate?.({
                                infrastructure: { ...requirements.infrastructure, ...updates }
                            })}
                        />
                    </Suspense>

                    <Suspense fallback={<ContentLoading />}>
                        <TrainingRequirements
                            training={requirements.training}
                            onUpdate={updates => onUpdate?.({
                                training: { ...requirements.training, ...updates }
                            })}
                        />
                    </Suspense>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default ResourceRequirementsView;