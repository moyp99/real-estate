import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Property } from '../types/Property'
import MortgageOfferModal from './MortgageOfferModal'
import ScheduleTourModal from './ScheduleTourModal'
import ContactAgentModal from './ContactAgentModal'
import { useFavorites } from '../context/FavoritesContext'

interface PropertyDetailsProps {
  property: Property
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showMortgageModal, setShowMortgageModal] = useState(false)
  const [showScheduleTourModal, setShowScheduleTourModal] = useState(false)
  const [showContactAgentModal, setShowContactAgentModal] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMortgageModal(true)
    }, 10000) // Show after 10 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleBack = () => {
    navigate('/main')
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <div className="relative h-80 bg-gray-200">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex space-x-2">
            <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            
            <button
              onClick={() => toggleFavorite(property)}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
            >
              <svg 
                className={`w-5 h-5 ${isFavorite(property.id) ? 'text-red-500 fill-current' : 'text-gray-700'}`} 
                fill={isFavorite(property.id) ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Indicators */}
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="p-4">
        {/* Price and Status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {formatPrice(property.price)}
            </h1>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                property.status === 'For Sale' ? 'bg-green-100 text-green-800' :
                property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {property.status}
              </span>
              <span className="text-sm text-gray-500">
                {property.daysOnMarket} days on market
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {property.title}
          </h2>
          <p className="text-gray-600">
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </p>
        </div>

        {/* Property Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{property.bedrooms}</div>
            <div className="text-sm text-gray-600">Beds</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{property.bathrooms}</div>
            <div className="text-sm text-gray-600">Baths</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{property.sqft.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Sq Ft</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{property.yearBuilt}</div>
            <div className="text-sm text-gray-600">Built</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-700 leading-relaxed">{property.description}</p>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
          <div className="grid grid-cols-2 gap-2">
            {property.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Listed by</h3>
          <div className="flex items-center">
            <img
              src={property.agent.photo}
              alt={property.agent.name}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{property.agent.name}</h4>
              <p className="text-sm text-gray-600">{property.agent.company}</p>
            </div>
            <div className="flex space-x-2">
              <a
                href={`tel:${property.agent.phone}`}
                className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              <a
                href={`mailto:${property.agent.email}`}
                className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Property Type</span>
              <span className="font-medium">{property.propertyType}</span>
            </div>
            {property.lotSize && (
              <div className="flex justify-between">
                <span className="text-gray-600">Lot Size</span>
                <span className="font-medium">{property.lotSize}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">MLS Number</span>
              <span className="font-medium">{property.mlsNumber}</span>
            </div>
            {property.schools && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Elementary School</span>
                  <span className="font-medium">{property.schools.elementary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Middle School</span>
                  <span className="font-medium">{property.schools.middle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">High School</span>
                  <span className="font-medium">{property.schools.high}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowScheduleTourModal(true)}
            className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Schedule Tour
          </button>
          <button 
            onClick={() => setShowContactAgentModal(true)}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Contact Agent
          </button>
        </div>
      </div>

      {/* Bottom padding to account for fixed buttons */}
      <div className="h-20"></div>

      {/* Mortgage Offer Modal */}
      <MortgageOfferModal
        property={property}
        isOpen={showMortgageModal}
        onClose={() => setShowMortgageModal(false)}
      />

      {/* Schedule Tour Modal */}
      <ScheduleTourModal
        property={property}
        isOpen={showScheduleTourModal}
        onClose={() => setShowScheduleTourModal(false)}
      />

      {/* Contact Agent Modal */}
      <ContactAgentModal
        property={property}
        isOpen={showContactAgentModal}
        onClose={() => setShowContactAgentModal(false)}
      />
    </div>
  )
}

export default PropertyDetails