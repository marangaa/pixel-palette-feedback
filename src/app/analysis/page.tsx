'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import DetailedAnalysisLayout from '@/components/analysis/DetailedAnalysisLayout';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

export default function AnalysisPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemId = searchParams?.get('itemId');

    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (itemId) {
            fetchAnalysis();
        } else {
            setIsLoading(false);
        }
    }, [itemId]);

    const fetchAnalysis = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/analysis?itemId=${itemId}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            setAnalysis(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load analysis');
        } finally {
            setIsLoading(false);
        }
    };

    const generateNewAnalysis = async () => {
        if (!itemId) return;

        try {
            setIsGenerating(true);
            const response = await fetch('/api/analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            setAnalysis(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate analysis');
        } finally {
            setIsGenerating(false);
        }
    };

    if (!itemId) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto text-center space-y-4">
                    <Alert>
                        <AlertDescription>
                            Please select an item from the roadmap to view its analysis.
                        </AlertDescription>
                    </Alert>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/roadmap')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Roadmap
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center space-x-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading analysis...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto space-y-4">
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/roadmap')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Roadmap
                        </Button>
                        <Button onClick={() => fetchAnalysis()}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/roadmap')}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Roadmap
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Detailed Analysis
                                </h1>
                                {analysis && (
                                    <p className="text-sm text-gray-500">
                                        Last updated: {new Date(analysis.timestamp).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            onClick={generateNewAnalysis}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Generate New Analysis
                                </>
                            )}
                        </Button>
                    </div>

                    {analysis ? (
                        <DetailedAnalysisLayout
                            analysis={analysis}
                            onUpdateAnalysis={async (section, updates) => {
                                try {
                                    const response = await fetch('/api/analysis', {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            analysisId: analysis.id,
                                            updates: { [section]: updates }
                                        }),
                                    });

                                    const result = await response.json();
                                    if (!result.success) throw new Error(result.error);
                                    setAnalysis(result.data);
                                } catch (err) {
                                    setError(err instanceof Error ? err.message : 'Failed to update analysis');
                                }
                            }}
                        />
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-gray-600 mb-4">
                                No analysis available for this item yet.
                            </p>
                            <Button onClick={generateNewAnalysis} disabled={isGenerating}>
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating Analysis
                                    </>
                                ) : (
                                    'Generate Analysis'
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}