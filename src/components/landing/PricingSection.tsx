import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

const plans = [
    {
        name: "Starter",
        price: "$499",
        description: "Perfect for small product teams getting started with AI-powered feedback analysis",
        features: [
            "Up to 10,000 feedback items/month",
            "Basic feedback analysis",
            "Simple roadmap generation",
            "Timeline visualization",
            "Email support",
            "2 team members",
            "Basic API access",
            "Standard reports"
        ],
        popular: false,
        color: "from-neutral-500 to-neutral-600"
    },
    {
        name: "Pro",
        price: "$999",
        description: "Ideal for growing product teams with complex feedback streams",
        features: [
            "Up to 50,000 feedback items/month",
            "Advanced sentiment analysis",
            "Intelligent prioritization",
            "Multiple visualization views",
            "Priority support",
            "10 team members",
            "Full API access",
            "Custom integrations",
            "Advanced analytics",
            "Resource optimization"
        ],
        popular: true,
        color: "from-orange-500 to-purple-500"
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations needing advanced features and customization",
        features: [
            "Unlimited feedback processing",
            "Custom AI model training",
            "Advanced roadmap strategies",
            "Custom visualizations",
            "24/7 dedicated support",
            "Unlimited team members",
            "Enterprise API access",
            "Custom integrations",
            "Advanced security features",
            "On-premise deployment option",
            "SLA guarantee"
        ],
        popular: false,
        color: "from-purple-500 to-indigo-500"
    }
];

interface Plan {
    name: string;
    price: string;
    description: string;
    features: string[];
    popular: boolean;
    color: string;
}

const PricingCard = ({ plan, index }: { plan: Plan; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`relative group ${plan.popular ? 'md:-mt-8' : ''}`}
        >
            <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} rounded-3xl transition-transform group-hover:scale-[0.98]`} />
            <div className="relative bg-neutral-950 rounded-3xl p-8 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 border border-neutral-800 flex flex-col h-full">
                {plan.popular && (
                    <div className="absolute -top-4 right-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full font-medium"
                        >
                            <Star className="w-4 h-4 fill-current" /> Most Popular
                        </motion.div>
                    </div>
                )}

                <div className="flex-grow">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-5xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                                {plan.price}
                            </span>
                            {plan.price !== "Custom" && <span className="text-neutral-400">/month</span>}
                        </div>
                        <p className="text-neutral-400">{plan.description}</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        {plan.features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div className={`p-1 rounded-full bg-gradient-to-r ${plan.color}`}>
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-neutral-300">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <Button
                    className={`w-full bg-gradient-to-r ${plan.color} text-white rounded-xl py-6 hover:opacity-90 transition-opacity mt-auto`}
                >
                    {plan.price === "Custom" ? "Contact Sales →" : "Get Started →"}
                </Button>
            </div>
        </motion.div>
    );
};

const PricingSection = () => {
    return (
        <section className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-6 py-3 rounded-full text-sm font-medium bg-orange-500/10 text-orange-500 mb-6"
                    >
                        Pricing Plans
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        Scale as you grow
                    </h2>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Choose the perfect plan for your needs. All plans include our core AI features.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch">
                    {plans.map((plan, index) => (
                        <PricingCard key={index} plan={plan} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;