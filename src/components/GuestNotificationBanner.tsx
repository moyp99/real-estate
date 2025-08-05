import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const GuestNotificationBanner: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    // Check if banner was previously collapsed in this session
    const collapsed = sessionStorage.getItem('guestBannerCollapsed')
    if (collapsed) {
      setIsCollapsed(true)
    }
    
    // Show banner with a slight delay for smooth animation
    if (user?.type === 'guest') {
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [user])

  const handleCollapse = () => {
    setIsCollapsed(true)
    sessionStorage.setItem('guestBannerCollapsed', 'true')
  }

  const handleExpand = () => {
    setIsCollapsed(false)
    sessionStorage.removeItem('guestBannerCollapsed')
  }

  const handleAuthAction = async (path: string) => {
    // Clear guest session
    await logout()
    // Clear any session storage
    sessionStorage.removeItem('guestBannerCollapsed')
    // Navigate to the auth page
    navigate(path)
  }

  // Don't render if not a guest user
  if (user?.type !== 'guest') {
    return null
  }

  // Collapsed state - minimal banner
  if (isCollapsed) {
    return (
      <div
        className={`fixed top-16 left-0 right-0 z-30 transition-all duration-500 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-white text-sm">
                  Guest mode • <span className="font-medium">Sign up to unlock all features</span>
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAuthAction('/signup')}
                  className="bg-white text-primary-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => handleAuthAction('/')}
                  className="text-white/90 hover:text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={handleExpand}
                  className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/20 transition-colors"
                  aria-label="Expand notification"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Expanded state - full banner
  return (
    <div
      className={`fixed top-16 left-0 right-0 z-30 transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-1">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  You're browsing as a guest
                </p>
                <p className="text-white/90 text-xs mt-0.5">
                  Sign up to save favorites, contact agents, and unlock all features
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAuthAction('/signup')}
                className="bg-white text-primary-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors shadow-md"
              >
                Sign Up
              </button>
              <button
                onClick={() => handleAuthAction('/')}
                className="bg-white/20 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={handleCollapse}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Collapse notification"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature list for larger screens */}
      <div className="hidden md:block bg-primary-50 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-6 text-xs text-primary-700">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Save favorite properties</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Message agents directly</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Schedule property tours</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Get price alerts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestNotificationBanner