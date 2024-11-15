import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Target, Zap, GitPullRequestDraft, MessageSquare, Brain, Gauge } from 'lucide-react';

const stats = [
    {
        label: "Feedback Processing",
        value: "70%",
        subtext: "Reduction in processing time",
        icon: <Clock className="w-6 h-6" />,
        description: "Process customer feedback faster",
        color: "from-orange-500 to-rose-500"
    },
    {
        label: "Feature Prioritization",
        value: "100x",
        subtext: "Faster decision making",
        icon: <Target className="w-6 h-6" />,
        description: "Data-driven priority decisions",
        color: "from-emerald-500 to-teal-500"
    },
    {
        label: "Team Productivity",
        value: "85%",
        subtext: "Increased efficiency",
        icon: <Zap className="w-6 h-6" />,
        description: "Streamlined workflows",
        color: "from-blue-500 to-cyan-500"
    },
    {
        label: "Customer Satisfaction",
        value: "95%",
        subtext: "Alignment with needs",
        icon: <Users className="w-6 h-6" />,
        description: "Better feature delivery",
        color: "from-purple-500 to-indigo-500"
    }
];

const StatsSection = () => {
    return (
        <section className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 to-neutral-900" />
            
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-6 py-3 rounded-full text-sm font-medium bg-orange-500/10 text-orange-500 mb-6">
                        Real Results
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        Transforming Product Management
                    </h2>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Our AI-powered platform delivers measurable improvements across your entire product development lifecycle
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-2xl transition-transform group-hover:scale-[0.98]" />
                            <div className="relative bg-neutral-950 p-6 rounded-2xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 border border-neutral-800">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                                        <div className="text-white">
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ 
                                            duration: 0.5,
                                            delay: index * 0.2,
                                            type: "spring",
                                            stiffness: 100
                                        }}
                                        className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                                    >
                                        {stat.value}
                                    </motion.div>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {stat.label}
                                </h3>
                                <p className="text-neutral-400 text-sm mb-2">
                                    {stat.subtext}
                                </p>
                                <p className="text-neutral-500 text-xs">
                                    {stat.description}
                                </p>

                                {/* Decorative Line */}
                                <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Metrics */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: <GitPullRequestDraft className="w-5 h-5" />, label: "Feature Requests", value: "5K+" },
                        { icon: <MessageSquare className="w-5 h-5" />, label: "Customer Feedback", value: "50K+" },
                        { icon: <Brain className="w-5 h-5" />, label: "AI Models", value: "10+" },
                        { icon: <Gauge className="w-5 h-5" />, label: "Processing Time", value: "<1s" }
                    ].map((metric, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800"
                        >
                            <div className="text-orange-500 mb-2">
                                {metric.icon}
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {metric.value}
                            </div>
                            <div className="text-xs text-neutral-400 text-center">
                                {metric.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;