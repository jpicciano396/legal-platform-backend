interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
}

export default function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className="absolute top-2 right-2"
    >
      {isFavorite ? (
        <span className="text-yellow-500">★</span>
      ) : (
        <span className="text-gray-400 hover:text-yellow-500">☆</span>
      )}
    </button>
  )
}

