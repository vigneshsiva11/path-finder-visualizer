import { useState, useCallback, useRef, useEffect } from 'react';
import { Grid } from './components/Grid';
import { Controls } from './components/Controls';
import { Legend } from './components/Legend';
import { Instructions } from './components/Instructions';
import { Analytics } from './components/Analytics';
import { ComparisonChart } from './components/ComparisonChart';
import { TimelineSlider } from './components/TimelineSlider';
import { GridNode, Algorithm, AlgorithmStats, VisualizationStep } from './types/pathfinding';
import { dijkstra, astar, bfs, dfs } from './utils/pathfinding-algorithms';
import {
  generateRandomMaze,
  generateRecursiveDivision,
  generateVerticalMaze,
  generateHorizontalMaze,
  generateSpiral,
} from './utils/maze-generators';

const ROWS = 25;
const COLS_FULL = 50;
const COLS_HALF = 25;
const START_ROW = 12;
const START_COL_FULL = 10;
const END_COL_FULL = 40;
const START_COL_HALF = 5;
const END_COL_HALF = 20;

function createInitialGrid(cols: number, startCol: number, endCol: number): GridNode[][] {
  const grid: GridNode[][] = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow: GridNode[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        type:
          row === START_ROW && col === startCol
            ? 'start'
            : row === START_ROW && col === endCol
            ? 'end'
            : 'empty',
        weight: 1,
        distance: Infinity,
        heuristic: 0,
        previous: null,
        isVisited: false,
      });
    }
    grid.push(currentRow);
  }
  return grid;
}

export default function App() {
  const [mode, setMode] = useState<'single' | 'compare'>('single');
  const [grid, setGrid] = useState<GridNode[][]>(createInitialGrid(COLS_FULL, START_COL_FULL, END_COL_FULL));
  const [grid1, setGrid1] = useState<GridNode[][]>(createInitialGrid(COLS_HALF, START_COL_HALF, END_COL_HALF));
  const [grid2, setGrid2] = useState<GridNode[][]>(createInitialGrid(COLS_HALF, START_COL_HALF, END_COL_HALF));
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('dijkstra');
  const [algorithm1, setAlgorithm1] = useState<Algorithm>('dijkstra');
  const [algorithm2, setAlgorithm2] = useState<Algorithm>('astar');
  const [speed, setSpeed] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [drawMode, setDrawMode] = useState<'wall' | 'weight'>('wall');
  const [currentWeight, setCurrentWeight] = useState(5);
  const [stats, setStats] = useState<AlgorithmStats | null>(null);
  const [stats1, setStats1] = useState<AlgorithmStats | null>(null);
  const [stats2, setStats2] = useState<AlgorithmStats | null>(null);

  // Timeline states
  const [visualizationHistory, setVisualizationHistory] = useState<VisualizationStep[]>([]);
  const [visualizationHistory1, setVisualizationHistory1] = useState<VisualizationStep[]>([]);
  const [visualizationHistory2, setVisualizationHistory2] = useState<VisualizationStep[]>([]);
  const [currentTimelineStep, setCurrentTimelineStep] = useState(0);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [baseGrid, setBaseGrid] = useState<GridNode[][]>([]);
  const [baseGrid1, setBaseGrid1] = useState<GridNode[][]>([]);
  const [baseGrid2, setBaseGrid2] = useState<GridNode[][]>([]);

  const timeoutsRef = useRef<number[]>([]);
  const timelineTimeoutRef = useRef<number | null>(null);
  const isManualScrubbingRef = useRef<boolean>(false);
  
  // Use refs to store timeline data to avoid triggering re-renders in useEffect
  const baseGridRef = useRef<GridNode[][]>([]);
  const baseGrid1Ref = useRef<GridNode[][]>([]);
  const baseGrid2Ref = useRef<GridNode[][]>([]);
  const visualizationHistoryRef = useRef<VisualizationStep[]>([]);
  const visualizationHistory1Ref = useRef<VisualizationStep[]>([]);
  const visualizationHistory2Ref = useRef<VisualizationStep[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  const clearTimeline = () => {
    if (timelineTimeoutRef.current) {
      clearTimeout(timelineTimeoutRef.current);
      timelineTimeoutRef.current = null;
    }
    setIsTimelinePlaying(false);
  };

  // Apply visualization steps up to a certain index
  const applyStepsToGrid = (
    base: GridNode[][],
    steps: VisualizationStep[],
    upToStep: number
  ): GridNode[][] => {
    const newGrid = base.map((row) => row.map((node) => ({ ...node })));

    for (let i = 0; i < upToStep && i < steps.length; i++) {
      const step = steps[i];
      const { row, col } = step.node;
      const node = newGrid[row][col];

      if (step.type === 'visiting') {
        // Mark as current visiting node only if it's the last step
        if (i === upToStep - 1 && node.type !== 'start' && node.type !== 'end') {
          node.type = 'current';
        }
      } else if (step.type === 'visited') {
        if (node.type !== 'start' && node.type !== 'end') {
          node.type = 'visited';
        }
      } else if (step.type === 'path') {
        if (node.type !== 'start' && node.type !== 'end') {
          node.type = 'path';
        }
      }
    }

    return newGrid;
  };

  // Handle timeline step changes (called when user drags slider)
  const handleTimelineStepChange = (step: number) => {
    // Mark as manual scrubbing to prevent auto-play interference
    isManualScrubbingRef.current = true;
    
    // Stop any auto-play
    if (isTimelinePlaying) {
      clearTimeline();
    }
    
    setCurrentTimelineStep(step);

    if (mode === 'single') {
      if (baseGridRef.current.length > 0) {
        const updatedGrid = applyStepsToGrid(baseGridRef.current, visualizationHistoryRef.current, step);
        setGrid(updatedGrid);
      }
    } else {
      if (baseGrid1Ref.current.length > 0 && baseGrid2Ref.current.length > 0) {
        const updatedGrid1 = applyStepsToGrid(baseGrid1Ref.current, visualizationHistory1Ref.current, step);
        const updatedGrid2 = applyStepsToGrid(baseGrid2Ref.current, visualizationHistory2Ref.current, step);
        setGrid1(updatedGrid1);
        setGrid2(updatedGrid2);
      }
    }
    
    // Reset manual scrubbing flag after a short delay
    setTimeout(() => {
      isManualScrubbingRef.current = false;
    }, 50);
  };

  // Handle timeline play/pause
  const handleTimelinePlayPause = () => {
    if (isTimelinePlaying) {
      clearTimeline();
    } else {
      setIsTimelinePlaying(true);
    }
  };

  // Effect to handle auto-play
  useEffect(() => {
    if (!isTimelinePlaying || isManualScrubbingRef.current) return;

    const maxSteps =
      mode === 'single'
        ? visualizationHistoryRef.current.length
        : Math.max(visualizationHistory1Ref.current.length, visualizationHistory2Ref.current.length);

    if (currentTimelineStep >= maxSteps) {
      clearTimeline();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      // Double-check we're not manually scrubbing
      if (isManualScrubbingRef.current) return;
      
      const nextStep = currentTimelineStep + 1;
      
      // Update timeline step
      setCurrentTimelineStep(nextStep);

      // Update grids using refs
      if (mode === 'single') {
        if (baseGridRef.current.length > 0) {
          const updatedGrid = applyStepsToGrid(baseGridRef.current, visualizationHistoryRef.current, nextStep);
          setGrid(updatedGrid);
        }
      } else {
        if (baseGrid1Ref.current.length > 0 && baseGrid2Ref.current.length > 0) {
          const updatedGrid1 = applyStepsToGrid(baseGrid1Ref.current, visualizationHistory1Ref.current, nextStep);
          const updatedGrid2 = applyStepsToGrid(baseGrid2Ref.current, visualizationHistory2Ref.current, nextStep);
          setGrid1(updatedGrid1);
          setGrid2(updatedGrid2);
        }
      }

      // Check if we've reached the end
      if (nextStep >= maxSteps) {
        clearTimeline();
      }
    }, speed * 2);

    timelineTimeoutRef.current = timeoutId;

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isTimelinePlaying, currentTimelineStep, mode, speed]);

  // Cleanup timeline on unmount
  useEffect(() => {
    return () => {
      clearTimeline();
    };
  }, []);

  // Handle mode changes - reset grids when switching between single and compare mode
  useEffect(() => {
    if (mode === 'compare') {
      // Switching to compare mode - create half-width grids
      const newGrid1 = createInitialGrid(COLS_HALF, START_COL_HALF, END_COL_HALF);
      const newGrid2 = createInitialGrid(COLS_HALF, START_COL_HALF, END_COL_HALF);
      setGrid1(newGrid1);
      setGrid2(newGrid2);
    } else {
      // Switching to single mode - create full-width grid
      const newGrid = createInitialGrid(COLS_FULL, START_COL_FULL, END_COL_FULL);
      setGrid(newGrid);
    }
    setStats(null);
    setStats1(null);
    setStats2(null);
    setVisualizationHistory([]);
    setVisualizationHistory1([]);
    setVisualizationHistory2([]);
    visualizationHistoryRef.current = [];
    visualizationHistory1Ref.current = [];
    visualizationHistory2Ref.current = [];
    baseGridRef.current = [];
    baseGrid1Ref.current = [];
    baseGrid2Ref.current = [];
    setCurrentTimelineStep(0);
    clearTimeline();
  }, [mode]);

  const handleMouseDown = (row: number, col: number, isRightClick: boolean = false) => {
    if (isRunning) return;

    const currentGrid = mode === 'single' ? grid : grid1;
    
    // Bounds check
    if (row < 0 || row >= currentGrid.length || col < 0 || col >= currentGrid[0].length) {
      return;
    }
    
    const node = currentGrid[row][col];
    
    if (!isRightClick) {
      // Left click
      if (node.type === 'start') {
        setIsDraggingStart(true);
      } else if (node.type === 'end') {
        setIsDraggingEnd(true);
      } else {
        setIsMousePressed(true);
        toggleWall(row, col, false);
      }
    } else {
      // Right click - remove
      setIsMousePressed(true);
      toggleWall(row, col, true);
    }
  };

  const handleMouseEnter = (row: number, col: number, isRightClick: boolean = false) => {
    if (isRunning) return;

    const currentGrid = mode === 'single' ? grid : grid1;
    
    // Bounds check
    if (row < 0 || row >= currentGrid.length || col < 0 || col >= currentGrid[0].length) {
      return;
    }

    if (isDraggingStart) {
      moveStartNode(row, col);
    } else if (isDraggingEnd) {
      moveEndNode(row, col);
    } else if (isMousePressed) {
      toggleWall(row, col, isRightClick);
    }
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
  };

  const toggleWall = (row: number, col: number, isRemoving: boolean = false) => {
    const updateGrid = (currentGrid: GridNode[][]) => {
      // Bounds check
      if (row < 0 || row >= currentGrid.length || col < 0 || col >= currentGrid[0].length) {
        return currentGrid;
      }
      
      const newGrid = currentGrid.map((r) => r.map((node) => ({ ...node })));
      const node = newGrid[row][col];
      
      if (node.type === 'start' || node.type === 'end') return newGrid;
      
      if (isRemoving) {
        // Right click - remove walls and weights
        node.type = 'empty';
        node.weight = 1;
      } else {
        // Left click - add walls or weights
        if (drawMode === 'wall') {
          if (node.type === 'empty' || node.type === 'visited' || node.type === 'path') {
            node.type = 'wall';
            node.weight = 1;
          }
        } else {
          // Weight mode
          if (node.type === 'empty' || node.type === 'visited' || node.type === 'path') {
            node.weight = currentWeight;
          }
        }
      }
      
      return newGrid;
    };
    
    if (mode === 'single') {
      setGrid(updateGrid(grid));
    } else {
      const newGrid1 = updateGrid(grid1);
      const newGrid2 = updateGrid(grid2);
      setGrid1(newGrid1);
      setGrid2(newGrid2);
    }
  };

  const moveStartNode = (row: number, col: number) => {
    const updateGridStart = (currentGrid: GridNode[][]) => {
      // Bounds check
      if (row < 0 || row >= currentGrid.length || col < 0 || col >= currentGrid[0].length) {
        return currentGrid;
      }
      
      const newGrid = currentGrid.map((r) => r.map((node) => ({ ...node })));
      const targetNode = newGrid[row][col];
      if (targetNode.type === 'end' || targetNode.type === 'wall') return currentGrid;

      // Clear old start
      for (const r of newGrid) {
        for (const node of r) {
          if (node.type === 'start') {
            node.type = 'empty';
          }
        }
      }

      // Set new start
      targetNode.type = 'start';
      return newGrid;
    };
    
    if (mode === 'single') {
      setGrid(updateGridStart(grid));
    } else {
      setGrid1(updateGridStart(grid1));
      setGrid2(updateGridStart(grid2));
    }
  };

  const moveEndNode = (row: number, col: number) => {
    const updateGridEnd = (currentGrid: GridNode[][]) => {
      // Bounds check
      if (row < 0 || row >= currentGrid.length || col < 0 || col >= currentGrid[0].length) {
        return currentGrid;
      }
      
      const newGrid = currentGrid.map((r) => r.map((node) => ({ ...node })));
      const targetNode = newGrid[row][col];
      if (targetNode.type === 'start' || targetNode.type === 'wall') return currentGrid;

      // Clear old end
      for (const r of newGrid) {
        for (const node of r) {
          if (node.type === 'end') {
            node.type = 'empty';
          }
        }
      }

      // Set new end
      targetNode.type = 'end';
      return newGrid;
    };
    
    if (mode === 'single') {
      setGrid(updateGridEnd(grid));
    } else {
      setGrid1(updateGridEnd(grid1));
      setGrid2(updateGridEnd(grid2));
    }
  };

  const clearPath = () => {
    clearTimeouts();
    clearTimeline();
    
    const clearGridPath = (currentGrid: GridNode[][]) => {
      return currentGrid.map((row) =>
        row.map((node) => ({
          ...node,
          type:
            node.type === 'visited' || node.type === 'path' || node.type === 'current'
              ? 'empty'
              : node.type,
          distance: Infinity,
          heuristic: 0,
          previous: null,
          isVisited: false,
        }))
      );
    };
    
    if (mode === 'single') {
      setGrid(clearGridPath(grid));
    } else {
      setGrid1(clearGridPath(grid1));
      setGrid2(clearGridPath(grid2));
    }
    
    setStats(null);
    setStats1(null);
    setStats2(null);
    setVisualizationHistory([]);
    setVisualizationHistory1([]);
    setVisualizationHistory2([]);
    visualizationHistoryRef.current = [];
    visualizationHistory1Ref.current = [];
    visualizationHistory2Ref.current = [];
    baseGridRef.current = [];
    baseGrid1Ref.current = [];
    baseGrid2Ref.current = [];
    setCurrentTimelineStep(0);
    setIsRunning(false);
  };

  const clearWalls = () => {
    clearTimeouts();
    
    const clearGridWalls = (currentGrid: GridNode[][]) => {
      return currentGrid.map((row) =>
        row.map((node) => ({
          ...node,
          type: node.type === 'wall' ? 'empty' : node.type,
          weight: 1,
          distance: Infinity,
          heuristic: 0,
          previous: null,
          isVisited: false,
        }))
      );
    };
    
    if (mode === 'single') {
      setGrid(clearGridWalls(grid));
    } else {
      setGrid1(clearGridWalls(grid1));
      setGrid2(clearGridWalls(grid2));
    }
    
    setIsRunning(false);
  };

  const resetGrid = () => {
    clearTimeouts();
    clearTimeline();
    if (mode === 'single') {
      const newGrid = createInitialGrid(COLS_FULL, START_COL_FULL, END_COL_FULL);
      setGrid(newGrid);
    } else {
      const newGrid1 = createInitialGrid(COLS_HALF, START_COL_HALF, END_COL_HALF);
      const newGrid2 = createInitialGrid(COLS_HALF, START_COL_HALF, END_COL_HALF);
      setGrid1(newGrid1);
      setGrid2(newGrid2);
    }
    setStats(null);
    setStats1(null);
    setStats2(null);
    setVisualizationHistory([]);
    setVisualizationHistory1([]);
    setVisualizationHistory2([]);
    visualizationHistoryRef.current = [];
    visualizationHistory1Ref.current = [];
    visualizationHistory2Ref.current = [];
    baseGridRef.current = [];
    baseGrid1Ref.current = [];
    baseGrid2Ref.current = [];
    setCurrentTimelineStep(0);
    setIsRunning(false);
  };

  const generateMaze = (type: string) => {
    clearTimeouts();
    
    const generateForGrid = (currentGrid: GridNode[][]) => {
      switch (type) {
        case 'random':
          return generateRandomMaze(currentGrid);
        case 'recursive':
          return generateRecursiveDivision(currentGrid);
        case 'vertical':
          return generateVerticalMaze(currentGrid);
        case 'horizontal':
          return generateHorizontalMaze(currentGrid);
        case 'spiral':
          return generateSpiral(currentGrid);
        default:
          return currentGrid;
      }
    };
    
    if (mode === 'single') {
      setGrid(generateForGrid(grid));
    } else {
      const newGrid1 = generateForGrid(grid1);
      const newGrid2 = newGrid1.map((row) => row.map((node) => ({ ...node })));
      setGrid1(newGrid1);
      setGrid2(newGrid2);
    }
  };

  const runAlgorithm = (
    workingGrid: GridNode[][],
    algorithm: Algorithm,
    startNode: GridNode,
    endNode: GridNode
  ) => {
    const startTime = performance.now();
    let steps;
    
    switch (algorithm) {
      case 'dijkstra':
        steps = dijkstra(workingGrid, startNode, endNode);
        break;
      case 'astar':
        steps = astar(workingGrid, startNode, endNode);
        break;
      case 'bfs':
        steps = bfs(workingGrid, startNode, endNode);
        break;
      case 'dfs':
        steps = dfs(workingGrid, startNode, endNode);
        break;
      default:
        steps = [];
    }
    
    const endTime = performance.now();
    
    // Calculate stats
    const visitedSteps = steps.filter(s => s.type === 'visited');
    const pathSteps = steps.filter(s => s.type === 'path');
    
    const stats: AlgorithmStats = {
      nodesVisited: visitedSteps.length,
      pathLength: pathSteps.length,
      executionTime: endTime - startTime,
    };
    
    return { steps, stats };
  };

  const visualize = useCallback(() => {
    if (isRunning) return;

    clearPath();
    setIsRunning(true);

    if (mode === 'single') {
      // Single mode visualization
      const workingGrid = grid.map((row) =>
        row.map((node) => ({
          ...node,
          distance: Infinity,
          heuristic: 0,
          previous: null,
          isVisited: false,
        }))
      );

      // Store base grid for timeline
      const baseGridCopy = workingGrid.map((row) => row.map((node) => ({ ...node })));
      setBaseGrid(baseGridCopy);
      baseGridRef.current = baseGridCopy;

      let startNode: GridNode | null = null;
      let endNode: GridNode | null = null;

      for (const row of workingGrid) {
        for (const node of row) {
          if (node.type === 'start') startNode = node;
          if (node.type === 'end') endNode = node;
        }
      }

      if (!startNode || !endNode) {
        setIsRunning(false);
        return;
      }

      const { steps, stats: algorithmStats } = runAlgorithm(workingGrid, selectedAlgorithm, startNode, endNode);

      // Store visualization history for timeline
      setVisualizationHistory(steps);
      visualizationHistoryRef.current = steps;
      setCurrentTimelineStep(0);

      steps.forEach((step, index) => {
        const timeout = window.setTimeout(() => {
          setGrid((prevGrid) => {
            const newGrid = prevGrid.map((row) => row.map((node) => ({ ...node })));
            const { row, col } = step.node;
            const node = newGrid[row][col];

            if (step.type === 'visiting') {
              if (node.type !== 'start' && node.type !== 'end') {
                node.type = 'current';
              }
            } else if (step.type === 'visited') {
              if (node.type !== 'start' && node.type !== 'end') {
                node.type = 'visited';
              }
            } else if (step.type === 'path') {
              if (node.type !== 'start' && node.type !== 'end') {
                node.type = 'path';
              }
            }

            return newGrid;
          });

          setCurrentTimelineStep(index + 1);

          if (index === steps.length - 1) {
            setStats(algorithmStats);
            setIsRunning(false);
          }
        }, speed * index);

        timeoutsRef.current.push(timeout);
      });

      if (steps.length === 0) {
        setIsRunning(false);
      }
    } else {
      // Compare mode visualization
      const workingGrid1 = grid1.map((row) =>
        row.map((node) => ({
          ...node,
          distance: Infinity,
          heuristic: 0,
          previous: null,
          isVisited: false,
        }))
      );

      const workingGrid2 = grid2.map((row) =>
        row.map((node) => ({
          ...node,
          distance: Infinity,
          heuristic: 0,
          previous: null,
          isVisited: false,
        }))
      );

      // Store base grids for timeline
      const baseGrid1Copy = workingGrid1.map((row) => row.map((node) => ({ ...node })));
      const baseGrid2Copy = workingGrid2.map((row) => row.map((node) => ({ ...node })));
      setBaseGrid1(baseGrid1Copy);
      setBaseGrid2(baseGrid2Copy);
      baseGrid1Ref.current = baseGrid1Copy;
      baseGrid2Ref.current = baseGrid2Copy;

      let startNode1: GridNode | null = null;
      let endNode1: GridNode | null = null;
      let startNode2: GridNode | null = null;
      let endNode2: GridNode | null = null;

      for (const row of workingGrid1) {
        for (const node of row) {
          if (node.type === 'start') startNode1 = node;
          if (node.type === 'end') endNode1 = node;
        }
      }

      for (const row of workingGrid2) {
        for (const node of row) {
          if (node.type === 'start') startNode2 = node;
          if (node.type === 'end') endNode2 = node;
        }
      }

      if (!startNode1 || !endNode1 || !startNode2 || !endNode2) {
        setIsRunning(false);
        return;
      }

      const { steps: steps1, stats: algorithmStats1 } = runAlgorithm(workingGrid1, algorithm1, startNode1, endNode1);
      const { steps: steps2, stats: algorithmStats2 } = runAlgorithm(workingGrid2, algorithm2, startNode2, endNode2);

      // Store visualization histories for timeline
      setVisualizationHistory1(steps1);
      setVisualizationHistory2(steps2);
      visualizationHistory1Ref.current = steps1;
      visualizationHistory2Ref.current = steps2;
      setCurrentTimelineStep(0);

      const maxSteps = Math.max(steps1.length, steps2.length);

      for (let index = 0; index < maxSteps; index++) {
        const timeout = window.setTimeout(() => {
          if (index < steps1.length) {
            const step = steps1[index];
            setGrid1((prevGrid) => {
              const newGrid = prevGrid.map((row) => row.map((node) => ({ ...node })));
              const { row, col } = step.node;
              const node = newGrid[row][col];

              if (step.type === 'visiting') {
                if (node.type !== 'start' && node.type !== 'end') {
                  node.type = 'current';
                }
              } else if (step.type === 'visited') {
                if (node.type !== 'start' && node.type !== 'end') {
                  node.type = 'visited';
                }
              } else if (step.type === 'path') {
                if (node.type !== 'start' && node.type !== 'end') {
                  node.type = 'path';
                }
              }

              return newGrid;
            });
          }

          if (index < steps2.length) {
            const step = steps2[index];
            setGrid2((prevGrid) => {
              const newGrid = prevGrid.map((row) => row.map((node) => ({ ...node })));
              const { row, col } = step.node;
              const node = newGrid[row][col];

              if (step.type === 'visiting') {
                if (node.type !== 'start' && node.type !== 'end') {
                  node.type = 'current';
                }
              } else if (step.type === 'visited') {
                if (node.type !== 'start' && node.type !== 'end') {
                  node.type = 'visited';
                }
              } else if (step.type === 'path') {
                if (node.type !== 'start' && node.type !== 'end') {
                  node.type = 'path';
                }
              }

              return newGrid;
            });
          }

          setCurrentTimelineStep(index + 1);

          if (index === maxSteps - 1) {
            setStats1(algorithmStats1);
            setStats2(algorithmStats2);
            setIsRunning(false);
          }
        }, speed * index);

        timeoutsRef.current.push(timeout);
      }

      if (maxSteps === 0) {
        setIsRunning(false);
      }
    }
  }, [grid, grid1, grid2, mode, selectedAlgorithm, algorithm1, algorithm2, speed, isRunning]);

  const getAlgorithmName = (algorithm: Algorithm) => {
    switch (algorithm) {
      case 'dijkstra':
        return "Dijkstra's Algorithm";
      case 'astar':
        return 'A* Search';
      case 'bfs':
        return 'Breadth-First Search';
      case 'dfs':
        return 'Depth-First Search';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="mb-6 text-center">Pathfinding Algorithm Visualizer</h1>

      <Instructions />

      <Controls
        mode={mode}
        onModeChange={setMode}
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={setSelectedAlgorithm}
        algorithm1={algorithm1}
        algorithm2={algorithm2}
        onAlgorithm1Change={setAlgorithm1}
        onAlgorithm2Change={setAlgorithm2}
        speed={speed}
        onSpeedChange={setSpeed}
        onVisualize={visualize}
        onClearPath={clearPath}
        onClearWalls={clearWalls}
        onResetGrid={resetGrid}
        onGenerateMaze={generateMaze}
        isRunning={isRunning}
        drawMode={drawMode}
        onDrawModeChange={setDrawMode}
        currentWeight={currentWeight}
        onWeightChange={setCurrentWeight}
      />

      <div className="mb-6 w-full flex justify-center overflow-x-auto">
        {mode === 'single' ? (
          <div className="flex flex-col items-center gap-4">
            <Grid
              grid={grid}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
            />
          </div>
        ) : (
          <div className="flex gap-8 justify-center min-w-max">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <h3>{getAlgorithmName(algorithm1)}</h3>
              </div>
              <Grid
                grid={grid1}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
              />
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <h3>{getAlgorithmName(algorithm2)}</h3>
              </div>
              <Grid
                grid={grid2}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
              />
            </div>
          </div>
        )}
      </div>

      {/* Timeline Slider */}
      <TimelineSlider
        currentStep={currentTimelineStep}
        totalSteps={
          mode === 'single'
            ? visualizationHistory.length
            : Math.max(visualizationHistory1.length, visualizationHistory2.length)
        }
        onStepChange={handleTimelineStepChange}
        isPlaying={isTimelinePlaying}
        onPlayPause={handleTimelinePlayPause}
        disabled={isRunning}
      />

      {/* Analytics Section */}
      <div className="w-full max-w-6xl mb-6">
        <div className="flex gap-4 justify-center flex-wrap">
          {mode === 'single' ? (
            <Analytics stats={stats} algorithmName={getAlgorithmName(selectedAlgorithm)} />
          ) : (
            <>
              <Analytics stats={stats1} algorithmName={getAlgorithmName(algorithm1)} />
              <Analytics stats={stats2} algorithmName={getAlgorithmName(algorithm2)} />
            </>
          )}
        </div>
      </div>

      {/* Comparison Chart (Compare Mode Only) */}
      {mode === 'compare' && (
        <div className="w-full max-w-6xl mb-6">
          <ComparisonChart
            stats1={stats1}
            stats2={stats2}
            algorithm1Name={getAlgorithmName(algorithm1)}
            algorithm2Name={getAlgorithmName(algorithm2)}
          />
        </div>
      )}

      <Legend />
    </div>
  );
}
