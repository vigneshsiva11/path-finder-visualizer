import { NodeType } from '../types/pathfinding';

interface GridNodeProps {
  type: NodeType;
  weight: number;
  onMouseDown: (isRightClick: boolean) => void;
  onMouseEnter: (isRightClick: boolean) => void;
  onMouseUp: () => void;
}

export function GridNode({ type, weight, onMouseDown, onMouseEnter, onMouseUp }: GridNodeProps) {
  const getNodeColor = () => {
    switch (type) {
      case 'start':
        return 'bg-green-500';
      case 'end':
        return 'bg-red-500';
      case 'wall':
        return 'bg-gray-800';
      case 'visited':
        return 'bg-blue-300';
      case 'path':
        return 'bg-yellow-400';
      case 'current':
        return 'bg-purple-500';
      default:
        return weight > 1 ? 'bg-orange-200' : 'bg-white border-gray-300';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onMouseDown(e.button === 2);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    onMouseEnter(e.buttons === 2);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={`w-6 h-6 border transition-all duration-300 ease-out cursor-pointer relative flex items-center justify-center ${getNodeColor()} ${
        type === 'current' ? 'border-2 border-purple-700 shadow-lg scale-110 z-10' : 'border-gray-300'
      }`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={onMouseUp}
      onContextMenu={handleContextMenu}
    >
      {weight > 1 && type !== 'start' && type !== 'end' && type !== 'wall' && (
        <span className={`text-[10px] pointer-events-none select-none ${type === 'visited' || type === 'path' || type === 'current' ? 'text-gray-800 font-semibold' : ''}`}>
          {weight}
        </span>
      )}
    </div>
  );
}
