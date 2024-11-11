import React from 'react';
import { Calendar } from 'lucide-react';

interface TimeRangeSelectorProps {
    value: number;
    onChange: (days: number) => void;
}

const timeRanges = [
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: '90 days', value: 90 }
] as const;

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 px-3 py-2 appearance-none cursor-pointer"
            >
                {timeRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                        Last {range.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TimeRangeSelector;