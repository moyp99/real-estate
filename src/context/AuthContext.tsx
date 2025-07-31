import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../services/auth.service'
import { supabase } from '../lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  name: string
  type: 'user' | 'agent' | 'guest'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  socialLogin: (provider: string) => Promise<boolean>
  guestLogin: () => Promise<boolean>
  signup: (email: string, password: string, name: string, type: 'user' | 'agent') => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for guest session first
    const guestSession = localStorage.getItem('guestSession')
    if (guestSession) {
      try {
        const guest = JSON.parse(guestSession)
        // Check if guest session is less than 24 hours old
        if (guest.timestamp && Date.now() - guest.timestamp < 24 * 60 * 60 * 1000) {
          setUser(guest)
          setIsLoading(false)
          return
        } else {
          // Clear expired guest session
          localStorage.removeItem('guestSession')
        }
      } catch (e) {
        console.error('Error parsing guest session:', e)
        localStorage.removeItem('guestSession')
      }
    }
    
    // Check if user is already logged in
    authService.getCurrentUser().then(async (supabaseUser) => {
      if (supabaseUser) {
        const profile = await authService.getProfile(supabaseUser.id)
        if (profile) {
          setUser({
            id: supabaseUser.id,
            email: profile.email,
            name: profile.name,
            type: profile.user_type
          })
        }
      }
      setIsLoading(false)
    }).catch(() => {
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (supabaseUser: SupabaseUser | null) => {
      if (supabaseUser) {
        const profile = await authService.getProfile(supabaseUser.id)
        if (profile) {
          setUser({
            id: supabaseUser.id,
            email: profile.email,
            name: profile.name,
            type: profile.user_type
          })
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const { user: supabaseUser } = await authService.signIn(email, password)
      if (supabaseUser) {
        const profile = await authService.getProfile(supabaseUser.id)
        if (profile) {
          setUser({
            id: supabaseUser.id,
            email: profile.email,
            name: profile.name,
            type: profile.user_type
          })
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const socialLogin = async (provider: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      if (provider === 'google') {
        await authService.signInWithGoogle()
      } else if (provider === 'facebook') {
        await authService.signInWithFacebook()
      }
      // Auth state change listener will handle the user update
      return true
    } catch (error) {
      console.error('Social login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const guestLogin = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Try Supabase anonymous sign in first
      try {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (!error && data.user) {
          setUser({
            id: data.user.id,
            email: 'guest@estate-navigator.com',
            name: 'Guest User',
            type: 'guest'
          })
          return true
        }
      } catch (supabaseError) {
        console.log('Supabase anonymous auth not available, using mock guest login')
      }
      
      // Fallback to mock guest login if Supabase is not configured
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setUser({
        id: guestId,
        email: 'guest@estate-navigator.com',
        name: 'Guest User',
        type: 'guest'
      })
      
      // Store guest session in localStorage
      localStorage.setItem('guestSession', JSON.stringify({
        id: guestId,
        email: 'guest@estate-navigator.com',
        name: 'Guest User',
        type: 'guest',
        timestamp: Date.now()
      }))
      
      return true
    } catch (error) {
      console.error('Guest login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, type: 'user' | 'agent'): Promise<boolean> => {
    setIsLoading(true)
    try {
      const { user: supabaseUser } = await authService.signUp(email, password, name, type)
      if (supabaseUser) {
        // Profile will be created automatically by database trigger
        return true
      }
      return false
    } catch (error) {
      console.error('Signup error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Clear guest session if exists
      localStorage.removeItem('guestSession')
      
      // Only call signOut if not a guest user
      if (user?.type !== 'guest' || user?.id?.startsWith('guest_') === false) {
        await authService.signOut()
      }
      
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear the user even if signOut fails
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    socialLogin,
    guestLogin,
    signup,
    logout,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}