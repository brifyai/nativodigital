import React, { useState } from 'react';
import {
  AccountTree as MindMapIcon,
  Circle as NodeIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material';

interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  level: number;
}

interface MindMapViewerProps {
  centralTopic: string;
  nodes: MindMapNode[];
  title?: string;
}

const MindMapViewer: React.FC<MindMapViewerProps> = ({ centralTopic, nodes, title }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(nodes.map(n => n.id))
  );

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getNodeColor = (level: number) => {
    const colors = [
      'bg-purple-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-pink-500',
    ];
    return colors[level % colors.length];
  };

  const renderNode = (node: MindMapNode, index: number) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const indent = node.level * 24;

    return (
      <div key={node.id} className="animate-in fade-in slide-in-from-left-2">
        <div
          className="flex items-center gap-2 p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors cursor-pointer"
          style={{ marginLeft: `${indent}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            <button className="flex-shrink-0">
              {isExpanded ? (
                <ExpandIcon className="text-secondary" sx={{ fontSize: 18 }} />
              ) : (
                <CollapseIcon className="text-secondary" sx={{ fontSize: 18 }} />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-[18px]" />}
          
          <div className={`w-3 h-3 rounded-full ${getNodeColor(node.level)} flex-shrink-0`} />
          
          <span className="text-sm font-medium text-primary">{node.label}</span>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map((child, i) => renderNode(child, i))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-xl">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-primary flex items-center gap-2 mb-3">
          <MindMapIcon className="text-purple-500" sx={{ fontSize: 20 }} />
          <span>{title || 'Dibuja las Ideas'}</span>
        </h3>
      </div>

      {/* Central Topic */}
      <div className="mb-4 flex justify-center">
        <div className="relative">
          <div className="px-6 py-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-xl">
            <p className="font-bold text-center text-lg">{centralTopic}</p>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-purple-300 dark:bg-purple-700" />
        </div>
      </div>

      {/* Nodes Tree */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-700 p-4">
        <div className="space-y-1">
          {nodes.map((node, index) => renderNode(node, index))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-300 dark:border-purple-700">
        <p className="text-xs text-purple-800 dark:text-purple-200">
          <strong>Dibuja las Ideas:</strong> Organiza ideas de forma visual y jerárquica. Haz clic en los nodos para expandir/colapsar ramas.
        </p>
      </div>
    </div>
  );
};

export default MindMapViewer;
