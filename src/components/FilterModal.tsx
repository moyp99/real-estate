import React, { useState } from 'react'

interface FilterOptions {
  priceRange: {
    min: number
    max: number
  }
  bedrooms: number[]
  bathrooms: number[]
  propertyTypes: string[]
  status: string[]
  sqftRange: {
    min: number
    max: number
  }
  yearBuiltRange: {
    min: number
    max: number
  }
  features: string[]
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
  currentFilters: FilterOptions
}

const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  currentFilters 
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters)

  if (!isOpen) return null

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: parseInt(value) || 0
      }
    }))
  }

  const handleBedroomToggle = (bedrooms: number) => {
    setFilters(prev => ({
      ...prev,
      bedrooms: prev.bedrooms.includes(bedrooms)
        ? prev.bedrooms.filter(b => b !== bedrooms)
        : [...prev.bedrooms, bedrooms]
    }))
  }

  const handleBathroomToggle = (bathrooms: number) => {
    setFilters(prev => ({
      ...prev,
      bathrooms: prev.bathrooms.includes(bathrooms)
        ? prev.bathrooms.filter(b => b !== bathrooms)
        : [...prev.bathrooms, bathrooms]
    }))
  }

  const handlePropertyTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }))
  }

  const handleStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleSqftChange = (type: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      sqftRange: {
        ...prev.sqftRange,
        [type]: parseInt(value) || 0
      }
    }))
  }

  const handleYearBuiltChange = (type: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      yearBuiltRange: {
        ...prev.yearBuiltRange,
        [type]: parseInt(value) || 0
      }
    }))
  }

  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 2000000 },
      bedrooms: [],
      bathrooms: [],
      propertyTypes: [],
      status: [],
      sqftRange: { min: 0, max: 5000 },
      yearBuiltRange: { min: 1900, max: 2024 },
      features: []
    })
  }

  const applyFilters = () => {
    onApplyFilters(filters)
    onClose()
  }

  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family']
  const statusOptions = ['For Sale', 'Pending', 'Sold', 'Off Market']
  const commonFeatures = [
    'Ocean Views', 'Modern Kitchen', 'Hardwood Floors', 'Two-Car Garage',
    'Private Patio', 'Walk to Beach', 'Updated Bathrooms', 'Central AC',
    'City Views', 'High-Rise Living', 'Rooftop Pool', 'Fitness Center',
    'Concierge', 'In-Unit Laundry', 'Stainless Appliances', 'Balcony',
    'Historic Charm', 'Built-in Cabinetry', 'Front Porch', 'Mature Trees',
    'Vaulted Ceilings', 'Fireplace', 'Large Backyard', 'Excellent Schools'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  value={filters.priceRange.min || ''}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  placeholder="$0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.priceRange.max || ''}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  placeholder="$2,000,000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bedrooms</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => handleBedroomToggle(num)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    filters.bedrooms.includes(num)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                  }`}
                >
                  {num}+ bed{num > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bathrooms</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => handleBathroomToggle(num)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    filters.bathrooms.includes(num)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                  }`}
                >
                  {num}+ bath{num > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Type</h3>
            <div className="space-y-2">
              {propertyTypes.map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.propertyTypes.includes(type)}
                    onChange={() => handlePropertyTypeToggle(type)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Status</h3>
            <div className="space-y-2">
              {statusOptions.map(status => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={() => handleStatusToggle(status)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Square Footage */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Square Footage</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Sq Ft</label>
                <input
                  type="number"
                  value={filters.sqftRange.min || ''}
                  onChange={(e) => handleSqftChange('min', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Sq Ft</label>
                <input
                  type="number"
                  value={filters.sqftRange.max || ''}
                  onChange={(e) => handleSqftChange('max', e.target.value)}
                  placeholder="5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Year Built */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Year Built</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="number"
                  value={filters.yearBuiltRange.min || ''}
                  onChange={(e) => handleYearBuiltChange('min', e.target.value)}
                  placeholder="1900"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="number"
                  value={filters.yearBuiltRange.max || ''}
                  onChange={(e) => handleYearBuiltChange('max', e.target.value)}
                  placeholder="2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {commonFeatures.map(feature => (
                <label key={feature} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-b-2xl">
          <div className="flex space-x-3">
            <button
              onClick={resetFilters}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterModal