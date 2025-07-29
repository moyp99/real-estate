import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { mockProperties } from '../data/mockProperties'
import FilterModal from './FilterModal'
import { Property } from '../types/Property'
import GoogleMap from './GoogleMap'
import { useFavorites } from '../context/FavoritesContext'

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

const MainView: React.FC = () => {
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Home')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties)
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    priceRange: { min: 0, max: 2000000 },
    bedrooms: [],
    bathrooms: [],
    propertyTypes: [],
    status: [],
    sqftRange: { min: 0, max: 5000 },
    yearBuiltRange: { min: 1900, max: 2024 },
    features: []
  })

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const applyFilters = (filters: FilterOptions) => {
    let filtered = mockProperties.filter(property => {
      // Price range filter
      if (filters.priceRange.min > 0 && property.price < filters.priceRange.min) return false
      if (filters.priceRange.max > 0 && property.price > filters.priceRange.max) return false
      
      // Bedrooms filter
      if (filters.bedrooms.length > 0 && !filters.bedrooms.some(bed => property.bedrooms >= bed)) return false
      
      // Bathrooms filter
      if (filters.bathrooms.length > 0 && !filters.bathrooms.some(bath => property.bathrooms >= bath)) return false
      
      // Property type filter
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.propertyType)) return false
      
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(property.status)) return false
      
      // Square footage filter
      if (filters.sqftRange.min > 0 && property.sqft < filters.sqftRange.min) return false
      if (filters.sqftRange.max > 0 && property.sqft > filters.sqftRange.max) return false
      
      // Year built filter
      if (filters.yearBuiltRange.min > 0 && property.yearBuilt < filters.yearBuiltRange.min) return false
      if (filters.yearBuiltRange.max > 0 && property.yearBuilt > filters.yearBuiltRange.max) return false
      
      // Features filter
      if (filters.features.length > 0 && !filters.features.some(feature => property.features.includes(feature))) return false
      
      return true
    })
    
    setFilteredProperties(filtered)
    setActiveFilters(filters)
  }

  const hasActiveFilters = () => {
    return (
      activeFilters.priceRange.min > 0 ||
      activeFilters.priceRange.max < 2000000 ||
      activeFilters.bedrooms.length > 0 ||
      activeFilters.bathrooms.length > 0 ||
      activeFilters.propertyTypes.length > 0 ||
      activeFilters.status.length > 0 ||
      activeFilters.sqftRange.min > 0 ||
      activeFilters.sqftRange.max < 5000 ||
      activeFilters.yearBuiltRange.min > 1900 ||
      activeFilters.yearBuiltRange.max < 2024 ||
      activeFilters.features.length > 0
    )
  }

  const TabButton = ({ name, icon, isActive, onClick }: { 
    name: string; 
    icon: React.ReactNode; 
    isActive: boolean; 
    onClick: () => void 
  }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
        isActive ? 'text-primary-600' : 'text-gray-400'
      }`}
    >
      {icon}
      <span className="text-xs mt-1 font-medium">{name}</span>
    </button>
  )

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="white"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Estate Navigator</h1>
            <p className="text-xs text-gray-500">San Francisco, CA</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full bg-gray-100 relative">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h5v12z" />
            </svg>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={applyFilters}
        currentFilters={activeFilters}
      />

      {/* Content Area with Top Padding */}
      <div className="flex-1 flex flex-col pt-20 pb-16 overflow-hidden">
        {/* Search Bar */}
        <div className="px-4 py-3 bg-white flex-shrink-0">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search properties, neighborhoods..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className={`p-3 rounded-lg transition-colors relative ${
                hasActiveFilters() 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {hasActiveFilters() && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Properties Count */}
        <div className="px-4 py-2 flex-shrink-0">
          <div className="inline-flex items-center bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {filteredProperties.length} properties
          </div>
        </div>

        {/* Map Container */}
        <div id="maps" className="flex-1 relative overflow-hidden">
          <GoogleMap 
            properties={filteredProperties}
            onPropertyClick={(propertyId) => navigate(`/property/${propertyId}`)}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex justify-around">
          <TabButton
            name="Home"
            isActive={activeTab === 'Home'}
            onClick={() => setActiveTab('Home')}
            icon={
              <svg className="w-6 h-6" fill={activeTab === 'Home' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          />
          <TabButton
            name="Favorites"
            isActive={activeTab === 'Favorites'}
            onClick={() => navigate('/favorites')}
            icon={
              <div className="relative">
                <svg className="w-6 h-6" fill={activeTab === 'Favorites' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favorites.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{favorites.length}</span>
                  </div>
                )}
              </div>
            }
          />
          <TabButton
            name="Messages"
            isActive={activeTab === 'Messages'}
            onClick={() => navigate('/messages')}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
          />
          <TabButton
            name="Profile"
            isActive={activeTab === 'Profile'}
            onClick={() => setActiveTab('Profile')}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  )
}

export default MainView