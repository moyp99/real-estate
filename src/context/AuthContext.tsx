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
      // For guest login, we'll use anonymous sign in
      const { data } = await supabase.auth.signInAnonymously()
      if (data.user) {
        setUser({
          id: data.user.id,
          email: 'guest@app.com',
          name: 'Guest User',
          type: 'guest'
        })
        return true
      }
      return false
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
      await authService.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
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