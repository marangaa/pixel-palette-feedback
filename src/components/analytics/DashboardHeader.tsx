import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { TimeRangeSelector } from './TimeRangeSelector';

interface DashboardHeaderProps {
    timeRange: number;
    onTimeRangeChange: (days: number) => void;
    totalConversations: number;
    onRefresh: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
                                                             timeRange,
                                                             onTimeRangeChange,
                                                             totalConversations,
                                                             onRefresh
                                                         }) => {
    return (
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Feedback Analytics</h1>
                <p className="text-gray-600">
                    Analyzing {totalConversations} conversations from the past {timeRange} days
                </p>
            </div>
            <div className="flex items-center space-x-4">
                <TimeRangeSelector
                    value={timeRange}
                    onChange={onTimeRangeChange}
                />
                <button
                    onClick={onRefresh}
                    className="flex items-center space-x-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                >
                    <RefreshCcw className="w-4 h-4" />
                    <span>Refresh</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;