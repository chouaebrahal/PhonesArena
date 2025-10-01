'use client'

interface PhoneFilters {
  search: string
  brand: string
  minPrice: number
  maxPrice: number
}

interface PhoneFiltersProps {
  filters: PhoneFilters
  onFilterChange: (filters: PhoneFilters) => void
}

export default function PhoneFilters({ filters, onFilterChange }: PhoneFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          placeholder="Search phones..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <select
          value={filters.brand}
          onChange={(e) => onFilterChange({ ...filters, brand: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">All Brands</option>
          <option value="Apple">Apple</option>
          <option value="Samsung">Samsung</option>
          <option value="Google">Google</option>
          <option value="OnePlus">OnePlus</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Min Price</label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => onFilterChange({ ...filters, minPrice: Number(e.target.value) })}
          min={0}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Max Price</label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          min={0}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
    </div>
  )
}
