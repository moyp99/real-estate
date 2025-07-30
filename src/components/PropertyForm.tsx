import React, { useState, useEffect } from 'react'
import { Property } from '../types/Property'

interface PropertyFormProps {
  property: Property | null
  onSave: (property: Property) => void
  onClose: () => void
}

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    yearBuilt: '',
    propertyType: 'Single Family' as Property['propertyType'],
    status: 'For Sale' as Property['status'],
    description: '',
    features: [] as string[],
    imageUrl: ''
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        price: property.price.toString(),
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        sqft: property.sqft.toString(),
        yearBuilt: property.yearBuilt.toString(),
        propertyType: property.propertyType,
        status: property.status,
        description: property.description,
        features: property.features,
        imageUrl: property.images[0] || ''
      })
    }
  }, [property])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newProperty: Property = {
      id: property?.id || 0,
      title: formData.title,
      price: parseInt(formData.price),
      priceFormatted: `$${parseInt(formData.price).toLocaleString()}`,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseFloat(formData.bathrooms),
      sqft: parseInt(formData.sqft),
      yearBuilt: parseInt(formData.yearBuilt),
      propertyType: formData.propertyType,
      status: formData.status,
      description: formData.description,
      features: formData.features,
      images: [formData.imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&h=600'],
      agent: property?.agent || {
        name: '',
        phone: '',
        email: '',
        photo: '',
        company: ''
      },
      coordinates: property?.coordinates || { lat: 0, lng: 0 },
      mapPosition: property?.mapPosition || { x: '0', y: '0' },
      daysOnMarket: property?.daysOnMarket || 0,
      mlsNumber: property?.mlsNumber || `MLS${Date.now()}`
    }
    
    onSave(newProperty)
  }

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const availableFeatures = [
    'Hardwood Floors',
    'Granite Countertops',
    'Stainless Steel Appliances',
    'Walk-in Closet',
    'Swimming Pool',
    'Garage',
    'Central Air',
    'Fireplace',
    'Balcony/Patio',
    'Washer/Dryer',
    'Storage Space',
    'Pet Friendly'
  ]

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-600">
              {currentStep === 1 && 'Basic Info'}
              {currentStep === 2 && 'Details'}
              {currentStep === 3 && 'Features'}
              {currentStep === 4 && 'Review'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Beautiful 3BR Home in Downtown"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                    placeholder="450000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as Property['propertyType'] })}
                    className="input-field"
                  >
                    <option value="Single Family">Single Family</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Multi-Family">Multi-Family</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Property['status'] })}
                    className="input-field"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                    <option value="Off Market">Off Market</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="input-field"
                      maxLength={2}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Square Feet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.sqft}
                      onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Built <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.yearBuilt}
                      onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                      className="input-field"
                      min="1800"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Features */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Describe the property..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Property Features
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableFeatures.map((feature) => (
                      <label
                        key={feature}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature)}
                          onChange={() => toggleFeature(feature)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Listing</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{formData.title}</h4>
                    <p className="text-primary-600 font-bold">${parseInt(formData.price || '0').toLocaleString()}</p>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                  </div>
                  
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{formData.bedrooms} beds</span>
                    <span>{formData.bathrooms} baths</span>
                    <span>{formData.sqft} sqft</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Type:</span> {formData.propertyType}
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Status:</span> {formData.status}
                  </div>
                  
                  {formData.features.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Features:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.features.map((feature) => (
                          <span key={feature} className="bg-white px-2 py-1 rounded-md text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              {property ? 'Update Property' : 'Add Property'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertyForm