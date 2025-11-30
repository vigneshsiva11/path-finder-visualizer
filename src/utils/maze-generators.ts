import { GridNode } from '../types/pathfinding';

export function generateRandomMaze(grid: GridNode[][], density: number = 0.3): GridNode[][] {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      type: node.type === 'start' || node.type === 'end' ? node.type : 'empty',
      weight: 1,
    }))
  );

  for (const row of newGrid) {
    for (const node of row) {
      if (node.type === 'empty' && Math.random() < density) {
        node.type = 'wall';
      }
    }
  }

  return newGrid;
}

export function generateRecursiveDivision(grid: GridNode[][]): GridNode[][] {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      type: node.type === 'start' || node.type === 'end' ? node.type : 'empty',
      weight: 1,
    }))
  );

  const rows = newGrid.length;
  const cols = newGrid[0].length;

  function divide(
    minRow: number,
    maxRow: number,
    minCol: number,
    maxCol: number,
    orientation: 'horizontal' | 'vertical'
  ) {
    if (maxRow - minRow < 2 || maxCol - minCol < 2) return;

    const horizontal = orientation === 'horizontal';

    // Where will the wall be?
    const wallRow = horizontal
      ? minRow + 1 + Math.floor(Math.random() * (maxRow - minRow - 1))
      : minRow;
    const wallCol = horizontal
      ? minCol
      : minCol + 1 + Math.floor(Math.random() * (maxCol - minCol - 1));

    // Where will the passage be?
    const passageRow = horizontal
      ? wallRow
      : minRow + Math.floor(Math.random() * (maxRow - minRow + 1));
    const passageCol = horizontal
      ? minCol + Math.floor(Math.random() * (maxCol - minCol + 1))
      : wallCol;

    // Draw the wall
    if (horizontal) {
      for (let col = minCol; col <= maxCol; col++) {
        if (col !== passageCol) {
          const node = newGrid[wallRow][col];
          if (node.type !== 'start' && node.type !== 'end') {
            node.type = 'wall';
          }
        }
      }
    } else {
      for (let row = minRow; row <= maxRow; row++) {
        if (row !== passageRow) {
          const node = newGrid[row][wallCol];
          if (node.type !== 'start' && node.type !== 'end') {
            node.type = 'wall';
          }
        }
      }
    }

    // Recursively divide
    if (horizontal) {
      divide(minRow, wallRow - 1, minCol, maxCol, maxCol - minCol > maxRow - minRow ? 'vertical' : 'horizontal');
      divide(wallRow + 1, maxRow, minCol, maxCol, maxCol - minCol > maxRow - minRow ? 'vertical' : 'horizontal');
    } else {
      divide(minRow, maxRow, minCol, wallCol - 1, maxCol - minCol > maxRow - minRow ? 'vertical' : 'horizontal');
      divide(minRow, maxRow, wallCol + 1, maxCol, maxCol - minCol > maxRow - minRow ? 'vertical' : 'horizontal');
    }
  }

  const orientation = cols > rows ? 'vertical' : 'horizontal';
  divide(0, rows - 1, 0, cols - 1, orientation);

  return newGrid;
}

export function generateVerticalMaze(grid: GridNode[][]): GridNode[][] {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      type: node.type === 'start' || node.type === 'end' ? node.type : 'empty',
      weight: 1,
    }))
  );

  const rows = newGrid.length;
  const cols = newGrid[0].length;

  for (let col = 2; col < cols - 2; col += 4) {
    const gapRow = Math.floor(Math.random() * rows);
    for (let row = 0; row < rows; row++) {
      if (row !== gapRow) {
        const node = newGrid[row][col];
        if (node.type !== 'start' && node.type !== 'end') {
          node.type = 'wall';
        }
      }
    }
  }

  return newGrid;
}

export function generateHorizontalMaze(grid: GridNode[][]): GridNode[][] {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      type: node.type === 'start' || node.type === 'end' ? node.type : 'empty',
      weight: 1,
    }))
  );

  const rows = newGrid.length;
  const cols = newGrid[0].length;

  for (let row = 2; row < rows - 2; row += 4) {
    const gapCol = Math.floor(Math.random() * cols);
    for (let col = 0; col < cols; col++) {
      if (col !== gapCol) {
        const node = newGrid[row][col];
        if (node.type !== 'start' && node.type !== 'end') {
          node.type = 'wall';
        }
      }
    }
  }

  return newGrid;
}

export function generateSpiral(grid: GridNode[][]): GridNode[][] {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      type: node.type === 'start' || node.type === 'end' ? node.type : 'empty',
      weight: 1,
    }))
  );

  const rows = newGrid.length;
  const cols = newGrid[0].length;
  const centerRow = Math.floor(rows / 2);
  const centerCol = Math.floor(cols / 2);

  let row = centerRow;
  let col = centerCol;
  let direction = 0; // 0: right, 1: down, 2: left, 3: up
  let steps = 1;
  let stepsTaken = 0;
  let turnsAtCurrentLength = 0;

  const directions = [
    [0, 1],  // right
    [1, 0],  // down
    [0, -1], // left
    [-1, 0], // up
  ];

  while (row >= 0 && row < rows && col >= 0 && col < cols) {
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      const node = newGrid[row][col];
      if (node.type !== 'start' && node.type !== 'end') {
        node.type = 'wall';
      }
    }

    stepsTaken++;
    row += directions[direction][0];
    col += directions[direction][1];

    if (stepsTaken === steps) {
      stepsTaken = 0;
      direction = (direction + 1) % 4;
      turnsAtCurrentLength++;
      if (turnsAtCurrentLength === 2) {
        steps++;
        turnsAtCurrentLength = 0;
      }
    }
  }

  return newGrid;
}
