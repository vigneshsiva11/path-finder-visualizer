import { AlgorithmStats } from '../types/pathfinding';
import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComparisonChartProps {
  stats1: AlgorithmStats | null;
  stats2: AlgorithmStats | null;
  algorithm1Name: string;
  algorithm2Name: string;
}

export function ComparisonChart({ stats1, stats2, algorithm1Name, algorithm2Name }: ComparisonChartProps) {
  if (!stats1 || !stats2) {
    return (
      <Card className="p-6 w-full">
        <h3 className="mb-4">Algorithm Comparison</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          Run visualization to see comparison
        </div>
      </Card>
    );
  }

  const data = [
    {
      metric: 'Nodes Visited',
      [algorithm1Name]: stats1.nodesVisited,
      [algorithm2Name]: stats2.nodesVisited,
    },
    {
      metric: 'Path Length',
      [algorithm1Name]: stats1.pathLength,
      [algorithm2Name]: stats2.pathLength,
    },
    {
      metric: 'Time (ms)',
      [algorithm1Name]: parseFloat(stats1.executionTime.toFixed(2)),
      [algorithm2Name]: parseFloat(stats2.executionTime.toFixed(2)),
    },
  ];

  return (
    <Card className="p-6 w-full">
      <h3 className="mb-4">Algorithm Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={algorithm1Name} fill="#3b82f6" />
          <Bar dataKey={algorithm2Name} fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
