import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { Property } from '../types/Property'
import GuestNotificationBanner from './GuestNotificationBanner'
import { useAuth } from '../context/AuthContext'

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { favorites, removeFromFavorites } = useFavorites()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Property Image */}
      <div className="relative h-48">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.status === 'For Sale' ? 'bg-green-100 text-green-800' :
            property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {property.status}
          </span>
        </div>

        {/* Remove from Favorites */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            removeFromFavorites(property.id)
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Property Details */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => navigate(`/property/${property.id}`)}
      >
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">
            {formatPrice(property.price)}
          </h3>
          <span className="text-sm text-gray-500">
            {property.daysOnMarket} days
          </span>
        </div>

        {/* Address */}
        <p className="text-gray-600 text-sm mb-3">
          {property.address}, {property.city}, {property.state}
        </p>

        {/* Property Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
            </svg>
            {property.bedrooms} beds
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
            </svg>
            {property.bathrooms} baths
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {property.sqft.toLocaleString()} sqft
          </div>
        </div>

        {/* Property Type */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {property.propertyType}
          </span>
          <span className="text-sm text-gray-500">
            Built {property.yearBuilt}
          </span>
        </div>

        {/* Key Features */}
        <div className="mt-3 flex flex-wrap gap-1">
          {property.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {feature}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{property.features.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Guest Notification Banner */}
      <GuestNotificationBanner />
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/main')}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">My Favorites</h1>
            <p className="text-xs text-gray-500">{favorites.length} saved properties</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 pb-16 overflow-y-auto ${user?.type === 'guest' ? 'pt-32' : 'pt-20'}`}>
        {favorites.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {user?.type === 'guest' ? 'Sign up to save favorites' : 'No favorites yet'}
            </h2>
            <p className="text-gray-600 text-center mb-6 max-w-sm">
              {user?.type === 'guest' 
                ? 'Create an account to save properties and access them anytime across all your devices.'
                : 'Start exploring properties and tap the heart icon to save your favorites here.'}
            </p>
            <button
              onClick={() => navigate(user?.type === 'guest' ? '/signup' : '/main')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              {user?.type === 'guest' ? 'Sign Up Now' : 'Explore Properties'}
            </button>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="px-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              {favorites.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex justify-around">
          <button
            onClick={() => navigate('/main')}
            className="flex flex-col items-center justify-center py-2 px-3 transition-colors text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1 font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center py-2 px-3 transition-colors text-primary-600">
            <div className="relative">
              <svg className="w-6 h-6" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favorites.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{favorites.length}</span>
                </div>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">Favorites</span>
          </button>
          <button
            onClick={() => navigate('/messages')}
            className="flex flex-col items-center justify-center py-2 px-3 transition-colors text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs mt-1 font-medium">Messages</span>
          </button>
          <button className="flex flex-col items-center justify-center py-2 px-3 transition-colors text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1 font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FavoritesPage