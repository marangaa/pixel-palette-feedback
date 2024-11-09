import React from 'react';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export const metadata = {
    title: 'Feedback Analytics Dashboard',
    description: 'Analyze user feedback and feature requests',
};

export default function AnalyticsPage() {
    return (
        <main>
            <AnalyticsDashboard />
        </main>
    );
}