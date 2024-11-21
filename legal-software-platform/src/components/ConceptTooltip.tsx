interface ConceptTooltipProps {
  concept: {
    name: string
    description: string
    category: string
  }
  x: number
  y: number
}

export default function ConceptTooltip({ concept, x, y }: ConceptTooltipProps) {
  return (
    <div 
      className="absolute bg-white p-3 rounded shadow-lg border max-w-xs"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -100%)',
        zIndex: 50
      }}
    >
      <h3 className="font-bold">{concept.name}</h3>
      <p className="text-sm text-gray-600">{concept.description}</p>
      <span className="text-xs text-gray-500">{concept.category}</span>
    </div>
  )
}

