import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Github, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
    const year = new Date().getFullYear();

    const footerSections = [
        {
            title: "Platform",
            links: ["AI Models", "API Reference", "Documentation", "Integrations", "Pricing"]
        },
        {
            title: "Company",
            links: ["About Us", "Careers", "Blog", "Press Kit", "Contact"]
        },
        {
            title: "Resources",
            links: ["Community", "Developer Hub", "Support", "Status", "Terms"]
        }
    ];

    const socialLinks = [
        { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
        { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" },
        { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
        { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" }
    ];

    return (
        <footer className="relative bg-neutral-950 pt-24 pb-12 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-16 border-b border-neutral-800">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
                                BuildAI
                            </h3>
                            <p className="text-neutral-400 max-w-md">
                                Empowering developers to build the future with advanced AI solutions. 
                                Join thousands of companies already transforming their products.
                            </p>
                        </motion.div>

                        {/* Newsletter Signup */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <h4 className="text-white font-semibold">Stay updated</h4>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <button className="bg-gradient-to-r from-orange-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                                    Subscribe
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Links Section */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {footerSections.map((section, index) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <h4 className="text-white font-semibold mb-6">{section.title}</h4>
                                <ul className="space-y-4">
                                    {section.links.map((link, i) => (
                                        <motion.li
                                            key={link}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <a
                                                href="#"
                                                className="text-neutral-400 hover:text-white transition-colors relative group"
                                            >
                                                {link}
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-purple-500 transition-all group-hover:w-full" />
                                            </a>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-neutral-400"
                    >
                        © {year} BuildAI. All rights reserved.
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex gap-6"
                    >
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-neutral-400 hover:text-white transition-colors"
                                aria-label={social.label}
                            >
                                {social.icon}
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;