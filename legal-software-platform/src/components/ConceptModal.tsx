'use client'

interface ConceptModalProps {
  concept: {
    name: string
    description: string
    category: string
  }
  onClose: () => void
}

export default function ConceptModal({ concept, onClose }: ConceptModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{concept.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <p className="mb-4">{concept.description}</p>
        <span className="text-sm text-gray-500">{concept.category}</span>
      </div>
    </div>
  )
}

