import { AlgorithmStats } from '../types/pathfinding';
import { Card } from './ui/card';

interface AnalyticsProps {
  stats: AlgorithmStats | null;
  algorithmName?: string;
}

export function Analytics({ stats, algorithmName }: AnalyticsProps) {
  if (!stats) {
    return (
      <Card className="p-4 flex-1 min-w-[250px]">
        <h3 className="mb-3">{algorithmName || 'Algorithm'}</h3>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Nodes Visited:</span>
            <span>-</span>
          </div>
          <div className="flex justify-between">
            <span>Path Length:</span>
            <span>-</span>
          </div>
          <div className="flex justify-between">
            <span>Execution Time:</span>
            <span>-</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 flex-1 min-w-[250px]">
      <h3 className="mb-3">{algorithmName || 'Algorithm'}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Nodes Visited:</span>
          <span className="font-medium">{stats.nodesVisited}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Path Length:</span>
          <span className="font-medium">{stats.pathLength}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Execution Time:</span>
          <span className="font-medium">{stats.executionTime.toFixed(2)}ms</span>
        </div>
      </div>
    </Card>
  );
}
