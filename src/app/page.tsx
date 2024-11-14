'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { SparklesCore } from "@/components/ui/sparkles";

interface Feature {
    title: string;
    description: string;
    icon: JSX.Element;
}

interface Metric {
    value: string;
    label: string;
    prefix?: string;
}

const features: Feature[] = [
    {
        icon: (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
        title: "AI-Powered Insights",
        description: "Transform raw data into strategic decisions with our advanced AI engine"
    },
    {
        icon: (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ),
        title: "Real-time Analytics",
        description: "Monitor and analyze your product metrics in real-time with instant updates"
    },
    {
        icon: (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L7 21L2 16L7 11L12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 8L17 13L12 8L17 3L22 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
        title: "Seamless Integration",
        description: "Connect with your existing tools and workflows effortlessly"
    },
];

const metrics: Metric[] = [
    { prefix: "↑", value: "400%", label: "Increase in productivity" },
    { prefix: "→", value: "2M+", label: "Data points analyzed" },
    { prefix: "↓", value: "85%", label: "Reduced decision time" },
];

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <BackgroundGradient className="rounded-[22px] p-6 bg-zinc-900 dark:bg-zinc-900">
                <div className="relative z-10">
                    <div className="mb-4 p-3 inline-flex rounded-2xl bg-blue-500/10">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-zinc-300">{feature.description}</p>
                </div>
            </BackgroundGradient>
        </motion.div>
    );
};

const MetricCard: React.FC<{ metric: Metric; index: number }> = ({ metric, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800"
        >
            <div className="flex items-center justify-center space-x-2">
                {metric.prefix && (
                    <span className="text-2xl text-blue-400">{metric.prefix}</span>
                )}
                <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
          {metric.value}
        </span>
            </div>
            <p className="mt-2 text-zinc-300">{metric.label}</p>
        </motion.div>
    );
};

const HomePage: React.FC = () => {
    const [scrollY, setScrollY] = useState<number>(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 w-full h-full bg-black">
                <div className="absolute inset-0 h-full w-full bg-black">
                    <div className="absolute inset-0 w-full h-full z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
                    <SparklesCore
                        id="tsparticlesfullpage"
                        background="transparent"
                        minSize={0.6}
                        maxSize={1.4}
                        particleDensity={100}
                        className="w-full h-full"
                        particleColor="#FFFFFF"
                    />
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-violet-500/10 to-transparent"
                         style={{ transform: `translateY(${scrollY * 0.5}px)` }} />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="mb-8 relative"
                        >
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full blur-xl opacity-20" />
                            <h1 className="relative text-6xl md:text-8xl font-bold tracking-tighter">
                                Build the{' '}
                                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Future
                </span>
                            </h1>
                        </motion.div>

                        <TextGenerateEffect
                            words="Transform your product development with AI-powered insights and real-time analytics"
                            className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-12 leading-relaxed"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white px-8 py-6 text-lg rounded-full"
                            >
                                Get Started
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-zinc-700 hover:bg-zinc-800 text-white px-8 py-6 text-lg rounded-full"
                            >
                                Watch Demo
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-32 bg-gradient-to-b from-black via-zinc-900 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
                            Everything you need to build exceptional products
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} feature={feature} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            <section className="relative py-32 bg-gradient-to-b from-black via-zinc-900 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {metrics.map((metric, index) => (
                            <MetricCard key={index} metric={metric} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 bg-gradient-to-b from-black to-zinc-900">
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-blue-500/10 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                            Ready to get started?
                        </h2>
                        <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-12">
                            Join thousands of companies building the future of product development
                        </p>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white px-8 py-6 text-lg rounded-full"
                        >
                            Start Free Trial
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;