import { useState, useEffect, useCallback } from 'react'
import { Property } from '../types/Property'
import { propertyService } from '../services/property.service'
import { useAuth } from '../context/AuthContext'

interface UseAgentPropertiesReturn {
  properties: Property[]
  isLoading: boolean
  error: string | null
  refreshProperties: () => Promise<void>
  createProperty: (property: Omit<Property, 'id' | 'agent' | 'coordinates' | 'mapPosition' | 'daysOnMarket' | 'mlsNumber'>, images: string[]) => Promise<Property | null>
  updateProperty: (propertyId: number, updates: Partial<Property>) => Promise<Property | null>
  deleteProperty: (propertyId: number) => Promise<boolean>
}

export const useAgentProperties = (): UseAgentPropertiesReturn => {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await propertyService.getAgentProperties(user.id)
      setProperties(data)
    } catch (err) {
      console.error('Error fetching agent properties:', err)
      setError('Failed to load properties. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const createProperty = useCallback(async (
    property: Omit<Property, 'id' | 'agent' | 'coordinates' | 'mapPosition' | 'daysOnMarket' | 'mlsNumber'>,
    images: string[]
  ): Promise<Property | null> => {
    if (!user?.id) return null

    try {
      const created = await propertyService.createAgentProperty(
        user.id,
        {
          title: property.title,
          price: property.price,
          address: property.address,
          city: property.city,
          state: property.state,
          zipCode: property.zipCode,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          sqft: property.sqft,
          yearBuilt: property.yearBuilt,
          propertyType: property.propertyType,
          status: property.status,
          description: property.description,
          features: property.features
        },
        images
      )
      
      setProperties(prev => [created, ...prev])
      return created
    } catch (err) {
      console.error('Error creating property:', err)
      setError('Failed to create property. Please try again.')
      return null
    }
  }, [user?.id])

  const updateProperty = useCallback(async (
    propertyId: number,
    updates: Partial<Property>
  ): Promise<Property | null> => {
    if (!user?.id) return null

    try {
      const updated = await propertyService.updateAgentProperty(
        propertyId,
        user.id,
        {
          title: updates.title,
          price: updates.price,
          address: updates.address,
          city: updates.city,
          state: updates.state,
          zipCode: updates.zipCode,
          bedrooms: updates.bedrooms,
          bathrooms: updates.bathrooms,
          sqft: updates.sqft,
          yearBuilt: updates.yearBuilt,
          propertyType: updates.propertyType,
          status: updates.status,
          description: updates.description,
          features: updates.features
        }
      )
      
      setProperties(prev => prev.map(p => p.id === propertyId ? updated : p))
      return updated
    } catch (err) {
      console.error('Error updating property:', err)
      setError('Failed to update property. Please try again.')
      return null
    }
  }, [user?.id])

  const deleteProperty = useCallback(async (propertyId: number): Promise<boolean> => {
    if (!user?.id) return false

    try {
      await propertyService.deleteAgentProperty(propertyId, user.id)
      setProperties(prev => prev.filter(p => p.id !== propertyId))
      return true
    } catch (err) {
      console.error('Error deleting property:', err)
      setError('Failed to delete property. Please try again.')
      return false
    }
  }, [user?.id])

  return {
    properties,
    isLoading,
    error,
    refreshProperties: fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty
  }
}