export function Instructions() {
  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-6xl w-full">
      <h3 className="mb-2">How to Use</h3>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
        <li><strong>Left click</strong> and drag to add walls or weights (based on draw mode)</li>
        <li><strong>Right click</strong> and drag to remove walls or weights</li>
        <li>Drag the green (start) and red (end) nodes to reposition them</li>
        <li>Select an algorithm and click "Visualize" to see it in action</li>
        <li>Use the <strong>timeline slider</strong> below the grid to rewind and replay the visualization</li>
        <li>Use "Generate Maze" to create preset patterns</li>
        <li>Toggle "Compare Mode" to run two algorithms side by side</li>
      </ul>
    </div>
  );
}
