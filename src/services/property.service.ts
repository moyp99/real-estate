import { supabase } from '../lib/supabase'
import { Database } from '../types/database.types'
import { Property } from '../types/Property'
import { mockPropertyService } from './mockPropertyService'

type DbProperty = Database['public']['Tables']['properties']['Row']
type PropertyImage = Database['public']['Tables']['property_images']['Row']

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  try {
    return supabase && supabase.auth && true
  } catch {
    return false
  }
}

export const propertyService = {
  async getProperties(filters?: {
    city?: string
    state?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    bathrooms?: number
    propertyType?: string
  }): Promise<Property[]> {
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_images (
          url,
          is_primary,
          display_order
        ),
        schools (
          elementary_school,
          middle_school,
          high_school
        ),
        profiles!properties_agent_id_fkey (
          name,
          email,
          phone,
          photo_url,
          company
        )
      `)
      .eq('status', 'For Sale')
      .order('created_at', { ascending: false })

    if (filters) {
      if (filters.city) query = query.eq('city', filters.city)
      if (filters.state) query = query.eq('state', filters.state)
      if (filters.minPrice) query = query.gte('price', filters.minPrice)
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice)
      if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms)
      if (filters.bathrooms) query = query.gte('bathrooms', filters.bathrooms)
      if (filters.propertyType) query = query.eq('property_type', filters.propertyType)
    }

    const { data, error } = await query

    if (error) throw error
    return transformProperties(data || [])
  },

  async getPropertyById(id: number): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (
          url,
          is_primary,
          display_order
        ),
        schools (
          elementary_school,
          middle_school,
          high_school
        ),
        profiles!properties_agent_id_fkey (
          name,
          email,
          phone,
          photo_url,
          company
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching property:', error)
      return null
    }

    return transformProperty(data)
  },

  async createProperty(property: Omit<DbProperty, 'id' | 'created_at' | 'updated_at'>, images: string[]) {
    const { data: propertyData, error: propertyError } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single()

    if (propertyError) throw propertyError

    if (images.length > 0) {
      const imageInserts = images.map((url, index) => ({
        property_id: propertyData.id,
        url,
        display_order: index,
        is_primary: index === 0
      }))

      const { error: imagesError } = await supabase
        .from('property_images')
        .insert(imageInserts)

      if (imagesError) throw imagesError
    }

    return propertyData
  },

  async updateProperty(id: number, updates: Partial<DbProperty>) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAgentProperties(agentId: string): Promise<Property[]> {
    if (!isSupabaseConfigured()) {
      return mockPropertyService.getAgentProperties(agentId)
    }

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (
          url,
          is_primary,
          display_order
        ),
        schools (
          elementary_school,
          middle_school,
          high_school
        ),
        profiles!properties_agent_id_fkey (
          name,
          email,
          phone,
          photo_url,
          company
        )
      `)
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return transformProperties(data || [])
  },

  async createAgentProperty(
    agentId: string,
    property: {
      title: string
      price: number
      address: string
      city: string
      state: string
      zipCode: string
      bedrooms: number
      bathrooms: number
      sqft: number
      yearBuilt: number
      propertyType: string
      status: string
      description: string
      features: string[]
      latitude?: number
      longitude?: number
    },
    images: string[]
  ): Promise<Property> {
    if (!isSupabaseConfigured()) {
      return mockPropertyService.createAgentProperty(agentId, property, images)
    }
    const propertyData = {
      agent_id: agentId,
      title: property.title,
      price: property.price,
      address: property.address,
      city: property.city,
      state: property.state,
      zip_code: property.zipCode,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      year_built: property.yearBuilt,
      property_type: property.propertyType,
      status: property.status,
      description: property.description,
      features: property.features,
      latitude: property.latitude || 0,
      longitude: property.longitude || 0,
      mls_number: `MLS${Date.now()}`,
      days_on_market: 0
    }

    const { data: createdProperty, error: propertyError } = await supabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single()

    if (propertyError) throw propertyError

    if (images.length > 0) {
      const imageInserts = images.map((url, index) => ({
        property_id: createdProperty.id,
        url,
        display_order: index,
        is_primary: index === 0
      }))

      const { error: imagesError } = await supabase
        .from('property_images')
        .insert(imageInserts)

      if (imagesError) throw imagesError
    }

    return this.getPropertyById(createdProperty.id) as Promise<Property>
  },

  async updateAgentProperty(
    propertyId: number,
    agentId: string,
    updates: {
      title?: string
      price?: number
      address?: string
      city?: string
      state?: string
      zipCode?: string
      bedrooms?: number
      bathrooms?: number
      sqft?: number
      yearBuilt?: number
      propertyType?: string
      status?: string
      description?: string
      features?: string[]
      latitude?: number
      longitude?: number
    }
  ): Promise<Property> {
    if (!isSupabaseConfigured()) {
      return mockPropertyService.updateAgentProperty(propertyId, agentId, updates)
    }
    const updateData: any = {}
    
    if (updates.title) updateData.title = updates.title
    if (updates.price) updateData.price = updates.price
    if (updates.address) updateData.address = updates.address
    if (updates.city) updateData.city = updates.city
    if (updates.state) updateData.state = updates.state
    if (updates.zipCode) updateData.zip_code = updates.zipCode
    if (updates.bedrooms) updateData.bedrooms = updates.bedrooms
    if (updates.bathrooms) updateData.bathrooms = updates.bathrooms
    if (updates.sqft) updateData.sqft = updates.sqft
    if (updates.yearBuilt) updateData.year_built = updates.yearBuilt
    if (updates.propertyType) updateData.property_type = updates.propertyType
    if (updates.status) updateData.status = updates.status
    if (updates.description) updateData.description = updates.description
    if (updates.features) updateData.features = updates.features
    if (updates.latitude !== undefined) updateData.latitude = updates.latitude
    if (updates.longitude !== undefined) updateData.longitude = updates.longitude

    const { data, error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', propertyId)
      .eq('agent_id', agentId)
      .select()
      .single()

    if (error) throw error
    
    return this.getPropertyById(propertyId) as Promise<Property>
  },

  async deleteAgentProperty(propertyId: number, agentId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return mockPropertyService.deleteAgentProperty(propertyId, agentId)
    }
    const { error: imagesError } = await supabase
      .from('property_images')
      .delete()
      .eq('property_id', propertyId)

    if (imagesError) throw imagesError

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
      .eq('agent_id', agentId)

    if (error) throw error
    return true
  },

  async trackPropertyView(propertyId: number, userId?: string) {
    const { error } = await supabase
      .from('property_views')
      .insert({
        property_id: propertyId,
        user_id: userId || null
      })

    if (error) console.error('Error tracking property view:', error)
  }
}

function transformProperties(data: any[]): Property[] {
  return data.map(transformProperty)
}

function transformProperty(data: any): Property {
  const images = data.property_images
    ?.sort((a: PropertyImage, b: PropertyImage) => a.display_order - b.display_order)
    .map((img: PropertyImage) => img.url) || []

  const agent = data.profiles || {}
  const school = data.schools?.[0] || {}

  return {
    id: data.id,
    title: data.title,
    price: data.price,
    priceFormatted: `$${data.price.toLocaleString()}`,
    address: data.address,
    city: data.city,
    state: data.state,
    zipCode: data.zip_code,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    sqft: data.sqft,
    lotSize: data.lot_size,
    yearBuilt: data.year_built,
    propertyType: data.property_type,
    status: data.status,
    description: data.description,
    features: data.features || [],
    images,
    agent: {
      name: agent.name || 'Unknown Agent',
      phone: agent.phone || '',
      email: agent.email || '',
      photo: agent.photo_url || '',
      company: agent.company || ''
    },
    coordinates: {
      lat: data.latitude,
      lng: data.longitude
    },
    mapPosition: {
      x: '50%',
      y: '50%'
    },
    daysOnMarket: data.days_on_market,
    mlsNumber: data.mls_number || '',
    virtualTour: data.virtual_tour_url,
    schools: {
      elementary: school.elementary_school,
      middle: school.middle_school,
      high: school.high_school
    }
  }
}