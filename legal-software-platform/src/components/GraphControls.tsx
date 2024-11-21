interface GraphControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onFilterRelations: (type: string) => void
  relationTypes: string[]
}

export default function GraphControls({ 
  onZoomIn, 
  onZoomOut, 
  onReset, 
  onFilterRelations,
  relationTypes 
}: GraphControlsProps) {
  return (
    <div className="flex gap-2 mb-4">
      <button 
        onClick={onZoomIn}
        className="p-2 rounded bg-gray-200 hover:bg-gray-300"
      >
        +
      </button>
      <button 
        onClick={onZoomOut}
        className="p-2 rounded bg-gray-200 hover:bg-gray-300"
      >
        -
      </button>
      <button 
        onClick={onReset}
        className="p-2 rounded bg-gray-200 hover:bg-gray-300"
      >
        Reset
      </button>
      <select 
        onChange={(e) => onFilterRelations(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="all">All Relations</option>
        {relationTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  )
}

