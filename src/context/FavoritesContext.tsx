import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Property } from '../types/Property'
import { favoritesService } from '../services/favorites.service'
import { useAuth } from './AuthContext'

interface FavoritesContextType {
  favorites: Property[]
  favoriteIds: number[]
  addToFavorites: (property: Property) => Promise<void>
  removeFromFavorites: (propertyId: number) => Promise<void>
  isFavorite: (propertyId: number) => boolean
  toggleFavorite: (property: Property) => Promise<void>
  isLoading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Property[]>([])
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      loadFavorites()
    } else {
      setFavorites([])
      setFavoriteIds([])
    }
  }, [user])

  const loadFavorites = async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    try {
      const [userFavorites, userFavoriteIds] = await Promise.all([
        favoritesService.getFavorites(user.id),
        favoritesService.getFavoriteIds(user.id)
      ])
      setFavorites(userFavorites)
      setFavoriteIds(userFavoriteIds)
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToFavorites = async (property: Property) => {
    if (!user?.id) {
      console.warn('User must be logged in to add favorites')
      return
    }

    try {
      await favoritesService.addFavorite(user.id, property.id)
      setFavorites(prev => {
        if (prev.find(p => p.id === property.id)) {
          return prev // Already in favorites
        }
        return [...prev, property]
      })
      setFavoriteIds(prev => [...prev, property.id])
    } catch (error) {
      console.error('Error adding favorite:', error)
      throw error
    }
  }

  const removeFromFavorites = async (propertyId: number) => {
    if (!user?.id) {
      console.warn('User must be logged in to remove favorites')
      return
    }

    try {
      await favoritesService.removeFavorite(user.id, propertyId)
      setFavorites(prev => prev.filter(p => p.id !== propertyId))
      setFavoriteIds(prev => prev.filter(id => id !== propertyId))
    } catch (error) {
      console.error('Error removing favorite:', error)
      throw error
    }
  }

  const isFavorite = (propertyId: number) => {
    return favoriteIds.includes(propertyId)
  }

  const toggleFavorite = async (property: Property) => {
    if (isFavorite(property.id)) {
      await removeFromFavorites(property.id)
    } else {
      await addToFavorites(property)
    }
  }

  const value = {
    favorites,
    favoriteIds,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    isLoading
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}