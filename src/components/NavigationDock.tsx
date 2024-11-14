"use client";

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

    // Define your navigation links here
    const navigationLinks = [
        {
            title: "Analysis",
            icon: <IconChartBar />, // Ensure icon is ReactNode
            href: "/simulated-analysis",
        },
        {
            title: "Analytics",
            icon: <IconChartPie />,
            href: "/analytics",
        },
        {
            title: "Roadmap",
            icon: <IconRoad />,
            href: "/roadmap",
        },
        {
            title: "Chat",
            icon: <IconMessageCircle />,
            href: "/chat",
        },
    ];

    // Skip the NavigationDock if on the home page
    if (pathname === "/") return null;

    return (
        <FloatingDock
            desktopClassName="fixed bottom-4 left-1/2 transform -translate-x-1/2"
            items={navigationLinks.map(link => ({
                title: link.title,
                href: link.href,
                icon: React.cloneElement(link.icon, {
                    className: `h-full w-full ${
                        pathname.includes(link.href)
                            ? 'text-blue-500'
                            : 'text-neutral-500 dark:text-neutral-300'
                    }`,
                }),
            }))}
        />
    );
}
