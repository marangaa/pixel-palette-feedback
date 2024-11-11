// types/roadmap.ts

export type TimeFrame = 'current' | 'next' | 'future' | 'completed';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'planned' | 'in-progress' | 'blocked' | 'completed' | 'cancelled';
export type BranchType = 'main' | 'alternative' | 'dependent';

export interface Milestone {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    progress: number;
    status: Status;
    dependencies: string[];
}

export interface RoadmapBranch {
    id: string;
    type: BranchType;
    title: string;
    description: string;
    probability: number; // 0-100
    items: RoadmapItem[];
    parentBranchId?: string;
    conditionalOn?: {
        type: 'milestone' | 'metric' | 'date';
        value: string;
    };
}

export interface RoadmapItem {
    id: string;
    type: 'feature' | 'bug' | 'improvement' | 'infrastructure';
    title: string;
    description: string;
    timeframe: TimeFrame;
    priority: Priority;
    status: Status;
    effort: number; // Story points or time estimate
    dependencies: string[];
    assignedTeam?: string;
    analysis?: {
        feasibility: number; // 0-100
        impact: number; // 0-100
        risk: number; // 0-100
        resources: {
            required: number;
            available: number;
        };
    };
    milestones: Milestone[];
    branches?: RoadmapBranch[]; // Alternative paths
    feedbackData?: {
        requestCount: number;
        avgSentiment: number;
        userSegments: string[];
        keyThemes: string[];
    };
}

export interface ResourceAllocation {
    startDate: Date;
    teamId: string;
    allocation: {
        [key: string]: number; // itemId: percentage
    };
    capacity: number;
    available: number;
}

export interface RoadmapTimeline {
    quarters: {
        [key: string]: {
            mainBranch: RoadmapItem[];
            alternativeBranches: RoadmapBranch[];
        };
    };
    resources: ResourceAllocation[];
    constraints: {
        maxParallelItems: number;
        resourceCap: number;
        priorityThresholds: {
            [K in Priority]: number;
        };
    };
}

export interface RoadmapFilter {
    timeframes: TimeFrame[];
    priorities: Priority[];
    status: Status[];
    teams?: string[];
    feasibilityRange?: [number, number];
    impactRange?: [number, number];
    hasAnalysis?: boolean;
    hasFeedback?: boolean;
}

export interface RoadmapView {
    type: 'timeline' | 'kanban' | 'graph' | 'calendar';
    groupBy?: 'priority' | 'status' | 'team' | 'timeframe';
    showDependencies: boolean;
    showResources: boolean;
    showAnalysis: boolean;
    showFeedback: boolean;
}