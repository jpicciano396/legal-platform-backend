interface SortControlsProps {
  onSort: (sortBy: string) => void
  currentSort: string
}

export default function SortControls({ onSort, currentSort }: SortControlsProps) {
  return (
    <div className="flex gap-4 mb-4">
      <select 
        value={currentSort}
        onChange={(e) => onSort(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="name">Name</option>
        <option value="category">Category</option>
        <option value="relevance">Relevance</option>
      </select>
    </div>
  )
}

