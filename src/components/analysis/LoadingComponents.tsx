import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CardSkeleton = () => (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 animate-pulse">
        <div className="space-y-3">
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
    </div>
);

export const StatsSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 animate-pulse">
                <div className="space-y-3">
                    <div className="h-4 w-1/3 bg-gray-200 rounded" />
                    <div className="h-6 w-1/2 bg-gray-200 rounded" />
                </div>
            </div>
        ))}
    </div>
);

export const ChartSkeleton = () => (
    <div className="h-[300px] rounded-lg border bg-card p-6 animate-pulse">
        <div className="h-full w-full bg-gray-200 rounded" />
    </div>
);

export const TableSkeleton = () => (
    <div className="rounded-lg border bg-card animate-pulse">
        <div className="h-12 border-b bg-gray-200" />
        {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b bg-gray-100" />
        ))}
    </div>
);

interface ContentLoadingProps {
    className?: string;
}

export const ContentLoading: React.FC<ContentLoadingProps> = ({ className }) => (
    <div className={cn(
        "flex items-center justify-center p-8",
        className
    )}>
        <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-gray-600">Loading content...</span>
        </div>
    </div>
);

export const AnimatedCard = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 animate-in fade-in-0 zoom-in-95",
            className
        )}
        {...props}
    >
        {children}
    </div>
));
AnimatedCard.displayName = 'AnimatedCard';

export const AnimatePresence: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => (
    <div
        className={cn(
            "transition-all duration-200 animate-in slide-in-from-bottom-4",
            className
        )}
    >
        {children}
    </div>
);

export const LoadingOverlay: React.FC<{ message?: string }> = ({
                                                                   message = "Loading..."
                                                               }) => (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="text-gray-600">{message}</span>
        </div>
    </div>
);