export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          user_type: 'user' | 'agent' | 'guest'
          phone: string | null
          company: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          user_type?: 'user' | 'agent' | 'guest'
          phone?: string | null
          company?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          user_type?: 'user' | 'agent' | 'guest'
          phone?: string | null
          company?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          profile_id: string | null
          license_number: string | null
          bio: string | null
          years_experience: number | null
          specializations: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          license_number?: string | null
          bio?: string | null
          years_experience?: number | null
          specializations?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          license_number?: string | null
          bio?: string | null
          years_experience?: number | null
          specializations?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: number
          title: string
          price: number
          address: string
          city: string
          state: string
          zip_code: string
          bedrooms: number
          bathrooms: number
          sqft: number
          lot_size: string | null
          year_built: number
          property_type: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family'
          status: 'For Sale' | 'Pending' | 'Sold' | 'Off Market'
          description: string
          features: string[]
          agent_id: string | null
          latitude: number
          longitude: number
          days_on_market: number
          mls_number: string | null
          virtual_tour_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          price: number
          address: string
          city: string
          state: string
          zip_code: string
          bedrooms: number
          bathrooms: number
          sqft: number
          lot_size?: string | null
          year_built: number
          property_type: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family'
          status?: 'For Sale' | 'Pending' | 'Sold' | 'Off Market'
          description: string
          features?: string[]
          agent_id?: string | null
          latitude: number
          longitude: number
          days_on_market?: number
          mls_number?: string | null
          virtual_tour_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          price?: number
          address?: string
          city?: string
          state?: string
          zip_code?: string
          bedrooms?: number
          bathrooms?: number
          sqft?: number
          lot_size?: string | null
          year_built?: number
          property_type?: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family'
          status?: 'For Sale' | 'Pending' | 'Sold' | 'Off Market'
          description?: string
          features?: string[]
          agent_id?: string | null
          latitude?: number
          longitude?: number
          days_on_market?: number
          mls_number?: string | null
          virtual_tour_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: number | null
          url: string
          display_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: number | null
          url: string
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: number | null
          url?: string
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          property_id: number | null
          elementary_school: string | null
          middle_school: string | null
          high_school: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: number | null
          elementary_school?: string | null
          middle_school?: string | null
          high_school?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: number | null
          elementary_school?: string | null
          middle_school?: string | null
          high_school?: string | null
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string | null
          property_id: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          property_id?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          property_id?: number | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string | null
          recipient_id: string | null
          property_id: number | null
          subject: string | null
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id?: string | null
          recipient_id?: string | null
          property_id?: number | null
          subject?: string | null
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string | null
          recipient_id?: string | null
          property_id?: number | null
          subject?: string | null
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
      property_views: {
        Row: {
          id: string
          property_id: number | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          property_id?: number | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          property_id?: number | null
          user_id?: string | null
          viewed_at?: string
        }
      }
      tours: {
        Row: {
          id: string
          property_id: number | null
          user_id: string | null
          agent_id: string | null
          scheduled_date: string
          scheduled_time: string
          notes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: number | null
          user_id?: string | null
          agent_id?: string | null
          scheduled_date: string
          scheduled_time: string
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: number | null
          user_id?: string | null
          agent_id?: string | null
          scheduled_date?: string
          scheduled_time?: string
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}