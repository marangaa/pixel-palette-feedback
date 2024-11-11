
export interface DetailedAnalysisLayoutProps {
    analysis: DetailedAnalysis;
    onUpdateAnalysis?: (section: string, updates: any) => Promise<void>;
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
    role: string;
    concerns: string[];
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

export interface DetailedAnalysis {
    id: string;
    feature_id: string;
    timestamp: string;
    market_analysis: MarketAnalysis;
    team_perspectives: TeamPerspective[];
    implementation_risks: ImplementationRisk;
    user_impact: UserImpact;
    resource_requirements: ResourceRequirements;
    recommendation: {
        decision: 'proceed' | 'hold' | 'modify' | 'reject';
        confidence_level: number;
        key_factors: string[];
        next_steps: string[];
        alternatives: string[];
    };
}