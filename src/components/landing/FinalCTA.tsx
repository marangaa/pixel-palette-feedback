import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SparklesCore } from "@/components/ui/sparkles";

const FinalCTA = () => {
    return (
        <section className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 to-neutral-900" />
            
            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative overflow-hidden"
                >
                    {/* Background Card with Gradient Border */}
                    <div className="relative rounded-3xl p-1 bg-gradient-to-r from-orange-500 via-purple-500 to-orange-500">
                        <div className="bg-neutral-950 rounded-3xl p-12 md:p-16 relative overflow-hidden">
                            {/* Sparkles Effect */}
                            <div className="absolute inset-0">
                                <SparklesCore
                                    id="tsparticlesfinalcta"
                                    background="transparent"
                                    minSize={0.4}
                                    maxSize={1}
                                    particleDensity={40}
                                    className="w-full h-full"
                                    particleColor="#fff"
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 text-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="inline-block px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-orange-500/10 to-purple-500/10 text-orange-500 mb-6 border border-orange-500/20"
                                >
                                    Ready to Transform Your Product?
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent"
                                >
                                    Start Building with AI Today
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12"
                                >
                                    Join thousands of developers and companies already building the future.
                                    Get 3 months free on annual plans.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col sm:flex-row gap-4 justify-center"
                                >
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white px-8 py-6 text-lg rounded-xl"
                                    >
                                        Start Building Free →
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-8 py-6 text-lg rounded-xl border border-neutral-700"
                                    >
                                        Talk to Sales
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;