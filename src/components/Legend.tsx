export function Legend() {
  const items = [
    { color: 'bg-green-500', label: 'Start Node' },
    { color: 'bg-red-500', label: 'End Node' },
    { color: 'bg-gray-800', label: 'Wall' },
    { color: 'bg-orange-200', label: 'Weighted Node' },
    { color: 'bg-blue-300', label: 'Visited' },
    { color: 'bg-yellow-400', label: 'Shortest Path' },
    { color: 'bg-white border border-gray-300', label: 'Unvisited' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6">
      <h3 className="mb-3">Legend</h3>
      <div className="flex flex-wrap gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-6 h-6 ${item.color}`} />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
