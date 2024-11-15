export type AnalysisSection =
    | 'market_analysis'
    | 'team_perspectives'
    | 'implementation_risks'
    | 'user_impact'
    | 'resource_requirements'
    | 'recommendation';

export interface DetailedAnalysisLayoutProps {
    analysis: Analysis;
    isLoading?: boolean;
    onUpdateAnalysis?: <T extends Analysis[AnalysisSection]>(section: AnalysisSection, updates: T) => Promise<void>;
}

export interface MarketAnalysis {
    market_size: {
        total_addressable: number;
        serviceable: number;
        current_reach: number;
    };
    competition: {
        direct_competitors: Array<{
            name: string;
            market_share: number;
            key_features: string[];
            strengths: string[];
            weaknesses: string[];
        }>;
        indirect_competitors: Array<{
            name: string;
            overlap_areas: string[];
            threat_level: 'high' | 'medium' | 'low';
        }>;
    };
    trends: {
        growing: string[];
        declining: string[];
        emerging: string[];
    };
}

export interface TeamPerspective {
    sentiment: number;
    team: string;
    concerns: string[];
    suggestions: string[];
    role: string;
    priorities: string[];
    constraints: string[];
    expertise_areas: string[];
    confidence_level: number;
    estimated_effort: {
        time: string;
        resources: string[];
        dependencies: string[];
    };
}

export interface ImplementationRisk {
    technical: {
        complexity: 'high' | 'medium' | 'low';
        uncertain_areas: string[];
        required_expertise: string[];
        potential_roadblocks: string[];
    };
    business: {
        cost_estimate: {
            min: number;
            max: number;
            currency: string;
        };
        revenue_impact: {
            estimate: number;
            confidence: number;
            factors: string[];
        };
        opportunity_cost: string[];
    };
    timeline: {
        estimated_duration: string;
        key_milestones: Array<{
            name: string;
            duration: string;
            dependencies: string[];
        }>;
        risks: string[];
    };
}

export interface UserImpact {
    segments_affected: Array<{
        segment: string;
        impact_level: 'high' | 'medium' | 'low';
        benefits: string[];
        drawbacks: string[];
    }>;
    adoption_prediction: {
        rate: number;
        factors: {
            driving: string[];
            hindering: string[];
        };
    };
    feedback_analysis: {
        positive_indicators: string[];
        concerns: string[];
        requested_modifications: string[];
    };
}

export interface ResourceRequirements {
    teams_involved: Array<{
        team: string;
        required_time: string;
        key_skills: string[];
    }>;
    infrastructure: {
        new_requirements: string[];
        upgrades_needed: string[];
        estimated_costs: number;
    };
    training: {
        required_skills: string[];
        training_time: string;
        materials_needed: string[];
    };
}

export interface Recommendation {
    decision: 'proceed' | 'hold' | 'modify' | 'reject';
    confidence_level: number;
    key_factors: string[];
    next_steps: string[];
    alternatives: string[];
}

export interface Analysis {
    id: string;
    feature_id: string;
    timestamp: string;
    market_analysis: MarketAnalysis;
    team_perspectives: TeamPerspective[];
    implementation_risks: ImplementationRisk;
    user_impact: UserImpact;
    resource_requirements: ResourceRequirements;
    recommendation: Recommendation;
}