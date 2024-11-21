'use client'

import { useState } from 'react'

interface FilterBarProps {
  categories: string[]
  onFilter: (category: string) => void
}

export default function FilterBar({ categories, onFilter }: FilterBarProps) {
  const [activeCategory, setActiveCategory] = useState('All')

  const handleFilter = (category: string) => {
    setActiveCategory(category)
    onFilter(category)
  }

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => handleFilter('All')}
        className={`px-4 py-2 rounded ${
          activeCategory === 'All' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => handleFilter(category)}
          className={`px-4 py-2 rounded ${
            activeCategory === category 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

