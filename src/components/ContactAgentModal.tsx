import React, { useState } from 'react'
import { Property } from '../types/Property'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface ContactAgentModalProps {
  property: Property
  isOpen: boolean
  onClose: () => void
}

const ContactAgentModal: React.FC<ContactAgentModalProps> = ({ property, isOpen, onClose }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedMethod, setSelectedMethod] = useState<'call' | 'email' | 'message'>('message')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: 'general' as 'general' | 'financing' | 'viewing' | 'offer'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showGuestPrompt, setShowGuestPrompt] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user is a guest
    if (user?.type === 'guest') {
      setShowGuestPrompt(true)
      return
    }
    
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Auto close after 3 seconds
    setTimeout(() => {
      onClose()
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        inquiryType: 'general'
      })
    }, 3000)
  }

  const handleGuestAction = (action: 'signup' | 'login') => {
    onClose()
    navigate(action === 'signup' ? '/signup' : '/')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
          <p className="text-gray-600 mb-4">
            Your message has been sent to {property.agent.name}. 
            They'll get back to you within 24 hours.
          </p>
          <div className="text-sm text-gray-500">
            Closing automatically...
          </div>
        </div>
      </div>
    )
  }

  // Guest Prompt Modal
  if (showGuestPrompt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Up to Contact Agents</h3>
            <p className="text-gray-600">
              Create a free account to message agents directly and get personalized assistance with your property search.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleGuestAction('signup')}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Sign Up for Free
            </button>
            <button
              onClick={() => handleGuestAction('login')}
              className="w-full bg-white text-primary-600 py-3 px-4 rounded-lg font-medium border border-primary-600 hover:bg-primary-50 transition-colors"
            >
              Already have an account? Log In
            </button>
            <button
              onClick={() => setShowGuestPrompt(false)}
              className="w-full text-gray-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Continue Browsing
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Why Sign Up?</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Direct messaging with real estate agents
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save and track your favorite properties
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Schedule property tours instantly
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Contact Agent</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Property Info */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 text-sm">{property.title}</h3>
            <p className="text-gray-600 text-xs">{formatPrice(property.price)} • {property.address}</p>
          </div>
        </div>

        {/* Agent Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <img
              src={property.agent.photo}
              alt={property.agent.name}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{property.agent.name}</h3>
              <p className="text-sm text-gray-600">{property.agent.company}</p>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How would you like to connect?</h3>
          
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              onClick={() => setSelectedMethod('call')}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                selectedMethod === 'call'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
              }`}
            >
              <div className="flex flex-col items-center">
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </div>
            </button>
            
            <button
              onClick={() => setSelectedMethod('email')}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                selectedMethod === 'email'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
              }`}
            >
              <div className="flex flex-col items-center">
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </div>
            </button>
            
            <button
              onClick={() => setSelectedMethod('message')}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                selectedMethod === 'message'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
              }`}
            >
              <div className="flex flex-col items-center">
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Message
              </div>
            </button>
          </div>

          {/* Direct Contact Options */}
          {selectedMethod === 'call' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Call {property.agent.name}</h4>
              <p className="text-gray-600 mb-4">Available Mon-Sat, 9 AM - 7 PM</p>
              {user?.type === 'guest' ? (
                <button
                  onClick={() => setShowGuestPrompt(true)}
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Sign Up to View Phone Number
                </button>
              ) : (
                <a
                  href={`tel:${property.agent.phone}`}
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  {property.agent.phone}
                </a>
              )}
            </div>
          )}

          {selectedMethod === 'email' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Email {property.agent.name}</h4>
              <p className="text-gray-600 mb-4">Typically responds within 2 hours</p>
              {user?.type === 'guest' ? (
                <button
                  onClick={() => setShowGuestPrompt(true)}
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Sign Up to View Email
                </button>
              ) : (
                <a
                  href={`mailto:${property.agent.email}?subject=Inquiry about ${property.title}&body=Hi ${property.agent.name},%0D%0A%0D%0AI'm interested in learning more about the property at ${property.address}.%0D%0A%0D%0AProperty Details:%0D%0A- Price: ${formatPrice(property.price)}%0D%0A- Bedrooms: ${property.bedrooms}%0D%0A- Bathrooms: ${property.bathrooms}%0D%0A- Square Feet: ${property.sqft.toLocaleString()}%0D%0A%0D%0APlease let me know when would be a good time to discuss this property.%0D%0A%0D%0AThank you!`}
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  {property.agent.email}
                </a>
              )}
            </div>
          )}

          {/* Message Form */}
          {selectedMethod === 'message' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Inquiry Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What are you interested in?</label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="general">General Information</option>
                  <option value="viewing">Schedule a Viewing</option>
                  <option value="financing">Financing Options</option>
                  <option value="offer">Making an Offer</option>
                </select>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder={`Hi ${property.agent.name}, I'm interested in learning more about this property...`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactAgentModal