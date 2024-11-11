'use client'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    IconBrain,
    IconRocket,
    IconChartPie,
    IconMessages
} from '@tabler/icons-react';

const features = [
    {
        icon: <IconBrain className="h-6 w-6" />,
        title: "AI Analysis",
        description: "Transform feedback into insights"
    },
    {
        icon: <IconChartPie className="h-6 w-6" />,
        title: "Strategic Planning",
        description: "Data-driven decision making"
    },
    {
        icon: <IconRocket className="h-6 w-6" />,
        title: "Roadmap",
        description: "Visualize product strategy"
    },
    {
        icon: <IconMessages className="h-6 w-6" />,
        title: "Feedback",
        description: "Track customer needs"
    }
];

export default function Home() {
    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-grid-white/[0.02]" />

                <div className="relative pt-20 pb-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                                AI-Powered
                                <span className="text-blue-500"> Product Management</span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-300">
                                Transform customer feedback into actionable roadmaps with AI.
                                Make data-driven decisions faster.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link href="/analysis">
                                    <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-black">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => (
                            <div key={index} className="relative p-6 rounded-xl border border-white/10 bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-500/10 p-2">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                                        <p className="mt-1 text-sm text-gray-400">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/analysis">
                            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                                View Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}