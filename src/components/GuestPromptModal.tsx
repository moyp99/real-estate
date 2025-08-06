import React from 'react'
import { useNavigate } from 'react-router-dom'

interface GuestPromptModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  benefits?: string[]
}

const GuestPromptModal: React.FC<GuestPromptModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description,
  benefits = []
}) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleAction = (action: 'signup' | 'login') => {
    onClose()
    navigate(action === 'signup' ? '/signup' : '/')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleAction('signup')}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Sign Up for Free
          </button>
          <button
            onClick={() => handleAction('login')}
            className="w-full bg-white text-primary-600 py-3 px-4 rounded-lg font-medium border border-primary-600 hover:bg-primary-50 transition-colors"
          >
            Already have an account? Log In
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Browsing
          </button>
        </div>

        {benefits.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Why Sign Up?</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-4 h-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default GuestPromptModal