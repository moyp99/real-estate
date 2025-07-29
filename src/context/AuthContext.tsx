import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
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
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email === 'test@test.com' && password === 'password123') {
      setUser({
        email,
        name: 'Test User',
        type: 'user'
      })
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const socialLogin = async (provider: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate social login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setUser({
      email: `user@${provider}.com`,
      name: `${provider} User`,
      type: 'user'
    })
    
    setIsLoading(false)
    return true
  }

  const guestLogin = async (): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate guest login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setUser({
      email: 'guest@app.com',
      name: 'Guest User',
      type: 'guest'
    })
    
    setIsLoading(false)
    return true
  }

  const signup = async (email: string, password: string, name: string, type: 'user' | 'agent'): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setUser({
      email,
      name,
      type
    })
    
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
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