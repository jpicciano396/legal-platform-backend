interface FavoritesFilterProps {
  showFavorites: boolean
  onToggle: () => void
}

export default function FavoritesFilter({ showFavorites, onToggle }: FavoritesFilterProps) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded ${
        showFavorites 
          ? 'bg-yellow-500 text-white' 
          : 'bg-gray-200 hover:bg-gray-300'
      }`}
    >
      {showFavorites ? 'Show All' : 'Show Favorites'}
    </button>
  )
}

