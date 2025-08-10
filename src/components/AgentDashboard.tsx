import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Property } from '../types/Property'
import PropertyForm from './PropertyForm'
import { propertyService } from '../services/property.service'
import LoadingSpinner from './LoadingSpinner'

const AgentDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [agentProperties, setAgentProperties] = useState<Property[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      fetchAgentProperties()
    }
  }, [user])

  const fetchAgentProperties = async () => {
    if (!user?.id) return
    
    try {
      setIsLoading(true)
      setError(null)
      const properties = await propertyService.getAgentProperties(user.id)
      setAgentProperties(properties)
    } catch (err) {
      console.error('Error fetching properties:', err)
      setError('Failed to load properties. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProperty = () => {
    setEditingProperty(null)
    setShowPropertyForm(true)
  }

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property)
    setShowPropertyForm(true)
  }

  const handleDeleteProperty = async (id: number) => {
    if (!user?.id) return
    
    const confirmed = window.confirm('Are you sure you want to delete this property?')
    if (!confirmed) return
    
    setDeletingId(id)
    try {
      await propertyService.deleteAgentProperty(id, user.id)
      setAgentProperties(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting property:', err)
      alert('Failed to delete property. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSaveProperty = async (property: Property) => {
    if (!user?.id) return
    
    try {
      if (editingProperty) {
        // Update existing property
        const updated = await propertyService.updateAgentProperty(
          property.id,
          user.id,
          {
            title: property.title,
            price: property.price,
            address: property.address,
            city: property.city,
            state: property.state,
            zipCode: property.zipCode,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            sqft: property.sqft,
            yearBuilt: property.yearBuilt,
            propertyType: property.propertyType,
            status: property.status,
            description: property.description,
            features: property.features,
            latitude: property.coordinates.lat,
            longitude: property.coordinates.lng,
          }
        )
        setAgentProperties(prev => 
          prev.map(p => p.id === property.id ? updated : p)
        )
      } else {
        // Add new property
        const created = await propertyService.createAgentProperty(
          user.id,
          {
            title: property.title,
            price: property.price,
            address: property.address,
            city: property.city,
            state: property.state,
            zipCode: property.zipCode,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            sqft: property.sqft,
            yearBuilt: property.yearBuilt,
            propertyType: property.propertyType,
            status: property.status,
            description: property.description,
            features: property.features,
            latitude: property.coordinates.lat,
            longitude: property.coordinates.lng
          },
          property.images || []
        )
        setAgentProperties(prev => [created, ...prev])
      }
      setShowPropertyForm(false)
      setEditingProperty(null)
    } catch (err) {
      console.error('Error saving property:', err)
      alert('Failed to save property. Please try again.')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Agent Dashboard</h1>
                <p className="text-xs text-gray-600">{user?.name}</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <button
                onClick={() => setShowMenu(false)}
                className="absolute top-4 right-4 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="mt-8 space-y-4">
                <Link to="/main" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Browse Properties
                </Link>
                
                <Link to="/messages" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Messages
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchAgentProperties}
              className="text-sm font-medium text-red-800 hover:text-red-900 mt-1"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-2xl font-bold text-gray-900">{agentProperties.length}</span>
            </div>
            <p className="text-sm text-gray-600">Active Listings</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-2xl font-bold text-gray-900">
                ${agentProperties.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Value</p>
          </div>
        </div>

        {/* Add Property Button */}
        <button
          onClick={handleAddProperty}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl py-4 px-6 font-medium shadow-lg shadow-primary-600/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Property
        </button>

        {/* Properties List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">My Properties</h2>
          
          {agentProperties.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-600 mb-4">No properties listed yet</p>
              <button
                onClick={handleAddProperty}
                className="text-primary-600 font-medium"
              >
                Add your first property
              </button>
            </div>
          ) : (
            agentProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="relative">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-1 text-sm font-medium text-gray-900">
                    {property.status}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
                  <p className="text-primary-600 font-bold text-lg mb-2">{property.priceFormatted}</p>
                  <p className="text-sm text-gray-600 mb-3">{property.address}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {property.bedrooms} beds
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" />
                      </svg>
                      {property.bathrooms} baths
                    </span>
                    <span>{property.sqft} sqft</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProperty(property)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      disabled={deletingId === property.id}
                      className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deletingId === property.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
          </>
        )}
      </div>

      {/* Property Form Modal */}
      {showPropertyForm && (
        <PropertyForm
          property={editingProperty}
          onSave={handleSaveProperty}
          onClose={() => {
            setShowPropertyForm(false)
            setEditingProperty(null)
          }}
        />
      )}
    </div>
  )
}

export default AgentDashboard