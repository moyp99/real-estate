import { supabase } from '../lib/supabase'
import { Database } from '../types/database.types'
import { Property } from '../types/Property'

type DbProperty = Database['public']['Tables']['properties']['Row']
type PropertyImage = Database['public']['Tables']['property_images']['Row']

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