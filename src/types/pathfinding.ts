export type NodeType = 'empty' | 'start' | 'end' | 'wall' | 'visited' | 'path' | 'current';

export interface GridNode {
  row: number;
  col: number;
  type: NodeType;
  weight: number;
  distance: number;
  heuristic: number;
  previous: GridNode | null;
  isVisited: boolean;
}

export type Algorithm = 'dijkstra' | 'astar' | 'bfs' | 'dfs';

export interface VisualizationStep {
  node: { row: number; col: number };
  type: 'visiting' | 'visited' | 'path';
}

export interface AlgorithmStats {
  nodesVisited: number;
  pathLength: number;
  executionTime: number;
}
