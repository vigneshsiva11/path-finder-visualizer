import { GridNode, VisualizationStep } from '../types/pathfinding';

// Helper function to get neighbors
function getNeighbors(node: GridNode, grid: GridNode[][]): GridNode[] {
  const neighbors: GridNode[] = [];
  const { row, col } = node;
  const rows = grid.length;
  const cols = grid[0].length;

  // Up, Right, Down, Left
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (
      newRow >= 0 &&
      newRow < rows &&
      newCol >= 0 &&
      newCol < cols &&
      grid[newRow][newCol].type !== 'wall'
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }

  return neighbors;
}

// Calculate Manhattan distance for A*
function heuristic(nodeA: GridNode, nodeB: GridNode): number {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

// Reconstruct path from start to end
function reconstructPath(endNode: GridNode): GridNode[] {
  const path: GridNode[] = [];
  let current: GridNode | null = endNode;

  while (current !== null) {
    path.unshift(current);
    current = current.previous;
  }

  return path;
}

export function dijkstra(
  grid: GridNode[][],
  startNode: GridNode,
  endNode: GridNode
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const unvisited: GridNode[] = [];

  // Initialize
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity;
      node.isVisited = false;
      node.previous = null;
      unvisited.push(node);
    }
  }

  startNode.distance = 0;

  while (unvisited.length > 0) {
    // Sort by distance
    unvisited.sort((a, b) => a.distance - b.distance);
    const current = unvisited.shift()!;

    // Skip walls
    if (current.type === 'wall') continue;

    // If we reach infinity, we're trapped
    if (current.distance === Infinity) break;

    current.isVisited = true;

    if (current !== startNode && current !== endNode) {
      // First mark as visiting (current node being processed)
      steps.push({
        node: { row: current.row, col: current.col },
        type: 'visiting',
      });
      // Then mark as visited
      steps.push({
        node: { row: current.row, col: current.col },
        type: 'visited',
      });
    }

    // Found the end
    if (current === endNode) {
      const path = reconstructPath(endNode);
      for (const node of path) {
        if (node !== startNode && node !== endNode) {
          steps.push({
            node: { row: node.row, col: node.col },
            type: 'path',
          });
        }
      }
      return steps;
    }

    // Update neighbors
    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        const newDistance = current.distance + neighbor.weight;
        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previous = current;
        }
      }
    }
  }

  return steps;
}

export function astar(
  grid: GridNode[][],
  startNode: GridNode,
  endNode: GridNode
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const openSet: GridNode[] = [startNode];
  const closedSet = new Set<GridNode>();

  // Initialize
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity;
      node.heuristic = heuristic(node, endNode);
      node.isVisited = false;
      node.previous = null;
    }
  }

  startNode.distance = 0;

  while (openSet.length > 0) {
    // Sort by f = g + h
    openSet.sort((a, b) => a.distance + a.heuristic - (b.distance + b.heuristic));
    const current = openSet.shift()!;

    if (current === endNode) {
      const path = reconstructPath(endNode);
      for (const node of path) {
        if (node !== startNode && node !== endNode) {
          steps.push({
            node: { row: node.row, col: node.col },
            type: 'path',
          });
        }
      }
      return steps;
    }

    closedSet.add(current);
    current.isVisited = true;

    if (current !== startNode && current !== endNode) {
      // First mark as visiting (current node being processed)
      steps.push({
        node: { row: current.row, col: current.col },
        type: 'visiting',
      });
      // Then mark as visited
      steps.push({
        node: { row: current.row, col: current.col },
        type: 'visited',
      });
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor)) continue;

      const tentativeG = current.distance + neighbor.weight;

      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeG >= neighbor.distance) {
        continue;
      }

      neighbor.previous = current;
      neighbor.distance = tentativeG;
    }
  }

  return steps;
}

export function bfs(
  grid: GridNode[][],
  startNode: GridNode,
  endNode: GridNode
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const queue: GridNode[] = [startNode];
  const visited = new Set<GridNode>();

  // Initialize
  for (const row of grid) {
    for (const node of row) {
      node.previous = null;
      node.isVisited = false;
    }
  }

  visited.add(startNode);
  startNode.isVisited = true;

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current !== startNode && current !== endNode) {
      // First mark as visiting (current node being processed)
      steps.push({
        node: { row: current.row, col: current.col },
        type: 'visiting',
      });
      // Then mark as visited
      steps.push({
        node: { row: current.row, col: current.col },
        type: 'visited',
      });
    }

    if (current === endNode) {
      const path = reconstructPath(endNode);
      for (const node of path) {
        if (node !== startNode && node !== endNode) {
          steps.push({
            node: { row: node.row, col: node.col },
            type: 'path',
          });
        }
      }
      return steps;
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        neighbor.isVisited = true;
        neighbor.previous = current;
        queue.push(neighbor);
      }
    }
  }

  return steps;
}

export function dfs(
  grid: GridNode[][],
  startNode: GridNode,
  endNode: GridNode
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const stack: GridNode[] = [startNode];
  const visited = new Set<GridNode>();

  // Initialize
  for (const row of grid) {
    for (const node of row) {
      node.previous = null;
      node.isVisited = false;
    }
  }

  visited.add(startNode);
  startNode.isVisited = true;

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (current !== startNode && current !== endNode) {
      // First mark as visiting (current node being processed)
      steps.push({
        node: { row: current.row, col: current.col },
        type: 'visiting',
      });
      // Then mark as visited
      steps.push({
        node: { row: current.row, col: current.col },
        type: 'visited',
      });
    }

    if (current === endNode) {
      const path = reconstructPath(endNode);
      for (const node of path) {
        if (node !== startNode && node !== endNode) {
          steps.push({
            node: { row: node.row, col: node.col },
            type: 'path',
          });
        }
      }
      return steps;
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        neighbor.isVisited = true;
        neighbor.previous = current;
        stack.push(neighbor);
      }
    }
  }

  return steps;
}
