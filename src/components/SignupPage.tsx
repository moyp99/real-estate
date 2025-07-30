import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'user' as 'user' | 'agent',
    // Agent-specific fields
    licenseNumber: '',
    brokerageName: '',
    phone: '',
    yearsOfExperience: '',
    specialization: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  
  const { signup, socialLogin, guestLogin, isLoading, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (user.type === 'agent') {
        navigate('/agent-dashboard')
      } else {
        navigate('/main')
      }
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    
    // Additional validation for agents
    if (formData.userType === 'agent') {
      if (!formData.licenseNumber || !formData.brokerageName || !formData.phone) {
        setError('Please fill in all required agent information')
        return
      }
      
      // Basic phone validation
      const phoneRegex = /^[\d\s()+-]+$/
      if (!phoneRegex.test(formData.phone)) {
        setError('Please enter a valid phone number')
        return
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    
    const success = await signup(formData.email, formData.password, formData.name, formData.userType)
    if (success) {
      if (formData.userType === 'agent') {
        navigate('/agent-dashboard')
      } else {
        navigate('/main')
      }
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider)
    setError('')
    
    const success = await socialLogin(provider)
    if (success) {
      navigate('/main')
    }
    
    setSocialLoading(null)
  }

  const handleGuestLogin = async () => {
    setSocialLoading('guest')
    setError('')
    
    const success = await guestLogin()
    if (success) {
      navigate('/main')
    }
    
    setSocialLoading(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-800 rounded-full mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="white"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Estate Navigator</h1>
            <p className="text-gray-600">Find your perfect home</p>
          </div>

          {/* Create Account */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Account</h2>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'user' }))}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  formData.userType === 'user'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/25'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home Buyer
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'agent' }))}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  formData.userType === 'agent'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/25'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Real Estate Agent
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878L5.636 5.636m9.542 9.542L12 12m3.178-3.178l-3.178 3.178m3.178-3.178L19.07 5.93" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your password"
                className="input-field"
              />
            </div>

            {/* Agent-specific fields */}
            {formData.userType === 'agent' && (
              <>
                <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-base font-semibold text-gray-900">Professional Information</h3>
                  </div>
                  
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Real Estate License Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="licenseNumber"
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      placeholder="Enter your license number"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="brokerageName" className="block text-sm font-medium text-gray-700 mb-2">
                      Brokerage Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="brokerageName"
                      type="text"
                      value={formData.brokerageName}
                      onChange={(e) => setFormData(prev => ({ ...prev, brokerageName: e.target.value }))}
                      placeholder="Enter your brokerage name"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <select
                        id="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                        className="input-field"
                      >
                        <option value="">Select</option>
                        <option value="0-2">0-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      <select
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                        className="input-field"
                      >
                        <option value="">Select</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="luxury">Luxury</option>
                        <option value="investment">Investment</option>
                        <option value="firsttime">First-time buyers</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={socialLoading === 'google'}
              className="btn-secondary flex items-center justify-center"
            >
              {socialLoading === 'google' ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={socialLoading === 'apple'}
              className="btn-secondary flex items-center justify-center"
            >
              {socialLoading === 'apple' ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.037-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                  </svg>
                  Continue with Apple
                </>
              )}
            </button>

            <button
              onClick={handleGuestLogin}
              disabled={socialLoading === 'guest'}
              className="btn-outline flex items-center justify-center"
            >
              {socialLoading === 'guest' ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Continue as Guest'
              )}
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">
                Sign In
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-800">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-600 hover:text-primary-800">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage