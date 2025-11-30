import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Algorithm } from '../types/pathfinding';
import { Play, RotateCcw, Trash2, Weight } from 'lucide-react';

interface ControlsProps {
  mode: 'single' | 'compare';
  onModeChange: (mode: 'single' | 'compare') => void;
  selectedAlgorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  algorithm1?: Algorithm;
  algorithm2?: Algorithm;
  onAlgorithm1Change?: (algorithm: Algorithm) => void;
  onAlgorithm2Change?: (algorithm: Algorithm) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onVisualize: () => void;
  onClearPath: () => void;
  onClearWalls: () => void;
  onResetGrid: () => void;
  onGenerateMaze: (type: string) => void;
  isRunning: boolean;
  drawMode: 'wall' | 'weight';
  onDrawModeChange: (mode: 'wall' | 'weight') => void;
  currentWeight: number;
  onWeightChange: (weight: number) => void;
}

export function Controls({
  mode,
  onModeChange,
  selectedAlgorithm,
  onAlgorithmChange,
  algorithm1,
  algorithm2,
  onAlgorithm1Change,
  onAlgorithm2Change,
  speed,
  onSpeedChange,
  onVisualize,
  onClearPath,
  onClearWalls,
  onResetGrid,
  onGenerateMaze,
  isRunning,
  drawMode,
  onDrawModeChange,
  currentWeight,
  onWeightChange,
}: ControlsProps) {
  const algorithmOptions = [
    { value: 'dijkstra', label: "Dijkstra's Algorithm" },
    { value: 'astar', label: 'A* Search' },
    { value: 'bfs', label: 'Breadth-First Search' },
    { value: 'dfs', label: 'Depth-First Search' },
  ];

  const mazeOptions = [
    { value: 'random', label: 'Random Maze' },
    { value: 'recursive', label: 'Recursive Division' },
    { value: 'vertical', label: 'Vertical Maze' },
    { value: 'horizontal', label: 'Horizontal Maze' },
    { value: 'spiral', label: 'Spiral Maze' },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col gap-4">
        {/* Mode Toggles */}
        <div className="flex flex-wrap items-center gap-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Label className="text-sm text-gray-600">Compare Mode</Label>
            <Switch
              checked={mode === 'compare'}
              onCheckedChange={(checked) => onModeChange(checked ? 'compare' : 'single')}
              disabled={isRunning}
            />
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-sm text-gray-600">Draw Mode</Label>
            <div className="flex gap-2">
              <Button
                variant={drawMode === 'wall' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onDrawModeChange('wall')}
                disabled={isRunning}
              >
                Wall
              </Button>
              <Button
                variant={drawMode === 'weight' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onDrawModeChange('weight')}
                disabled={isRunning}
                className="gap-2"
              >
                <Weight className="w-4 h-4" />
                Weight
              </Button>
            </div>
          </div>
          {drawMode === 'weight' && (
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600">Weight Value:</Label>
              <Input
                type="number"
                min="1"
                max="99"
                value={currentWeight}
                onChange={(e) => onWeightChange(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                className="w-20"
                disabled={isRunning}
              />
            </div>
          )}
        </div>

        {/* Algorithm Selection */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {mode === 'single' ? (
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600">Algorithm</label>
                <Select
                  value={selectedAlgorithm}
                  onValueChange={(value) => onAlgorithmChange(value as Algorithm)}
                  disabled={isRunning}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {algorithmOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600">Algorithm 1</label>
                  <Select
                    value={algorithm1}
                    onValueChange={(value) => onAlgorithm1Change?.(value as Algorithm)}
                    disabled={isRunning}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithmOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600">Algorithm 2</label>
                  <Select
                    value={algorithm2}
                    onValueChange={(value) => onAlgorithm2Change?.(value as Algorithm)}
                    disabled={isRunning}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithmOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="flex flex-col gap-2 min-w-[200px]">
              <label className="text-sm text-gray-600">Speed: {speed}ms</label>
              <Slider
                value={[speed]}
                onValueChange={(values) => onSpeedChange(values[0])}
                min={1}
                max={100}
                step={1}
                disabled={isRunning}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={onVisualize} disabled={isRunning} className="gap-2">
              <Play className="w-4 h-4" />
              Visualize
            </Button>
            <Select onValueChange={onGenerateMaze} disabled={isRunning}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Generate Maze" />
              </SelectTrigger>
              <SelectContent>
                {mazeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={onClearPath} variant="outline" disabled={isRunning}>
              Clear Path
            </Button>
            <Button onClick={onClearWalls} variant="outline" disabled={isRunning} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear Walls
            </Button>
            <Button onClick={onResetGrid} variant="outline" disabled={isRunning} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
