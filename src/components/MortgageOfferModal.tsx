import React from 'react'
import { Property } from '../types/Property'

interface MortgageOfferModalProps {
  property: Property
  isOpen: boolean
  onClose: () => void
}

const MortgageOfferModal: React.FC<MortgageOfferModalProps> = ({ property, isOpen, onClose }) => {
  if (!isOpen) return null

  // Calculate monthly payment (simplified calculation)
  const calculateMonthlyPayment = (price: number, downPaymentPercent: number = 20, interestRate: number = 2.9, loanTermYears: number = 30) => {
    const downPayment = price * (downPaymentPercent / 100)
    const loanAmount = price - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTermYears * 12
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    
    return Math.round(monthlyPayment)
  }

  const monthlyPayment = calculateMonthlyPayment(property.price)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-4 bg-primary-600 text-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
            </div>
            <span className="font-semibold">FirstBank</span>
          </div>
          
          <h2 className="text-xl font-bold mb-1">Special Mortgage Offer</h2>
          <p className="text-primary-100 text-sm">Exclusive rates for Estate Navigator users</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Interest Rate */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-primary-600 mb-1">2.9%</div>
            <div className="text-gray-500 text-sm mb-2">APR Starting Rate</div>
            <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Limited Time Offer
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">No origination fees</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Fast 15-day approval</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Up to $1M loan amount</span>
            </div>
          </div>

          {/* Monthly Payment */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Estimated Monthly Payment</div>
              <div className="text-2xl font-bold text-gray-900">
                ${monthlyPayment.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">Based on this property</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Get Pre-Approved Now
            </button>
            
            <button 
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Learn More
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
            *Rate subject to credit approval. Terms and conditions apply.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MortgageOfferModal