import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AgentFloatingButton: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Only show for agent users
  if (user?.type !== 'agent') {
    return null
  }

  return (
    <div className="fixed bottom-24 right-4 z-40">
      {/* Floating Button */}
      <button
        onClick={() => navigate('/agent-dashboard')}
        className="group relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          bg-gradient-to-r from-primary-600 to-primary-700 
          transition-all duration-300 transform hover:scale-110 hover:shadow-xl
          active:scale-95"
        aria-label="Go to Agent Dashboard"
      >
        <svg 
          className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
          />
        </svg>
        
        {/* Subtle Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-primary-600 animate-ping opacity-25"></div>
      </button>
      
      {/* Tooltip on Hover */}
      <div className="absolute bottom-16 right-0 pointer-events-none">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 
          bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap
          transform translate-y-2 group-hover:translate-y-0 transition-transform">
          Agent Dashboard
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 
            w-2 h-2 bg-gray-900"></div>
        </div>
      </div>
    </div>
  )
}

export default AgentFloatingButton