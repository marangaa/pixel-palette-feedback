'use client'

import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import StatsSection from '../components/landing/StatsSection';
import PricingSection from '../components/landing/PricingSection';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';
import { ArrowRight } from 'lucide-react';

interface Feature {
    title: string;
    description: string;
    category: string;
    image: string;
}

const features: Feature[] = [
    {
        category: "AI & ML",
        title: "Predictive Analytics",
        description: "Forecast trends and make data-driven decisions with our advanced ML models",
        image: "/api/placeholder/600/400"
    },
    {
        category: "Automation",
        title: "Workflow Builder",
        description: "Design and automate complex workflows without writing code",
        image: "/api/placeholder/600/400"
    },
    {
        category: "Integration",
        title: "API Gateway",
        description: "Connect and manage all your services through a single interface",
        image: "/api/placeholder/600/400"
    }
];

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="group relative"
        >
            <div className="absolute inset-0 bg-orange-500 rounded-3xl transition-transform group-hover:scale-[0.98]" />
            <div className="relative bg-neutral-950 rounded-3xl p-8 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">
                <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-orange-500/10 text-orange-500 mb-4">
                    {feature.category}
                </span>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-neutral-400 mb-6">{feature.description}</p>
                <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-48 object-cover rounded-xl"
                />
            </div>
        </motion.div>
    );
};

const HomePage: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    
    return (
        <div className="bg-neutral-950 text-white">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <motion.div 
                    className="absolute inset-0 z-0"
                    style={{ y }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-purple-500/20 mix-blend-overlay" />
                    <div className="grid grid-cols-8 gap-4 p-4 h-full opacity-30">
                        {Array.from({ length: 64 }).map((_, i) => (
                            <div 
                                key={i} 
                                className="aspect-square bg-neutral-900/50 rounded-lg"
                            />
                        ))}
                    </div>
                </motion.div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mb-8"
                        >
                            <span className="inline-block px-6 py-3 rounded-full text-sm font-medium bg-orange-500/10 text-orange-500 mb-6">
                                Transforming AI Development →
                            </span>
                            <h1 className="text-7xl md:text-8xl font-bold mb-6 tracking-tighter">
                                Build
                                <span className="text-orange-500"> faster.</span>
                                <br />
                                Ship
                                <span className="text-purple-500"> smarter.</span>
                            </h1>
                        </motion.div>

                        <TextGenerateEffect
                            words="The most advanced platform for modern product teams. Powered by AI, designed for humans."
                            className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto mb-12"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white px-8 py-6 text-lg rounded-xl group"
                            >
                                <span className="flex items-center gap-2">
                                    Start Building
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-neutral-900/50 backdrop-blur-sm border-2 border-neutral-800 hover:bg-neutral-800 text-white px-8 py-6 text-lg rounded-xl"
                            >
                                Book Demo
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <span className="inline-block px-6 py-3 rounded-full text-sm font-medium bg-purple-500/10 text-purple-500 mb-6">
                            Features
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Everything you need.
                            <br />
                            Nothing you don&apos;t.
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} feature={feature} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <StatsSection />

            {/* Pricing Section */}
            <PricingSection />

            {/* Final CTA */}
            <FinalCTA />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;