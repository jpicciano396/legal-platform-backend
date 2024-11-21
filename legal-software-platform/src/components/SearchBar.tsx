'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <input
      type="text"
      placeholder="Search legal concepts..."
      value={query}
      onChange={handleSearch}
      className="w-full p-2 border rounded mb-4"
    />
  )
}

