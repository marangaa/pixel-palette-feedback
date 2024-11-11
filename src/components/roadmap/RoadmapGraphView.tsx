import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Edge,
    Node,
    Position,
    MarkerType,
    useNodesState,
    useEdgesState,
    Handle
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
    GitBranch,
    GitMerge,
    AlertCircle,
    CheckCircle,
    Clock,
    AlertTriangle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { RoadmapTimeline, RoadmapItem, RoadmapBranch } from '@/types/roadmap';

interface NodeData {
    item: RoadmapItem | RoadmapBranch;
    type: 'main' | 'branch' | 'milestone';
    showAnalysis?: boolean;
}

// Custom Node Component
const RoadmapNode: React.FC<{ data: NodeData }> = ({ data }) => {
    const getStatusColor = (status: string) => {
        const colors = {
            'planned': 'border-blue-200 bg-blue-50',
            'in-progress': 'border-yellow-200 bg-yellow-50',
            'blocked': 'border-red-200 bg-red-50',
            'completed': 'border-green-200 bg-green-50',
            'cancelled': 'border-gray-200 bg-gray-50'
        };
        return colors[status as keyof typeof colors] || colors.planned;
    };

    const isItem = 'status' in data.item;
    const item = data.item as RoadmapItem;

    return (
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(isItem ? item.status : 'planned')} 
            min-w-[200px] max-w-[300px]`}
        >
            <Handle type="target" position={Position.Left} />

            <div className="space-y-2">
                <div className="flex items-start justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900">{data.item.title}</h4>
                        <p className="text-xs text-gray-500">{data.item.description}</p>
                    </div>
                    {data.type === 'branch' && (
                        <GitBranch className="w-4 h-4 text-purple-500" />
                    )}
                </div>

                {isItem && (
                    <>
                        <div className="flex flex-wrap gap-1">
                            <Badge variant="outline">{item.status}</Badge>
                            <Badge variant="outline">{item.priority}</Badge>
                        </div>

                        {data.showAnalysis && item.analysis && (
                            <div className="space-y-1">
                                <div className="flex items-center text-xs">
                                    <span className="w-20 text-gray-500">Feasibility</span>
                                    <Progress value={item.analysis.feasibility} className="flex-1" />
                                </div>
                                <div className="flex items-center text-xs">
                                    <span className="w-20 text-gray-500">Impact</span>
                                    <Progress value={item.analysis.impact} className="flex-1" />
                                </div>
                            </div>
                        )}

                        {item.analysis && (
                            <div className="flex items-center justify-end gap-2">
                                {item.analysis.risk > 70 && (
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                )}
                                {item.analysis.feasibility < 30 && (
                                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                                )}
                                {item.status === 'completed' && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Handle type="source" position={Position.Right} />
        </div>
    );
};

interface RoadmapGraphViewProps {
    data: RoadmapTimeline;
    showAnalysis?: boolean;
}

const nodeTypes = {
    roadmapNode: RoadmapNode
};

export const RoadmapGraphView: React.FC<RoadmapGraphViewProps> = ({
                                                                      data,
                                                                      showAnalysis = true
                                                                  }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Convert roadmap data to nodes and edges
    const processRoadmapData = useCallback(() => {
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];
        let yOffset = 0;
        let xOffset = 0;

        // Process each quarter
        Object.entries(data.quarters).forEach(([quarter, quarterData], quarterIndex) => {
            // Add main branch items
            quarterData.mainBranch.forEach((item, itemIndex) => {
                const nodeId = `main-${quarter}-${item.id}`;
                newNodes.push({
                    id: nodeId,
                    type: 'roadmapNode',
                    position: { x: xOffset, y: yOffset + itemIndex * 150 },
                    data: {
                        item,
                        type: 'main',
                        showAnalysis
                    }
                });

                // Add dependencies
                item.dependencies.forEach(depId => {
                    newEdges.push({
                        id: `${depId}-${nodeId}`,
                        source: `main-${quarter}-${depId}`,
                        target: nodeId,
                        markerEnd: { type: MarkerType.ArrowClosed },
                        style: { strokeWidth: 2 }
                    });
                });
            });

            // Process alternative branches
            quarterData.alternativeBranches.forEach((branch, branchIndex) => {
                const branchXOffset = xOffset + 400;
                const branchYOffset = yOffset + branchIndex * 300;

                // Add branch node
                const branchNodeId = `branch-${branch.id}`;
                newNodes.push({
                    id: branchNodeId,
                    type: 'roadmapNode',
                    position: { x: branchXOffset, y: branchYOffset },
                    data: {
                        item: branch,
                        type: 'branch',
                        showAnalysis
                    }
                });

                // Add branch items
                branch.items.forEach((item, itemIndex) => {
                    const nodeId = `branch-item-${item.id}`;
                    newNodes.push({
                        id: nodeId,
                        type: 'roadmapNode',
                        position: {
                            x: branchXOffset + 300,
                            y: branchYOffset + itemIndex * 150
                        },
                        data: {
                            item,
                            type: 'main',
                            showAnalysis
                        }
                    });

                    // Connect branch items
                    newEdges.push({
                        id: `${branchNodeId}-${nodeId}`,
                        source: branchNodeId,
                        target: nodeId,
                        style: { strokeWidth: 2 },
                        markerEnd: { type: MarkerType.ArrowClosed }
                    });
                });
            });

            xOffset += 800; // Move to next quarter
        });

        setNodes(newNodes);
        setEdges(newEdges);
    }, [data, showAnalysis, setNodes, setEdges]);

    useEffect(() => {
        processRoadmapData();
    }, [processRoadmapData]);

    return (
        <div className="h-[800px] w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default RoadmapGraphView;