import { GridNode as GridNodeComponent } from './GridNode';
import { GridNode as GridNodeType } from '../types/pathfinding';

interface GridProps {
  grid: GridNodeType[][];
  onMouseDown: (row: number, col: number, isRightClick: boolean) => void;
  onMouseEnter: (row: number, col: number, isRightClick: boolean) => void;
  onMouseUp: () => void;
}

export function Grid({ grid, onMouseDown, onMouseEnter, onMouseUp }: GridProps) {
  return (
    <div className="inline-block border-2 border-gray-400 bg-white select-none">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((node, colIndex) => (
            <GridNodeComponent
              key={`${rowIndex}-${colIndex}`}
              type={node.type}
              weight={node.weight}
              onMouseDown={(isRightClick) => onMouseDown(rowIndex, colIndex, isRightClick)}
              onMouseEnter={(isRightClick) => onMouseEnter(rowIndex, colIndex, isRightClick)}
              onMouseUp={onMouseUp}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
