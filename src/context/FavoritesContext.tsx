import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Property } from '../types/Property'

interface FavoritesContextType {
  favorites: Property[]
  addToFavorites: (property: Property) => void
  removeFromFavorites: (propertyId: number) => void
  isFavorite: (propertyId: number) => boolean
  toggleFavorite: (property: Property) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Property[]>([])

  const addToFavorites = (property: Property) => {
    setFavorites(prev => {
      if (prev.find(p => p.id === property.id)) {
        return prev // Already in favorites
      }
      return [...prev, property]
    })
  }

  const removeFromFavorites = (propertyId: number) => {
    setFavorites(prev => prev.filter(p => p.id !== propertyId))
  }

  const isFavorite = (propertyId: number) => {
    return favorites.some(p => p.id === propertyId)
  }

  const toggleFavorite = (property: Property) => {
    if (isFavorite(property.id)) {
      removeFromFavorites(property.id)
    } else {
      addToFavorites(property)
    }
  }

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite
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