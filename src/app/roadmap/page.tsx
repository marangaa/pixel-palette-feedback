'use client';

import { useEffect, useState } from 'react';
import { RoadmapLayout } from '@/components/roadmap/RoadmapLayout';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, RefreshCw } from 'lucide-react';
import type { RoadmapTimeline } from '@/types/roadmap';

// Helper function to organize items by quarter
const organizeByQuarter = (roadmap: any) => {
    if (!roadmap) return null;

    const quarterMap: { [key: string]: any } = {
        'Q1 2024': {
            mainBranch: [],
            alternativeBranches: []
        },
        'Q2 2024': {
            mainBranch: [],
            alternativeBranches: []
        },
        'Q3 2024': {
            mainBranch: [],
            alternativeBranches: []
        },
        'Q4 2024': {
            mainBranch: [],
            alternativeBranches: []
        }
    };

    // First, process main branch items
    roadmap.items?.forEach((item: any) => {
        let quarter;
        switch (item.timeframe) {
            case 'current':
                quarter = 'Q1 2024';
                break;
            case 'next':
                quarter = 'Q2 2024';
                break;
            case 'future':
                quarter = 'Q3 2024';
                break;
            default:
                quarter = 'Q4 2024';
        }

        if (!item.branchId) {
            quarterMap[quarter].mainBranch.push(item);
        }
    });

    // Then process branches and their items
    roadmap.branches?.forEach((branch: any) => {
        if (branch.type === 'main') {
            branch.items.forEach((item: any) => {
                let quarter;
                switch (item.timeframe) {
                    case 'current':
                        quarter = 'Q1 2024';
                        break;
                    case 'next':
                        quarter = 'Q2 2024';
                        break;
                    case 'future':
                        quarter = 'Q3 2024';
                        break;
                    default:
                        quarter = 'Q4 2024';
                }
                quarterMap[quarter].mainBranch.push(item);
            });
        } else {
            // For alternative branches
            const targetQuarter = branch.items[0]?.timeframe === 'current' ? 'Q1 2024' :
                branch.items[0]?.timeframe === 'next' ? 'Q2 2024' :
                    branch.items[0]?.timeframe === 'future' ? 'Q3 2024' : 'Q4 2024';

            quarterMap[targetQuarter].alternativeBranches.push(branch);
        }
    });

    return quarterMap;
};

export default function RoadmapPage() {
    const [rawData, setRawData] = useState<any>(null);
    const [data, setData] = useState<RoadmapTimeline | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRoadmapData();
    }, []);

    const fetchRoadmapData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/roadmap');
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            setRawData(result.data);

            if (result.data) {
                const transformedData: RoadmapTimeline = {
                    quarters: organizeByQuarter(result.data),
                    resources: result.data.resources || [],
                    constraints: result.data.constraints || {
                        maxParallelItems: 5,
                        resourceCap: 100,
                        priorityThresholds: {
                            critical: 90,
                            high: 70,
                            medium: 40,
                            low: 0
                        }
                    }
                };

                setData(transformedData);
            }
        } catch (err) {
            console.error('Error in fetchRoadmapData:', err);
            setError(err instanceof Error ? err.message : 'Failed to load roadmap');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateItem = async (itemId: string, updates: any) => {
        try {
            const response = await fetch(`/api/roadmap/items`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: itemId, ...updates }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            await fetchRoadmapData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update item');
        }
    };

    const handleCreateBranch = async (itemId: string, branchData: any) => {
        try {
            const response = await fetch(`/api/roadmap/branches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parentItemId: itemId,
                    roadmapId: rawData?.id,
                    ...branchData,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            await fetchRoadmapData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create branch');
        }
    };

    const handleUpdateResource = async (resourceId: string, updates: any) => {
        try {
            const response = await fetch(`/api/roadmap/resources`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: resourceId, ...updates }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            await fetchRoadmapData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update resource');
        }
    };

    const handleGenerateNewRoadmap = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/roadmap/create', {
                method: 'POST'
            });
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error);
            }
            await fetchRoadmapData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create roadmap');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Product Roadmap</h1>
                        <p className="text-gray-600">Strategic planning based on feedback and goals</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleGenerateNewRoadmap}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Generate New Roadmap
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={() => fetchRoadmapData()}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                </Button>
            </div>
        );
    }

    if (!data || !data.quarters) {
        return (
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Product Roadmap</h1>
                        <p className="text-gray-600">Strategic planning based on feedback and goals</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleGenerateNewRoadmap}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Generate New Roadmap
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                <Alert>
                    <AlertDescription>No roadmap data available.</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Product Roadmap</h1>
                            <p className="text-gray-600">Strategic planning based on feedback and goals</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={handleGenerateNewRoadmap}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Generate New Roadmap
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <RoadmapLayout
                        data={data}
                        onUpdateItem={handleUpdateItem}
                        onCreateBranch={handleCreateBranch}
                        onUpdateResource={handleUpdateResource}
                    />
                </div>
            </div>
        </div>
    );
}