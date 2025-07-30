import { supabase } from '../lib/supabase'
import { Property } from '../types/Property'
import { propertyService } from './property.service'

export const favoritesService = {
  async getFavorites(userId: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', userId)

    if (error) throw error

    const propertyIds = data?.map(f => f.property_id).filter(Boolean) || []
    
    if (propertyIds.length === 0) return []

    const properties = await Promise.all(
      propertyIds.map(id => propertyService.getPropertyById(id!))
    )

    return properties.filter(Boolean) as Property[]
  },

  async addFavorite(userId: string, propertyId: number) {
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        property_id: propertyId
      })

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      throw error
    }
  },

  async removeFavorite(userId: string, propertyId: number) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId)

    if (error) throw error
  },

  async isFavorite(userId: string, propertyId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .single()

    if (error && error.code !== 'PGRST116') { // Not found error is ok
      throw error
    }

    return !!data
  },

  async getFavoriteIds(userId: string): Promise<number[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', userId)

    if (error) throw error

    return data?.map(f => f.property_id).filter(Boolean) || []
  }
}