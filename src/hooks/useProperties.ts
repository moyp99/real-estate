import { useState, useEffect } from 'react'
import { Property } from '../types/Property'
import { propertyService } from '../services/property.service'

export function useProperties(filters?: {
  city?: string
  state?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
}) {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProperties()
  }, [JSON.stringify(filters)])

  const loadProperties = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await propertyService.getProperties(filters)
      setProperties(data)
    } catch (err) {
      console.error('Error loading properties:', err)
      setError('Failed to load properties')
    } finally {
      setIsLoading(false)
    }
  }

  return { properties, isLoading, error, refetch: loadProperties }
}

export function useProperty(id: number) {
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProperty()
  }, [id])

  const loadProperty = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await propertyService.getPropertyById(id)
      setProperty(data)
    } catch (err) {
      console.error('Error loading property:', err)
      setError('Failed to load property')
    } finally {
      setIsLoading(false)
    }
  }

  return { property, isLoading, error, refetch: loadProperty }
}