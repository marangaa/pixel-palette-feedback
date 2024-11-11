'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
    IconChartBar,
    IconRoad,
    IconMessageCircle,
    IconChartPie
} from '@tabler/icons-react';

const navigation = [
    {
        name: 'Analysis',
        href: '/simulated-analysis',
        icon: IconChartBar
    },
    {
        name: 'Analytics',
        href: '/analytics',
        icon: IconChartPie
    },
    {
        name: 'Roadmap',
        href: '/roadmap',
        icon: IconRoad
    },
    {
        name: 'Chat',
        href: '/chat',
        icon: IconMessageCircle
    }
];

export function TopNav() {
    const pathname = usePathname();

    return (
        <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
                <Link href="/" className="mr-6">
                    <span className="font-bold">genny</span>
                </Link>
                <nav className="flex items-center space-x-4 lg:space-x-6">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 text-sm transition-colors hover:text-primary",
                                    pathname === item.href
                                        ? "text-blue-500 font-medium"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}