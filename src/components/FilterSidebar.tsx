"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  X, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Search,
  RotateCcw,
  Smartphone,
  Calendar,
  DollarSign,
  Zap,
} from 'lucide-react';

// Types
interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  phoneCount?: number;
}

interface FilterState {
  brands: string[];
  priceRange: [number, number];
  releaseYears: string[];
  status: string[];
  searchTerm: string;
}

interface FilterSidebarProps {
  onFiltersChange?: (filters: FilterState) => void;
  isLoading?: boolean;
  totalResults?: number;
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Available', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'UPCOMING', label: 'Upcoming', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'DISCONTINUED', label: 'Discontinued', color: 'bg-gray-100 text-gray-600 border-gray-200' }
];

const RELEASE_YEARS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019'];
const PRICE_RANGE = { min: 0, max: 2000 };

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onFiltersChange, 
  isLoading = false,
  totalResults = 0 
}) => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [autoApply, setAutoApply] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    price: true,
    year: false,
    status: false,
  });
  const [searchBrand, setSearchBrand] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>(() => {
    return {
      brands: searchParams.get('brandSlug')?.split(',').filter(Boolean) || [],
      priceRange: [
        parseInt(searchParams.get('minPrice') || '0'),
        parseInt(searchParams.get('maxPrice') || '2000')
      ],
      releaseYears: searchParams.get('releaseYear')?.split(',').filter(Boolean) || [],
      status: searchParams.get('status')?.split(',').filter(Boolean) || [],
      searchTerm: searchParams.get('searchTerm') || ''
    };
  });

  // Load brands from API
  const fetchBrands = useCallback(async () => {
    try {
      setBrandsLoading(true);
      const response = await fetch('/api/brands');
      if (response.ok) {
        const data = await response.json();
        setBrands(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setBrandsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Update URL params when filters change
  const updateURLParams = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    if (newFilters.searchTerm) params.set('searchTerm', newFilters.searchTerm);
    if (newFilters.brands.length > 0) params.set('brandSlug', newFilters.brands.join(','));
    if (newFilters.priceRange[0] > PRICE_RANGE.min) params.set('minPrice', newFilters.priceRange[0].toString());
    if (newFilters.priceRange[1] < PRICE_RANGE.max) params.set('maxPrice', newFilters.priceRange[1].toString());
    
    if (newFilters.releaseYears.length > 0) params.set('releaseYear', newFilters.releaseYears[0]);
    if (newFilters.status.length > 0) params.set('status', newFilters.status[0]);

    const newURL = params.toString() ? `/phones?${params.toString()}` : '/phones';
    router.push(newURL, { scroll: false });
  }, [router]);

  const applyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    if (autoApply) {
      updateURLParams(newFilters);
      onFiltersChange?.(newFilters);
    }
  }, [autoApply, updateURLParams, onFiltersChange]);

  // Filter handlers
  const handleBrandToggle = (brandSlug: string) => {
    const newBrands = filters.brands.includes(brandSlug)
      ? filters.brands.filter(slug => slug !== brandSlug)
      : [...filters.brands, brandSlug];
    applyFilters({ ...filters, brands: newBrands });
  };

  const handlePriceChange = (range: [number, number]) => {
    applyFilters({ ...filters, priceRange: range });
  };

  const handleYearToggle = (year: string) => {
    const newYears = filters.releaseYears.includes(year)
      ? filters.releaseYears.filter(y => y !== year)
      : [year];
    applyFilters({ ...filters, releaseYears: newYears });
  };

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [status];
    applyFilters({ ...filters, status: newStatus });
  };

  const handleSearchChange = (searchTerm: string) => {
    applyFilters({ ...filters, searchTerm });
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      brands: [],
      priceRange: [PRICE_RANGE.min, PRICE_RANGE.max],
      releaseYears: [],
      status: [],
      searchTerm: ''
    };
    setFilters(defaultFilters);
    updateURLParams(defaultFilters);
    onFiltersChange?.(defaultFilters);
    setSearchBrand('');
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredBrands = useMemo(() => {
    if (!searchBrand.trim()) return brands;
    return brands.filter(brand => 
      brand.name.toLowerCase().includes(searchBrand.toLowerCase())
    );
  }, [brands, searchBrand]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.brands.length > 0) count++;
    if (filters.priceRange[0] > PRICE_RANGE.min || filters.priceRange[1] < PRICE_RANGE.max) count++;
    if (filters.releaseYears.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.searchTerm) count++;
    return count;
  }, [filters]);

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; type: string; value: string; }[] = [];
    
    filters.brands.forEach(brandSlug => {
      const brand = brands.find(b => b.slug === brandSlug);
      if (brand) {
        chips.push({
          key: `brand-${brandSlug}`,
          label: brand.name,
          type: 'brand',
          value: brandSlug
        });
      }
    });

    if (filters.priceRange[0] > PRICE_RANGE.min || filters.priceRange[1] < PRICE_RANGE.max) {
      chips.push({
        key: 'price',
        label: `$${filters.priceRange[0]} - $${filters.priceRange[1]}`,
        type: 'price',
        value: 'price'
      });
    }

    filters.releaseYears.forEach(year => {
      chips.push({ key: `year-${year}`, label: year, type: 'year', value: year });
    });

    filters.status.forEach(status => {
      const statusOption = STATUS_OPTIONS.find(s => s.value === status);
      if (statusOption) {
        chips.push({ key: `status-${status}`, label: statusOption.label, type: 'status', value: status });
      }
    });

    return chips;
  }, [filters, brands]);

  const removeFilterChip = (chip: any) => {
    switch (chip.type) {
      case 'brand': handleBrandToggle(chip.value); break;
      case 'price': handlePriceChange([PRICE_RANGE.min, PRICE_RANGE.max]); break;
      case 'year': handleYearToggle(chip.value); break;
      case 'status': handleStatusToggle(chip.value); break;
    }
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{activeFilterCount}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={clearFilters}
            disabled={activeFilterCount === 0}
            className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear all filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
          {activeFilterChips.length > 0 && (
      <div className="my-4 mx-2 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active:</span>
              {activeFilterChips.map((chip) => (
                <span key={chip.key} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                  {chip.label}
                  <button onClick={() => removeFilterChip(chip)} className="ml-1 hover:text-blue-600"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <button onClick={clearFilters} className="text-[12px] font-bold text-blue-500 hover:text-gray-700 ">Clear all</button>
            </div>
        </div>
      </div>
          )}

      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700 dark:text-gray-300">Auto-apply filters</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={autoApply}
              onChange={(e) => setAutoApply(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-10 h-4 rounded-full transition-colors  ${autoApply ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-md  transform transition-transform mt-1 ml-1 ${autoApply ? 'translate-x-4 ' : 'translate-x-0'}`} />
            </div>
          </div>
        </label>
      </div>

      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
        {isLoading ? (
          <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />Loading...</div>
        ) : (
          `${totalResults.toLocaleString()} phones found`
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search phones..."
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => toggleSection('brands')} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-pink-600" />
              <span className="font-bold  text-gray-900 dark:text-white">Brand</span>
              {filters.brands.length > 0 && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{filters.brands.length}</span>}
            </div>
            {expandedSections.brands ? <ChevronUp className="w-4 h-4 text-pink-600" /> : <ChevronDown className="w-4 h-4 text-pink-600" />}
          </button>
          
          {expandedSections.brands && (
            <div className="pb-4 px-4">
              <div className="mb-3 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-600" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                />
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {brandsLoading ? (
                  <div className="flex items-center justify-center py-4"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
                ) : (
                  filteredBrands.map((brand) => (
                    <label key={brand.slug} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand.slug)}
                        onChange={() => handleBrandToggle(brand.slug)}
                        className="w-4 h-4 text-pink-600 "
                        style={{color:"red"}}
                      />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {brand.logo && <img src={brand.logo} alt={brand.name} className="w-5 h-5 object-conver" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{brand.name}</span>
                        {brand.phoneCount != null && <span className="text-xs text-gray-400 ml-auto">({brand.phoneCount})</span>}
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-pink-600" /><span className="font-medium text-gray-900 dark:text-white">Price Range</span></div>
            {expandedSections.price ? <ChevronUp className="w-4 h-4 text-pink-600" /> : <ChevronDown className="w-4 h-4 text-pink-600" />}
          </button>
          
          {expandedSections.price && (
            <div className="pb-4 px-4">
              <p className="text-sm text-gray-500">Price filter UI to be implemented.</p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => toggleSection('year')} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-pink-600" /><span className="font-medium text-gray-900 dark:text-white">Release Year</span></div>
            {expandedSections.year ? <ChevronUp className="w-4 h-4 text-pink-600" /> : <ChevronDown className="w-4 h-4 text-pink-600" />}
          </button>
          
          {expandedSections.year && (
            <div className="pb-4 px-4 grid grid-cols-2 gap-2">
              {RELEASE_YEARS.map((year) => (
                <label key={year} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input
                    type="radio"
                    name="releaseYear"
                    checked={filters.releaseYears.includes(year)}
                    onChange={() => handleYearToggle(year)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{year}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => toggleSection('status')} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-pink-600" /><span className="font-medium text-gray-900 dark:text-white">Status</span></div>
            {expandedSections.status ? <ChevronUp className="w-4 h-4 text-pink-600" /> : <ChevronDown className="w-4 h-4 text-pink-600" />}
          </button>
          
          {expandedSections.status && (
            <div className="pb-4 px-4 space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <label key={status.value} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={filters.status.includes(status.value)}
                    onChange={() => handleStatusToggle(status.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${status.color}`}>{status.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {!autoApply && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => { updateURLParams(filters); onFiltersChange?.(filters); }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
          >
            Apply Filters ({activeFilterCount})
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden absolute top-2 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-40"
      >
        <Filter className="w-6 h-6 text-pink-600" />
        {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
      </button>

      

      <div className="hidden lg:block w-80 h-screen relative top-0 border-r border-gray-200 dark:border-gray-700">
        <SidebarContent />
      </div>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;