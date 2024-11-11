import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
    IconChartBar,
    IconRoad,
    IconMessageCircle,
    IconChartPie,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";

export function NavigationDock() {
    const pathname = usePathname();

    const navigationLinks = [
        {
            title: "Analysis",
            icon: (
                <IconChartBar
                    className={`h-full w-full ${
                        pathname.includes('/simulated-analysis')
                            ? 'text-blue-500'
                            : 'text-neutral-500 dark:text-neutral-300'
                    }`}
                />
            ),
            href: "/simulated-analysis",
        },
        {
            title: "Analytics",
            icon: (
                <IconChartPie
                    className={`h-full w-full ${
                        pathname.includes('/analytics')
                            ? 'text-blue-500'
                            : 'text-neutral-500 dark:text-neutral-300'
                    }`}
                />
            ),
            href: "/analytics",
        },
        {
            title: "Roadmap",
            icon: (
                <IconRoad
                    className={`h-full w-full ${
                        pathname.includes('/roadmap')
                            ? 'text-blue-500'
                            : 'text-neutral-500 dark:text-neutral-300'
                    }`}
                />
            ),
            href: "/roadmap",
        },
        {
            title: "Chat",
            icon: (
                <IconMessageCircle
                    className={`h-full w-full ${
                        pathname.includes('/chat')
                            ? 'text-blue-500'
                            : 'text-neutral-500 dark:text-neutral-300'
                    }`}
                />
            ),
            href: "/chat",
        },
    ];

    return (
        <FloatingDock
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2"
            items={navigationLinks}
        />
    );
}

// Optional: Create a layout wrapper component
export function DockLayout({ children }) {
    return (
        <div className="min-h-screen pb-20">
            {children}
            <NavigationDock />
        </div>
    );
}