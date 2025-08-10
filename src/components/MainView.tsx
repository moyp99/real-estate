import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import FilterModal from './FilterModal'
import { Property } from '../types/Property'
import GoogleMap from './GoogleMap'
import { useFavorites } from '../context/FavoritesContext'
import { useProperties } from '../hooks/useProperties'
import LoadingSpinner from './LoadingSpinner'
import GuestNotificationBanner from './GuestNotificationBanner'
import AgentFloatingButton from './AgentFloatingButton'
import { Bell, Home, Heart, MessageCircle, User, Search, Filter, MapPin, LogOut, Settings, ChevronDown } from 'lucide-react'

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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
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
  
  const { properties, isLoading, error } = useProperties()
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])

  React.useEffect(() => {
    if (properties.length > 0) {
      applyFilters(activeFilters)
    }
  }, [properties])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showProfileDropdown && !target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileDropdown])

  const handleLogout = async () => {
    setShowProfileDropdown(false)
    await logout()
    navigate('/')
  }

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown)
  }

  const handleDropdownItemClick = (action: string) => {
    setShowProfileDropdown(false)
    switch (action) {
      case 'logout':
        handleLogout()
        break
      case 'favorites':
        navigate('/favorites')
        break
      case 'settings':
        // TODO: Navigate to settings page when implemented
        console.log('Settings page not implemented yet')
        break
    }
  }

  const applyFilters = (filters: FilterOptions) => {
    let filtered = properties.filter(property => {
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

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

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
          {/* Agent Quick Access Button */}
          {user?.type === 'agent' && (
            <button
              onClick={() => navigate('/agent-dashboard')}
              className="p-2 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors"
              title="Agent Dashboard"
            >
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </button>
          )}
          
                     <button className="p-2 rounded-full bg-gray-100 relative">
             <Bell className="w-5 h-5 text-gray-600" />
             {/* Notification dot */}
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
           </button>
          <div className="relative profile-dropdown">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                
                <button
                  onClick={() => handleDropdownItemClick('favorites')}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Favorites</span>
                </button>
                
                <button
                  onClick={() => handleDropdownItemClick('settings')}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>
                
                <div className="border-t border-gray-100 mt-1">
                  <button
                    onClick={() => handleDropdownItemClick('logout')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guest Notification Banner */}
      <GuestNotificationBanner />
      
      {/* Agent Floating Button */}
      <AgentFloatingButton />

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={applyFilters}
        currentFilters={activeFilters}
      />

      {/* Content Area with Top Padding - adjusted for potential banner */}
      <div className={`flex-1 flex flex-col pb-16 overflow-hidden ${user?.type === 'guest' ? 'pt-32' : 'pt-20'}`}>
        {/* Search Bar */}
        <div className="px-4 py-3 bg-white flex-shrink-0">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="h-5 w-5 text-gray-400" />
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
                             <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Properties Count */}
        <div className="px-4 py-2 flex-shrink-0">
                     <div className="inline-flex items-center bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
             <MapPin className="w-4 h-4 mr-1" />
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
               <Home className={`w-6 h-6 ${activeTab === 'Home' ? 'fill-current' : ''}`} />
             }
          />
          <TabButton
            name="Favorites"
            isActive={activeTab === 'Favorites'}
            onClick={() => navigate('/favorites')}
                         icon={
               <div className="relative">
                 <Heart className={`w-6 h-6 ${activeTab === 'Favorites' ? 'fill-current' : ''}`} />
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
               <MessageCircle className="w-6 h-6" />
             }
          />
          <TabButton
            name="Profile"
            isActive={activeTab === 'Profile'}
            onClick={() => setActiveTab('Profile')}
                         icon={
               <User className="w-6 h-6" />
             }
          />
        </div>
      </div>
    </div>
  )
}

export default MainView